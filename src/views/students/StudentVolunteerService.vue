<template>
    <div class="container">
  
      <div class="title">
        <h1 class="title">志愿服务时长 - 在线审核</h1>
        
      </div>
      <el-divider></el-divider>
      <div class="main">
        <el-table :data="tableData" style="width: 100%" id="mainTable" max-height="500">
          <!-- <el-table-column prop="date" label="更新日期" width="140"> </el-table-column> -->
          <el-table-column prop="stuNum" label="学号" width="140">
          </el-table-column>
          <el-table-column prop="stuName" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="time" label="志愿服务时长" width="120">
          </el-table-column>
            
        </el-table>
      </div>
  
      <!-- <div class="footer">
        <el-button type="primary" v-if="state!=1" @click="confirm(); showForm = false">确认</el-button>
        <el-button type="danger" v-if="state!=1" @click="showForm = true">信息有误</el-button>
          <el-form v-if="showForm" :rules="formRules" ref="form" label-width="120px" :model="formData">
            <el-form-item label="问题描述" prop="description" style="margin-top: 50px;">
              <el-input v-model="formData.description"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="report">提交</el-button>
            </el-form-item>
          </el-form>
        <el-button type="info" v-if="state==1" disabled>已确认</el-button>
      </div> -->

    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import FileSaver from "file-saver";
  import * as XLSX from "xlsx";
  export default {
    data() {
      return {
        // showForm: false, // 控制是否显示表单
        // formData: {
        //   description: "", // 表单数据
        // },
        // formRules: { // 表单验证规则
        //   description: [
        //     { required: true, message: "问题描述不能为空", trigger: "blur" },
        //   ],
        // },
        tableData: [
          {
            // date: "2002-06-28",
            // ID: "2200022758",
            // name: "ZYY",
            // class: "求知三苑",
            // hours: "30",
            stuNum: "",
            stuName: "",
            time: "",
          },
        ],
        //state: 0, // 0-未确认，1-已确认，2-有误，目前默认未确认，写了后端以后可以从后端调用相应数据
      };
    },
    mounted() {
      this.getStudentInfo();
    },
    methods: {
      getStudentInfo() {
      const stuId = 1; // 你需要替换为实际的学生ID
      axios
        .post(`http://localhost:18080/api/volunteer/${stuId}/get-volunteer-info`)
        .then(response => {
          this.tableData = [response.data.data];
        })
        .catch(error => {
          console.error('获取学生信息失败', error);
        });
      },
      // confirm(){
      //   this.state = 1;
      //   // 将确认信息传送到后台服务器
      //   console.log(state);
      //   // 在提交成功后进行一些提示或跳转
      //   this.$message.success('信息已确认');
      // },
      // report() {
      //   this.$refs.form.validate((valid) => {
      //     if (valid) {
      //       // 表单验证通过，提交表单数据
      //       console.log(this.formData);
      //       this.state = 2;
      //       this.$message.success("信息已上报，请等待老师与您联系");
      //       this.showForm = false; // 隐藏表单
      //     } else {
      //       // 表单验证不通过，提示错误信息
      //       this.$message.error("备注不能为空");
      //     }
      //   });
      // }
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
    }
    .title {
      font-size: 28px;
      text-align: center;
    }
    .main {
      margin: 0 auto;
    }
    .footer{
      margin-top: 50px;
    }
  </style>
    
  
  