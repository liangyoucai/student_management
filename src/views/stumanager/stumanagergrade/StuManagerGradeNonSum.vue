<template>
  <div class="container">

    <div class="title">
      <h1 class="title">学生评分汇总 - 未测评学生信息</h1>

    </div>
    <el-divider></el-divider>
    <div class="titleBtn">

      <!-- 导出Excel -->
      <el-button @click="exportClick" type="primary" size="small" icon="el-icon-folder-opened">导出</el-button>
    </div>

    <div class="main">
      <el-table :data="pagedData" style="width: 100%" id="mainTable" max-height="500">
        <el-table-column prop="no" label="序号" width="80">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="更新日期" width="140"> </el-table-column>
        <el-table-column prop="ID" label="学号" width="140">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="gpa" label="GPA" width="80">
        </el-table-column>
        <el-table-column prop="vol" label="志愿" width="80">
        </el-table-column>
        <el-table-column prop="sci" label="科研" width="80">
        </el-table-column>
        <el-table-column prop="pra" label="实践" width="80">
        </el-table-column>
        <el-table-column prop="ser" label="学生骨干" width="80">
        </el-table-column>
        <el-table-column prop="per" label="个人总结" width="80">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination layout="prev, pager, next, jumper" :total="tableData.length" :page-size="pageSize"
        :current-page.sync="currentPage" />

    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import staff from '@/api/studentManager/summary'
import qs from 'qs';
export default {
  data() {
    return {
      defaultButtonText: '重新测评',
      dialogVisible: false,
      checkedScores: [],
      tableData: [{
        date: "",
        ID: "",
        name: "",
        gpa: "",
        vol: "",
        sci: "",
        pra: "",
        ser: "",
        per: "",
        totalpoints: ""
      }],
      pageSize: 20, // 每页显示的数据条数
      currentPage: 1, // 当前页数
    };
  },
  mounted() {
    this.init();
  },

  computed: {
    // 计算分页后的数据
    // 计算分页后的数据
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;

      return this.tableData.slice(start, end);
    },
  },

  methods: {

    init() {
      let _this = this;
      staff.getList(qs.stringify({ flag: 0 })).then(res => {
        // 如果保存成功，则更新表格数据
        if (res.code === 200) {

          const formdata = res.data;

          // 提取当前时间
          let currentDate = new Date();
          let year = currentDate.getFullYear();
          let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          let day = currentDate.getDate().toString().padStart(2, '0');
          let formattedDate = `${year}-${month}-${day}`;

          this.tableData.length = 0;
          for (var i = 0; i < formdata.summarylist.length; i++) {
            this.tableData.push({
              date: formattedDate,
              ID: formdata.summarylist[i]["stuNum"],
              name: formdata.summarylist[i]["stuName"],
              gpa: formdata.summarylist[i]["gpa"],
              vol: formdata.summarylist[i]["vol"],
              sci: formdata.summarylist[i]["sci"],
              pra: formdata.summarylist[i]["pra"],
              ser: formdata.summarylist[i]["ser"],
              per: formdata.summarylist[i]["per"],
              totalpoints: formdata.summarylist[i]["gpa"] + formdata.summarylist[i]["vol"] + formdata.summarylist[i]["sci"] +
                formdata.summarylist[i]["pra"] + formdata.summarylist[i]["ser"] + formdata.summarylist[i]["per"]
            });
          }

          // 在赋值之后，再次对每一行数据添加buttonText属性
          // _this.tableData = _this.tableData.map(row => ({ ...row, buttonText: _this.defaultButtonText }));

        } else {
          // this.$message.error("保存数据失败");
        }
      });

    },

    //导出
    exportClick() {
      //第一个参数是到处后文件名，第二个是id绑定表格dom
      this.exportExcel("学生评分汇总_未测评", "mainTable");
    },
    //转换数据
    exportExcel(filename, tableId) {
      var xlsxParam = { raw: true };
      var table = document.createElement('table');
      var thead = document.createElement('thead');
      var tbody = document.createElement('tbody');

      // 创建表头
      var header = this.tableData[0];
      var tr = document.createElement('tr');
      for (var key in header) {
        var th = document.createElement('th');
        th.innerText = key;
        tr.appendChild(th);
      }
      thead.appendChild(tr);
      // 创建表格内容
      for (var i = 0; i < this.tableData.length; i++) {
        var item = this.tableData[i];
        var tr = document.createElement('tr');
        for (var key in item) {
          var td = document.createElement('td');
          td.innerText = item[key];
          tr.appendChild(td);
        }
        // console.log(tr)
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
  

