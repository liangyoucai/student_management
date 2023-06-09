<template>
  <div class="container">

    <div class="title">
      <h1 class="title">志愿服务时长 - 导入/在线评审</h1>
    </div>
    <el-divider></el-divider>
    
    <div class="titleBtnSearch">
      <div class="importButton">
        <el-button type="warning" icon="el-icon-folder-add" size="small" @click="openImportDialog">导入</el-button>
      </div>
      <div class="searchContainer">
        <el-input v-model="searchText" placeholder="输入学号或姓名搜索" style="width: 250px;" @keydown.native="handleKeyDown"></el-input>
        <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
      </div>
    </div>
    <!-- 上传对话框 -->
    <div v-if="isImportFileDialogVisible">
      <importFileDialog importName="volunteer" importTitle="上传学生志愿服务时长文件" importTip="一次只能上传一个xls/xlsx文件，且不超过10M" importType="excel" @close-dialog="closeImportDialog">
      </importFileDialog>
    </div>
    
    <div class="main">
      <el-table :data="sortedTableData" :row-class-name="changeRowColor" style="width: 100%" id="mainTable" max-height="auto">
        <el-table-column prop="no" label="序号" width="50">
          <template slot-scope="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="stuNum" label="学号" width="140" sortable>
        </el-table-column>
        <el-table-column prop="stuName" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="time" label="志愿服务时长" width="120">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160">
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="do" label="操作" width="170">
          <template slot-scope="scope">
            <div class="action-buttons">
              <el-button type="primary" @click="showDialog(scope.row)" :disabled="scope.row.isDel === 1">评分</el-button>
              <el-button type="danger" @click="showDeleteConfirmation(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="评分" width="100">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="tableData.length"
        :page-size="pageSize"
        :current-page.sync="currentPage"
      />

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
import staff from '@/api/judge/volunteer'
import RatingList from '@/components/RatingList.vue';
import importFileDialog from '@/components/importFileDialog.vue'
import axios from 'axios';
import volunteerApi from '@/api/judge/volunteer';

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
        stuNum: "",
        stuName: "",
        time: "",
        score: "",
        createTime: "",
        updateTime: "",
        isDel: ""
      }],
      dialogVisible: false,
      isImportFileDialogVisible: false,
      form: {
        stuNum: "",
        time: '',
        score: ""
      },
      currentRow: null,
      searchText: '',
      originalData: [], // 存储初始数据的属性
      filteredTableData: [], // 存储过滤后的数据
      pageSize: 10, // 每页显示的数据条数
      currentPage: 1, // 当前页数
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
    },
    pagedData() {
      this.checklist = this.tableData.filter(data => !this.searchContent || 
        data.name.toLowerCase().includes(
        this.searchContent.toLowerCase()) ||
        data.num.includes(this.searchContent) )
      // 每页显示的第一个和最后一个条目
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;

      return this.checklist.slice(start, end);
    },
    sortedTableData() {
      const sortedData = this.pagedData.slice(); // 复制分页数据，避免直接修改原数据
      sortedData.sort((a, b) => {
        // 按学号进行升序排序
        if (a.stuNum < b.stuNum) return -1;
        if (a.stuNum > b.stuNum) return 1;
        return 0;
      });
      return sortedData;
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
          for (var i = 0; i < formdata.volunteerlist.length; i++) {
            this.tableData.push({
              stuNum: formdata.volunteerlist[i]["stuNum"],
              stuName: formdata.volunteerlist[i]["stuName"],
              time: formdata.volunteerlist[i]["time"],
              score: formdata.volunteerlist[i]["score"],
              createTime: formdata.volunteerlist[i]["createTime"],
              updateTime: formdata.volunteerlist[i]["updateTime"],
              isDel: formdata.volunteerlist[i]["isDel"],
            });
          }
          this.originalData = this.tableData.slice(); // 将初始数据赋值给originalData
        } else {
          this.$message.error("数据获取失败");
        }
      });
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const hour = ("0" + date.getHours()).slice(-2);
      const minute = ("0" + date.getMinutes()).slice(-2);
      const second = ("0" + date.getSeconds()).slice(-2);

      return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
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
      volunteerApi.updateScore({ stuNum: this.form.stuNum, score: this.form.score })
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
    handleKeyDown(event) {
      if (event.keyCode === 13 || event.key === 'Enter') {
        this.searchData();
      }
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
    showDeleteConfirmation(row) {
      this.$confirm('确定删除该项吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          volunteerApi.deleteVolunteer({ stuNumData: row.stuNum }).then(response => {
          console.log("要删除的" + row.stuNum);
          if (response.code === 200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
            //自动刷新页面
            window.location.reload();
          }
        })
        })
        
        .catch(error => {
          // 请求失败处理
          console.error('删除失败', error);
        });
    },
    changeRowColor({ row }) {
      if (row.isDel === 1) {
        return 'rowstyle';
      } 
    },
  },
};
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
  margin: 0 auto;
}

.container {
  margin: 10px auto;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  height: auto;
  overflow: hidden;
}

.title {
  font-size: 28px;
  text-align: center;
}

.titleBtnSearch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}


.searchContainer {
  display: flex;
  margin-right: 10px;
}

.importButton {
  display: flex;
  /* justify-content: center;
   */
  margin-left: 520px;
}

.main {
  margin: 0 auto;
}
.action-buttons {
    display: flex;
    justify-content: space-between;
  }
.el-table .rowstyle {
  background: pink;
}
</style>
  

