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
        <el-table-column prop="no" label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="更新日期" width="120"> </el-table-column>
        <el-table-column prop="ID" label="学号" width="120">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="100">
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
        <el-table-column prop="totalpoints" label="测评总分" width="80">
        </el-table-column>
        

      </el-table>

      <el-dialog title="删除分数项" :visible.sync="dialogVisible">
        <el-checkbox-group v-model="checkedScores">
          <el-checkbox :label="'gpa'">GPA</el-checkbox>
          <el-checkbox :label="'vol'">志愿</el-checkbox>
          <el-checkbox :label="'sci'">科研</el-checkbox>
          <el-checkbox :label="'pra'">实践</el-checkbox>
          <el-checkbox :label="'ser'">学生骨干</el-checkbox>
          <el-checkbox :label="'per'">个人总结</el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmDelete">确 定</el-button>
        </div>
      </el-dialog>

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
import axios from 'axios';
export default {
  data() {
    return {
      defaultButtonText: '重新测评',
      dialogVisible: false,
      checkedScores: [],
      tableData: [

      ],


      pageSize: 20, // 每页显示的数据条数
      currentPage: 1, // 当前页数

      summary: {},

      noeId: 0,
    };
  },

  created() {
    this.$axios = axios;
    // 使用map()方法为每个行数据对象添加按钮文本属性
    this.tableData = this.tableData.map(row => ({ ...row, buttonText: this.defaultButtonText }));
    this.init();
    this.tableData = this.tableData.map(row => ({ ...row, buttonText: this.defaultButtonText }));


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

    init(){
      let _this = this;
      this.$axios.post('http://localhost:28080/api/summary/selectbystatus1',null )
              .then(function (response) {
                console.log(response);
                // 如果保存成功，则更新表格数据

                if (response.data.code === 200) {

                  const data1 = response.data.data;
                  console.log("数据" + JSON.stringify(data1))

                  const tableData = [];



                  let currentDate = new Date();
                  let year = currentDate.getFullYear();
                  let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                  let day = currentDate.getDate().toString().padStart(2, '0');
                  let formattedDate = `${year}-${month}-${day}`;


                  for (var i = 0;i < data1.length;i++){




                    let sheetData = {
                      // 键名为绑定 el 表格的关键字，值则是 ws[i][对应表头名]
                      date: formattedDate,
                      ID: data1[i]["stuNum"],
                      name: data1[i]["stuName"],

                      // sex: data1[i]['stu_name'],
                      gpa: data1[i]["gpa"],
                      vol: data1[i]["vol"],
                      sci: data1[i]["sci"],
                      pra: data1[i]["pra"],
                      ser: data1[i]["ser"],
                      per: data1[i]["per"],
                      totalpoints: data1[i]["gpa"] + data1[i]["vol"] + data1[i]["sci"] + data1[i]["pra"] + data1[i]["ser"] + data1[i]["per"]

                    };

                    // this.tableData = this.tableData.map(row => ({ ...row, buttonText: this.defaultButtonText }));


                    console.log("数据：" + sheetData)


                    tableData.push(sheetData);

                  }


                  console.log(1111111)
                  _this.tableData = tableData;
                  console.log(222222)

                  // 在赋值之后，再次对每一行数据添加buttonText属性
                  _this.tableData = _this.tableData.map(row => ({ ...row, buttonText: _this.defaultButtonText }));



                } else {
                  // this.$message.error("保存数据失败");
                }
              })
              .catch(function (error) {
                console.log(error);
                // this.$message.error("保存数据失败");
              });
    },

    handleButtonClick(row) {
      let _this = this;

      if (row.buttonText === '重新测评') {
        _this.dialogVisible = true;
        _this.currentRow = row;
      }

      this.noeId = row.ID;
    },

    confirmDelete() {
      let _this = this;

      // 删除选择的分数项
     for (let i = 0; i < this.checkedScores.length; i++) {
        const score = this.checkedScores[i];

        console.log("属性=" + score)
        this.summary = { ...this.currentRow };

        delete this.currentRow[score];

        this.summary[score] = '';

      }

      // 重新计算总分
      let totalpoints = 0;
      for (let key in this.currentRow) {
        if (key !== 'no' && key !== 'ID' && key !== 'name' && key !== 'totalpoints' && key !== 'buttonText') {
          totalpoints += parseFloat(this.currentRow[key]);
        }
      }

      // 确认删除时将按钮文本改为“待测评”
      _this.currentRow.buttonText = '待测评';

      this.currentRow.totalpoints = ""; // 更新总分
      this.dialogVisible = false; // 隐藏对话框

      // 将更改后的行数据设置到临时变量 summary 中

      console.log("删除后：" + JSON.stringify(this.currentRow))

      // // 删除选择的分数项
      // for (let i = 0; i < this.checkedScores.length; i++) {
      //   const score = this.checkedScores[i];
      //   delete this.summary[score];
      // }


      console.log(JSON.stringify(this.summary))

      console.log(1111);

      console.log(this.noeId);

      console.log(this.checkedScores);

      console.log(this.tableData);

      console.log(1111);
      let summaryVO = this.tableData.find(item => item.ID==this.noeId);
      this.checkedScores.forEach(item => {
        summaryVO[item] = 0;
      });
      console.log(summaryVO);

      let summary = {};


       summary['stuNum'] = summaryVO['ID']
       summary['stuName'] = summaryVO['ID']
       summary['gpa'] = summaryVO['gpa']
       summary['vol'] = summaryVO['vol']
       summary['sci'] = summaryVO['sci']
       summary['pra'] = summaryVO['pra']
       summary['ser'] = summaryVO['ser']
       summary['per'] = summaryVO['per']

      console.log("更新数据=" + JSON.stringify(summary))


      this.$axios.post('http://localhost:28080/api/summary/update',JSON.stringify(summary), {
        headers: {
          'Content-Type': 'application/json'
        }
      } )
              .then(function (response) {
                console.log(response);
                // 如果保存成功，则更新表格数据

                if (response.data.code === 200) {

                  const data1 = response.data.data;
                  console.log("数据" + JSON.stringify(data1))

                  const tableData = [];



                  let currentDate = new Date();
                  let year = currentDate.getFullYear();
                  let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                  let day = currentDate.getDate().toString().padStart(2, '0');
                  let formattedDate = `${year}-${month}-${day}`;

                  // // 在赋值之后，再次对每一行数据添加buttonText属性
                  // _this.tableData = _this.tableData.map(row => ({ ...row, buttonText: _this.defaultButtonText }));



                } else {
                  // this.$message.error("保存数据失败");
                }
              })
              .catch(function (error) {
                console.log(error);
                // this.$message.error("保存数据失败");
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

        if (key !== "buttonText") { // 修改这里的列名
          var th = document.createElement('th');
          th.innerText = key;
          tr.appendChild(th);
        }
      }
      thead.appendChild(tr);

      // 创建表格内容
      for (var i = 0; i < this.tableData.length - 2; i++) {
        var item = this.tableData[i];
        var tr = document.createElement('tr');
        for (var key in item) {
          if (key != "buttonText"){

            var td = document.createElement('td');
            td.innerText = item[key];
            tr.appendChild(td);

          }


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
              gpa: ws[i]["GPA"],
              vol: ws[i]["志愿"],
              sci: ws[i]["科研"],
              pra: ws[i]["实践"],
              ser: ws[i]["学生骨干"],
              per: ws[i]["个人总结"],
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
  
