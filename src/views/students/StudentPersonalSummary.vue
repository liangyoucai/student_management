<template>
    <div class="my-form">
        <h1 class="title">学生个人学年总结 - 在线填写</h1>
        <el-divider style="margin-bottom: 0;"></el-divider>
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

            <el-table-column label="学习情况总结" prop="school"></el-table-column>
            <el-table-column label="社会实践总结" prop="society"></el-table-column>
            <el-table-column label="自我评价" prop="self"></el-table-column>

        </submitted-data-table>
        <el-divider style="margin-bottom: 10px;"></el-divider>
        <el-form :model="form" label-width="120px" ref="form" :rules="rules">
            <el-form-item label="学习情况总结" prop="studySummary">
                <el-input type="textarea" :rows="4" placeholder="请输入学习情况总结" v-model="form.studySummary"></el-input>
            </el-form-item>
            <el-form-item label="社会实践总结" prop="practiceSummary">
                <el-input type="textarea" :rows="4" placeholder="请输入社会实践总结" v-model="form.practiceSummary"></el-input>
            </el-form-item>
            <el-form-item label="自我评价" prop="selfEvaluation">
                <el-input type="textarea" :rows="4" placeholder="请输入自我评价" v-model="form.selfEvaluation"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="clearForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
import student from '@/api/student/student'
import user from '@/api/auth/user';
import SubmittedDataTable from '@/components/SubmittedDataTable.vue';
export default {
    components: {
        SubmittedDataTable
    },
    name: 'PersonalSummaryForm',
    data() {
        return {
            showSubmittedData: false,
            form: {
                studySummary: '',
                practiceSummary: '',
                selfEvaluation: '',
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
            },
            username: '',
            num: '',
            submittedData: []
        };
    },
    mounted() {
        // 当页面被调用，立刻调用该方法，获得的username直接赋值给this对象
        user.getInfo(this.role).then((res) => {
            this.username = res.data.username;
            this.num = res.data.num
            student.reviewMyList('personal', this.num).then(res => {
                this.submittedData = res.data;
            })
        });
    },
    methods: {
        toggleSubmittedData() {
            this.showSubmittedData = !this.showSubmittedData;
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let data = [{
                        "school": this.form.studySummary,
                        "score": null,
                        "self": this.form.selfEvaluation,
                        "society": this.form.practiceSummary,
                        // "stuId": 1,
                        // "stuName": this.username,
                        // "stuNum": this.num
                    }]

                    console.log(data)
                    student.import('personal', data)
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
</style>