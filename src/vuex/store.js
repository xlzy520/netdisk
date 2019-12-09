import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        userInfo: {},
        drawer: { open: false, direction: "ltr" },
        fromFolderId:null,
    },
    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },
        getDrawerInfo(state) {
            return state.drawer;
        },
        getFromFolderId(state){
            return state.fromFolderId;
        }
    },
    mutations: {
        addUserInfo(state, userInfo) {
            state.userInfo = userInfo;
            localStorage.setItem('token',JSON.stringify(userInfo)); 
        },
        quitUserInfo(state) {
            state.userInfo = {};
            localStorage.removeItem('token');
        },        
        changeDrawer(state, drawer = [false, "ltr"]) {
            let [open, direction='ltr'] = drawer;
            state.drawer = {
                open,
                direction
            };
        },
        changeFromFolderId(state,FromFolderId){
            state.fromFolderId=FromFolderId;
        }
    },
    actions: {
        awaitChangeAccountMoney(context, money) {
            setTimeout(() => {
                context.commit("changeAccountMoney", money)
            }, 10)
        }
    }
})
export default store;