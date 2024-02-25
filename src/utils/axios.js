import axios from 'axios';

axios.interceptors.request.use(function (config) {
    const access = localStorage.getItem('ACCESS_TOKEN');
    const refresh = localStorage.getItem('REFRESH_TOKEN');

    config.headers.ACCESS_TOKEN = "Bearer " + access;
    config.headers.REFRESH_TOKEN = "Bearer " + refresh;

    return config;
});

axios.interceptors.response.use(function (config) {
    return config
});

export default axios;