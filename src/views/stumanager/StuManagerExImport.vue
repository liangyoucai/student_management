<template>
  <div class="container">

    <div class="title">
      <h1 class="title">学生名单管理 - 导入/导出</h1>
    </div>
    <el-divider></el-divider>
    <div class="titleBtn">
      
      <!-- 导入Excel -->
      <el-upload
        action="/上传文件的接口"
        :on-change="onChange"
        :auto-upload="false"
        :show-file-list="false"
        accept=".xls, .xlsx"
        ref="upload"
        :multiple="true"
      >
        <el-button 
        type="warning" 
        icon="el-icon-folder-add" 
        size="small"
        style="margin: 0 380px"
          >导入</el-button
        >
      </el-upload>

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
      <el-table :data="tableData" style="width: 100%" id="mainTable" max-height="500">
        <el-table-column prop="no" label="序号" width="80"> 
          <template slot-scope="scope">
            {{ scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="更新日期" width="140"> </el-table-column>
        <el-table-column prop="ID" label="学号" width="140">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="100">
        </el-table-column>
        <el-table-column prop="grade" label="年级" width="120">
        </el-table-column>
        <el-table-column prop="class" label="学苑" width="120">
        </el-table-column>
        <el-table-column prop="major" label="专业" width="200">
        </el-table-column>
        <el-table-column prop="mailbox" label="邮箱地址" width="250">
        </el-table-column>
          
      </el-table>
    </div>

  </div>
</template>

<script>
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
export default {
  data() {
    return {
      tableData: [
        {
          date: "2002-06-28",
          ID: "2200022758",
          name: "ZYY",
          sex: "男",
          grade: "2022级",
          class: "求知三苑",
          major: "软件工程大数据方向",
          mailbox: "watermelon_boom@163.com",
        },
      ],
    };
  },
  
  methods: {
    //导出
    exportClick() {
      //第一个参数是到处后文件名，第二个是id绑定表格dom
      this.exportExcel("学生信息管理_导出", "mainTable");
    },
    //转换数据
    exportExcel(filename, tableId) {
      var xlsxParam = { raw: true }; // 导出的内容只做解析，不进行格式转换
      var table = document.querySelector("#" + tableId).cloneNode(true);
      var wb = XLSX.utils.table_to_book(table, xlsxParam);
      /* 获取二进制字符进行输出 */
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
    //导入
    onChange(file, fileList) {
      this.readExcel(file); // 调用读取数据的方法
    },
    // 读取数据
    readExcel(file) {
      let that = this;
      if (!file) {
        //如果没有文件
        return false;
      } else if (!/.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          if (workbook.SheetNames.length >= 1) {
            this.$message({
              message: "导入数据表格成功",
              showClose: true,
              type: "success",
            });
          }
          const wsname = workbook.SheetNames[0]; //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
          console.log("生成json：", ws);
          that.tableData = [];
          for (var i = 1; i < ws.length; i++) {
            let sheetData = {
              // 键名为绑定 el 表格的关键字，值则是 ws[i][对应表头名]
              date: ws[i]["更新日期"],
              ID: ws[i]["学号"],
              name: ws[i]["姓名"],
              sex: ws[i]["性别"],
              grade: ws[i]["年级"],
              class: ws[i]["学苑"],
              major: ws[i]["专业"],
              mailbox: ws[i]["邮箱地址"],
            };
            console.log("上传的数据:", sheetData);
            //添加到表格中
            that.tableData.push(sheetData);
            //正常导入需要拿到上传的数据就在这从新弄个数组push进去，然后传给后台，后台保存后查询表格返给前端。
          }
          this.$refs.upload.value = "";
        } catch (e) {
          console.log(e);
          return false;
        }
      };
      // 如果为原生 input 则应是 files[0]
      fileReader.readAsBinaryString(file.raw);
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
    display: flex;
    margin: 20px 0;
    margin-bottom: 50px;
  }
  .main {
    flex: 1;
    width: 100%;
    overflow-y: auto;
  }
</style>
  

