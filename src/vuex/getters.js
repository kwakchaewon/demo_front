/**
 * getters.js: store 의 상태(state) 를 가져오는 메서드
 */
export default {
  getUser: state => state.user,
  getErrorState: state => state.errorState,
  getIsAuth: state => state.isAuth,
  loggedIn(state) {
    return !!state.user
  }
}