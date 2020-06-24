import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/user/' + url, ...arg)
export default {
  login(data) {
    return fetch('login', data)
  },
  register(data) {
    return fetch('register', data)
  },
  getInfo(data) {
    return fetch('info', '', 'get')
  },
  logout(data) {
    return fetch('logout', data)
  },
  getStaff(data) {
    return fetch('list', data)
  },
  updateStaff(data) {
    return fetch('update', data)
  },
  deleteStaff(id) {
    return fetch('delete', id)
  },
  changePassword(data){
    return fetch('resetPassword', data)
  }
  
}
