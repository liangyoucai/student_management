// 通常会定义一些全局守卫，如路由守卫、请求拦截器等。这些守卫会在应用程序加载时被执行，
// 并且会对全局路由、请求等产生影响。由于这些守卫是全局的，
// 因此应该在主入口文件中引入，以确保它们在应用程序加载时就被执行。
import router from './router'
import { getAccessToken } from '@/utils/auth'

router.beforeEach((to, from, next) => {
  if (getAccessToken()) {
    if (to.path === '/beforelogin'|| to.path === '/signup' || to.path === '/login') {
      // console.log('1')
      next({ path: '/' })
    } 
    // console.log('2')
    next()
  } else {
    // 没有token
    if (to.path === '/login' || to.path === '/signup' || to.path === '/beforelogin') {
      // 直接进入
      // console.log('3'+to.path)
      next()
    } else {
      // console.log('4'+to.path)
      next('/beforelogin') // 否则全部重定向到登录页
    }
  }
})

router.afterEach(() => {
  
})