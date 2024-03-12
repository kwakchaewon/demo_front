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
                Cookies.set('ACCESS_TOKEN', userInfoResponse.data.ACCESS_TOKEN, {expires: 1/24}); // 1시간
                Cookies.set('REFRESH_TOKEN', userInfoResponse.data.REFRESH_TOKEN, {expires: 7});
                return userInfoResponse;
            }
        } catch (err) {
            console.error(err);
        }
    }
}