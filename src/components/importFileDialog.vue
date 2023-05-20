<template>
  <el-dialog :title="importTitle" width="40%" :visible.sync="isVisible" :before-close="closeDialog">
    <el-form label-width="100px">
      <el-form-item label="导入文件 ">
        <div>
          <el-upload ref="upload" action="#" :http-request="uploadHttpRequest" :data="importData" :auto-upload="false" :multiple="false" :before-upload="beforeUpload">
            <el-button slot="trigger" size="small" type="primary" @click="handleUpload">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">{{ importTip }}</div>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="handleSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: ['importTitle', 'importUrl', 'importData', 'importTip', 'importName'],
  data() {
    return {
      isVisible: true,
    };
  },
  methods: {
    handleUpload() {
      this.$refs.upload.clearFiles();
    },
    // 点击确认：手动上传到服务器，此时会触发组件的http-request
    handleSubmit() {
      this.$refs.upload.submit();
    },
    closeDialog() {
      this.$emit('close-dialog');
      this.$refs.upload.clearFiles();
    },
    beforeUpload(file) {
      //文件类型
      const isType = file.type === 'application/vnd.ms-excel'
      const isTypeComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const fileType = isType || isTypeComputer
      if (!fileType) {
        this.$message.error('上传文件只能是xls/xlsx格式！')
      }
      // 文件大小限制为10M
      const fileLimit = file.size / 1024 / 1024 < 10;
      if (!fileLimit) {
        this.$message.error('上传文件大小不超过10M！');
      }
      return fileType && fileLimit
    },
    // 自定义上传方法，param是默认参数，可以取得file文件信息，具体信息如下图
    uploadHttpRequest(param) {
      const formData = new FormData() //FormData对象，添加参数只能通过append('key', value)的形式添加
      formData.append('file', param.file) //添加文件对象
      formData.append('uploadType', this.rulesType)
      const url = `http://localhost:28080/api/${this.importName}/upload` //上传地址
      axios.post(url, formData)
        .then(res => {
          console.log(res)
          if (res.status === 200) {
            param.onSuccess()  // 上传成功的文件显示绿色的对勾
            this.$message.success('上传成功');
            this.$emit('close-dialog');
          }
          return;
        })
        .catch(err => {
          console.log('失败', err)
          param.onError() //上传失败的文件会从文件列表中删除
        })
    }
  },
};
</script>