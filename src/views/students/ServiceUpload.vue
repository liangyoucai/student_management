<template>
  <div class="my-form">
    <h1 class="title">学生骨干服务情况 - 在线填写</h1>
    <el-divider></el-divider>
    <el-form :model="form" label-width="120px" ref="form" :rules="rules">
      <div v-for="(project, index) in form.research" :key="project.key">
        <el-row type="flex">
          <el-col :span="22">
            <h4 style="float: left;">{{ '参与的服务项目' + (index + 1) }} </h4>
          </el-col>
          <!-- 删除按钮 -->
          <el-col :span="2" style="display:flex;justify-content:flex-end;align-items:center;">
            <el-button size='mini' type="danger" icon="el-icon-delete" circle @click.prevent="removeProject(project)"></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="名称">
              <el-input placeholder="请输入服务项目名称" v-model="form.research[index].name">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="负责人">
              <el-input placeholder="请输入服务项目负责人" v-model="form.research[index].manager">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="负责单位">
              <el-input placeholder="请输入服务项目负责单位" v-model="form.research[index].organization">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="内容">
              <el-input placeholder="请输入服务内容" v-model="form.research[index].content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="成果">
              <el-input placeholder="请输入服务成果" v-model="form.research[index].achievements"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="时长">
              <el-input placeholder="请输入服务时长" v-model="form.research[index].time"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

      </div>
      <el-form-item style="margin-top: 20px">
        <el-button type="warning" @click="addProject">增加社会实践项目</el-button>
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
        studySummary: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
        ],
        practiceSummary: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
        ],
        selfEvaluation: [
          { required: true, message: '该项不能为空', trigger: 'blur' },
        ],
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 将表单数据传送到后台服务器
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
      console.log(this.form);
    },
    removeProject(project) {
      var index = this.form.research.indexOf(project)
      if (index !== -1) {
        this.form.research.splice(index, 1)
      }
      console.log(this.form);

    }
  },
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