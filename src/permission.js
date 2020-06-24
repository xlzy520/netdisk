import router from './router/router'
import store from './vuex/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const hasToken = store.getters.userInfo
  console.log(hasToken);
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (!hasToken) {
    if (!whiteList.includes(to.path)) {
      try {
        await store.dispatch('getInfo')
        next({ ...to, replace: true })
      } catch (error) {
        next(`/#/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
  next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
