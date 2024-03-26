/**
 * store 상태 변경 메서드
 * mutation의 정의된 함수를 commit 을 통해 호출하는 것으로 저장소의 state 변수 값을 변경할 수 있음.
 */

import * as types from './mutation_types'

export default {
    increment(state){
        state.count++;
    },

    [types.USER_ID] (state, userId) {
        state.userId = userId
    },
    [types.ERROR_STATE] (state, errorState) {
        state.errorState = errorState
    },
    [types.IS_AUTH] (state, isAuth) {
        state.isAuth = isAuth
    }
}