<template>
  <div class="container">

    <div class="title">
      <h1 class="title">学生名单管理 - 导入/导出</h1>
    </div>
    <el-divider></el-divider>
    <div class="titleBtn">
      
      <!-- 导入Excel -->
      <el-upload ref="upload" accept=".xls,.xlsx" action='#' :auto-upload="false" :multiple="false" :file-list="fileList" :before-upload="beforeUpload" :http-request="uploadHttpRequest" :on-remove="fileRemove" :on-change="fileChange">
        <el-button size="small" type="primary">选择文件</el-button>

        <el-button
                @click="exportClick"
                type="primary"
                size="small"
                icon="el-icon-folder-opened"
        >导出</el-button
        >

        <div slot="tip" class="el-upload__tip">一次只能上传一个xls/xlsx文件，且不超过10M</div>
      </el-upload>
      <!-- 导出Excel -->


      <el-row>
        <el-button size="small" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="small" @click="submitUpload">上 传</el-button>



      </el-row>




    </div>
    
    <div class="main">
      <el-table :data="pagedData" style="width: 100%" id="mainTable" max-height="500">
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

      <!-- 分页 -->
      <el-pagination
              layout="prev, pager, next, jumper"
              :total="tableData.length"
              :page-size="pageSize"
              :current-page.sync="currentPage"
      />



    </div>
    <el-divider>



    </el-divider>

  </div>
</template>

<script>
import { uploadHttpRequest } from '@/api/grade/gradeApi';
import axios from 'axios';
import { saveExcelData, submitUpload } from '@/api/grade/gradeApi';
import FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default {
  created() {
    this.$axios = axios;
  },
  data() {
    return {
      tableData: [
        {
          // date: "1111-11-1",
          // ID: "111111",
          // name: "111",
          // sex: "男",
          // grade: "2022级",
          // class: "123",
          // major: "123",
          // mailbox: "123@163.com",
        },
      ],

      pageSize: 20, // 每页显示的数据条数
      currentPage: 1, // 当前页数



      data: []

    };
  },

  created(){
    this.$axios = axios;

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




    init(){

      // alert();

      let _this = this;



      this.$axios.post('http://localhost:28080/api/stu/selectall',null )
              .then(function (response) {
                console.log(response);
                // 如果保存成功，则更新表格数据
                console.log("12312312:" + response)
                console.log("12312312:" + response.code)
                console.log("12312312:" + response.data.code)
                console.log("12312312:" + response.data.data)


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
                      ID: data1[i]["num"],
                      name: data1[i]["name"],

                      sex: data1[i]['sex'] == '0' ? '女' : '男',
                      grade: data1[i]["yearId"],
                      class: data1[i]["classId"],
                      major: data1[i]["majorId"],
                      mailbox: data1[i]["email"],





                    };

                    console.log("数据：" + sheetData)


                    tableData.push(sheetData);

                  }
                  console.log(1111111)
                  _this.tableData = tableData;
                  console.log(222222)

                  _this.pagedData()


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
      this.exportExcel("学生信息管理_导出", "mainTable");
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











    // 导入
    beforeUpload(file) {
      //文件类型
      const isType = file.type === 'application/vnd.ms-excel'
      const isTypeComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const fileType = isType || isTypeComputer
      if (!fileType) {
        this.$message.error('上传文件只能是xls/xlsx格式！')
      }

      // 文件大小限制为10M
      const fileLimit = file.size / 1024 / 1024 < 10;
      if (!fileLimit) {
        this.$message.error('上传文件大小不超过10M！');
      }
      return fileType && fileLimit
    },
    // 自定义上传方法，param是默认参数，可以取得file文件信息，具体信息如下图
    uploadHttpRequest(param) {

      const list = [];
      const data1 = this.tableData;

      for (var i = 0;i < this.tableData.length;i++){
        let sheetData = {

          ID: data1[i]["num"],
          name: data1[i]["name"],
          num: data1[i]["ID"],

          sex: data1[i]['sex'] == '男' ? '1' : '0',
          yearId: data1[i]["grade"],
          classId: data1[i]["class"],
          majorId: data1[i]["major"],
          email: data1[i]["mailbox"],

        };

        console.log("数据：" + sheetData)
        list.push(sheetData);

      }


      console.log("更新的数据:" + list)


      const url = `http://localhost:28080/api/stu/upload` //上传地址
      this.$axios.post(url,list , {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          console.log(res)
          if (res.data.code === 200) {
            param.onSuccess()  // 上传成功的文件显示绿色的对勾
            // this.uploadMark = mark
            this.$message.success('上传成功');

          }
          const data1 = res.data.data;



          console.log("huixianshuju" + JSON.stringify(data1))

          const data = [];

          for (var i = 0;i < data1.length;i++){
            let sheetData = {
              // 键名为绑定 el 表格的关键字，值则是 ws[i][对应表头名]
              // date: data1[i]["更新日期"],
              ID: data1[i]["num"],
              name: data1[i]["name"],

              sex: data1[i]['sex'] == '0' ? '女' : '男',
              grade: data1[i]["year_id"],
              class: data1[i]["class_id"],
              major: data1[i]["major_id"],
              mailbox: data1[i]["email"],
            };
            data.push(sheetData);


            // that.tableData.push(sheetData)

          }

          console.log("所有数据:" + JSON.stringify(data) );






          this.data = data;

          console.log("data:" + JSON.stringify(this.data) );

          return;
        })
        .catch(err => {
          console.log('失败', err)
          param.onError() //上传失败的文件会从文件列表中删除
        })
    },

    // 点击上传：手动上传到服务器，此时会触发组件的http-request
    submitUpload() {
      this.$refs.upload.submit()


    },
    // 文件发生改变
    fileChange(file, fileList) {


      // this.tableData = this.tableData;



      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 展示最后一次选择的文件
        this.onChange(file,this.fileList)
      }
    },
    // 移除选择的文件
    fileRemove(file, fileList) {
      if (fileList.length < 1) {
        this.uploadDisabled = true //未选择文件则禁用上传按钮
      }
    },
    // 取消
    closeDialog() {
      this.$refs.upload.clearFiles() //清除上传文件对象
      this.fileList = [] //清空选择的文件列表
      this.$emit('close', false)
    },
    showDialog(row) {
      // 记录当前行的数据到 tempData 中
      this.tempData = Object.assign({}, row);
      this.currentRow = row;
      // 将当前行的数据赋值给对话框的 form 对象
      this.form.ID = row.ID;
      this.form.name = row.name;
      this.form.GPA = row.GPA;
      this.dialogVisible = true; // 显示对话框
    },
    handleChange() {
      // 判断数据是否合法
      if (!this.form.GPA || isNaN(this.form.GPA) || this.form.GPA < 0 || this.form.GPA > 5) {
        this.$message.error('请输入有效的GPA');
        return;
      }
      // 处理修改逻辑
      // 获取当前行的索引
      const index = this.tableData.findIndex(item => item === this.currentRow);
      // 更新当前行数据
      this.tableData[index].GPA = this.form.GPA;
      this.tableData[index].state = 0;

      this.dialogVisible = false;
    },

    onChange(file, fileList) {
      this.readExcel(file); // 调用读取数据的方法



      // this.tableData = this.data;


    },
    // 读取数据
    readExcel(file) {



      let _this = this;
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
          _this.tableData = [];
          for (var i = 0; i < ws.length; i++) {
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

            console.log("4444444" + JSON.stringify(sheetData))


            _this.tableData.push(sheetData);


            let data1 = {};
            data1['num'] = sheetData['ID'];
            data1['name'] = sheetData['name'];
            data1['sex'] = sheetData['sex'] == '男' ? '1' : '0';
            data1['year_id'] = sheetData['grade'];
            data1['class_id'] = sheetData['class'];
            data1['major_id'] = sheetData['major'];
            data1['email'] = sheetData['mailbox'];


            //添加到表格中

            // console.log("shuju" + JSON.stringify(data1))

            //正常导入需要拿到上传的数据就在这从新弄个数组push进去，然后传给后台，后台保存后查询表格返给前端。
            // this.tableData.push(data1);
          }
          console.log("11111111:" +this.data)
          console.log(JSON.stringify(this.data))

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
</style>
  


