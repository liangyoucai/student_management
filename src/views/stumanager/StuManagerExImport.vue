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
      <el-table :data="pagedData" style="width: 100%" id="mainTable" max-height="500">
        <el-table-column prop="no" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
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
      <el-pagination layout="prev, pager, next, jumper" :total="tableData.length" :page-size="pageSize" :current-page.sync="currentPage" />
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
      }],

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
      // 每页显示的第一个和最后一个条目
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;

      return this.tableData.slice(start, end);
    },
  },

  methods: {
    openImportDialog() {
      this.isImportFileDialogVisible = true;
    },
    closeImportDialog() {
      this.isImportFileDialogVisible = false;
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
