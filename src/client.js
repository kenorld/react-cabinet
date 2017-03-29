import authStore from './stores/auth'

function toQueryString(obj) {
    var parts = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i) && obj[i] !== "" && obj[i] != null) {
          const value = obj[i]
          if (typeof value === 'object'){
            parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(JSON.stringify(value)));
          }else{
            parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(value));
          }
        }
    }
    return parts.join("&");
}
const clientFetch = (url, method, data) => {
  if (url.indexOf('http://') != 0 && url.indexOf('https://') != 0) {
    url = getUrl(url)
  }
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  if (method === 'POST' || method === 'PUT' || method === 'PATCH'){
    headers.append('Content-Type', 'application/json')
  }
  const token = authStore.token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  //Authorization Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJlbnQiOiI1OGFiZTA4ZGJkZGE5OWY4ZDA0YTc5M2YiLCJyb2xlIjoicGFyZW50IiwidXNlciI6IjU4YWJlMDhkNTcwYTk2YzA2Y2Q5OWJmMiJ9.LdrIfkJOeA7JCAlutgX3qlaEwl2VfmI14OGEt2wQ8BQ
  let options = { method, headers };
  if (data) {
    if (method === 'HEAD' || method === "GET"){
      const last = url[url.length - 1], params = toQueryString(data)
      if (url.indexOf('?') < 0){
        url += '?' + params
      }else{
        url += last === '&' ? params : '&' + params
      }
    }else{
      options.body = JSON.stringify(data)
    }
  }
  console.log(url, method, data)
  return fetch(url, options).then((response) => {
    if (response.status === 401){
      routerStore.reset([{ key: 'login', index: 0, }], 'global')
    }
    if (response.status === 401 || response.status === 403) {
      console.log("==================AUath error")
      return undefined
    }
    return response.json()
  }).catch((e) => {
    console.log("=====================ERROR FETCH", url, e)
  })
}
const clientPost = (url, data) => {
  return clientFetch(url, 'POST', data)
}
const clientGet = (url, data) => {
  return clientFetch(url, 'GET', data)
}
const clientPatch = (url, data) => {
  return clientFetch(url, 'PATCH', data)
}
const clientDelete = (url, data) => {
  return clientFetch(url, 'DELETE', data)
}
export default {
  post: clientPost,
  get: clientGet,
  fetch: clientFetch,
  patch: clientPatch,
  delete: clientDelete
}