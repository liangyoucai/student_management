<template>
  <div class="success-page">


    <!-- 菜单 -->
    <el-container class="menu">
      <el-main>
        <div class="content">
          <h1>欢迎您, {{ name }} {{ rolename }}!</h1>
          <p>现在是 {{ nowTime }}</p>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
  
<script>
import user from "@/api/auth/user";
import { Message } from 'element-ui';
import { removeToken } from '@/utils/token'
export default {
  name: "SuccessPage",
  data() {
    return {
      nowTime: '',
      name: '',
      role: '',
      rolename: ''
    };
  },
  mounted() {
    this.getNowTime();
    // 当页面被调用，立刻调用该方法，获得的username直接赋值给this对象
    user.getInfo(this.role).then((res) => {
      console.log(res)
      if (res.code == 200) {
        this.name = res.data.name;
        this.role = res.data.role;
        if (this.role === 'true') {

          this.rolename = "同学"
        } else {
          this.rolename = "老师"
        }
      }
      // else {
      //   // Message.error({
      //   //   message: `Error ${res.code}: ${res.msg}`,
      //   //   duration: 3000,
      //   // });
      //   // 清除token
      //   removeToken()

      // }
      


    });
  },
  methods: {

    // 获取时间
    getNowTime() {
      let speed = 1000
      let that = this
      let theNowTime = function () {
        that.nowTime = that.timeNumber()
      }
      setInterval(theNowTime, speed)
    },
    timeNumber() {
      let today = new Date()
      let date = today.getFullYear() + '年' + this.twoDigits(today.getMonth() + 1) + '月' + this.twoDigits(today.getDate()) + '日 '
      let time = this.twoDigits(today.getHours()) + ':' + this.twoDigits(today.getMinutes()) + ':' + this.twoDigits(today.getSeconds())
      return date + '  ' + time
    },
    twoDigits(val) {
      if (val < 10) return '0' + val
      return val
    },
  },
};
</script>
  
<style scoped>
.menu {
  padding-top: 0px;
  margin: auto;
  /* float: left; */
  width: 100%;
  min-height: 100vh;
}

el-main {
  height: 0;
}

.success-page {
  /* height: 100%;
  width: 100%; */
}

.content {
  /* width: 80%; */
  margin: 20px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>