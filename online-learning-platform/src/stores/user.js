import { defineStore } from 'pinia'
import { getUserInfoApi, loginApi, updateUserInfoApi } from '../api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),
  getters: {
    isLogin: (state) => Boolean(state.token),
    displayName: (state) => state.userInfo?.name || '未命名用户'
  },
  actions: {
    async login(form) {
      const data = await loginApi(form)
      this.token = data.token
      localStorage.setItem('token', data.token)
      return data
    },
    async fetchUserInfo() {
      const data = await getUserInfoApi()
      this.userInfo = data.user
      return data.user
    },
    async updateUserInfo(payload) {
      const data = await updateUserInfoApi(payload)
      this.userInfo = data.user
      return data.user
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
})
