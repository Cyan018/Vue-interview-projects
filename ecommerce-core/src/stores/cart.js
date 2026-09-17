import { defineStore } from 'pinia'

const STORAGE_KEY = 'cyan-mall-cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadCart(),
    buyNowItem: null
  }),
  getters: {
    totalCount: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    selectedItems: (state) => state.items.filter((item) => item.selected),
    checkedCount: (state) =>
      state.items
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.quantity, 0),
    totalOriginalPrice: (state) =>
      state.items
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.price * item.quantity, 0),
    totalDiscountPrice: (state) =>
      state.items
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.discountPrice * item.quantity, 0),
    savedAmount: (state) =>
      state.totalOriginalPrice - state.totalDiscountPrice,
    allSelected: (state) =>
      state.items.length > 0 && state.items.every((item) => item.selected)
  },
  actions: {
    persist() {
      saveCart(this.items)
    },
    addToCart(product, sku, quantity) {
      const id = `${product.id}-${sku.id}`
      const existed = this.items.find((item) => item.id === id)
      if (existed) {
        existed.quantity = Math.min(sku.stock, existed.quantity + quantity)
      } else {
        this.items.push({
          id,
          productId: product.id,
          name: product.name,
          image: product.image,
          skuId: sku.id,
          skuName: sku.name,
          price: sku.price,
          discountPrice: sku.discountPrice,
          stock: sku.stock,
          quantity,
          selected: true
        })
      }
      this.persist()
    },
    setBuyNow(product, sku, quantity) {
      this.buyNowItem = {
        id: `${product.id}-${sku.id}`,
        productId: product.id,
        name: product.name,
        image: product.image,
        skuId: sku.id,
        skuName: sku.name,
        price: sku.price,
        discountPrice: sku.discountPrice,
        stock: sku.stock,
        quantity,
        selected: true
      }
    },
    clearBuyNow() {
      this.buyNowItem = null
    },
    updateQuantity(id, quantity) {
      const item = this.items.find((entry) => entry.id === id)
      if (!item) return
      if (quantity <= 0) {
        this.items = this.items.filter((entry) => entry.id !== id)
      } else {
        item.quantity = Math.min(quantity, item.stock)
      }
      this.persist()
    },
    toggleSelected(id) {
      const item = this.items.find((entry) => entry.id === id)
      if (item) {
        item.selected = !item.selected
        this.persist()
      }
    },
    toggleAll(selected) {
      this.items.forEach((item) => {
        item.selected = selected
      })
      this.persist()
    },
    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id)
      this.persist()
    },
    clearSelected() {
      this.items = this.items.filter((item) => !item.selected)
      this.persist()
    }
  }
})
