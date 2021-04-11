import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './vuex/store.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.prototype.$message1000 = (message, type = 'success', duration = 1000) => { // 默认消息提示持续1S
  ElementUI.Message({
    message: message,
    type,
    duration
  })
}
import './permission'
const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
