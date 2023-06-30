<template>
  <div class="preview-pdf">
    <el-button size="small" @click="togglePreview">{{ showPreview ? '隐藏预览证明材料' : '点击预览证明材料' }}</el-button>
    <div v-if="showPreview" id="pdf">
      <iframe :src="pdfURL" height="900px;" width="800px"></iframe>
    </div>
  </div>
</template>

<script>
import judge from '@/api/judge/judge';

export default {
  props: ['subject', 'stuNum'],
  name: 'App',
  data() {
    return {
      pdfURL: '',
      showPreview: false, // 初始状态下不显示预览
    };
  },
  methods: {
    togglePreview() {
      if (this.showPreview == false) {
        judge.previewFile(this.subject, this.stuNum).then(res => {
          //res为接口所返回的文件流
          var blob = new Blob([res], {
            type: "application/pdf;chartset=UTF-8"
          });
          this.pdfURL = window.URL.createObjectURL(blob);
        })
      }
      this.showPreview = !this.showPreview; // 切换showPreview的值，控制预览的显示/隐藏
    }
  },
  mounted() {
    // student.previewFile(this.subject).then(res => {
    //   //res为接口所返回的文件流
    //   var blob = new Blob([res], {
    //     type: "application/pdf;chartset=UTF-8"
    //   });
    //   this.pdfURL = window.URL.createObjectURL(blob);
    //   console.log(this.pdfURL)
    // })
  }
}
</script>

<style scoped>
.preview-pdf {
  margin-top: 20px;
  margin-bottom: 10px;
  /* float: left; */
}
</style>