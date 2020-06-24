import Vue from "vue";
import Vuex from "vuex";
import userApi from "../api/user";

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    userInfo: {},
    drawer: {open: false, direction: "ltr"},
    fromFolderId: null,
  },
  getters: {
    userInfo(state) {
      return state.userInfo;
    },
    getDrawerInfo(state) {
      return state.drawer;
    },
    getFromFolderId(state) {
      return state.fromFolderId;
    }
  },
  mutations: {
    addUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    quitUserInfo(state) {
      state.userInfo = {};
    },
    changeDrawer(state, drawer = [false, "ltr"]) {
      let [open, direction = 'ltr'] = drawer;
      state.drawer = {
        open,
        direction
      };
    },
    changeFromFolderId(state, FromFolderId) {
      state.fromFolderId = FromFolderId;
    }
  },
  actions: {
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        userApi.login(userInfo).then(response => {
          commit('addUserInfo', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        userApi.getInfo().then(response => {
          commit('addUserInfo', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
  
  
    awaitChangeAccountMoney(context, money) {
      setTimeout(() => {
        context.commit("changeAccountMoney", money)
      }, 10)
    }
  }
})
export default store;
