import { createRouter, createWebHistory } from 'vue-router'
import PageHome from '@/views/Board/PageHome.vue'
import BoardList from '@/views/Board/BoardList.vue'
import BoardDetail from '@/views/Board/BoardDetail.vue'
import BoardWrite from '@/views/Board/BoardWrite.vue'
import BoardUpdate from '@/views/Board/BoardUpdate.vue'

const routes = [
  {
    path: '/',
    name: 'PageHome',
    component: PageHome
  },
   {
      path: '/board/list',
      name: 'BoardList',
      component: BoardList
    },
    {
        path: '/board/:id',
        name: 'BoardDetail',
        component: BoardDetail
    },
    {
        path: '/board/write/',
        name: 'BoardWrite',
        component: BoardWrite
      },
    {
            path: '/board/:id/update/',
            name: 'BoardUpdate',
            component: BoardUpdate
    },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router