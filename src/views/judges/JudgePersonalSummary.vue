<template>
    <div class="container">
        <!-- 标题栏 -->
        <h1 class="title">学生个人学年总结 - 在线评审</h1>
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
                    <el-form-item label="学习情况总结">
                        <el-input type="textarea" autosize v-model="currentStudent.school" :readonly=true></el-input>
                    </el-form-item>
                    <el-form-item label="社会实践总结">
                        <el-input type="textarea" autosize v-model="currentStudent.society" :readonly=true></el-input>
                    </el-form-item>
                    <el-form-item label="自我评价">
                        <el-input type="textarea" autosize v-model="currentStudent.self" :readonly=true></el-input>
                    </el-form-item>
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
            <el-table-column label="学习情况总结" prop="school" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="社会实践总结" prop="society" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="自我评价" prop="self" :show-overflow-tooltip="true">
            </el-table-column>
        </overview-table>

        <!-- 确认提交按钮与弹出提示 -->
        <!-- <el-button v-if="isOverviewing" type="primary" class="submitSocre-btn" @click="submitAllScores">确认提交</el-button>
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
        </el-dialog> -->
    </div>
</template>

<script>
import OverviewTable from '@/components/OverviewTable.vue';
import ScoreTable from '@/components/ScoreTable.vue'
import RatingList from '@/components/RatingList.vue';
import axios from 'axios';
import judge from '@/api/judge/judge';
export default {
    emits: ['score-selected', 'review-from-overview'],
    components: {
        OverviewTable,
        ScoreTable,
        RatingList
    },
    data() {
        return {
            summaryList: [],
            result: [],
            rawData: [],
            final: [],
            waitingStudents: [
                // { id: 1, name: '张三', class: '一班', school: '本人认真学习，成绩优秀，本人认真学习，成绩优秀，本人认真学习，成绩优秀', society: '本人积极参加各种实践活动，表现良好,本人积极参加各种实践活动，表现良好,本人积极参加各种实践活动，表现良好', self: '本人对自己的表现非常满意，但还有提升空间,本人对自己的表现非常满意，但还有提升空间', score: null },
                // { id: 2, name: '李四', class: '二班', school: '本人学习主动性不够，需要改进，本人学习主动性不够，需要改进，本人学习主动性不够，需要改进', society: '本人参加的社会实践活动较少，需要加强,本人参加的社会实践活动较少，需要加强,本人参加的社会实践活动较少，需要加强', self: '本人对自己的表现有些不满意，但会继续努力,本人对自己的表现有些不满意，但会继续努力', score: null },
                // { id: 3, name: '王五', class: '三班', school: '本人学习成绩中等，需要加强复习和提高学习效率,本人学习成绩中等，需要加强复习和提高学习效率,本人学习成绩中等，需要加强复习和提高学习效率', society: '本人参加的社会实践活动表现一般', self: '本人对自己的表现有些不满意，需要更多的努力,本人对自己的表现有些不满意，需要更多的努力', score: null },
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
    mounted() {
        if (this.rawData !== null) {
            // 获得summary表所有数据
            judge.getSummary().then(res => {
                this.summaryList = res.data.summarylist
                console.log(this.summaryList)
                this.getSheetData();
            })
        }
    },
    methods: {
        getSheetData() {
            // 获得personal表所有数据
            judge.getSheet('personal')
                .then(res => {
                    this.rawData = res.data
                    this.clean(this.rawData);
                })
        },
        clean(rawData) {
            console.log(rawData);
            rawData.map((item) => {
                this.result.push({
                    theId: item.stuId,
                    id: item.stuNum,
                    name: item.stuName,
                    school: item.school,
                    self: item.self,
                    society: item.society,
                    score: null
                });
                // this.final.push({
                //     "school": item.school,
                //     "self": item.self,
                //     "society": item.society,
                //     "stuId": item.stuId,
                //     "stuName": item.stuName,
                //     "stuNum": item.stuNum,
                //     "score": null
                // })

            })
            this.result.forEach((student) => {
                const summary = this.summaryList.find((s) => s.stuId === student.theId);
                if (summary && summary.per !== null) {
                    student.score = summary.per;
                    this.finishedStudents.push(student);
                } else {
                    this.waitingStudents.push(student);
                }
            })
            if (this.waitingStudents.length == 0) {
                this.startOverview();
            }
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
                this.currentStudent = this.waitingStudents[0];
                this.currentIndex = 0;
                this.currentScore = 0;
            } else {
                this.startOverview();
                const h = this.$createElement;
                this.$notify({
                    title: '评审完成',
                    // message: h('i', { style: 'color: teal' }, '确认无误后，点击下方确认提交按钮。')
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

            this.waitingStudents.splice(this.currentIndex, 1);
            this.final = [{
                "gpa": null,
                "per": this.currentStudent.score,
                "pra": null,
                "sci": null,
                "ser": null,
                "stuId": this.currentStudent.theId,
                "stuName": this.currentStudent.name,
                "stuNum": this.currentStudent.id,
                "vol": null
            }]
            this.currentStudent = null;
            this.showNextStudent();
            this.sumbitFinal();

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
            // this.final.map((item) => {
            //     console.log("item.stuId = " + item.stuId)
            //     console.log("finished find:" + this.finishedStudents.find(finished => finished.theId == item.stuId))
            //     item.per = this.finishedStudents.find(finished => finished.theId == item.stuId).score;
            // })
            console.log("final:" + this.final);
            this.dialog2Visible = false;
            judge.importScore(this.final)
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