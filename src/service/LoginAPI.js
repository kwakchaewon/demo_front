// src/service/loginAPI.js
import axios from 'axios'
import Cookies from 'js-cookie';


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

            console.log(userInfoResponse.data)
            if (userInfoResponse.data.length === 0) {
                return 'notFound';
            } else {
                // var ACCESS_EXP = new Date(userInfoResponse.data.ACCESS_EXP).getTime();
                // var REFRESH_EXP = new Date(userInfoResponse.data.REFRESH_EXP).getTime();

                // Cookies.set('user_role', userInfoResponse.data.user_role, {expires: new Date(expTimeMillis)})
                // Cookies.set('ACCESS_TOKEN', userInfoResponse.data.ACCESS_TOKEN, {expires: 1/24})
                Cookies.set('ACCESS_TOKEN', userInfoResponse.data.ACCESS_TOKEN, {expires: 1/24}); // 1시간
                Cookies.set('REFRESH_TOKEN', userInfoResponse.data.REFRESH_TOKEN, {expires: 7});

                // localStorage.setItem('ACCESS_TOKEN', userInfoResponse.data.ACCESS_TOKEN)
                // localStorage.setItem('REFRESH_TOKEN', userInfoResponse.data.REFRESH_TOKEN)
                return userInfoResponse;
            }
        } catch (err) {
            console.error(err);
        }
    }
}