<template>
    <div class="container">
  
      <div class="title">
        <h1 class="title">个人成绩 - 在线审核</h1>
      </div>
      <el-divider></el-divider>

      <div class="main">
        <el-table :data="tableData" style="width: 100%" id="mainTable" max-height="500">
          <el-table-column prop="stuNum" label="学号" width="140"></el-table-column>
          <el-table-column prop="stuName" label="姓名" width="120"></el-table-column>
          <el-table-column prop="gpa" label="GPA" width="120"></el-table-column>
        </el-table>
      </div>
  
    </div>
  </template>
  
  <script>
  import gradeApi from '@/api/student/grade';
  export default {
    data() {
      return {
        tableData: [
          {
            stuNum: "",
            stuName: "",
            gpa: "",
          },
        ],
      };
    },
    mounted() {
      gradeApi.getList()
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
    methods: {
    
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
    
  
  