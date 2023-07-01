<template>
  <div class="container">

    <div class="title">
      <h1 class="title">学生成绩 - 导入/在线评审</h1>
    </div>
    <el-divider></el-divider>

    <!-- 导入按钮 -->
    <div class="titleBtn">
      <el-button type="warning" icon="el-icon-folder-add" size="small" style="margin: 0 80px" @click="openImportDialog">导入</el-button>
    </div>
    <!-- 上传对话框 -->
    <div v-if="isImportFileDialogVisible">
      <importFileDialog importName="grade" importTitle="上传学生成绩文件" importTip="一次只能上传一个xls/xlsx文件，且不超过10M" importType="excel" @close-dialog="closeImportDialog">
      </importFileDialog>
    </div>

    <div class="main">
      <el-input
      v-model="searchText"
      placeholder="请输入学号或学生姓名"
      style="width: 250px; margin-bottom: 10px;"
        >
      <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
      </el-input>

      <el-table :data="tableData" style="width: 100%" id="mainTable" max-height="500">
        <el-table-column prop="no" label="序号" width="80">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>

        </el-table-column>
        <!-- <el-table-column prop="date" label="更新日期" width="140"> </el-table-column> -->
        <el-table-column prop="stuNum" label="学号" width="140">
        </el-table-column>
        <el-table-column prop="stuName" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="gpa" label="GPA" width="100">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160">
        </el-table-column>
        <el-table-column prop="do" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="primary" @click="showDialog(scope.row)">评分</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="评分" width="100">
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="dialogVisible">
        <el-form :model="form" ref="form" label-width="100px">
          <el-form-item label="GPA">
            <el-input v-model="form.gpa" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div class="block">
          <span class="demonstration">评分：{{ currentScore }}</span>
          <rating-list :currentScore="currentScore" @score-selected="onScoreSelected"></rating-list>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveForm()">确定</el-button>
        </div>
      </el-dialog>


    </div>

  </div>
</template>
  
<script>
import qs from 'qs';
import staff from '@/api/judge/grade'
import RatingList from '@/components/RatingList.vue';
import importFileDialog from '@/components/importFileDialog.vue'
import axios from 'axios';
import gradeApi from '@/api/judge/grade';
import FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default {
  emits: ['close-dialog', 'score-selected'],
  components: {
    importFileDialog,
    RatingList
  },
  created() {
    this.$axios = axios;
    this.init();
  },
  data() {
    return {
      currentScore: null,
      isRatingDialogVisible: false,
      tableData: [{
        //   {
        //     date: "2002-06-28",
        //     ID: "2200022600",
        //     name: "ABC",
        //     class: "求知三苑",
        //     GPA: "3.80",
        //     state: 1
        //   },
        stuNum: "",
        stuName: "",
        gpa: "",
        score: "",
        createTime: "",
        updateTime: ""
      }],
      dialogVisible: false,
      isImportFileDialogVisible: false,
      form: {
        stuNum: "",
        gpa: '',
        score: ""
      },
      currentRow: null,
      searchText: '',
      originalData: [], // 存储初始数据的属性
      filteredTableData: [], // 存储过滤后的数据
    };
  },
  computed: {
    filteredTableData() {
      const keyword = this.searchText.trim().toLowerCase();
      if (keyword === "") {
        return this.originalData.slice(); // 搜索栏为空，返回原始数据
      } else {
        return this.originalData.filter(
          (item) =>
            item.stuNum.toLowerCase().includes(keyword) ||
            item.stuName.toLowerCase().includes(keyword)
        );
      }
    }
  },
  watch: {
    searchText(newText) {
      if (newText.trim() === "" && !this.userInteracted) {
        this.tableData = this.originalData.slice(); // 搜索栏为空且用户没有进行任何操作，显示原始数据
      }
    }
  },
  methods: {
    init() {
      let _this = this;
      staff.getList(qs.stringify({ flag: 0 })).then(res => {
        // 如果保存成功，则更新表格数据
        if (res.code === 200) {
          const formdata = res.data;
          this.tableData.length = 0;
          for (var i = 0; i < formdata.gradelist.length; i++) {
            this.tableData.push({
              stuNum: formdata.gradelist[i]["stuNum"],
              stuName: formdata.gradelist[i]["stuName"],
              gpa: formdata.gradelist[i]["gpa"],
              score: formdata.gradelist[i]["score"],
              createTime: formdata.gradelist[i]["createTime"],
              updateTime: formdata.gradelist[i]["updateTime"],
            });
          }
          this.originalData = this.tableData.slice(); // 将初始数据赋值给originalData
          // this.filteredTableData = this.tableData.slice(); // 存储过滤后的数
        } else {
          this.$message.error("数据获取失败");
        }
      });

    },
    showRatingDialog() {
      this.isRatingDialogVisible = true;
    },
    onScoreSelected(score) {
      this.currentScore = score;
      this.form.score = score;
    },
    openImportDialog() {
      this.isImportFileDialogVisible = true;
    },
    closeImportDialog() {
      this.isImportFileDialogVisible = false;
      this.init(); // 刷新数据
    },
    showDialog(row) {
      // 记录当前行的数据到 tempData 中
      this.tempData = Object.assign({}, row);
      this.currentRow = row;
      // 将当前行的数据赋值给对话框的 form 对象
      this.form.stuNum = row.stuNum;
      this.form.stuName = row.stuName;
      this.form.gpa = row.gpa;
      this.dialogVisible = true; // 显示对话框
    },
    saveForm() {
      console.log({ stuNum: this.form.stuNum, score: this.form.score });
      // 构造请求体数据
      console.log();
      // 发送更新学生记录的请求到服务器
      gradeApi.updateScore({ stuNum: this.form.stuNum, score: this.form.score })
        .then(response => {
          if (response.code === 200) {
                this.$message({
                  message: '打分更新成功！',
                  type: 'success'
                });
                //自动刷新页面
                window.location.reload();
              } 
        })
        .catch(error => {
          // 请求失败处理
          console.error('打分更新失败', error);
        });
      this.dialogVisible = false;
    },
    searchData() {
      // 根据搜索关键词过滤表格数据
      const keyword = this.searchText.trim().toLowerCase();
      const filteredData = this.originalData.filter(
        (item) =>
          item.stuNum.toLowerCase().includes(keyword) ||
          item.stuName.toLowerCase().includes(keyword)
      );
      this.tableData = filteredData;
    },
  },
};
</script>
  
<style scoped>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0 auto;
}

.container {
  margin: 10px auto;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.title {
  font-size: 28px;
  text-align: center;
}

.titleBtn {
  margin: 20px 0;
  margin-bottom: 50px;
}

.main {
  margin: 0 auto;
}
</style>
    
  
  