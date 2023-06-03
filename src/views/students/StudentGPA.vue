<template>
    <div class="container">
  
      <div class="title">
        <h1 class="title">个人成绩 - 在线审核</h1>
      </div>
      <el-divider></el-divider>

      <div class="main">
        <el-table :data="tableData" style="width: 100%" id="mainTable" max-height="500">
          <!-- <el-table-column prop="date" label="更新日期" width="140"> </el-table-column> -->
          <el-table-column prop="stuNum" label="学号" width="140"></el-table-column>
          <el-table-column prop="stuName" label="姓名" width="120"></el-table-column>
          <el-table-column prop="gpa" label="GPA" width="120"></el-table-column>
        </el-table>
      </div>
  
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import user from '@/api/auth/user'
  import student from '@/api/student/grade'
  export default {
    data() {
      return {
        tableData: [
          {
            // date: "2002-06-28",
            // ID: "2200022758",
            // name: "ZYY",
            // class: "求知三苑",
            // GPA: "4.00",
            stuNum: "",
            stuName: "",
            gpa: "",
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
        //console.log(token);
        student.getList(this.stuNum)
          .then(response => {
            // 请求成功处理
            console.log(response.data); // 处理返回的数据
            //this.stuNum = response.data.stuNum;
            //this.stuName = response.data.stuName;
            //this.gpa = response.data.gpa;
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
    
  
  