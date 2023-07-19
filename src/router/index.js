import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TodoListView from '@/views/TodoListView.vue'

const routes = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/:title',
    component: TodoListView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
