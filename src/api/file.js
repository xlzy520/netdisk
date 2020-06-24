import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/file/' + url, ...arg)
export default {
  getFile(data) {
    return fetch('list', data)
  },
  createShare(data) {
    return fetch('createShare', data)
  },
  updateFile(data) {
    return fetch('update', data)
  },
  deleteFile(id) {
    return fetch('delete', id)
  },
  orderDetail(id) {
    return fetch('detail', id)
  },
  fahuo(id) {
    return fetch('setFaHuo', id)
  },
  orderClose(id) {
    return fetch('close', id)
  },
  orderConfirm(data){
    return fetch('confirm', data)
  },
}
