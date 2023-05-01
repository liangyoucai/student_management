<template>
  <div>
    <div class="titleBtn">
      <!-- 导出Excel -->
      <el-button
        @click="exportClick"
        type="primary"
        size="small"
        style="margin: 0 20px"
        icon="el-icon-folder-opened"
        >导出</el-button
      >
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
        <el-button type="warning" icon="el-icon-folder-add" size="small"
          >导入</el-button
        >
      </el-upload>
    </div>
    
    <el-table :data="tableData" style="width: 100%" id="mainTable">
      <el-table-column prop="date" label="更新日期" width="100"> </el-table-column>
      <el-table-column prop="ID" label="学号" width="120">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="100">
      </el-table-column>
      <el-table-column prop="grade" label="年级" width="100">
      </el-table-column>
      <el-table-column prop="class" label="学苑" width="100">
      </el-table-column>
      <el-table-column prop="major" label="专业" width="180">
      </el-table-column>
      <el-table-column prop="mailbox" label="邮箱地址" width="250">
      </el-table-column>
      <el-table-column prop="evaluationstatus" label="测评状态" width="100">
      </el-table-column>
      <el-table-column prop="totalpoints" label="测评总分" width="100">
      </el-table-column>
    </el-table>
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
          sex: "♂",
          grade: "2022级",
          class: "求知三苑",
          major: "软件工程大数据方向",
          evaluationstatus: "未测评",
          totalpoints: "/",
          mailbox: "watermelon_boom@163.com",
        },
      ],
    };
  },
  
  methods: {
    //导出
    exportClick() {
      //第一个参数是到处后文件名，第二个是id绑定表格dom
      this.exportExcel("test", "mainTable");
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
          // that.tableData = [];
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
              evaluationstatus: ws[i]["测评状态"],
              totalpoints: ws[i]["测评总分"],
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
.titleBtn {
  display: flex;
  margin: 20px 0;
}
</style>
