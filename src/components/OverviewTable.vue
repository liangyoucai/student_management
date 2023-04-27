<template>
    <div class="container">
        
            <el-table :data="allStudents" class="socreTable" stripe>
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

</template>

<script>
export default {
    props:['allStudents']
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