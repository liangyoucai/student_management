<template>
    <div class="my-form">
        <h1 class="title">学生科研情况 - 在线填写</h1>
        <el-divider></el-divider>

        <el-row type="flex">
            <el-row>
                <el-col :span="24">
                    <h4 style="float: left;">已提交内容</h4>
                </el-col>
            </el-row>
        </el-row>
        <el-row>
            <el-col>
                <el-button style="float: left;" @click="toggleSubmittedData" type="text">{{ showSubmittedData ? "收起" : "展开" }}</el-button>
            </el-col>
        </el-row>
        <!-- 已提交内容总览表 -->
        <submitted-data-table v-if="showSubmittedData" :submittedData="submittedData.slice().sort((a, b) => a.id - b.id)">

            <el-table-column label="项目名称" prop="title"></el-table-column>
            <el-table-column label="负责人" prop="director"></el-table-column>
            <el-table-column label="组织机构" prop="constitution"></el-table-column>
            <el-table-column label="项目级别" prop="level"></el-table-column>
            <el-table-column label="参与时间" prop="time"></el-table-column>
            <el-table-column label="项目成果" prop="result"></el-table-column>

        </submitted-data-table>
        <!-- 证明材料上传 -->
        <el-row type="flex">
            <el-row>
                <el-col :span="24">
                    <h4 style="float: left;">证明材料（请将所有证明材料放在一个pdf文件上传）</h4>
                </el-col>
            </el-row>
        </el-row>
        <el-row>
            <el-row>
                <el-col :span="24">
                    <stuImportPdfButton @click="openImportDialog" subject="science"></stuImportPdfButton>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <preview subject="science"></preview>
                </el-col>
            </el-row>
        </el-row>


        <el-form :model="form" label-width="120px" ref="form">
            <div v-for="(project, index) in form.research" :key="project.key">
                <el-row type="flex">
                    <el-col :span="22">
                        <h4 style="float: left;">{{ '参与的科研项目' + (index + 1) }} </h4>
                    </el-col>
                    <!-- 删除按钮 -->
                    <el-col :span="2" style="display:flex;justify-content:flex-end;align-items:center;">
                        <el-button size='mini' type="danger" icon="el-icon-delete" circle @click.prevent="removeProject(project)"></el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="名称" :prop="'research.' + index + '.name'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
                            <el-input placeholder="请输入项目名称" v-model="form.research[index].name">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="负责人" :prop="'research.' + index + '.manager'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
                            <el-input placeholder="请输入项目负责人" v-model="form.research[index].manager"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="组织机构" :prop="'research.' + index + '.organization'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'blur'
                        }">
                            <el-input placeholder="请输入项目组织机构" v-model="form.research[index].organization"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="项目级别" :prop="'research.' + index + '.level'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'change'
                        }">
                            <el-select v-model="form.research[index].level" placeholder="请选择项目级别" style="width: 100%;">
                                <el-option label="国家级" value="国家级"></el-option>
                                <el-option label="省级" value="省级"></el-option>
                                <el-option label="市级" value="市级"></el-option>
                                <el-option label="校级" value="校级"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="参与时间" :prop="'research.' + index + '.time'" :rules="{
                            required: true, message: '该项不能为空', trigger: 'change'
                        }" style="float: left">
                            <el-date-picker v-model="form.research[index].time" type="monthrange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>


                </el-row>
                <el-form-item label="项目成果" :prop="'research.' + index + '.achievements'" :rules="{
                    required: true, message: '该项不能为空', trigger: 'blur'
                }">
                    <el-input type="textarea" :rows="4" placeholder="请输入项目成果" v-model="form.research[index].achievements"></el-input>
                </el-form-item>

            </div>
            <el-form-item style="margin-top: 20px">
                <el-button type="warning" @click="addProject">增加项目</el-button>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="clearForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import user from '@/api/auth/user';
import student from '@/api/student/student';
import preview from '@/components/preview.vue'
import stuImportPdfButton from '@/components/stuImportPdfButton.vue';
import submittedDataTable from '@/components/SubmittedDataTable.vue'
export default {
    components: {
        stuImportPdfButton,
        preview,
        submittedDataTable
    },
    data() {
        return {
            showSubmittedData: false,
            form: {
                research: [
                    {
                        name: '',
                        manager: '',
                        organization: '',
                        level: '',
                        time: '',
                        achievements: ''
                    }
                ]
            },
            levels: ['校级', '市级', '省级', '国家级'],
            username: '',
            num: '',
            submittedData: []
        };
    },

    mounted() {
        user.getInfo(this.role).then((res) => {
            this.username = res.data.username;
            this.num = res.data.num
            console.log(res.data)
            student.reviewMyList('science', this.num).then(res => {
                this.submittedData = res.data;
            })
        });

    },

    methods: {
        toggleSubmittedData() {
            this.showSubmittedData = !this.showSubmittedData;
        },
        openImportDialog() {
            this.$refs.ChildButton.openImportDialog();
        },
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
                            "level": this.levels.indexOf(item.level),
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
                    student.import('science', data)
                        .then(res => {
                            console.log(res);
                            if (res.code == 200) {
                                this.$message.success("提交成功")
                                //自动刷新页面
                                window.location.reload();
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
                level: '',
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
