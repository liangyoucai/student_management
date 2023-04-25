import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/Judge/PersonalSummary",
    name: "JudgePersonalSummary",
    component: () => import("../views/judges/JudgePersonalSummary.vue"),
  },
  {
    path: "/Judge/PersonalSummary/Situation",
    name: "JudgePersonalSummarySituaion",
    component: () =>
      import("../views/judges/JudgePersonalSummarySituation.vue"),
  },
  {
    path: "/Student/PersonalSummary",
    name: "StudentPersonalSummary",
    component: () =>
      import("../views/students/StudentPersonalSummary.vue"),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
