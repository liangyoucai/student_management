<template>
    <div>
        <div class="side-bar">
            <el-menu class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                <!-- 循环遍历菜单项-->
                <template v-for="(menu, index) in menuItems">
                    <!-- 设置每一个菜单项的 key 属性和 index 属性，以及点击菜单项时跳转的路由 -->
                    <el-menu-item :key="menu.name" :index="menu.path" @click="$router.push(menu.path)">
                        <i class="el-icon-location"></i>
                        <span slot="title">{{ nameMap[menu.name] }}</span>
                    </el-menu-item>
                </template>


                <!-- <el-menu-item index="/" @click="$router.push('/home')">
                    <i class="el-icon-house"></i>
                    <span slot="title">首页</span>
                </el-menu-item> -->

                <!-- <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>学生入口</span>
                    </template>

                    <el-menu-item index="1-1" @click="$router.push('/student/GPA')"><i class="el-icon-edit-outline"></i>个人成绩</el-menu-item>
                    <el-menu-item index="1-2" @click="$router.push('/student/volunteer-service')"><i class="el-icon-edit-outline"></i>志愿服务</el-menu-item>
                    <el-menu-item index="1-3" @click="$router.push('/student/research')"><i class="el-icon-edit-outline"></i>科研情况</el-menu-item>
                    <el-menu-item index="1-4" @click="$router.push('/student/social')"><i class="el-icon-edit-outline"></i>社会实践</el-menu-item>
                    <el-menu-item index="1-5" @click="$router.push('/student/service')"><i class="el-icon-edit-outline"></i>学生骨干服务岗位</el-menu-item>
                    <el-menu-item index="1-6" @click="$router.push('/student/personal-summary')"><i class="el-icon-edit-outline"></i>个人学年总结</el-menu-item>

                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>评委入口</span>
                    </template> -->

                <!-- <el-submenu index="2-1"> -->
                <!-- <template slot="title"><i class="el-icon-edit-outline"></i>个人成绩</template> -->
                <!-- <el-menu-item index="2-1-1" @click="$router.push('/judge/GPA')"><i class="el-icon-edit-outline"></i>学生成绩导入</el-menu-item> -->
                <!-- </el-submenu>
                    <el-submenu index="2-2"> -->
                <!-- <template slot="title"><i class="el-icon-edit-outline"></i>志愿服务</template> -->
                <!-- <el-menu-item index="2-2-1" @click="$router.push('/judge/volunteer-service')"><i class="el-icon-edit-outline"></i>志愿服务时长导入</el-menu-item> -->
                <!-- </el-submenu>

                    <el-submenu index="2-3"> -->
                <!-- <template slot="title"><i class="el-icon-edit-outline"></i>科研情况</template> -->
                <!-- <el-menu-item index="2-3-1" @click="$router.push('/judge/research')"><i class="el-icon-edit-outline"></i>科研情况打分</el-menu-item> -->
                <!-- </el-submenu>
                    <el-submenu index="2-4"> -->
                <!-- <template slot="title"><i class="el-icon-edit-outline"></i>社会实践</template> -->
                <!-- <el-menu-item index="2-4-1" @click="$router.push('/judge/social')"><i class="el-icon-edit-outline"></i>社会实践打分</el-menu-item> -->
                <!-- </el-submenu>
                    <el-submenu index="2-5"> -->
                <!-- <template slot="title"><i class="el-icon-edit-outline"></i>学生骨干服务岗位</template> -->
                <!-- <el-menu-item index="2-5-1" @click="$router.push('/judge/service')"><i class="el-icon-edit-outline"></i>学生骨干服务岗位打分</el-menu-item> -->
                <!-- </el-submenu>
                    <el-submenu index="2-6"> -->
                <!-- <template slot="title"><i class="el-icon-edit-outline"></i>个人学年总结</template> -->
                <!-- <el-menu-item index="2-6-1" @click="$router.push('/judge/personal-summary')"><i class="el-icon-edit-outline"></i>个人学年总结打分</el-menu-item> -->
                <!-- </el-submenu> -->
                <!-- </el-submenu> -->
                <!-- <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>学工管理员入口</span>
                    </template>

                    <el-menu-item index="3-1" @click="$router.push('/stumanager/eximport')"><i class="el-icon-edit-outline"></i>学生信息管理</el-menu-item>

                    <el-submenu index="3-2">
                      <template slot="title"><i class="el-icon-location"></i>学生评分汇总</template>
                      <el-menu-item index="3-2-1" @click="$router.push('/stumanager/gradenonsum')"><i class="el-icon-edit-outline"></i>未测评学生</el-menu-item>
                      <el-menu-item index="3-2-2" @click="$router.push('/stumanager/gradesum')"><i class="el-icon-edit-outline"></i>已测评学生</el-menu-item>
                    </el-submenu>
                    
                </el-submenu> -->

                <el-menu-item index="/logout" @click="logout">
                    <!-- 返回到登录页面 -->
                    <i class="el-icon-setting"></i>
                    <span slot="title">退出</span>
                </el-menu-item>
            </el-menu>

            <div class="main-content">
                <div class="logo">
                    <img src="./img/logo01.png" alt="logo" height="80px">
                    <img src="./img/name.png" alt="caption" height="80px">
                    <!-- <div class="time">{{ nowTime }}</div> -->
                    <el-button style="float: right;margin-right: 0px;" icon="el-icon-s-tools" circle @click="openChangePasswdDialog" :disabled="isDisabled"></el-button>
                    <el-button v-show="isResetButtonShow" style="float: right; margin-right: 30px;" size="medium" round @click="openResetPasswdDialog"> 重置密码 </el-button>
                    <!-- <el-button  type="primary" icon="el-icon-setting" >修改密码</el-button> -->
                    <!-- 上传对话框 -->
                    <div v-if="isChangePasswdDialogVisible">
                        <ChangePasswdDialog @close-dialog="closeChangePasswdDialog">
                        </ChangePasswdDialog>
                    </div>
                    <div v-if="isResetPasswdDialogVisible">
                        <ResetPasswdDialog @close-dialog="closeResetPasswdDialog">
                        </ResetPasswdDialog>
                    </div>
                    <h1>学生综合测评系统</h1>

                </div>
                <el-divider borderWidth="2px"></el-divider>
                <router-view />
            </div>
        </div>
    </div>
</template>


<script>
import { removeToken } from '@/utils/token'
import menu from '@/api/menu'
import ChangePasswdDialog from "@/components/ChangePasswdDialog.vue";
import ResetPasswdDialog from '@/components/ResetPasswdDialog.vue';
export default {
    name: "SuccessPage",
    components: {
        ChangePasswdDialog,
        ResetPasswdDialog
    },
    data() {
        return {
            nowTime: '',
            isChangePasswdDialogVisible: false,
            isResetPasswdDialogVisible: false,
            isResetButtonShow: false,
            nameMap: {
                "StudentPersonalSummary": "个人学年总结",
                "StudentResearch": "科研情况",
                "home": "首页",
                "StudentVolunteerService": "志愿服务",
                "StudentGPA": "个人成绩",
                "ServiceUpload": "骨干服务岗位",
                "SocialUpload": "社会实践",
                "JudgeGPA": "学生成绩评审",
                "JudgeVolunteerService": "志愿服务评审",
                "JudgeResearch": "科研情况评审",
                "SocialExperence": "社会实践评审",
                "ServiceWorks": "骨干服务岗位评审",
                "JudgePersonalSummary": "个人学年总结评审",
                "StuManagerExImport": "学生信息管理",
                "StuManagerGradeSum": "已测评学生",
                "StuManagerGradeNonSum": "未测评学生",
            },
            isDisabled: false,
            menuItems: [],
            // : [
            //     {
            //         "name": "home",
            //         "path": "/home",
            //         "component": "Home"
            //     },
            //     {
            //         "name": "ServiceUpload",
            //         "path": "/student/service",
            //         "component": "students/ServiceUpload"
            //     },
            //     {
            //         "name": "StudentPersonalSummary",
            //         "path": "/student/personal-summary",
            //         "component": "students/StudentPersonalSummary"
            //     },
            //     {
            //         "name": "SocialUpload",
            //         "path": "/student/practice",
            //         "component": "students/SocialUpload"
            //     },
            //     {
            //         "name": "StudentResearch",
            //         "path": "/student/research",
            //         "component": "students/StudentResearch"
            //     },

            //     {
            //         "name": "StudentVolunteerService",
            //         "path": "/student/volunteer-service",
            //         "component": "students/StudentVolunteerService"
            //     },
            //     {
            //         "name": "StudentGPA",
            //         "path": "/student/GPA",
            //         "component": "students/StudentGPA"
            //     }
            // ]
        };
    },
    mounted() {
        this.getNowTime();
        this.getMenu();
        this.disableButton();
        this.showResetButton();
        // 首次登录强制修改密码
        if (localStorage.getItem("initial") == "true") {
            this.openChangePasswdDialog();
        }

    },
    methods: {
        //如果localstorage中initial为false，则el-button禁用
        disableButton() {
            if (localStorage.getItem("initial") == "false") {
                this.isDisabled = true;
            }
        },
        showResetButton() {
            if (localStorage.getItem("manager") == "true") {
                this.isResetButtonShow = true;
            }
        },

        openChangePasswdDialog() {
            this.isChangePasswdDialogVisible = true;
            console.log(this.isChangePasswdDialogVisible)
        },
        closeChangePasswdDialog() {
            this.isChangePasswdDialogVisible = false;
            console.log(this.isChangePasswdDialogVisible)
        },
        openResetPasswdDialog() {
            this.isResetPasswdDialogVisible = true;
            console.log(this.isResetPasswdDialogVisible)
        },
        closeResetPasswdDialog() {
            this.isResetPasswdDialogVisible = false;
            console.log(this.isResetPasswdDialogVisible)
        },
        getMenu() {
            menu.getMenuList().then((res) => {
                this.menuItems = res;
                // 找到 name 为 "home" 的项的下标
                const index = this.menuItems.findIndex(item => item.name === "home");
                // 如果找到了，将该项从原位置删除并插入数组的第一个位置
                if (index !== -1) {
                    const item = this.menuItems.splice(index, 1)[0];
                    this.menuItems.splice(0, 0, item);
                }
            })
        },
        logout() {
            this.$confirm('确定注销并退出系统吗？', '提示').then(() => {
                removeToken()
                //删除浏览器缓存
                localStorage.removeItem("initial");
                localStorage.removeItem("manager");
                this.$router.push({ path: '/login' })
            }).catch(() => { });
        },
        getNowTime() {
            let speed = 1000
            let that = this
            let theNowTime = function () {
                that.nowTime = that.timeNumber()
            }
            setInterval(theNowTime, speed)
        },
        timeNumber() {
            let today = new Date()
            let time = this.twoDigits(today.getHours()) + ':' + this.twoDigits(today.getMinutes()) + ':' + this.twoDigits(today.getSeconds())
            return time
        },
        twoDigits(val) {
            if (val < 10) return '0' + val
            return val
        },
    },
};
</script>


<style lang="scss" scoped>
.time {
    float: right;
    padding-top: 10px;
}

.logo h1 {

    margin: auto;
}

.logo img {
    float: left;
    margin-top: -15px;
}

.side-bar {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: auto;
}



.main-content {
    flex: 1;
    padding: 20px;
    min-height: 100vh;
}
</style>