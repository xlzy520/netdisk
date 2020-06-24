import Vue from "vue";
import VueRouter from "vue-router";
import store from "../vuex/store";

const login = () => import('../pages/Login.vue');
const register = () => import('../pages/Register.vue');
const header = () => import('../pages/Header.vue');
const content = () => import('../pages/Content.vue');
const myshare = () => import('../pages/Myshare.vue');
const shareview = () => import('../pages/Shareview.vue');
const notFound = () => import('../pages/404.vue');
Vue.use(VueRouter);
const router = new VueRouter({
  mode: "hash",
  routes: [
    
    {
      path: "/login", component: login, meta: {title: "登录页面"}
    },
    {
      path: "/register", component: register, meta: {title: "注册页面"}
    },
    {
      path: "/netdisk/",
      component: header,
      redirect: '/netdisk/index',
      meta: {title: "网盘"},
      children: [
        {
          path: 'index',
          component: content,
          meta: {title: "MY网盘-全部文件"}
        },
        {
          path: 'myshare',
          component: myshare,
          meta: {title: "MY网盘-我的分享"}
        }
      ]
    },
    {
      path: "/s/:shareUrl", component: shareview, meta: {title: "MY网盘-查看分享"}
    },
    {
      path: "*", component: notFound, meta: {title: "404 Not Found"}
    },
  ]
})
export default router;
