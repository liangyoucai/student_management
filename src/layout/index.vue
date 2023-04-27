<template>
    <div>
        <div class="side-bar">
            <el-menu class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                <el-menu-item index="/" @click="$router.push('/')">
                    <i class="el-icon-house"></i>
                    <span slot="title">首页</span>
                </el-menu-item>
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>学生入口</span>
                    </template>

                    <el-menu-item index="1-1"><i class="el-icon-edit-outline"></i>个人成绩</el-menu-item>
                    <el-menu-item index="1-2"><i class="el-icon-edit-outline"></i>志愿服务</el-menu-item>
                    <el-menu-item index="1-3"><i class="el-icon-edit-outline"></i>科研情况</el-menu-item>
                    <el-menu-item index="1-4"><i class="el-icon-edit-outline"></i>社会实践</el-menu-item>
                    <el-menu-item index="1-5"><i class="el-icon-edit-outline"></i>学生骨干服务岗位</el-menu-item>
                    <el-menu-item index="1-6"><i class="el-icon-edit-outline"></i>个人学年总结</el-menu-item>

                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>评委入口</span>
                    </template>

                    <el-submenu index="2-1">
                        <template slot="title"><i class="el-icon-edit-outline"></i>个人成绩</template>
                        <el-menu-item index="2-1-1">个人成绩审核</el-menu-item>
                        <el-menu-item index="2-1-2">个人成绩审核情况</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2-2">
                        <template slot="title"><i class="el-icon-edit-outline"></i>志愿服务</template>
                        <el-menu-item index="2-2-1">志愿服务导入</el-menu-item>
                    </el-submenu>

                    <el-submenu index="2-3">
                        <template slot="title"><i class="el-icon-edit-outline"></i>科研情况</template>
                        <el-menu-item index="2-3-1">科研情况打分</el-menu-item>
                        <el-menu-item index="2-3-2">科研情况打分情况</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2-4">
                        <template slot="title"><i class="el-icon-edit-outline"></i>社会实践</template>
                        <el-menu-item index="2-4-1">社会实践打分</el-menu-item>
                        <el-menu-item index="2-4-2">社会实践打分情况</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2-5">
                        <template slot="title"><i class="el-icon-edit-outline"></i>学生骨干服务岗位</template>
                        <el-menu-item index="2-5-1">学生骨干服务岗位打分</el-menu-item>
                        <el-menu-item index="2-5-2">学生骨干服务岗位打分情况</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2-6">
                        <template slot="title"><i class="el-icon-edit-outline"></i>个人学年总结</template>
                        <el-menu-item index="2-6-1">个人学年总结打分</el-menu-item>
                        <el-menu-item index="2-6-2">个人学年总结打分情况</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>学工管理员入口</span>
                    </template>

                    <el-menu-item index="3-1"><i class="el-icon-edit-outline"></i>学工管理员页面</el-menu-item>

                </el-submenu>

                <el-menu-item index="/logout" @click="">
                    <i class="el-icon-setting"></i>
                    <span slot="title">退出</span>
                </el-menu-item>
            </el-menu>

            <div class="main-content">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.side-bar {
    display: flex;
    height: 100%;
}

.el-menu-vertical-demo {
    min-width: 14%;
}

.main-content {
    flex: 1;
    padding: 20px;
}
</style>

<script>
export default {
    name: "MyComponent",
    methods: {

    },
};
</script>