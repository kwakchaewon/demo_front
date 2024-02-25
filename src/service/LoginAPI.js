// src/service/loginAPI.js
import axios from 'axios'

const getUserInfo = (userId, userPw) => {
    const reqData = {
        'userId': userId,
        'userPw': userPw
    }

    let serverUrl = '//localhost:8080'

    return axios.post(serverUrl + '/member/login2', reqData, {
        headers: {
            'Content-type': 'application/json'
        }
    })
}

export default {
    async doLogin(userId, userPw) {
        try {
            const getUserInfoPromise = getUserInfo(userId, userPw)
            const [userInfoResponse] = await Promise.all([getUserInfoPromise])
            if (userInfoResponse.data.length === 0) {
                return 'notFound'
            } else {
                localStorage.setItem('user_role', userInfoResponse.data.user_role)
                localStorage.setItem('ACCESS_TOKEN', userInfoResponse.data.ACCESS_TOKEN)
                localStorage.setItem('REFRESH_TOKEN', userInfoResponse.data.REFRESH_TOKEN)

                return userInfoResponse
            }
        } catch (err) {
            console.error(err)
        }
    }
}