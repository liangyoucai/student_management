<template>
    <div class="my-form">
        <h1 class="title">学生个人学年总结 - 在线填写</h1>
        <el-divider style="margin-bottom: 0;"></el-divider>
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
export default {
    name: 'PersonalSummaryForm',
    data() {
        return {
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
            }
        };
    },
    methods: {

        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let data = [{
                        "school": this.form.studySummary,
                        "score": null,
                        "self": this.form.selfEvaluation,
                        "society": this.form.practiceSummary,
                        "status": 1,
                        "stuId": 23,
                        "stu_name": "张三",
                        "stu_num": 22200044123
                    }]

                    console.log(data)
                    axios.post("http://localhost:28080/api/personal/import", data, {
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