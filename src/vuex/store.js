// src/vuex/store.js
import {createStore} from "vuex"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions";

/**
 * store.js: vuex 로 변수 및 데이터 관리
 */

const store = createStore({
  state: {
    user: null,
    isLogin: false,
    role: null
  },
  mutations,
  getters,
  actions
})

// 세션 스토리지에서 상태를 가져오기
const savedState = JSON.parse(sessionStorage.getItem('vuex-state'))
if (savedState) {
  store.replaceState(savedState)
}

// 스토어의 상태가 변경될 때마다 세션 스토리지에 저장
store.subscribe((mutation, state) => {
  sessionStorage.setItem('vuex-state', JSON.stringify(state))
})

export default store