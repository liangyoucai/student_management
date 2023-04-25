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
        <!-- <el-divider></el-divider> -->
        <!-- v-if="waitingStudents.length == 0" -->
        <div>

            <el-table :data="allStudents" class="socreTable">
                <el-table-column label="学号" prop="id"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="班级" prop="class"></el-table-column>
                <el-table-column label="学习情况总结" prop="studySummary">
                    <!-- <template slot-scope="scope">
                        <p v-for="(item, index) in scope.row.studySummary.split(',')" :key="index">{{ item }}</p>
                    </template> -->
                </el-table-column>
                <el-table-column label="社会实践总结" prop="practiceSummary">
                    <!-- <template slot-scope="scope">
                        <p v-for="(item, index) in scope.row.practiceSummary.split(',')" :key="index">{{ item }}</p>
                    </template> -->
                </el-table-column>
                <el-table-column label="自我评价" prop="selfEvaluation">
                    <!-- <template slot-scope="scope">
                        <p v-for="(item, index) in scope.row.selfEvaluation.split(',')" :key="index">{{ item }}</p>
                    </template> -->
                </el-table-column>
                <el-table-column label="总分" prop="score"></el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="handleEdit(scope.$index, scope.row)">打分</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-button type="primary" class="submitSocre-btn">确认提交</el-button>

        </div>

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
        

    }
};
</script>

<style scoped>
.container {
    margin: 50px auto;
    max-width: 900px;
}

.title {
    font-size: 28px;
    text-align: center;
    margin-bottom: 30px;
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