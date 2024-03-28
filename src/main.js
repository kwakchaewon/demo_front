import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import axios from './utils/axios'
import store from './vuex/store'

import './assets/common.css'

/**
 * main.js: vue 어플리케이션의 진입점
 * 스토어 설정, 전역 변수, 라우터 등을 설정
 */
export const serverUrl = '//localhost:8080';

const app = createApp(App)
app.config.globalProperties.$axios = axios; // 전역변수로 설정 컴포넌트에서 this.$axios 호출
app.config.globalProperties.$serverUrl = '//localhost:8080' // API 서버
app.config.globalProperties.$store = store
app
    .use(router)
    .use(store)
    .mount('#app')
