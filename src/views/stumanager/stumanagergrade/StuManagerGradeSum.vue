<template>
  <div class="container">

    <div class="title">
      <h1 class="title">学生评分汇总 - 已测评</h1>

    </div>
    <el-divider></el-divider>
    <div class="titleBtn">

      <!-- 导出Excel -->
      <el-button
        @click="exportClick"
        type="primary"
        size="small"
        icon="el-icon-folder-opened"
        >导出</el-button
      >
    </div>

    <div class="main">
      <el-table :data="pagedData" style="width: 100%" id="mainTable" max-height="500">
        <el-table-column prop="no" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新日期" width="110"> </el-table-column>
        <el-table-column prop="num" label="学号" width="100">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="90">
        </el-table-column>
        <el-table-column prop="gpa" label="GPA" width="70">
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
        <el-table-column prop="totalpoints" label="测评总分" width="80">
        </el-table-column>

      </el-table>

      <!-- 分页 -->
      <el-pagination
              layout="prev, pager, next, jumper"
              :total="tableData.length"
              :page-size="pageSize"
              :current-page.sync="currentPage"
      />


    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import summary from '@/api/studentManager/summary'
import qs from 'qs';
import parseTime from "@/utils/timeformat"

export default {
  data() {
    return {
      tableData: [{
        updateTime: "",
        num: "",
        name: "",
        gpa: "",
        vol: "",
        sci: "",
        pra: "",
        ser: "",
        per: "",
        totalpoints:""
      }],

      pageSize: 3, // 每页显示的数据条数
      currentPage: 1, // 当前页数

    };
  },

  mounted() {
    this.init();
  },
  computed: {
    // 计算分页后的数据
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;

      return this.tableData.slice(start, end);
    },
  },

  methods: {

    init(){
      summary.getList(qs.stringify({flag:1})).then(res => {
        // 如果保存成功，则更新表格数据
        if (res.code === 200) {
          this.tableData.length = 0;
          if (res.data !== null) {
            const rawdata = res.data.summarylist;
            for (var i = 0;i < rawdata.length; i++){
              this.tableData.push({
                updateTime: parseTime.dateFormat(rawdata[i]["updateTime"]),
                num: rawdata[i]["stuNum"],
                name: rawdata[i]["stuName"],
                gpa: rawdata[i]["gpa"],
                vol: rawdata[i]["vol"],
                sci: rawdata[i]["sci"],
                pra: rawdata[i]["pra"],
                ser: rawdata[i]["ser"],
                per: rawdata[i]["per"],
                totalpoints: rawdata[i]["gpa"] + rawdata[i]["vol"] + rawdata[i]["sci"] + 
                rawdata[i]["pra"] + rawdata[i]["ser"] + rawdata[i]["per"]
              });
            }
          }
        
        } else {
          console.log(error)
          // this.$message.error("保存数据失败");
        }
      });
      
    },

    //导出
    exportClick() {
      //第一个参数是到处后文件名，第二个是id绑定表格dom
      this.exportExcel("学生评分汇总_已测评", "mainTable");
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
  html, body {
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

 .red-button {
  background-color: rgb(245, 108, 108);
  color: white;
}

.blue-button {
  background-color: rgb(64, 158, 255);
  color: white;
}

</style>
  
