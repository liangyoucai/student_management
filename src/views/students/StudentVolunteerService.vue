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
  import user from '@/api/auth/user'
  import volunteerApi from '@/api/student/volunteer'
  export default {
    data() {
      return {
        tableData: [
          {
            stuNum: "",
            stuName: "",
            time: "",
          },
        ],
      };
    },
    mounted() {
      this.getStudentInfo();
    },
    methods: {
      getStudentInfo() {
        const token = localStorage.getItem('ACCESS_TOKEN');
        const headers = {
          Authorization: `"Bearer" + ${token}`, // 在请求头中添加Token
        };
        volunteerApi.getList(headers)
          .then(response => {
            // 请求成功处理
            console.log(response.data); // 处理返回的数据
            this.tableData = [response.data];
          })
        .catch(error => {
          // 请求失败处理
          console.error(error);
        });
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
    
  
  