<template>
  <div class="container">

    <div class="title">
      <h1 class="title">志愿服务时长 - 导入/在线评审</h1>
      
    </div>
    <el-divider></el-divider>
    <!-- 导入按钮 -->
    <div class="titleBtn">
      <el-button type="warning" icon="el-icon-folder-add" size="small" style="margin: 0 80px" @click="openImportDialog">导入</el-button>
    </div>
    <!-- 上传对话框 -->
    <div v-if="isImportFileDialogVisible">
      <importFileDialog importName="volunteer" importTitle="上传学生志愿服务时长文件" importTip="一次只能上传一个xls/xlsx文件，且不超过10M" @close-dialog="closeImportDialog">
      </importFileDialog>
    </div>
    
    <div class="main">
      <el-table :data="tableData" style="width: 100%" id="mainTable" max-height="500">
        <el-table-column prop="no" label="序号" width="80"> 
          <template slot-scope="scope">
            {{ scope.$index + 1}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="date" label="更新日期" width="140"> </el-table-column> -->
        <el-table-column prop="stuNum" label="学号" width="140">
        </el-table-column>
        <el-table-column prop="stuName" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="time" label="志愿服务时长" width="120">
        </el-table-column>
        <!-- <el-table-column prop="state" label="状态" width="120">
          <template slot-scope="scope">
            <template v-if="scope.row.state === 0">
              未确认
            </template>
            <template v-else-if="scope.row.state === 1">
              已确认
            </template>
            <template v-else-if="scope.row.state === 2">
              有误
            </template>
          </template>
        </el-table-column> -->
        <el-table-column prop="do" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" @click="showDialog(scope.row)">评分</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="评分" width="120">
        </el-table-column>
      </el-table>
      
      <el-dialog :visible.sync="dialogVisible">
        <el-form :model="form" ref="form" label-width="100px">
          <el-form-item label="志愿服务时长">
            <el-input v-model="form.time" :disabled="true"></el-input>
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
import staff from '@/api/volunteer/volunteerApi'
import RatingList from '@/components/RatingList.vue';
import importFileDialog from '@/components/importFileDialog.vue'
import axios from 'axios';
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
export default {
  emits: ['close-dialog','score-selected'],
  components: {
    importFileDialog,
    RatingList
  },
  created(){
    this.$axios = axios;
    this.init();
  },
  data() {
    return {
      currentScore: null,
      isRatingDialogVisible: false,
      tableData: [{
        // {
        //   date: "2002-06-28",
        //   stuNum: "2200022600",
        //   stuName: "ABC",
        //   time: "80",
        // },
        stuNum: "",
        stuName: "",
        time: "",
        score:""
      }],
      dialogVisible: false,
      isImportFileDialogVisible: false,
      form: {
        stuNum: "",
        time: '',
        score:""
      },
      currentRow: null,
    };
  },
  
  methods: {
    init(){
      let _this = this;
      staff.getList(qs.stringify({flag:0})).then(res => {
        // 如果保存成功，则更新表格数据
        if (res.code === 200) {
          const formdata = res.data;
          this.tableData.length = 0;
          for (var i = 0;i < formdata.volunteerlist.length; i++){
            this.tableData.push({
              stuNum: formdata.volunteerlist[i]["stuNum"],
              stuName: formdata.volunteerlist[i]["stuName"],
              time: formdata.volunteerlist[i]["time"],
              score: formdata.volunteerlist[i]["score"],
            });
          }
          // 在赋值之后，再次对每一行数据添加buttonText属性
          // _this.tableData = _this.tableData.map(row => ({ ...row, buttonText: _this.defaultButtonText }));

        } else {
          // this.$message.error("保存数据失败");
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
      this.form.time = row.time;
      this.dialogVisible = true; // 显示对话框
    },
    saveForm() {
      // 构造请求体数据
      console.log();
      // 发送更新学生记录的请求到服务器
      axios.post(`http://localhost:18080/api/volunteer/${this.form.stuNum}/update-score?score=${this.form.score}`)
        .then(response => {
          // 请求成功处理
          console.log('打分更新成功', response);
          // 更新页面上对应学生的分数
          const updatedStudent = this.tableData.find(student => student.stuNum === this.form.stuNum);
          if (updatedStudent) {
            updatedStudent.score = this.form.score;
          }
        })
        .catch(error => {
          // 请求失败处理
          console.error('打分更新失败', error);
          // 可以根据需要执行其他操作
        });
      this.dialogVisible = false;
    },
  },
};
</script>

<style scoped>
   html, body {
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
    /* box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); */
  }
  .el-divider--horizontal {
  margin-top: 3px;
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
  

