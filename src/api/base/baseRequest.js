import axios from 'axios'
import { Message } from 'element-ui'
import router from '../../router/router'

const baseRequest = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 20 * 1000
})
let expire = 0

// response interceptor
baseRequest.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.success && res.code !== 20000) {
      Message({
        message: res.msg || 'error',
        type: 'error',
        duration: 1.5 * 1000
      })
      // token已过期
      if (res.code === 401) {
        expire++
        if (expire < 2) {
          expire = true
          router.push('/login')
          expire = 0
        }
      }
      return Promise.reject(res)
    } else {
      return res.data
    }
  },
  error => {
    error.message = error.message === 'timeout of 10000ms exceeded' ? '连接服务器超时！' : error.message
    Message({
      message: error.message,
      type: 'error',
      duration: 1.5 * 1000
    })
    return Promise.reject(error)
  }
)

export default baseRequest
