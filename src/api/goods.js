import baseFetch from './base/fetch'
const fetch = (url, ...arg) => baseFetch('/goods/' + url, ...arg)
export default {
  getGoods(data) {
    return fetch('list', data)
  },
  addGoods(data) {
    return fetch('add', data)
  },
  updateGoods(data) {
    return fetch('update', data)
  },
  deleteGoods(id) {
    return fetch('delete', id)
  },
}
