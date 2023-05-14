<template>
  <div class="container">

    <div class="title">
      <h1 class="title">学生成绩 - 导入</h1>

    </div>
    <el-divider></el-divider>
    <div class="titleBtn">

      <!-- 导入Excel -->
      <!-- <el-upload action="#" :http-request="uploadHttpRequest" :on-change="onChange" :auto-upload="false" :show-file-list="false" accept=".xls, .xlsx" ref="upload" :multiple="true">
        <el-button type="warning" icon="el-icon-folder-add" size="small" style="margin: 0 80px">导入</el-button>
      </el-upload>
      <el-row>
        <el-button type="primary" size="small" @click="submitUpload">上 传</el-button>
      </el-row> -->
      <el-upload ref="upload" accept=".xls,.xlsx" action='#' :auto-upload="false" :multiple="false" :file-list="fileList" :before-upload="beforeUpload" :http-request="uploadHttpRequest" :on-remove="fileRemove" :on-change="fileChange">
        <el-button size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">一次只能上传一个xls/xlsx文件，且不超过10M</div>
      </el-upload>
      <el-row>
        <el-button size="small" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="small" @click="submitUpload">上 传</el-button>
      </el-row>
    </div>

    <div class="main">
      <el-table :data="tableData" style="width: 100%" id="mainTable" max-height="500">
        <el-table-column prop="no" label="序号" width="80">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>

        </el-table-column>
        <el-table-column prop="date" label="更新日期" width="140"> </el-table-column>
        <el-table-column prop="class" label="学苑" width="120">
        </el-table-column>
        <el-table-column prop="ID" label="学号" width="140">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="GPA" label="GPA" width="120">
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
          <el-form-item label="学号">
            <el-input v-model="form.ID"></el-input>
          </el-form-item>
          <el-form-item label="GPA">
            <el-input v-model="form.GPA"></el-input>
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
import { uploadHttpRequest } from '@/api/grade/gradeApi';

import axios from 'axios';
import { saveExcelData, submitUpload } from '@/api/grade/gradeApi';
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
          GPA: "3.80",
          state: 1
        },
        {
          date: "2002-06-28",
          ID: "2200022700",
          name: "DEF",
          class: "求知三苑",
          GPA: "3.50",
          state: 2
        },
        {
          date: "2002-06-28",
          ID: "2200022758",
          name: "ZYY",
          class: "求知三苑",
          GPA: "4.00",
          state: 0
        },
      ],
      dialogVisible: false,
      form: {
        GPA: ''
      },
      currentRow: null,
    };
  },

  methods: {
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
      const formData = new FormData() //FormData对象，添加参数只能通过append('key', value)的形式添加
      formData.append('file', param.file) //添加文件对象
      formData.append('uploadType', this.rulesType)
      const url = `http://localhost:28080/api/grade/import` //上传地址
      axios.post(url, formData)
        .then(res => {
          console.log(res)
          if (res.status === 200) {
            param.onSuccess()  // 上传成功的文件显示绿色的对勾
            // this.uploadMark = mark
            this.$message.success('上传成功');
          }
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
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 展示最后一次选择的文件
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

      const formData = new FormData();
      formData.append('file', file.raw); // 将文件添加到 FormData 对象中

      // 发送 POST 请求，将文件传递给后端
      axios.post('/api/grade/upload', formData)
        .then(response => {
          // 处理上传成功的逻辑
          this.$message.success("文件上传成功");
          // 根据后端返回的数据进行操作
          console.log(response.data);
        })
        .catch(error => {
          // 处理上传失败的逻辑
          this.$message.error("文件上传失败");
          console.error(error);
        });

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
html,
body {
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
    
  
  