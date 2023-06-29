<template>
    <div>
      <el-dialog :visible.sync="dialogVisible" title="重设密码" width="400px" @close="cancelDialog">
        <el-row align="middle" :gutter="5">
        <el-col :span="8">
          <label class="dialog-label">学号/职工号：</label>
        </el-col>
        <el-col :span="10">
          <el-input class="dialog-input" v-model="num"></el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
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
        
      };
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
      confirm() {
        this.$confirm('此操作重置密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          user.resetPassword(qs.stringify({num:this.num})).then(res => {
            if (res.code === 200){
                this.$message({
                    type: 'success',
                    message: '重置成功!'
                });
            } else {
                this.$message({
                    type: 'error',
                    message: '重置失败!'
                });
            }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置！'
          });          
        });
        })
      },

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
  