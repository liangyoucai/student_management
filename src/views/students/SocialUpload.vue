<template>
  <div class="my-form">
    <h1 class="title">学生社会实践情况 - 在线填写</h1>
    <el-divider></el-divider>
    <el-form :model="form" label-width="120px" ref="form" :rules="rules">
      <div v-for="(project, index) in form.research" :key="project.key">
        <el-row type="flex">
          <el-col :span="22">
            <h4 style="float: left;">{{ '参与的社会实践项目' + (index + 1) }} </h4>
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
              <el-input placeholder="请输入社会实践名称" v-model="form.research[index].name" >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="负责人" :prop="'research.'+index+'.manager'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
              <el-input placeholder="请输入社会实践负责人" v-model="form.research[index].manager">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="负责单位" :prop="'research.'+index+'.organization'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
              <el-input placeholder="请输入社会实践负责单位" v-model="form.research[index].organization">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="内容" ::prop="'research.'+index+'.content'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
              <el-input placeholder="请输入社会实践内容" v-model="form.research[index].content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="成果" :prop="'research.'+index+'.achievements'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
              <el-input placeholder="请输入社会实践成果" v-model="form.research[index].achievements"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="时长" :prop="'research.'+index+'.time'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
              <el-input placeholder="请输入社会实践时长" v-model="form.research[index].time"></el-input>
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
import axios from "axios";
import user from "@/api/auth/user";

export default {
  name: 'PersonalSummaryForm',
  data() {
    return {
      form: {
        research: [
          {

            username: '',
            num: '',
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
  mounted() {
    //console.log("asdasdas")
    // 当页面被调用，立刻调用该方法，获得的username直接赋值给this对象
    user.getInfo(this.role).then((res) => {
      this.username = res.data.username;
      this.num = res.data.num
     // console.log(this.num)
    });
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let data = []
          for (let item of this.form.research) {
          //  let dateStringArray = []

           // console.log(this.num)
           // const start = dateStringArray[0];
          //  const end = dateStringArray[dateStringArray.length - 1];
          //  const dateRangeString = start + ' ~ ' + end;
            data.push({
              "constitution": item.organization,
              "director": item.manager,
             // "level": this.levels.indexOf(item.level),
              "content":item.content,
              "result": item.achievements,
              "score": 0,
              "status": 1,
              "stuId": 72,
              "stuName": this.username,
              "stuNum": this.num,
              "time": item.time,
              "title": item.name
            })
          }
          console.log(data)
          axios.post("http://localhost:28080/api/practice/import", data, {
                headers: {
                  'Content-Type': 'application/json;'
                }
              }
          )
              .then(res => {
                console.log(res);
                if (res.data.code == 200) {
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
  // methods: {
  //   submitForm() {
  //
  //     console.log(this.form.research)
  //
  //     this.$refs.form.validate((valid) => {
  //       if (valid) {
  //         let data = []
  //         // let data=[{
  //         //   "constitution": "北京大学",
  //         //   "content": "hahahhaah",
  //         //   "director": "李四",
  //         //   "result": 100,
  //         //   "score": 8,
  //         //   "status": 1,
  //         //   "stu_id": 1,
  //         //   "stu_name": "张三",
  //         //   "stu_num": 2200022123,
  //         //   "time": 10,
  //         //   "title": "智能餐厅管理系统"
  //         // }]
  //         for (let item of this.form.research) {
  //           data.push({
  //             "constitution": item.organization,
  //             "director": item.manager,
  //             "content": item.content,
  //            // "level": this.levels.indexOf(item.level),
  //             "result": parseInt(item.achievements),
  //             "score": 8 ,
  //             "status": 1,
  //             "stu_id": 328,
  //             "stu_name": "李十",
  //             "stu_num": 1111110,
  //             "time": item.time,
  //             "title": item.name
  //           })
  //
  //          }
  //         console.log(data)
  //
  //         axios.post("http://localhost:28080/api/practice/import", data, {
  //               headers: {
  //                 'Content-Type': 'application/json;'
  //               }
  //             }
  //         )
  //             .then(res => {
  //               console.log(res);
  //               if (res.data.code == 200) {
  //                 this.$message.success("提交成功")
  //               }
  //             });
  //       } else {
  //         // 表单校验不通过
  //         this.$message.error('表单填写不完整或有误，请检查');
  //         return false;
  //       }
  //     });
  //   },
  //   clearForm() {
  //     this.$refs.form.resetFields();
  //   },
  //   addProject() {
  //     this.form.research.push({
  //       name: '',
  //       manager:'',
  //       organization: '',
  //       content: '',
  //       achievements: '',
  //       time: '',
  //       key: Date.now()
  //     });
  //     console.log(this.form);
  //   },
  //   removeProject(project) {
  //     var index = this.form.research.indexOf(project)
  //     if (index !== -1) {
  //       this.form.research.splice(index, 1)
  //     }
  //     console.log(this.form);
  //
  //   }
  // },
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
