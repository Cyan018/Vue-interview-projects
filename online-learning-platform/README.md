# 在线学习平台前端模块

基于 Vue 3 + Pinia + Vue Router + Axios 的在线学习平台前端 Demo，覆盖登录、个人中心、前端课程资源浏览和视频详情页。

## 运行方式

```bash
npm install
npm run dev
```

打开浏览器访问 `http://localhost:5173`。

演示账号：`admin`，密码：`123456`。

## 技术要点

- `src/router/index.js`：路由懒加载、`meta` 权限标记、全局前置守卫。
- `src/stores/user.js`：Pinia 管理 `token` 和用户信息，`getters` 派生登录状态。
- `src/api/request.js`：Axios 实例、请求拦截器注入 token、响应拦截器统一处理。
- `src/api/mock.js`：自定义 Axios adapter 模拟登录、用户、资源接口。
- `src/views/Resources.vue`：搜索防抖、分类筛选、列表组件化。
- `src/components/ResourceCard.vue`：`props` 接收数据，组件复用。
- `src/views/ResourceDetail.vue`：动态路由详情页，展示课程信息与目录。
- `src/components/VideoPlayer.vue`：模拟视频播放器，支持播放/暂停和进度展示，不依赖真实视频文件。

## 面试常见问题映射

- 登录态如何持久化：`stores/user.js` + `localStorage`。
- 未登录如何拦截：`router/index.js` 的 `beforeEach`。
- Axios 如何统一处理 token 和 401：`api/request.js`。
- 资源列表如何做搜索和筛选：`views/Resources.vue` 的 `watch` + 防抖。
- 详情页视频窗口如何实现：`components/VideoPlayer.vue` 的模拟播放与进度计算。
