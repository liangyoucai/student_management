<template>
    <div class="container">
        <h1 class="title">学生个人学年总结 - 在线评审</h1>
        <div class="info-row" v-if="waitingStudents.length !== 0">
            <div class="info-item">
                <span>待评分学生个数：</span>
                {{ waitingStudents.length }}
            </div>
            <div class="info-item">
                <span>已完成评分个数：</span>
                {{ finishedStudents.length }}
            </div>
        </div>
        <el-divider></el-divider>
        <div v-if="!isReviewing && waitingStudents.length !== 0">
            <el-button type="primary" class="review-btn" @click="startReview">开始评审</el-button>
        </div>
        <div v-if="isReviewing">
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
        <div v-if="waitingStudents.length == 0">

        </div>
        <!-- <el-divider></el-divider> -->
        <!-- <div v-if="waitingStudents.length == 0">
            
            <el-table :data="allStudents" class="socreTable">
                <el-table-column label="学号" prop="id"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="班级" prop="class"></el-table-column>
                <el-table-column label="学习情况总结" prop="studySummary">
                  
                </el-table-column>
                <el-table-column label="社会实践总结" prop="practiceSummary">
                    
                </el-table-column>
                <el-table-column label="自我评价" prop="selfEvaluation">
                    
                </el-table-column>
                <el-table-column label="总分" prop="score"></el-table-column>
            </el-table>

            <el-button type="primary" class="submitSocre-btn">确认提交</el-button>

        </div> -->
        <br>
        <div class="score-table" v-if="waitingStudents.length > 0">
            <h3>评分标准</h3>
            <table>
                <thead>
                    <tr>
                        <th>分数</th>
                        <th>评价</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>10</td>
                        <td>服务优异，认真负责，信誉卓著，表现突出。</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>服务良好，工作勤奋，业务熟练，态度端正。</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>服务较好，工作认真，具备普通水平。</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>一般评价，存在服务行为上的不足或失误。</td>
                    </tr>
                    <tr>
                        <td>6</td>
                        <td>服务差，工作不认真，存在严重失误或不规范问题。</td>
                    </tr>
                    <tr>
                        <td>5及以下</td>
                        <td>服务极差，表现不合格，失职渎职。</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <el-empty v-if="waitingStudents.length == 0" description="暂无需要评分的学生"></el-empty>
    </div>
</template>

<script>
export default {
    data() {
        return {
            waitingStudents: [
                { id: 1, name: '张三', class: '一班', studySummary: '本人认真学习，成绩优秀，本人认真学习，成绩优秀，本人认真学习，成绩优秀', practiceSummary: '本人积极参加各种实践活动，表现良好,本人积极参加各种实践活动，表现良好,本人积极参加各种实践活动，表现良好', selfEvaluation: '本人对自己的表现非常满意，但还有提升空间,本人对自己的表现非常满意，但还有提升空间', score: 0 },
                { id: 2, name: '李四', class: '二班', studySummary: '本人学习主动性不够，需要改进，本人学习主动性不够，需要改进，本人学习主动性不够，需要改进', practiceSummary: '本人参加的社会实践活动较少，需要加强,本人参加的社会实践活动较少，需要加强,本人参加的社会实践活动较少，需要加强', selfEvaluation: '本人对自己的表现有些不满意，但会继续努力,本人对自己的表现有些不满意，但会继续努力', score: 0 },
                { id: 3, name: '王五', class: '三班', studySummary: '本人学习成绩中等，需要加强复习和提高学习效率,本人学习成绩中等，需要加强复习和提高学习效率,本人学习成绩中等，需要加强复习和提高学习效率', practiceSummary: '本人参加的社会实践活动表现一般', selfEvaluation: '本人对自己的表现有些不满意，需要更多的努力,本人对自己的表现有些不满意，需要更多的努力', score: 0 },
            ],
            finishedStudents: [],
            isReviewing: false,
            currentStudent: null,
            currentScore: null,
        };
    },
    computed: {
        allStudents() {
            return [...this.waitingStudents, ...this.finishedStudents];
        }
    },
    methods: {
        startReview() {
            this.isReviewing = true;
            this.showNextStudent();
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
    height: 100vh;
}

.title {
    font-size: 28px;
    text-align: center;
    margin-bottom: 30px;
}

.studentInfo {
    margin: 0 auto;
}

.info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.info-item {
    font-size: 16px;
    color: #666;
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

.score-row {
    display: flex;
    justify-content: flex-end;
}

.score-item {
    font-size: 16px;
    color: #666;
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

.score-table {
    max-width: 500px;
    margin: 0 auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

td,
th {
    padding: 10px;
    border: 1px solid #ccc;
}

th {
    background-color: #f8f8f8;
    font-weight: normal;
    text-align: left;
}

.score {
    font-weight: bold;
    color: #ff9900;
}

.empty {
    color: #999;
}
</style>