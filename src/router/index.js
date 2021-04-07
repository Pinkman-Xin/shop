import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(Router)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new Router({
  routes
})
router.beforeEach((to,from,next)=>{
  //to 将要访问路径
  //from代表从哪个路径跳转进来
  //next是一个函数表示放行

  if(to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr)return next('/login')
  next()
})
export default router
