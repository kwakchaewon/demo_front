import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * axios 가 실행될때 인증에 필요한 토큰이 설정되도록 구현했습니다.
 */
axios.interceptors.request.use(function (config) {
    const access = Cookies.get('ACCESS_TOKEN');
    const refresh = Cookies.get('REFRESH_TOKEN');

    config.headers.ACCESS_TOKEN = "Bearer " + access;
    config.headers.REFRESH_TOKEN = "Bearer " + refresh;

    return config;
});

axios.interceptors.response.use(function (config) {
    return config;
});

export default axios;