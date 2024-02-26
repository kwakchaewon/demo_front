import {createRouter, createWebHistory} from 'vue-router'
import BoardList from '@/views/Board/BoardList.vue'
import BoardDetail from '@/views/Board/BoardDetail.vue'
import BoardWrite from '@/views/Board/BoardWrite.vue'
import BoardUpdate from '@/views/Board/BoardUpdate.vue'
import Login from '@/views/common/Login'
import store from '@/vuex/store'
import SignUp from "@/views/common/SignUp.vue";

const requireAuth = () => (from, to, next) => {
    const token = localStorage.getItem('ACCESS_TOKEN')
    if (token) {
        store.state.isLogin = true
        return next()
    } // isLogin === true면 페이지 이동
    next('/member/login') // isLogin === false면 다시 로그인 화면으로 이동
}

const routes = [
    {
        path: '/board',
        name: 'BoardList',
        component: BoardList,
        beforeEnter: requireAuth()
    },
    // {
    //     path: '/board/list',
    //     name: 'BoardList',
    //     component: ,
    //     beforeEnter: requireAuth()
    // },
    {
        path: '/board/:id',
        name: 'BoardDetail',
        component: BoardDetail,
        beforeEnter: requireAuth()
    },
    {
        path: '/board/writeform',
        name: 'BoardWrite',
        component: BoardWrite,
        beforeEnter: requireAuth()
    },
    {
        path: '/board/:id/update',
        name: 'BoardUpdate',
        component: BoardUpdate,
        beforeEnter: requireAuth()
    },

    {
        path: '/member/login',
        name: 'Login',
        component: Login  //로그인 컴포넌트 추가
    },
    {
        path: '/member/signup',
        name: 'SignUp',
        component: SignUp  //로그인 컴포넌트 추가
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router