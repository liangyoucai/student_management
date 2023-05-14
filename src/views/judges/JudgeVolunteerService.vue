<template>
    <div class="container">
  
      <div class="title">
        <h1 class="title">志愿服务时长 - 导入</h1>
        
      </div>
      <el-divider ></el-divider>
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
  
      </div>
      
      <div class="main">
        <el-table :data="tableData" style="width: 100%" id="mainTable" max-height="500">
          <el-table-column prop="no" label="序号" width="80"> 
            <template slot-scope="scope">
              {{ scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column prop="date" label="更新日期" width="140"> </el-table-column>
          <el-table-column prop="class" label="学苑" width="120">
          </el-table-column>
          <el-table-column prop="ID" label="学号" width="140">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="hours" label="志愿服务时长" width="120">
          </el-table-column>
          <el-table-column prop="state" label="状态" width="120">
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
          </el-table-column>
          <el-table-column prop="do" label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="primary" :disabled="scope.row.state !== 2" @click="showDialog(scope.row)">修改</el-button>
              </template>
          </el-table-column>
        </el-table>
        
        <el-dialog :visible.sync="dialogVisible">
          <el-form :model="form" ref="form" label-width="100px">
            <el-form-item label="志愿服务时长">
              <el-input v-model="form.hours"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleChange">确定</el-button>
          </div>
        </el-dialog>
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
            ID: "2200022600",
            name: "ABC",
            class: "求知三苑",
            hours: "80",
            state: 1
          },
          {
            date: "2002-06-28",
            ID: "2200022700",
            name: "DEF",
            class: "求知三苑",
            hours: "50",
            state: 2
          },
          {
            date: "2002-06-28",
            ID: "2200022758",
            name: "ZYY",
            class: "求知三苑",
            hours: "30",
            state: 0
          },
        ],
        dialogVisible: false,
        form: {
          hours: ''
        },
        currentRow: null,
      };
    },
    
    methods: {
      showDialog(row) {
        // 记录当前行的数据到 tempData 中
        this.tempData = Object.assign({}, row);
        this.currentRow = row;
        // 将当前行的数据赋值给对话框的 form 对象
        this.form.ID = row.ID;
        this.form.name = row.name;
        this.form.hours = row.hours;
        this.dialogVisible = true; // 显示对话框
      },
      handleChange(){
        // 判断数据是否合法
        if (!this.form.hours || isNaN(this.form.hours) || this.form.hours < 0 || this.form.hours > 10000) {
          this.$message.error('请输入有效的志愿服务时长');
          return;
        }
        // 处理修改逻辑
        // 获取当前行的索引
        const index = this.tableData.findIndex(item => item === this.currentRow);
        // 更新当前行数据
        this.tableData[index].hours = this.form.hours;
        this.tableData[index].state = 0;
        
        this.dialogVisible = false;
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
                class: ws[i]["学苑"],
                hours: ws[i]["志愿服务时长"],
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
    
  
  