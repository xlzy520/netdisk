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
    mode:"history",
    routes: [
        {
            path: "/user/login", component: login, meta: {
                title: "登录页面"
            }
        },
        {
            path: "/user/register", component: register, meta: {
                title: "注册页面"
            }
        },
        {
            path: "/netdisk/", component: header, meta: {
                title: "网盘"
            }, children: [
                {
                    path: 'folder_id/:folder_id',
                    component: content,
                    meta: { title: "MY网盘-全部文件" }
                },
                {
                    path: 'myshare',
                    component: myshare,
                    meta: { title: "MY网盘-我的分享" }
                }
            ]
        },
        {
            path: "/s/:shareUrl", component: shareview, meta: { title: "MY网盘-查看分享" }
        },
        {
            path: "*", component: notFound, meta: { title: "404 Not Found" }
        },
    ]
})
router.beforeEach((to, from, next) => {
    if (to.path.includes("netdisk/folder_id")) {
        if (to.params.folder_id == 0) {
            store.commit('changeFromFolderId', 0);
        } else {
            store.commit('changeFromFolderId', to.params['folder_id']);
        }
    } else {
        store.commit('changeFromFolderId', null);
    }
    if (to.meta.title) {
        document.title = to.meta.title;

    }
    let isLogin = localStorage.getItem('token');
    let path = to.path;
    if (path === '/user/login') {
        next();
        return;
    }
    if (isLogin) {
        if(path.includes('/s/')){
            next();
            return;
        }
        if(Object.keys(store.getters.getUserInfo).length==0){
            store.commit('addUserInfo', JSON.parse(isLogin));
        }
        if (path === '/') {
            next({
                path: '/netdisk/folder_id/0'
            });
        } else {
            next();
        }
    } else {
        if(path.includes('/s/')){
            next();
            return;
        }
        if (path === '/') {
            next({
                path: '/user/login'
            });
        } else {
            next();
        }        
    }

})
export default router;