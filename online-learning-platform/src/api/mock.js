const users = {
  admin: {
    username: 'admin',
    password: '123456',
    name: '张三',
    email: 'admin@example.com',
    joinedAt: '2025-09-01'
  }
}

const resources = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 实战',
    category: 'Vue 核心',
    level: '中级',
    duration: '2小时30分',
    seconds: 9000,
    instructor: '王老师',
    summary: '从 setup 到 ref、reactive、computed、watch，系统掌握 Vue 3 的响应式与组合式 API。',
    chapters: [
      { title: '01 项目初始化与 Vite 配置', minutes: 18 },
      { title: '02 ref 与 reactive 的区别', minutes: 25 },
      { title: '03 computed 与 watch 使用场景', minutes: 22 },
      { title: '04 组合式函数封装', minutes: 30 }
    ]
  },
  {
    id: 2,
    title: 'Vue Router 路由与导航守卫',
    category: '路由',
    level: '中级',
    duration: '1小时40分',
    seconds: 6000,
    instructor: '李老师',
    summary: '掌握嵌套路由、动态路由、路由懒加载以及 beforeEach 全局守卫的权限控制。',
    chapters: [
      { title: '01 路由基础与动态路由', minutes: 20 },
      { title: '02 嵌套路由与路由元信息', minutes: 24 },
      { title: '03 全局前置守卫鉴权', minutes: 26 },
      { title: '04 路由懒加载优化', minutes: 18 }
    ]
  },
  {
    id: 3,
    title: 'Pinia 状态管理实战',
    category: '状态管理',
    level: '中级',
    duration: '2小时10分',
    seconds: 7800,
    instructor: '王老师',
    summary: '用登录态和购物车两个真实场景理解 state、getter、action 以及持久化方案。',
    chapters: [
      { title: '01 为什么选择 Pinia', minutes: 15 },
      { title: '02 state 与 getter 设计', minutes: 28 },
      { title: '03 action 异步操作', minutes: 30 },
      { title: '04 状态持久化实践', minutes: 25 }
    ]
  },
  {
    id: 4,
    title: 'Axios 请求封装与拦截器',
    category: '工程化',
    level: '初级',
    duration: '1小时20分',
    seconds: 4800,
    instructor: '陈老师',
    summary: '封装请求实例，统一处理 token 注入、错误提示、超时与 401 跳转。',
    chapters: [
      { title: '01 Axios 实例与基础配置', minutes: 18 },
      { title: '02 请求拦截器', minutes: 20 },
      { title: '03 响应拦截器与错误处理', minutes: 22 },
      { title: '04 接口模块化管理', minutes: 16 }
    ]
  },
  {
    id: 5,
    title: 'Vite 工程化与性能优化',
    category: '工程化',
    level: '中级',
    duration: '1小时50分',
    seconds: 6600,
    instructor: '陈老师',
    summary: '从开发服务器到生产构建，了解懒加载、按需引入、包体积分析与优化思路。',
    chapters: [
      { title: '01 Vite 开发体验与原理', minutes: 20 },
      { title: '02 组件按需引入', minutes: 22 },
      { title: '03 路由懒加载', minutes: 18 },
      { title: '04 构建产物分析', minutes: 24 }
    ]
  },
  {
    id: 6,
    title: 'Vue 3 组件设计与通信',
    category: 'Vue 核心',
    level: '中级',
    duration: '2小时05分',
    seconds: 7500,
    instructor: '李老师',
    summary: '理解 props、emit、v-model、provide/inject 以及组件拆分和复用的边界。',
    chapters: [
      { title: '01 props 与单向数据流', minutes: 25 },
      { title: '02 emit 与 v-model', minutes: 22 },
      { title: '03 provide 与 inject', minutes: 18 },
      { title: '04 什么时候拆分组件', minutes: 20 }
    ]
  }
]

const tokenMap = new Map()

function ok(data) {
  return { status: 200, body: { code: 200, message: 'success', data } }
}

function fail(status, message) {
  return { status, body: { code: status, message } }
}

function publicUser(user) {
  return {
    username: user.username,
    name: user.name,
    email: user.email,
    joinedAt: user.joinedAt
  }
}

function getAuthUser(config) {
  const authorization = config.headers?.Authorization || ''
  const token = authorization.replace('Bearer ', '')
  const username = tokenMap.get(token)
  return username ? users[username] : null
}

function parseBody(config) {
  try {
    return config.data ? JSON.parse(config.data) : {}
  } catch {
    return {}
  }
}

export function handleMock(config) {
  const method = (config.method || 'get').toLowerCase()
  const path = config.url.replace(/^\/api/, '')

  if (method === 'post' && path === '/login') {
    const { username, password } = parseBody(config)
    const user = users[username]
    if (!user || user.password !== password) {
      return fail(401, '用户名或密码错误')
    }
    const token = `mock-token-${username}-${Date.now()}`
    tokenMap.set(token, username)
    return ok({ token, user: publicUser(user) })
  }

  if (path === '/user/me') {
    const user = getAuthUser(config)
    if (!user) return fail(401, '登录已过期，请重新登录')
    if (method === 'get') return ok({ user: publicUser(user) })
    if (method === 'put') {
      const payload = parseBody(config)
      user.name = payload.name || user.name
      user.email = payload.email || user.email
      return ok({ user: publicUser(user) })
    }
  }

  if (method === 'get' && path === '/resources') {
    if (!getAuthUser(config)) return fail(401, '登录已过期，请重新登录')
    const keyword = (config.params?.keyword || '').toLowerCase()
    const category = config.params?.category || ''
    const list = resources.filter((item) => {
      const matchKeyword = !keyword || item.title.toLowerCase().includes(keyword)
      const matchCategory = !category || item.category === category
      return matchKeyword && matchCategory
    })
    return ok({ list, total: list.length })
  }

  const detailMatch = path.match(/^\/resources\/(\d+)$/)
  if (method === 'get' && detailMatch) {
    if (!getAuthUser(config)) return fail(401, '登录已过期，请重新登录')
    const resource = resources.find((item) => item.id === Number(detailMatch[1]))
    if (!resource) return fail(404, '资源不存在')
    return ok({ resource })
  }

  return fail(404, `Mock 接口不存在：${method.toUpperCase()} ${path}`)
}
