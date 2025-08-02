// frontend/src/utils/api.js
import axios from 'axios'
import { logout as logoutUser, refreshToken as refreshUserToken } from '@/hooks/useAuthHelper' // 後面提供說明

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 10000,
})

// 請求攔截器：自動帶 Authorization Header
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// 回應攔截器：遇 401 嘗試用 refresh token 更新 access token，更新成功後重試
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 將重試放入隊列
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refresh = localStorage.getItem('refreshToken')

      return new Promise(async (resolve, reject) => {
        try {
          const response = await api.post('/token/refresh', { refresh })
          const newAccessToken = response.data.access
          localStorage.setItem('accessToken', newAccessToken)
          api.defaults.headers.common.Authorization = 'Bearer ' + newAccessToken
          originalRequest.headers.Authorization = 'Bearer ' + newAccessToken
          processQueue(null, newAccessToken)
          resolve(api(originalRequest))
        } catch (err) {
          processQueue(err, null)
          logoutUser() // 登出邏輯需從 useAuthHelper import
          reject(err)
        } finally {
          isRefreshing = false
        }
      })
    }

    return Promise.reject(error)
  }
)

export default api
