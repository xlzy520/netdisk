import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/order/' + url, ...arg)
export default {
  getOrder(data) {
    return fetch('list', data)
  },
  updateOrder(data) {
    return fetch('update', data)
  },
  deleteOrder(id) {
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
