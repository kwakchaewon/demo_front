// src/service/loginAPI.js
import axios from 'axios'

const getUserInfo = (userId, userPw) => {
  const reqData = {
    'user_id': userId,
    'user_pw': userPw
  }

  let serverUrl = '//localhost:8080'

  return axios.post(serverUrl + '/member/login', reqData, {
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
        console.log("1")
        return 'notFound'
      } else {
        console.log("2")
        localStorage.setItem('user_token', userInfoResponse.data.user_token)
        localStorage.setItem('user_role', userInfoResponse.data.user_role)
        return userInfoResponse
      }
    } catch (err) {
      console.error(err)
    }
  }
}