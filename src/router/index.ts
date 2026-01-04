import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardVertical from '../views/DashboardVertical.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardVertical,
      children: [
        {
          path: '',
          redirect: '/dashboard/home'
        },
        {
          path: 'home',
          component: HomeView,
        },
        {
          path: 'baklava',
          component: () => import('../views/BaklavaDemo.vue'),
        },
        {
          path: 'vue-flow',
          component: () => import('../views/VueFlowDemo.vue'),
        },
        {
          path: 'monaco',
          component: () => import('../views/MonacoDemo.vue'),
        },
        {
          path: 'file-explorer',
          component: () => import('../views/FileExplorerDemo.vue'),
        },
        {
          path: 'kanban',
          component: () => import('../views/KanbanBoard.vue'),
        },
        {
          path: 'about',
          component: () => import('../views/AboutView.vue'),
        },
      ],
    },
    {
      path: '/baklava',
      name: 'baklava',
      component: () => import('../views/BaklavaDemo.vue'),
    },
    {
      path: '/baklava-js',
      name: 'baklava-js',
      component: () => import('../views/BaklavaDemo-JS.vue'),
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
    {
      path: '/file-explorer',
      name: 'file-explorer',
      component: () => import('../views/FileExplorerDemo.vue'),
    },
    {
      path: '/kanban',
      name: 'kanban',
      component: () => import('../views/KanbanBoard.vue'),
    },
  ],
})

export default router
