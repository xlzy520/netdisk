import Vue from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import store from "./vuex/store.js";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
const vm = new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
})