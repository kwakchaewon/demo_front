// src/service/loginAPI.js
import axios from 'axios'
import Cookies from 'js-cookie';
import store from '@/vuex/store'

const getUserInfo = (userId, userPw) => {
    const reqData = {
        'userId': userId,
        'userPw': userPw
    }

    const serverUrl = '//localhost:8080';

    return axios.post(serverUrl + '/member/login', reqData, {
        headers: {
            'Content-type': 'application/json'
        }
    });
}

export default {
    async doLogin(userId, userPw) {
        try {
            const getUserInfoPromise = getUserInfo(userId, userPw);
            const [userInfoResponse] = await Promise.all([getUserInfoPromise]);
            if (userInfoResponse.data.length === 0) {
                return 'notFound';
            } else {
                store.state.isLogin = true;
                store.state.user = userInfoResponse.data.memberId;
                store.state.role = userInfoResponse.data.authority;

                Cookies.set('ACCESS_TOKEN', userInfoResponse.data.accessToken, {expires: userInfoResponse.data.accessTime}); // 3시간
                Cookies.set('REFRESH_TOKEN', userInfoResponse.data.refreshToken, {expires: userInfoResponse.data.refreshTime}); // 7일
                return userInfoResponse;
            }
        } catch (err) {
            console.error(err);
        }
    }
}