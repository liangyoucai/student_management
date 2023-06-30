<template>
  <div>

    <div class="titleBtn">
      <el-button type="warning" icon="el-icon-folder-add" size="small" @click="openImportDialog" style="float: left;" ref="ChildButton">上传证明材料</el-button>
    </div>
    <!-- 上传对话框 -->
    <div v-if="isImportFileDialogVisible">
      <importFileDialog :subject=subject importName="pdf" importTitle="上传证明材料pdf文件" importTip="请将所有证明材料放在一个pdf文件上传，且不超过10M。如果有补充提交，请将原来的pdf文件加上补充的材料再次提交。" importType="pdf" @close-dialog="closeImportDialog">
      </importFileDialog>
    </div>
  </div>
</template>

<script>
import importFileDialog from '@/components/importFileDialog.vue'

export default {
  props: ['subject'],
  components: {
    importFileDialog,
  },
  data() {
    return {
      isImportFileDialogVisible: false,
    }
  },
  methods: {
    openImportDialog() {
      this.isImportFileDialogVisible = true;
    },
    closeImportDialog() {
      this.isImportFileDialogVisible = false;
    },
  }
}
</script>

<style scoped></style>