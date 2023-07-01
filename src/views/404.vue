<template>
  <div class="error-page">
    <div class="error-page__title">
      404错误！
    </div>
    <div class="error-page__headline">
      {{ message }}
    </div>
    <div class="error-page__info">
      对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。
    </div>
    <router-link to="/" class="error-page__return-home">
      返回首页
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  computed: {
    message() {
      return '找不到网页！'
    }
  }
}
</script>

<style lang="scss" scoped>
.error-page {
  text-align: center;
  margin-top: 100px;
}

.error-page__title {
  font-size: 32px;
  font-weight: bold;
  line-height: 40px;
  color: #409eff;
  margin-bottom: 20px;
}

.error-page__headline {
  font-size: 20px;
  line-height: 24px;
  color: #222;
  font-weight: bold;
  margin-bottom: 10px;

}

.error-page__info {
  font-size: 13px;
  line-height: 21px;
  color: grey;
  max-width: 400px;
  /* 设置最大宽度为400px */
  margin: 30px auto;
  /* 居中对齐容器 */
}

.error-page__return-home {
  font-size: 20px;
  display: inline-block;
  padding: 10px 20px;
  background-color: #409eff;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
</style>
