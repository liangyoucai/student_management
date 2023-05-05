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
        path: '',
        component: () => import( '../views/Home.vue'),
        name: 'home'
      },
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
        path: "judge/social",
        name: "StudentSocialExperience",
        component: () => import("../views/judges/SocialExperience.vue"),
      },
      {
        path: "student/social",
        name: "UploadSocialExperience",
        component: () => import("../views/students/SocialUpload.vue"),
      },
      {
        path: "judge/service",
        name: "StudentServiceWorks",
        component: () => import("../views/judges/ServiceWorks.vue"),
      },
      {
        path: "student/service",
        name: "UploadServiceWork",
        component: () => import("../views/students/ServiceUpload.vue"),
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
      {
        path: "judge/volunteer-service",
        name: "JudgeVolunteerService",
        component: () => import("../views/judges/JudgeVolunteerService.vue"),
      },
      {
        path: "judge/GPA",
        name: "JudgeGPA",
        component: () => import("../views/judges/JudgeGPA.vue"),
      },
      {
        path: "student/volunteer-service",
        name: "StudentVolunteerService",
        component: () => import("../views/students/StudentVolunteerService.vue"),
      },
      {
        path: "student/GPA",
        name: "StudentGPA",
        component: () => import("../views/students/StudentGPA.vue"),
      }
    ],
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
