# 电商平台交互核心模块

基于 Vue 3 + Pinia + Element Plus 的电商交互核心 Demo，覆盖商品列表、SKU 选择、购物车、订单结算、模拟支付和营销抽奖。

## 运行方式

```bash
npm install
npm run dev
```

打开浏览器访问 `http://localhost:5174`。

## 技术要点

- `src/stores/cart.js`：购物车状态、总价/已省金额 getters、LocalStorage 持久化、库存上限控制。
- `src/stores/order.js`：订单创建、支付、取消支付等状态流转。
- `src/components/SkuDialog.vue`：SKU 规格选择和数量选择，未选规格不能提交。
- `src/components/PaymentDialog.vue`：模拟支付方式选择、加载和支付成功状态。
- `src/views/Checkout.vue`：收货信息、优惠券选择、金额实时重算。
- `src/views/Orders.vue`：订单列表与物流状态展示，包含待支付、待发货、运输中、已签收。
- `src/utils/weightedRandom.js`：按权重抽取的原生 JavaScript 随机算法。
- `src/api/request.js`：Axios 实例、请求拦截器注入 token 和请求时间、响应拦截器统一处理。
- `src/api/mock.js`：模拟商品和抽奖接口，抽奖结果由 mock 服务端决定，并做时间戳/防重放校验。
- `src/utils/debounce.js`：搜索防抖，减少无效请求。
- `src/router/index.js`：路由懒加载。
- `vite.config.js`：Element Plus 按需引入，减小打包体积。

## 面试常见问题映射

- 购物车总价如何计算：`stores/cart.js` 的 `totalOriginalPrice`、`totalDiscountPrice` 和 `savedAmount` getter，只统计勾选商品。
- 为什么用 Pinia：购物车数据被商品页、购物车页共享，需要全局状态。
- 数据如何持久化：`stores/cart.js` 的 `persist` 写入 `localStorage`，初始化时读取。
- 库存不足如何处理：`SkuDialog.vue` 禁用无库存规格，`cart.js` 对数量做库存上限限制。
- 订单状态如何展示：`views/Orders.vue` 用时间轴展示提交、支付、发货、运输和签收状态。
- 抽奖如何公平：前端不计算中奖，`api/mock.js` 模拟服务端按权重返回结果。
- 如何防止重复提交：`api/mock.js` 校验 `timestamp` 和 `nonce`。
- 性能优化：路由懒加载、搜索防抖、Element Plus 按需引入。
