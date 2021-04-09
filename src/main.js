import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router/index.js'
import './assets/css/global.css'
import './elementui/element.js'
import './assets/fonts/iconfont.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
