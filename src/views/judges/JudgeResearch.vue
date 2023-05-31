<template>
    <div class="container">
        <!-- 标题栏 -->
        <h1 class="title">学生科研情况 - 在线评审</h1>
        <div class="info-row">
            <div class="info-item">
                <span>待评分学生个数：</span>
                {{ waitingStudents.length }}
            </div>
            <div class="info-item">
                <span>已完成评分个数：</span>
                {{ finishedStudents.length }}
            </div>
            <div class="info-item" v-if="waitingStudents.length > 0">
                <el-button type='text' style="font-size: 1rem;" @click="startOverview">{{ isOverviewing ? '返回评分' : '评分总览' }}</el-button>
            </div>
        </div>
        <el-divider></el-divider>

        <!-- 开始评审按钮 -->
        <div v-if="!isReviewing && !isOverviewing && waitingStudents.length !== 0">
            <el-button type="primary" class="review-btn" @click="startReview">开始评审</el-button>
        </div>

        <!-- 评审卡片 -->
        <div v-if="isReviewing && !isOverviewing">
            <div class="review-card">
                <el-form label-width="120px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="学号">
                                <el-input v-model="currentStudent.id" :readonly=true></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="姓名">
                                <el-input v-model="currentStudent.name" :readonly=true></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="学苑">
                                <el-input v-model="currentStudent.class" :readonly=true></el-input>
                            </el-form-item>
                        </el-col> -->
                    </el-row>

                    <template v-for="(project, index) in waitingStudents[currentIndex].research">

                        <div v-if="index >= 0">
                            <h4>参与的科研项目{{ index + 1 }}</h4>
                        </div>
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="名称">
                                    <el-input v-model="project.name" :readonly=true></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="负责人">
                                    <el-input v-model="project.manager" :readonly=true></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>


                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="组织机构">
                                    <el-input v-model="project.organization" :readonly=true></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="项目级别">
                                    <el-input v-model="project.level" :readonly=true></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="参与时间">
                                    <el-input v-model="project.time" :readonly=true></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="项目成果">
                            <el-input type="textarea" autosize v-model="project.achievement" :readonly=true></el-input>
                        </el-form-item>
                    </template>
                </el-form>

                <el-divider></el-divider>
                <div class="block">
                    <span class="demonstration">评分：{{ currentScore }}</span>
                    <rating-list :currentScore="currentScore" @score-selected="onScoreSelected"></rating-list>
                </div>
            </div>
            <el-button-group>
                <el-button type="primary" class="review-btn" @click="submitScore">下一个</el-button>
                <el-button class="review-btn" @click="cancelReview">返回</el-button>
            </el-button-group>
        </div>

        <!-- 评分标准 -->
        <score-table v-if="waitingStudents.length > 0 && !isOverviewing" :scoreStandard="scoreStandard"></score-table>

        <!-- 待评分人数为0时出现的画面 -->
        <!-- <el-empty v-if="waitingStudents.length == 0 && !isOverviewing" description="暂无需要评分的学生" style="height:70vh;"></el-empty> -->

        <!-- 评分总览表 -->
        <overview-table :allStudents="allStudents.sort((a, b) => a.id - b.id)" v-if="isOverviewing" @review-from-overview="startReviewFromOverview">
            <!-- <el-table-column v-for="(project, index) in research" :key="index" label="科研项目名称" prop="project.name" :show-overflow-tooltip="true">
            </el-table-column> -->

            <el-table-column label="科研情况" width="350">
                <template slot-scope="scope">
                    <div v-for="(project, index) in scope.row.research" :key="index">{{ '项目' + (index + 1) + '：' + project.name }}</div>
                </template>
            </el-table-column>

        </overview-table>

        <!-- 确认提交按钮与弹出提示 -->
        <el-button v-if="isOverviewing" type="primary" class="submitSocre-btn" @click="submitAllScores">确认提交</el-button>
        <el-dialog title="提示" :visible.sync="dialog1Visible" width="30%">
            <span>还有{{ waitingStudents.length }}名学生未评分，请评分后再提交！</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog1Visible = false">取 消</el-button>
                <el-button type="primary" @click="dialog1Visible = false">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialog2Visible" width="30%">
            <span>确认提交？一经提交评分不可撤回。</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog2Visible = false">取 消</el-button>
                <el-button type="primary" @click="sumbitFinal()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';

import OverviewTable from '@/components/OverviewTable.vue';
import ScoreTable from '@/components/ScoreTable.vue'
import RatingList from '@/components/RatingList.vue';
export default {
    emits: ['score-selected', 'review-from-overview'],
    components: {
        OverviewTable,
        ScoreTable,
        RatingList
    },
    mounted() {
        // console.log("mounted")
        if (this.rawData !== null) {
            // 暂时仅1,26,27有数据
            axios.get("http://localhost:18080/api/science/list?ids=1%2C26%2C27%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10")
                .then(res => {
                    this.rawData = res.data.data
                    this.clean(this.rawData);
                });
        }
    },
    data() {
        return {
            result: [],
            rawData: [],
            final: [],
            waitingStudents: [
                // {
                //     id: 1,
                //     name: '张三',
                //     // class: '一班',
                //     research: [
                //         {
                //             name: '人工智能应用于智慧医疗研究',
                //             manager: '李华',
                //             organization: '北京大学',
                //             level: '国家级',
                //             time: '2019年1月-2020年3月',
                //             achievement: '发表在 IEEE Transactions on Medical Imaging 上的一篇论文;开发了一套基于深度学习的医疗影像智能诊断系统;探索了疾病预测的可解释性与通用性'
                //         },
                //         {
                //             name: '机器学习在金融数据分析中的应用研究',
                //             manager: '王刚',
                //             organization: '中央财经大学',
                //             level: '省级',
                //             time: '2020年3月-2021年9月',
                //             achievement: '提出一种基于更安全的加密算法的银行信用风险识别方法，相较于传统方法精度提高10个百分点;在美国顶尖金融机构担任数据科学家实习生，积累了非常丰富的项目经验'
                //         }
                //     ],
                //     score: null
                // },
                // {
                //     id: 2,
                //     name: '李四',
                //     // class: '二班',
                //     research: [
                //         {
                //             name: '物联网在智慧城市中的应用研究',
                //             manager: '王明',
                //             organization: '北京大学',
                //             level: '国家级',
                //             time: '2018年2月-2019年8月',
                //             achievement: '提出一套采用区块链技术解决智慧城市设施信任问题的方案;开发了一种基于物联网的智能城市路灯系统;应用实践探讨了智慧城市中个人数据隐私保护的方案'
                //         }
                //     ],
                //     score: null
                // },
                // {
                //     id: 3,
                //     name: '王五',
                //     // class: '三班',
                //     research: [
                //         {
                //             name: '区块链技术在供应链金融中的应用研究',
                //             manager: '张三丰',
                //             organization: '复旦大学',
                //             level: '校级',
                //             time: '2020年9月-2021年12月',
                //             achievement: '提出一套区块链智能化供应链金融管理平台;成功开展区块链供应链金融的试点项目;担任南京银行区块链金融部门实习生，积累了丰富的从业经验'
                //         },
                //         {
                //             name: '城市经济发展的空间分析',
                //             manager: '李丹',
                //             organization: '上海交通大学',
                //             level: '国家级',
                //             time: '2019年6月-2021年3月',
                //             achievement: '发现城市中心区域与发展趋势之间的关系;制定了合理的城市空间规划，推动了城市的经济繁荣;参加国际学术会议并发表论文'
                //         }
                //     ],
                //     score: null
                // }
            ],
            finishedStudents: [],
            isReviewing: false,
            isOverviewing: false,
            currentStudent: null,
            currentIndex: null,
            currentScore: null,
            scoreStandard: [
                { score: '10', comment: '表现突出，得到满分评价' },
                { score: '9', comment: '态度端正，工作勤奋' },
                { score: '8', comment: '工作认真，具备普通水平' },
                { score: '7', comment: '存在服务行为上的不足或失误' },
                { score: '6', comment: '工作不认真，存在严重失误或不规范问题' },
                { score: '5及以下', comment: '表现不合格，失职渎职' }
            ],
            dialog1Visible: false,
            dialog2Visible: false,

        };
    },
    computed: {
        allStudents() {
            return [...this.finishedStudents, ...this.waitingStudents];
        }
    },
    methods: {
        clean(rawData) {
            console.log(rawData);
            rawData.map((item) => {
                const index = this.result.findIndex((ele) => ele.id === item.stuNum);
                console.log(index)
                if (index > -1) {
                    this.result[index].research.push({
                        name: item.title,
                        manager: item.director,
                        organization: item.constitution,
                        level: item.level,
                        time: item.time,
                        achievement: item.result,
                    });
                } else {
                    this.result.push({
                        theId: item.stuId,
                        id: item.stuNum,
                        name: item.stuName,
                        research: [{
                            name: item.title,
                            manager: item.director,
                            organization: item.constitution,
                            level: item.level,
                            time: item.time,
                            achievement: item.result,
                        }],
                        score: null
                    });
                    this.final.push({
                        "gpa": null,
                        "per": null,
                        "pra": null,
                        "sci": null,
                        "ser": null,
                        "stuId": item.stuId,
                        "stuName": item.stuName,
                        "stuNum": item.stuNum,
                        "vol": null
                    })
                }
            })
            this.waitingStudents = this.result;
            console.log("result:" + this.result)
        },
        startReview() {
            this.isReviewing = true;
            this.isOverviewing = false;
            this.showNextStudent();
        },
        startOverview() {
            this.isReviewing = false;
            this.isOverviewing = !this.isOverviewing;
        },
        showNextStudent() {
            if (this.waitingStudents.length > 0) {
                // 滚动到顶部
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                this.currentStudent = this.waitingStudents[0];
                this.currentIndex = 0;
                this.currentScore = 0;
            } else {
                this.startOverview();
                const h = this.$createElement;
                this.$notify({
                    title: '评审完成',
                    message: h('i', { style: 'color: teal' }, '确认无误后，点击下方确认提交按钮。')
                });

            }
        },
        onScoreSelected(score) {
            this.currentScore = score;
            // console.log('获取到rating-list组件传递的分数值：', score);
        },
        startReviewFromOverview(id) {
            // 滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            // 在等待评分的学生中查找
            let student = this.waitingStudents.find(student => student.id === id);
            if (student) {
                this.startReview();
                this.currentStudent = student;
                this.currentIndex = this.waitingStudents.indexOf(student);
                console.log("currentIndex = " + this.currentIndex);
            }
            // 在已完成评分的学生中查找
            student = this.finishedStudents.find(student => student.id === id);
            if (student) {
                student.score = null;
                this.currentStudent = student;
                this.currentIndex = this.finishedStudents.indexOf(student);
                this.finishedStudents.splice(this.currentIndex, 1);
                this.waitingStudents.push(student);
                this.currentIndex = this.waitingStudents.indexOf(student);
                this.startReview();
            }
        },
        submitScore() {
            this.currentStudent.score = this.currentScore;
            this.finishedStudents.push(this.currentStudent);
            this.currentStudent = null;
            this.waitingStudents.splice(this.currentIndex, 1);
            console.log(this.waitingStudents);
            console.log(this.finishedStudents);
            this.showNextStudent();
        },
        cancelReview() {
            this.currentStudent = null;
            this.isReviewing = false;
        },
        submitAllScores() {
            if (this.waitingStudents.length > 0) {
                this.dialog1Visible = true;
            } else {
                this.dialog2Visible = true;
            }
        },
        sumbitFinal() {
            console.log("finished:" + this.finishedStudents)
            this.final.map((item) => {
                console.log("item.stuId = " + item.stuId)
                console.log("finished find:" + this.finishedStudents.find(finished => finished.theId == item.stuId))
                item.sci = this.finishedStudents.find(finished => finished.theId == item.stuId).score;
                item.status = null
            })
            console.log("final:" + this.final);
            this.dialog2Visible = false;
            axios.post("http://localhost:18080/api/summary/import", this.final, {
                headers: {
                    'Content-Type': 'application/json;'
                }
            }
            )
                .then(res => {
                    console.log(res);
                    if (res.data.code == 200) {
                        this.$message.success("提交成功")
                    }
                });
        }
    }
};
</script>

<style scoped>
.container {
    margin: 10px auto;
    max-width: 900px;
    /* height: 100%; */
}

.title {
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}

.studentInfo {
    margin: 0 auto;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.info-item {
    font-size: 16px;
    color: #666;
}

.el-divider--horizontal {
    margin-top: 3px;
}

.review-card {
    border: 1px solid #ccc;
    padding: 20px;
    margin-bottom: 30px;
}

.card-row {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 15px;
}

.card-item {
    font-size: 16px;
    color: #666;
    margin-right: 20px;
}

.submitSocre-btn {
    margin-top: 50px;
}



.el-button-group {
    margin-top: 30px;
    text-align: center;
}

.review-btn {
    width: 120px;

}

.submitSocre-btn {
    margin-top: 50px;
}

.info-btn {
    margin-left: 30px;
}



.empty {
    color: #999;
}
</style>