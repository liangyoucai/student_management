<template>
  <div class="container">
    <div class="title">
      <h1 class="title">学生名单管理 - 导入/导出</h1>
    </div>
    <el-divider></el-divider>

    <!-- 导入导出按钮 -->
    <div class="titleBtn">
      <el-button type="warning" icon="el-icon-folder-add" size="small" style="margin: 0 20px" @click="openImportDialog">导入</el-button>
      <el-button @click="exportClick" type="primary" size="small" icon="el-icon-folder-opened">导出</el-button>
    </div>

    <!-- 上传对话框 -->
    <div v-if="isImportFileDialogVisible">
      <importFileDialog importName="stu" importTitle="上传学生信息文件" importTip="一次只能上传一个xls/xlsx文件，且不超过10M" importType="excel" @close-dialog="closeImportDialog">
      </importFileDialog>
    </div>

    <!-- 表格 -->
    <div class="main">
      <el-button
          style="float: left; margin-top: 10px; margin-bottom: 15px;"
          size="small"
          type="danger"
          @click="handleDelete()">删除所选</el-button>
      <el-input 
      style="float: right; margin-left: 20px; margin-top: 10px; margin-bottom: 15px;width: 30%;"
      v-model="searchContent" 
      size="medium" 
      placeholder="请输入姓名或学号" 
      ></el-input>
      <el-table
        :data="pagedData"
        style="width: 100%"
        id="mainTable"
        :row-key="row => row.num"
        max-height="500"
        ref="multipleTable"
        @select="handleSelect"
        @select-all="handleSelectionAll"
      >
        //选择框
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column prop="no" label="序号" width="50">
          <template slot-scope="scope">
            {{ pageSize * (currentPage - 1) + scope.$index + 1 }}
          </template>
        </el-table-column>
        
        <el-table-column prop="date" label="更新日期" width="100"></el-table-column>
        <el-table-column prop="num" label="学号" width="100"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="80"> </el-table-column>
        <el-table-column prop="sex" label="性别" width="80"> </el-table-column>
        <el-table-column prop="year" label="年级" width="100"></el-table-column>
        <el-table-column prop="class" label="学苑" width="120"></el-table-column>
        <el-table-column prop="major" label="专业" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱地址" width="120"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next, jumper"
        :total="checklist.length"
        :page-size="pageSize"
        :current-page.sync="currentPage"
      />
      
    </div>
  </div>
</template>

<script>
import importFileDialog from "@/components/importFileDialog.vue";
import parseTime from "@/utils/timeformat"
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import student from "@/api/studentManager/student";
export default {
  components: {
    importFileDialog,
  },
  data() {
    return {
      tableData: [{
        updateTime: '',
        num: '',
        name: '',
        sex: '',
        year: '',
        class: '',
        major: '',
        email: '',
      }],// 原数据
      checklist:[{
        updateTime:'',
        num:'',
        name:'',
        sex:'',
        year:'',
        class: '',
        major: '',
        email: '',
      }],//筛选值
      searchContent:'',// 搜索内容
      selected: [], // 多选框选中的数据
      pageSize: 3, // 每页显示的数据条数
      currentPage: 1, // 当前页数
      isImportFileDialogVisible: false,

    };
  },
  mounted() {
    this.init();
  },

  computed: {
    // 计算分页后的数据
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
  },

  methods: {
    // 单选
    handleSelect(selection, row) {
      // isExited判断selected是否已经存在当前项
      let isExited = false 
      this.selected.forEach(item => {
        if(item.id === row.id) {
          isExited = true
        }
      })
      if (isExited) {
        // 若存在，代表操作是 取消选中
        this.handleDelItem(row)
      } else {
        // 反之，选中某项
        this.selected.push(row)
      }
    },
    // 全选或全不选
    handleSelectionAll(selection) {
      if (selection.length === 0) {
        // 若是全不选，则循环删除selected数组中存在的项
        this.pagedData().forEach(item => {
          this.handleDelItem(item)
        })
      } else {
        // 全选，将selected和当前table数据合起来，注意去重！
        this.selected = this.unique(
          this.selected.concat(this.pagedData())
        )
      }
    },
    // 删除selected数组中某项数据
    handleDelItem(row){
      let index = -1
      this.selected.forEach((item, idx) => {
        if(item.id === row.id) {
          index = idx
        }
      })
      if (index >= 0) {
        this.selected.splice(index, 1)
      }
    },    // 当前页面切换触发回显
    handleCurrentChange() {
      this.echo()
    },

    // 回显
    echo() {
      let rows = []
      this.pagedData().forEach(row => {
        this.selected.forEach(item => {
          if (row.id === item.id) {
            rows.push(row)
          }
        })
      })
      this.toggleSelection(rows)
    },

    // el-table自带方法
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    openImportDialog() {
      this.isImportFileDialogVisible = true;
    },
    closeImportDialog() {
      this.isImportFileDialogVisible = false;
    },
    handleDelete() {
      console.log(this.selected);
      this.$confirm("此操作将删除所选学生信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除所选学生信息
          student.deleteInfo(this.selected).then((res) => {
            if (res.code === 200) {
              this.init();
            } else {
              console.log(error);
            }
          })
            .catch(function (error) {
              console.log(error);
            });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //获取当前数据库内的学生信息
    init() {
      student.getList().then((res) => {
        // 如果保存成功，则更新表格数据
        // console.log(res)
        if (res.code === 200) {
          const rawdata = res.data;
          this.tableData.length = 0;
          for (var i = 0; i < rawdata.length; i++) {
            let sheetData = {
              date: parseTime.dateFormat(rawdata[i]["updateTime"]),
              num: rawdata[i]["num"],
              name: rawdata[i]["name"],
              sex: rawdata[i]["sex"] === 0 ? '女' : '男',
              year: rawdata[i]["yearName"],
              class: rawdata[i]["className"],
              major: rawdata[i]["majorName"],
              email: rawdata[i]["email"],
            };

            this.tableData.push(sheetData);
          }
        } else {
          console.log(error);
        }
      })
        .catch(function (error) {
          console.log(error);
        });
    },

    //导出
    exportClick() {
      //第一个参数是到处后文件名，第二个是id绑定表格dom
      this.exportExcel("学生信息_导出", "mainTable");
    },

    //转换数据
    exportExcel(filename, tableId) {
      var xlsxParam = { raw: true };
      var table = document.createElement("table");
      var thead = document.createElement("thead");
      var tbody = document.createElement("tbody");

      // 创建表头
      var header = this.tableData[0];
      var tr = document.createElement("tr");
      for (var key in header) {
        var th = document.createElement("th");
        th.innerText = key;
        tr.appendChild(th);
      }
      thead.appendChild(tr);

      // 创建表格内容
      for (var i = 0; i < this.tableData.length; i++) {
        var item = this.tableData[i];
        var tr = document.createElement("tr");
        for (var key in item) {
          var td = document.createElement("td");
          td.innerText = item[key];
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      }

      table.appendChild(thead);
      table.appendChild(tbody);

      var wb = XLSX.utils.table_to_book(table, xlsxParam);
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          filename + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") {
          this.$message.error('文件读取失败!');
          console.log(e, wbout);
        }
      }
      return wbout;
    },
  },
};
</script>

<style scoped>
html,
body {
  height: 100%;
  width: 100%;
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
  flex: 1;
  width: 100%;
  overflow-y: auto;
}
</style>
