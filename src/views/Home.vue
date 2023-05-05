<template>
    <div class="success-page">
        
     
    <!-- 菜单 -->
      <el-container class="menu">
        <el-main>
          <div class="content">
            <h1>欢迎您, 李平 老师!</h1>
            <p>现在是 {{ nowTime }}</p>
          </div>
        </el-main>
      </el-container>
    </div>
  </template>
  
  <script>
  
  export default {
    name: "SuccessPage",
    data() {
      return {
        nowTime: '',
        username: "",
      };
    },
    mounted() {
        this.getNowTime();

    //   // 当页面被调用，立刻调用该方法，获得的username直接赋值给this对象
    //   user.getInfo().then((res) => {
    //     this.username = res.data.username;
    //   });
    },
    methods: {
        getNowTime () {
            let speed = 1000
            let that = this
            let theNowTime = function () {
                that.nowTime = that.timeNumber()
            }
            setInterval(theNowTime, speed)
        },
        timeNumber () {
            let today = new Date()
            let date = today.getFullYear() + '年' + this.twoDigits(today.getMonth() + 1) + '月' + this.twoDigits(today.getDate() + 1) + '日 '
            let time = this.twoDigits(today.getHours()) + ':' + this.twoDigits(today.getMinutes()) + ':' + this.twoDigits(today.getSeconds())
            return date + '  ' + time
        },
        twoDigits (val) {
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
    float: left;
    width: 100%;
  }

  
  .success-page {
    height: 100%;
    width: 100%;
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