import {createRouter, createWebHistory} from 'vue-router'
import BoardList from '@/views/Board/BoardList.vue'
import BoardDetail from '@/views/Board/BoardDetail.vue'
import BoardWrite from '@/views/Board/BoardWrite.vue'
import CommentUpdate from '@/views/Board/CommentUpdate.vue'
import Login from '@/views/common/Login'
import store from '@/vuex/store'
import SignUp from "@/views/common/SignUp.vue";
import Admin from "@/views/Admin/Admin.vue";
import Cookies from 'js-cookie';
import axios from "axios";
import BoardManage from "@/components/Admin/BoardManage.vue";
import MemberManage from "@/components/Admin/MemberManage.vue";
import NestedComponent from "@/views/test/NestedComponent.vue";
import ParentComponent from "@/views/test/ParentComponent.vue";
import ParentComponent2 from "@/views/test/ParentComponent2.vue";

/**
 * vue.js 에서 라우터를 설정하는 부분
 */

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
                store.state.user = "";
                store.state.role = "";
                return next('/member/login');
            })
        }

        // access, refresh 둘 다 없을 경우
        else {
            alert("로그인 세션이 만료됐습니다.");
            return next('/member/login'); // isLogin === false면 다시 로그인 화면으로 이동
        }
    }
}

/**
 * ADMIN 페이지 검증 로직
 */
const requireAdmin = () => (from, to, next) => {

    if (store.state.isLogin === true) {
        if (store.state.role === "ROLE_ADMIN" || store.state.role === "ROLE_SUPERVISOR") {
            return next();
        } else {
            alert("접근 권한이 없습니다.");
            return next('/board');
        }
    } else {
        alert("접근 권한이 없습니다.");
        return next('/board');
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
        path: '/board/write/:id?',
        name: 'BoardWrite',
        component: BoardWrite,
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
        component: Admin, BoardManage, MemberManage,
        beforeEnter: requireAdmin()
    },
    {
        path: '/test',
        name: 'test',
        component: NestedComponent,
    },
    {
        path: '/test',
        name: 'test',
        component: NestedComponent,
    },
    {
        path: '/test2',
        name: 'test2',
        component: ParentComponent,
    },
    {
        path: '/test3',
        name: 'test3',
        component: ParentComponent2,
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

// router.beforeEach((to, from, next) => {
//     // 요청된 URL이 존재하지 않을 때
//     if (to.matched.length === 0) {
//         alert("URL을 찾을 수 없습니다.");
//         next.('/board'); // /board로 리디렉션합니다.
//     } else {
//         next(); // 계속 진행합니다.
//     }
// });

export default router