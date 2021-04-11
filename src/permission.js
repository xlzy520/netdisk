import router from './router/router'
import store from './vuex/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist
const shareFileRoute = '/s/'

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // const hasToken = store.getters.userInfo.token
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (!whiteList.includes(to.path) && !to.path.includes(shareFileRoute)) {
    next(`/#/login?redirect=${to.path}`)
    NProgress.done()
  } else {
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
