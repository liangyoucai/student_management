import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from "@/layout";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    component: Layout, // 修改为 Layout 组件
    children: [
      {
        path: "judge/personal-summary",
        name: "JudgePersonalSummary",
        component: () => import("../views/judges/JudgePersonalSummary.vue"),
      },
      {
        path: "judge/research",
        name: "JudgeResearch",
        component: () => import("../views/judges/JudgeResearch.vue"),
      },
      {
        path: "student/personal-summary",
        name: "StudentPersonalSummary",
        component: () => import("../views/students/StudentPersonalSummary.vue"),
      },
      {
        path: "student/research",
        name: "StudentResearch",
        component: () => import("../views/students/StudentResearch.vue"),
      },
      {
        path: "student/social",
        name: "StudentSocialExperience",
        component: () => import("../views/students/SocialExperience.vue"),
      },
      {
        path: "student/works",
        name: "StudentServiceWorkExperience",
        component: () => import("../views/students/ServiceWorks.vue"),
      },
      {
        path: "stumanager/gradesum",
        name: "StuManagergradesum",
        component: () => import("../views/stumanager/stumanagergrade/StuManagerGradeSum.vue"),
      },
      {
        path: "stumanager/gradenonsum",
        name: "StuManagergradenonsum",
        component: () => import("../views/stumanager/stumanagergrade/StuManagerGradeNonSum.vue"),
      },
      {
        path: "stumanager/eximport",
        name: "StuManagerExImport",
        component: () => import("../views/stumanager/StuManagerExImport.vue"),
      },
    ],
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
