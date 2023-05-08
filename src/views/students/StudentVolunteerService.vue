<template>
    <div class="container">
  
      <div class="title">
        <h1 class="title">志愿服务时长 - 在线审核</h1>
        <el-divider></el-divider>
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
          <el-table-column prop="class" label="学苑" width="120">
          </el-table-column>
          <el-table-column prop="hours" label="志愿服务时长" width="120">
          </el-table-column>
            
        </el-table>
      </div>
  
      <div class="footer">
        <el-button type="primary" v-if="!isConfirmed" @click="confirm">确认</el-button>
        <el-button type="danger" v-if="!isConfirmed" @click="report">有误</el-button>
        <el-button type="info" v-else disabled>已确认</el-button>
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
            class: "求知三苑",
            hours: "30",
          },
        ],
        isConfirmed: false // 目前默认未确认，写了后端以后可以从后端调用相应数据
      };
    },
    
    methods: {
      confirm(){
        this.isConfirmed = true;
        // 将确认信息传送到后台服务器
        console.log(1);
        // 在提交成功后进行一些提示或跳转
        this.$message.success('信息已确认');
      },
      report(){
        // 将错误上报信息传送到后台服务器
        console.log(0);
        // 在提交成功后进行一些提示或跳转
        this.$message.success('错误信息已上报，请等待老师与您联系');
      }
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
    
  
  