<template>
    <div>
      <el-dialog :visible.sync="dialogVisible" title="修改密码" width="400px" @close="cancelDialog">
        <el-row align="middle" :gutter="5">
        <el-col :span="8">
          <label class="dialog-label">学号：</label>
        </el-col>
        <el-col :span="10">
          <!-- <el-input class="dialog-input" v-model="email"></el-input> -->
          <span style="margin-top: 20px;margin-left: 15px; display: flex;align-items: center;"> {{ num }}</span>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <label class="dialog-label">新密码：</label>
        </el-col>
        <el-col :span="12">
          <el-input class="dialog-input" type="password" v-model="newPassword" show-password></el-input>
        </el-col>
        <el-col :span="8">
          <label class="dialog-label">再次输入密码：</label>
        </el-col>
        <el-col :span="12">
          <el-input class="dialog-input" type="password" v-model="newPassword2" show-password></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确定</el-button>
      </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { removeToken } from '@/utils/token'
  import user from "@/api/auth/user";
  import qs from 'qs';
  export default {
    data() {
      return {
        dialogVisible: true,
        num: '',
        newPassword: '',
        newPassword2: ''
      };
    },
    mounted() {
      user.getInfo().then(res => {
        this.num = res.data.num;
      });
    },
    methods: {
      showDialog() {
        this.dialogVisible = true;
        console.log(this.dialogVisible)
      },
      cancelDialog() {
        // this.dialogVisible = false;
        this.$emit('close-dialog');
      },
      
      confirmDialog() {
        // 检查两次密码是否一致
        if (this.newPassword !== this.newPassword2) {
          this.$message({
            message: '两次密码不一致！',
            type: 'error'
          });
          return;
        } else {
          user.changePassword(qs.stringify({newPassword:this.newPassword})).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                });
                removeToken();
                //自动刷新页面
                window.location.reload();
                this.$router.push('/login');
              } 
              
        }).catch(err => {
          this.$message({
            message: '修改失败！',
            type: 'error'
          });
        });
        }
        // this.dialogVisible = false;
      }
    }
  };
  </script>
  
  <style>
  .dialog-input{
    height: 20px;
    padding: 5px;
    margin: 10px;
  }
  .round-button {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    padding: 0;
  }
  .dialog-label{
    height: 20px;
    display: flex;
    align-items: center;
    margin-top: 22px;
    
  }
  .dialog-footer {
    text-align: right;
  }
  </style>
  