<template>
  <div class="my-form">
    <h1 class="title">学生骨干服务情况 - 在线填写</h1>
    <el-divider></el-divider>
    <el-form :model="form" label-width="120px" ref="form" :rules="rules">
      <div v-for="(project, index) in form.research" :key="project.key">
        <el-row type="flex">
          <el-col :span="22">
            <h4 style="float: left;">{{ '参与的服务项目' + (index + 1) }}</h4>
          </el-col>
          <!-- 删除按钮 -->
          <el-col :span="2" style="display:flex;justify-content:flex-end;align-items:center;">
            <el-button size='mini' type="danger" icon="el-icon-delete" circle @click.prevent="removeProject(project)"></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="名称" prop="name" >
              <el-input placeholder="请输入服务岗位名称" v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="岗位负责人" prop="manager" >
              <el-input placeholder="请输入服务岗位负责人" v-model="form.manager"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="岗位负责单位" prop="organization" >
              <el-input placeholder="请输入服务岗位负责单位" v-model="form.organization"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="岗位职责" prop="content" >
              <el-input placeholder="请输入岗位职责" v-model="form.content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="成果" prop="achievements" >
              <el-input placeholder="请输入在岗期间成果" v-model="form.achievements"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="时长" prop="time" >
              <el-input placeholder="请输入在岗服务时长" v-model="form.time"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item style="margin-top: 20px">
        <el-button type="warning" @click="addProject">增加服务项目</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="clearForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PersonalSummaryForm',
  data() {
    return {
      form: {
        research: [
          {
            name: '',
            manager:'',
            organization:'',
            content: '',
            achievements: '',
            time: ''
          }
        ]
      },
      rules: {

            name: [
              {required: true, message: '该项不能为空', trigger: 'blur'},
            ],
            manager: [
              {required: true, message: '该项不能为空', trigger: 'blur'},
            ],
            organization: [
              {required: true, message: '该项不能为空', trigger: 'blur'},
            ],
            content: [
              {required: true, message: '该项不能为空', trigger: 'blur'},
            ],
            time: [
              {required: true, message: '该项不能为空', trigger: 'blur'},
            ],
            achievements: [
              {required: true, message: '该项不能为空', trigger: 'blur'},
            ],
          }


    };


  },
  methods: {

    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 将表单数据传送到后台服务器
          console.log('submitForm called')
          console.log(this.form);
          // 在提交成功后进行一些提示或跳转
          this.$message.success('提交成功');
        } else {
          // 表单校验不通过
          this.$message.error('表单填写不完整或有误，请检查');
          return false;
        }
      });
    },
    clearForm() {
      this.$refs.form.resetFields();
    },
    addProject() {
      this.form.research.push({
        name: '',
        manager:'',
        organization: '',
        content: '',
        achievements: '',
        time: '',
        key: Date.now()
      });
    },
    removeProject(project) {
      var index = this.form.research.indexOf(project)
      if (index !== -1) {
        this.form.research.splice(index, 1)
      }
    }
  }
};
</script>

<style scoped>
.title {
  font-size: 28px;
  text-align: center;
  margin-bottom: 30px;
}

.my-form {
  width: 80%;
  margin: 0 auto;
  min-height: 100vh;
}

.el-divider--horizontal {
  margin: 0px 0;
}
</style>
