/**
 * mutations 와 유사한 역할
 * 여러개의 mutations 를 실행시키거나
 * 비동기작업을 수행
 * 비동기 처리 후 mutations를 커밋할 수 있어서 비동기 처리 로직을 관리
 */


import {USER_ID, IS_AUTH, ERROR_STATE} from './mutation_types'
import loginAPI from '../service/LoginAPI'

const  setUserId = ({commit}, data) => {
  commit(USER_ID, data)
}

const  setErrorState = ({commit}, data) => {
  commit(ERROR_STATE, data)
}

const  setIsAuth = ({commit}, data) => {
  commit(IS_AUTH, data)
}

// 백엔드에서 반환한 결과값을 가지고 로그인 성공 실패 여부를 vuex에 넣어준다.
const processResponse = (store, loginResponse) => {
  switch (loginResponse) {
    case 'notFound':
      setErrorState(store, 'Wrong ID or Password')
      setIsAuth(store, false)
      break
    default:
      setUserId(store, loginResponse.user_id)
      setErrorState(store, '')
      setIsAuth(store, true)
  }
}

export default {
  async login (store, {user_id, user_pw}) {
    let loginResponse = await loginAPI.doLogin(user_id, user_pw)
    processResponse(store, loginResponse)
    return store.getters.getIsAuth  // 로그인 결과 리턴한다
  }
}