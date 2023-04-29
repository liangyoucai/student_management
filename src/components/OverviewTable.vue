<template>
    <div class="container">

        <el-table :data="allStudents" class="socreTable" stripe>
            <el-table-column label="学号" prop="id"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="学苑" prop="class"></el-table-column>

            <slot></slot>

            <el-table-column label="得分" prop="score">
                <template slot-scope="{ row }">
                    {{ row.score === null ? '未评分' : row.score }}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="goReview(scope.$index, scope.row)">评分</el-button>
                </template>
            </el-table-column>
        </el-table>


    </div>
</template>

<script>
export default {
    props: ['allStudents'],
    methods: {
        goReview(_, row) {
            console.log(row.id);
            this.$emit('review-from-overview', row.id)
        }
    }
    
};
</script>

<style scoped>
.container {
    margin: 10px auto;
    max-width: 900px;
    min-height: 60vh;
}

</style>