// src/vuex/store.js
import {createStore} from "vuex"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions";

export default createStore({
  state: {
    user: null,
    isLogin: false,
    role: null
  },
  mutations,
  getters,
  actions
})