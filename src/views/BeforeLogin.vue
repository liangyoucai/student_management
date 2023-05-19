<template>
    <div class="login-container">
      <div class="login-box">
        <div class="login-logo">
          <a href="#">
            <img width="100px" src="../assets/logo.png" alt="logo">
          </a>
        </div>
        <div class="login-form">
          <h1 id="wel">欢迎您!</h1>
          <el-row>
            <el-button index="/login" @click="go_login" >登录</el-button>
          </el-row>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {

    data() {
      return {
      }
    },
    methods: {
      go_login() {
        // console.log("调用login")
        this.$router.push('/login')
      },
      go_signup() {
        // console.log("调用sigup")
        this.$router.push('/signup')
      },
    }
  }

  </script>
  
  <style lang="scss">
 
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
        height: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
  
        img {
          height: 90%;
          padding-top: 50px;
        }
      }
  
      .login-form {
        padding: 20px;
  
        h1 {
          font-size: 24px;
          margin-bottom: 60px;
          text-align: center;
        }
      }
    }
    
  }

  </style>

