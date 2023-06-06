<template>
  <div class="my-form">
    <h1 class="title">学生骨干服务情况 - 在线填写</h1>
    <el-divider></el-divider>
    <el-form :model="form" label-width="120px" ref="form" >
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
            <el-form-item label="名称" :prop="'research.'+index+'.name'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
              <el-input placeholder="请输入服务岗位名称" v-model="form.research[index].name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="岗位负责人" :prop="'research.'+index+'.manager'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
              <el-input placeholder="请输入服务岗位负责人" v-model="form.research[index].manager"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="岗位负责单位" :prop="'research.'+index+'.organization'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
              <el-input placeholder="请输入服务岗位负责单位" v-model="form.research[index].organization"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="岗位职责" :prop="'research.'+index+'.content'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
              <el-input placeholder="请输入岗位职责" v-model="form.research[index].content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="成果" :prop="'research.'+index+'.achievements'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
              <el-input placeholder="请输入在岗期间成果" v-model="form.research[index].achievements"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="参与时间" :prop="'research.' + index + '.time'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'change'
                        }" style="float: left">
              <el-date-picker v-model="form.research[index].time" type="monthrange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
<!--            <el-form-item label="时长" :prop="'research.'+index+'.time'" :rules="{-->
<!--                            required: true, message: '该项不能为空', trigger: 'blur'-->
<!--                        }">-->
<!--              <el-input placeholder="请输入在岗服务时长" v-model="form.research[index].time"></el-input>-->
<!--            </el-form-item>-->
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
import axios from "axios";
import user from "@/api/auth/user";
import student from '@/api/student/student'
export default {
  name: 'PersonalSummaryForm',
  data() {
    return {
      form: {
        research: [
          {
            name: '',
            manager: '',
            organization: '',
            content:'',
            // level: '',
            time: '',
            achievements: ''
          }
        ]
      },
      // levels: ['校级', '市级', '省级', '国家级'],
      username: '',
      num: '',
    };
  },
  // mounted() {
  //     // 当页面被调用，立刻调用该方法，获得的username直接赋值给this对象
  //     // user.getInfo(this.role).then((res) => {
  //     //     this.name = res.data.name;
  //     //     this.num = res.data.num;
  //     //     this.id = res.data.id;
  // },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let data = []
          for (let item of this.form.research) {
            let dateStringArray = []
            item.time.forEach((date) => {
              const year = date.getFullYear().toString();
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              dateStringArray.push(year + '.' + month); // 这里用 '.' 进行连接，也可以使用其他分隔符，如 '-'
            });
            const start = dateStringArray[0];
            const end = dateStringArray[dateStringArray.length - 1];
            const dateRangeString = start + '-' + end;

            data.push({
              "constitution": item.organization,
              "director": item.manager,
              // "level": this.levels.indexOf(item.level),
              "content":item.content,
              "result": item.achievements,
              // "stuId": 1,
              // "stuName": '张三',
              // "stuNum": 2200022001,
              // "createUserId": 0,
              // "updateUserId": 0,
              "time": dateRangeString,
              "title": item.name
            })
          }
          console.log(data)
          student.import('service', data)
              .then(res => {
                console.log(res);
                if (res.code == 200) {
                  this.$message.success("提交成功")
                }
              });
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
        manager: '',
        organization: '',
        // level: '',
        content:'',
        time: '',
        achievements: '',
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

// export default {
//   name: 'PersonalSummaryForm',
//   data() {
//     return {
//       form: {
//         research: [
//           {
//             name: '',
//             manager: '',
//             organization: '',
//             content:'',
//             //level: '',
//             time: '',
//             achievements: ''
//           }
//         ]
//       },
//      // levels: ['校级', '市级', '省级', '国家级'],
//       username: '',
//       num: '',
//     };
//   },
//   mounted() {
//     // 当页面被调用，立刻调用该方法，获得的username直接赋值给this对象
//     user.getInfo(this.role).then((res) => {
//       this.username = res.data.username;
//       this.num = res.data.num
//       console.log(res.data)
//     });
//   },
//   methods: {
//     submitForm() {
//       this.$refs.form.validate((valid) => {
//         if (valid) {
//           let data = []
//           for (let item of this.form.research) {
//
//             data.push({
//               "constitution": item.organization,
//               "director": item.manager,
//              // "level": this.levels.indexOf(item.level),
//               "content":item.content,
//               "result": item.achievements,
//               "score": null,
//               "status": 1,
//               "stuId": 1,
//               "stuName": this.username,
//               "stuNum": this.num,
//               "time": item.time,
//               "title": item.name
//             })
//           }
//           console.log(data)
//           axios.post("http://localhost:18080/api/service/import", data, {
//                 headers: {
//                   'Content-Type': 'application/json;'
//                 }
//               }
//           )
//               .then(res => {
//                 console.log(res);
//                 if (res.data.code == 200) {
//                   this.$message.success("提交成功")
//                 }
//               });
//         } else {
//           // 表单校验不通过
//           this.$message.error('表单填写不完整或有误，请检查');
//           return false;
//         }
//       });
//     },
//
//     clearForm() {
//       this.$refs.form.resetFields();
//     },
//     addProject() {
//       this.form.research.push({
//         name: '',
//         manager: '',
//         organization: '',
//        // level: '',
//         content:'',
//         time: '',
//         achievements: '',
//         key: Date.now()
//       });
//       console.log(this.form);
//     },
//     removeProject(project) {
//       var index = this.form.research.indexOf(project)
//       if (index !== -1) {
//         this.form.research.splice(index, 1)
//       }
//       console.log(this.form);
//
//     }
//   },
// };
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
