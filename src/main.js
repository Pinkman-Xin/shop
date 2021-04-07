import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router/index.js'
import './assets/css/global.css'
import './elementui/element.js'
import './assets/fonts/iconfont.css'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
