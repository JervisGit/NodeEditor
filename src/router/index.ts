import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/baklava',
      name: 'baklava',
      component: () => import('../views/BaklavaDemo.vue'),
    },
    {
      path: '/baklava-raw',
      name: 'baklava-raw',
      component: () => import('../views/BaklavaRaw.vue'),
    },
    {
      path: '/vue-flow',
      name: 'vue-flow',
      component: () => import('../views/VueFlowDemo.vue'),
    },
    {
      path: '/vue-flow-custom',
      name: 'vue-flow-custom',
      component: () => import('../views/VueFlowCustom.vue'),
    },
    {
      path: '/monaco',
      name: 'monaco',
      component: () => import('../views/MonacoDemo.vue'),
    },
  ],
})

export default router
