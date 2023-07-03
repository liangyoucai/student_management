<template>
  <div class="container">
    <el-table :data="submittedData" class="socreTable" stripe>
      <!-- <el-table-column label="学号" prop="id"></el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column> -->
      <!-- <el-table-column label="学苑" prop="class"></el-table-column> -->

      <slot></slot>

      <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="goReview(scope.$index, scope.row)">评分</el-button>
                </template>
            </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
export default {
  props: ['submittedData'],
  methods: {},
};
</script>

<style scoped>
.container {
  margin: 10px auto;
  max-width: 900px;
  /* min-height: 60vh; */
}
</style>
