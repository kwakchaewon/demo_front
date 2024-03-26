/**
 * store 상태 변경 메서드
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