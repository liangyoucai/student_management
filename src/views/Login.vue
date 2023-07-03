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
          <el-form-item prop="captchaText">
            <el-input v-model="loginForm.captchaText" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item>
            <div class="identifybox">
                <img :src="captchaimg" alt="获取验证码失败">
              <el-button style="margin-left: 30px;" @click="refreshCode" type='text' class="textbtn">看不清，换一张</el-button>
            </div>
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
      <el-dialog title="找回密码" :visible.sync="dialogFormVisible" width="40%">
          <div >
            请联系学工办找回密码！
          </div>
      </el-dialog>
    </div>
  </div>
</template>
  
<script>
import { setToken } from '@/utils/token'
import user from '@/api/auth/user'
import menu from '@/api/menu';
import Layout from '@/layout';
export default {
  data() {
    // 角色身份必选
    var validateRadio = (rule, value, callback) => {
      if (value) {
        // 当值为0的时候当做没选择
        if (value == 0) {
          callback(new Error('请选择工单状态'))
        } else {
          callback();
        }
      } else {
        callback(new Error('请选择工单状态'));
      }
    };

    return {
      // 按钮加载
      loading: false,
      loginForm: {
        username: '',
        password: '',
        captchaText:''
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captchaText: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      captchaimg:'data:image/jpg;base64,',
      // 找回密码
      dialogFormVisible: false,
    }
  },
  created() {
    this.enterLogin()
  },
  methods: {
    //回车登录
    enterLogin() {
      document.onkeydown = e => {
        //13表示回车键，baseURI是当前页面的地址
        if (e.keyCode === 13 && e.target.baseURI.indexOf('login') != -1) {
          //回车后执行搜索方法
          this.do_login('loginForm')
        }
      }
    },
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
            if (res.code == 200) {
              console.log(res.data)
              // 登录成功
              setToken(res.data.token)
              // 获取菜单列表数据，并动态生成路由
              // menu
              //   .getMenuList()
              //   .then((res) => {
              //     const menuList = res;
              //     console.log(res);
              //     menuList.forEach((menu) => {
              //       const route = {
              //         path: '/',
              //         component: Layout,
              //         children: [
              //           {
              //             path: menu.path,
              //             name: menu.name,
              //             component: () => import(`@/views/${menu.component}.vue`),
              //           },
              //         ],
              //       };

              //       router.addRoute(route);
              //     });

              //   })
              //   .catch((error) => {
              //     console.error(error);
              //   });
              setTimeout(() => {
                this.$router.push({ path: '/home' })
              }, 500);

              this.$message({
                message: '登录成功',
                type: 'success'
              })
              localStorage.setItem('initial', res.data.initial)
              localStorage.setItem('manager', res.data.initial)

          }}).finally(_ => {
            this.loading = false
            this.refreshCode();
          })
        }
      });
    },
    // 刷新验证码
    refreshCode(){
      //更新验证码
      user.getCaptcha().then((res) => {
      if (res.code == 200) {
        this.captchaimg = 'data:image/jpg;base64,'
        this.captchaimg += res.data
      } 
    })
    },
  },
  mounted() {
    user.getCaptcha().then((res) => {
      if (res.code == 200) {
        this.captchaimg += res.data
      } 
    })
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
    width: 450px;
    height: 550px;
    border-radius: 5px;
    box-shadow: 0px 0px 10px #ccc;

    .login-logo {
      margin-top: 10px;
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

