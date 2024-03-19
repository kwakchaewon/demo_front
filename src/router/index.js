import {createRouter, createWebHistory} from 'vue-router'
import BoardList from '@/views/Board/BoardList.vue'
import BoardDetail from '@/views/Board/BoardDetail.vue'
import BoardWrite from '@/views/Board/BoardWrite.vue'
import BoardUpdate from '@/views/Board/BoardUpdate.vue'
import CommentUpdate from '@/views/Board/CommentUpdate.vue'
import Login from '@/views/common/Login'
import store from '@/vuex/store'
import SignUp from "@/views/common/SignUp.vue";
import Admin from "@/views/Admin/Admin.vue";
import Cookies from 'js-cookie';
import AdminMember from "@/components/Admin/MemberManage.vue";
import AdminBoard from "@/components/Admin/BoardManage.vue";
import AdminManage from "@/components/Admin/AdminManage.vue";
import axios from "axios";

/**
 * 컴포넌트 진입 전 실행
 * 토큰 유무에 따라 store 변수 관리, 로그인 상태 관리
 */
const requireAuth = () => (from, to, next) => {
    const serverUrl = '//localhost:8080';
    const ACCESS_TOKEN = Cookies.get('ACCESS_TOKEN');
    const REFRESH_TOKEN = Cookies.get('REFRESH_TOKEN');

    if (ACCESS_TOKEN) {
        store.state.isLogin = true;
        return next();
    } else {
        // refresh 토큰만 있을 경우
        if (REFRESH_TOKEN) {
            // 액세스 토큰 재발급
            axios.get(serverUrl + "/member/refresh").then((res) => {
                Cookies.set("ACCESS_TOKEN", res.data.accessToken, {expires: res.data.accessTime});

                store.state.isLogin = true
                store.state.user = res.data.memberId;
                store.state.role = res.data.authority;
                return next();
            }).catch(() => {
                alert("액세스 토큰 로그인 실패");
                store.state.isLogin = false;
                store.state.user = null;
                store.state.role =null;
                next('/member/login');
            })
        }

        // access, refresh 둘 다 없을 경우
        else {
            alert("로그인 세션이 만료됐습니다.");
            next('/member/login'); // isLogin === false면 다시 로그인 화면으로 이동
        }
    }
}

const requireAdmin  = () => (from, to, next) => {
    console.log('12');

    if(store.state.role === "ROLE_ADMIN" || store.state.role === "ROLE_SUPERVISOR"){
        return next();
    } else {
        alert("접근 권한이 없습니다.");
        next('/board');
    }
}


const routes = [
    {
        path: '/board',
        name: 'BoardList',
        component: BoardList,
        beforeEnter: requireAuth()
    },
    {
        path: '/board/:id',
        name: 'BoardDetail',
        component: BoardDetail, Comment,
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
        path: '/comment/:id/update',
        name: 'CommentUpdate',
        component: CommentUpdate,
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
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin, AdminMember, AdminBoard, AdminManage,
        beforeEnter: requireAdmin()
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router