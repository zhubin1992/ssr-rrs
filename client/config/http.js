/*
 * @Author: zb
 * @Date: 2019-03-25 18:01:15
 * @Last Modified by: zb
 * @Last Modified time: 2019-03-26 10:41:06
 */
import axios from 'axios'

const baseUrl = 'https://cnodejs.org/api/v1' || ''
const parseUrl = (url, params) => {
  params = params || {}
  const str = Object.keys(params).reduce((result, key) => {
    const x = `${result}${key}=${params[key]}&`
    return x
  }, '')
  return `${baseUrl}${url}?${str.substr(0, str.length - 1)}`
}

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.get(parseUrl(url, params))
      .then((resp) => {
        const { data } = resp
        if (data && data.success === true) {
          resolve(data)
        } else {
          reject()
        }
      })
      .catch(reject)
  })
}

export const post = (url, params) => {
  return new Promise((resolve, reject) => {
    axios.post(parseUrl(url), params)
      .then((resp) => {
        const { data } = resp
        if (data && data.success === true) {
          resolve(data)
        } else {
          reject(data)
        }
      })
      .catch((resp) => {
        reject(resp)
      })
  })
}
