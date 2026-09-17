import { defineStore } from 'pinia'
import { drawApi } from '../api'

export const useLotteryStore = defineStore('lottery', {
  state: () => ({
    prizes: [
      { id: 1, name: '谢谢参与', weight: 40 },
      { id: 2, name: '5元优惠券', weight: 30 },
      { id: 3, name: '10元优惠券', weight: 18 },
      { id: 4, name: '20元优惠券', weight: 8 },
      { id: 5, name: '精美礼品', weight: 3 },
      { id: 6, name: '免单大奖', weight: 1 }
    ],
    drawing: false,
    lastResult: null,
    history: []
  }),
  actions: {
    async draw() {
      this.drawing = true
      try {
        const data = await drawApi()
        this.lastResult = data.prize
        this.history.unshift({
          orderId: data.orderId,
          name: data.prize.name,
          time: new Date().toLocaleTimeString()
        })
        return data
      } finally {
        this.drawing = false
      }
    }
  }
})
