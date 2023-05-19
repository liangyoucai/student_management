<template>
    <div class="login-container">
      <div class="login-box">
        <div class="login-logo">
          <a href="#">
            <img src="../assets/logo.png" alt="logo">
          </a>
        </div>
        <div class="login-form">
          <h3>用户登录</h3>
          <el-form ref="loginForm" :model="loginForm" :rules="rules" label-position="left" label-width="0">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="margin-left: -10px;" type="primary" @click="do_login('loginForm')" :loading="loading">登录</el-button>
            </el-form-item>
            <div class="rg_right">
                <el-link type="primary" @click="dialogFormVisible = true">忘记密码？</el-link>
            </div>
          </el-form>
        </div>
        <!-- 找回密码 -->
        <el-dialog @close="clearForm('findPasswordForm')" title="找回密码" :visible.sync="dialogFormVisible" width="40%">
          <el-form :model="findPasswordForm" ref="findPasswordForm" :rules="rules" label-width="60px">

            <el-form-item label="邮箱" prop="email">
              <el-input placeholder="请填写邮箱" maxlength="32" v-model="findPasswordForm.email"></el-input>
            </el-form-item>

            <el-form-item label="新密码" prop="password">
              <el-input placeholder="请填写 6-18 位密码" type="password" maxlength="18" v-model="findPasswordForm.password" show-password></el-input>
            </el-form-item>

          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button :loading="loading" @click="submitFindPassword('findPasswordForm')">提 交</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </template>
  
  <script>
  import {setToken} from '@/utils/auth'
  import user from '@/api/user'
  export default {
    data() {
      var email = (rule, value, callback) => {
        if(!value) {
          return callback(new Error('请输入邮箱'))
        }else if(!/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/.test(value)) {
          return callback(new Error('请输入正确的邮箱'))
        }else {
          callback()
        }
       };
      var password = (rule, value, callback) => {
        if(!value) {
          return callback(new Error('请输入密码'))
        }else if(!/(?=.*[a-zA-Z])[a-zA-Z0-9]{6,18}/.test(value)) {
          return callback(new Error("密码长度在6-18个字符，只能包含数字、大小写字母 且 至少包含一个字母"))
        }else {
          callback()
        }
      };

      return {
        isCode: false,
        // 倒计时
        disabled: false,
        msg: '点击获取验证码',
        count: 60,
        timer: 0,
        // 按钮加载
        loading: false,
        loginForm: {
          username: '',
          password: ''
        },
        rules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
        },
        loading: false,
        // 找回密码
        dialogFormVisible: false,
        findPasswordForm: {
          email: '',
          password: '',
        },
        rules: {
          email: [
            { validator: email, trigger: 'blur' }
          ],
          password: [
            { validator: password, trigger: 'blur' }
          ],
        },
      }
    },
    methods: {
      // 清空表单
      clearForm(formName) {
        this.$refs[formName].resetFields();
      },
      open_warning() {
        this.$message({
          showClose: true,
          message: this.msg,
          type: 'warning'
        });
      },
      open_suc() {
        this.$message({
          showClose: true,
          message: this.msg,
          type: 'success'
        });
      },
      open_err() {
        this.$message({
          showClose: true,
          message: this.msg,
          type: 'error'
        });
      },
      do_login(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true
            // 登录请求
            user.login(this.loginForm).then(res => {
              if(res.code == 200) {
                // 登录成功
                setToken(res.data.accessToken)
                
                setTimeout(() => {
                  this.$router.push({ path: '/'})
                }, 500);

                this.$message({
                  message: '登录成功',
                  type: 'success'
                })

              }else{
                this.msg = res.msg
                this.open_err()
              } 
              
            }).finally(_ => {
              this.loading = false
            })
          }
        });
      },
        
      // 修改密码
      submitFindPassword(formName) {
        this.$refs[formName].validate((valid) => {
        if(valid) {
          this.$message({
                message: "暂未开放",
                type: 'error'
              })
          // this.loading = true
          // // 请求
          // user.findPassword(this.findPasswordForm).then(_ => {
          //   if(_) {
          //     // 请求成功
          //     this.$message({
          //       message: '密码修改成功',
          //       type: 'success'
          //     })
          //     this.dialogFormVisible = false
          //   }
          // }).finally(_ => {
          //   this.loading = false
          // })
        }
      })
    }
 
    }
}
  
  

  </script>
  
  <style lang="scss">
  .rg_right {
    float: right;
    margin-top: -50px;
  }
  .login-container {
    margin-top: 80px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  
    .login-box {
      width: 400px;
      height: 400px;
      border-radius: 5px;
      box-shadow: 0px 0px 10px #ccc;
  
      .login-logo {
        margin-top: 20px;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
  
        img {
          height: 80%;
          padding-top: 50px;
        }
      }
  
      .login-form {
        padding: 20px;
  
        h3 {
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }
      }
    }
  }
  </style>

