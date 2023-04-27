<template>
    <div class="container">
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
            <div class="info-item">
                <el-button type='text' style="font-size: 1rem;" @click="startOverview">{{isOverviewing ? '返回评分': '评分总览'}}</el-button>
            </div>
        </div>
        <el-divider></el-divider>
        <div v-if="!isReviewing && !isOverviewing && waitingStudents.length !== 0">
            <el-button type="primary" class="review-btn" @click="startReview">开始评审</el-button>
        </div>
        <div v-if="isReviewing && !isOverviewing">
            <div class="review-card">
                <el-form label-width="120px">
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
                    <el-col :span="8">
                        <el-form-item label="学苑">
                            <el-input v-model="currentStudent.class" :readonly=true></el-input>
                        </el-form-item>
                    </el-col>

                    <el-form-item label="学习情况总结">
                        <el-input type="textarea" autosize v-model="currentStudent.studySummary" :readonly=true></el-input>
                    </el-form-item>
                    <el-form-item label="社会实践总结">
                        <el-input type="textarea" autosize v-model="currentStudent.practiceSummary" :readonly=true></el-input>
                    </el-form-item>
                    <el-form-item label="自我评价">
                        <el-input type="textarea" autosize v-model="currentStudent.selfEvaluation" :readonly=true></el-input>
                    </el-form-item>
                </el-form>
                <el-divider></el-divider>
                <div class="block">
                    <span class="demonstration">评分:{{ currentScore }}</span>
                    <el-slider v-model="currentScore" :step="1" :max=10 show-stops>
                    </el-slider>
                </div>
            </div>
            <el-button-group>
                <el-button type="primary" class="review-btn" @click="submitScore">下一个</el-button>
                <el-button class="review-btn" @click="cancelReview">返回</el-button>
            </el-button-group>
        </div>
        
        <score-table v-if="waitingStudents.length > 0 && !isOverviewing" :items="scoreStandard"></score-table>
        <el-empty v-if="waitingStudents.length == 0 && !isOverviewing" description="暂无需要评分的学生" style="height:70vh;"></el-empty>
        
        <overview-table :allStudents="allStudents" v-if="isOverviewing">
            <el-table-column label="学习情况总结" prop="studySummary">
                </el-table-column>
                <el-table-column label="社会实践总结" prop="practiceSummary">
                </el-table-column>
                <el-table-column label="自我评价" prop="selfEvaluation">
                </el-table-column>
        </overview-table>
    </div>
</template>

<script>
import OverviewTable from '@/components/OverviewTable.vue';
import ScoreTable from '@/components/ScoreTable.vue'
export default {
    components: {
        OverviewTable,
        ScoreTable
    },
    data() {
        return {
            waitingStudents: [
                { id: 1, name: '张三', class: '一班', studySummary: '本人认真学习，成绩优秀，本人认真学习，成绩优秀，本人认真学习，成绩优秀', practiceSummary: '本人积极参加各种实践活动，表现良好,本人积极参加各种实践活动，表现良好,本人积极参加各种实践活动，表现良好', selfEvaluation: '本人对自己的表现非常满意，但还有提升空间,本人对自己的表现非常满意，但还有提升空间', score: 0 },
                { id: 2, name: '李四', class: '二班', studySummary: '本人学习主动性不够，需要改进，本人学习主动性不够，需要改进，本人学习主动性不够，需要改进', practiceSummary: '本人参加的社会实践活动较少，需要加强,本人参加的社会实践活动较少，需要加强,本人参加的社会实践活动较少，需要加强', selfEvaluation: '本人对自己的表现有些不满意，但会继续努力,本人对自己的表现有些不满意，但会继续努力', score: 0 },
                { id: 3, name: '王五', class: '三班', studySummary: '本人学习成绩中等，需要加强复习和提高学习效率,本人学习成绩中等，需要加强复习和提高学习效率,本人学习成绩中等，需要加强复习和提高学习效率', practiceSummary: '本人参加的社会实践活动表现一般', selfEvaluation: '本人对自己的表现有些不满意，需要更多的努力,本人对自己的表现有些不满意，需要更多的努力', score: 0 },
            ],
            finishedStudents: [],
            isReviewing: false,
            isOverviewing: false,
            currentStudent: null,
            currentScore: null,
        };
    },
    computed: {
        allStudents() {
            return [...this.finishedStudents, ...this.waitingStudents];
        }
    },
    methods: {
        startReview() {
            this.isReviewing = true;
            this.showNextStudent();
        },
        startOverview() {
            this.isReviewing = false;
            this.isOverviewing = !this.isOverviewing;
        },
        showNextStudent() {
            if (this.waitingStudents.length > 0) {
                this.currentStudent = this.waitingStudents[0];
                this.currentScore = 5;
            } else {
                this.$message.success('评审完成！');
                this.isReviewing = false;
            }
        },
        submitScore() {
            this.currentStudent.score = this.currentScore;
            this.finishedStudents.push(this.currentStudent);
            this.currentStudent = null;
            this.waitingStudents.shift();
            this.showNextStudent();
        },
        cancelReview() {
            this.currentStudent = null;
            this.isReviewing = false;
        },

    }
};
</script>

<style scoped>
.container {
    margin: 10px auto;
    max-width: 900px;
    height: 100%;
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
.el-divider--horizontal{
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