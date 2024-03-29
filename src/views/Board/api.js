import axios from "@/utils/axios";
import {serverUrl} from "@/main";
// import router from "@/router";

export default {
    // 게시글 상세 조회
    fetchBoardDetail(id) {
        return axios.get(serverUrl + '/board/detail/' + id)
            .then((res) => {
                if (res.data.state.statusCode === 200) {
                    return res.data.data;
                } else if (res.data.state.statusCode !== 200) {
                    throw new Error(res.data.state.message);
                } else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                throw err;
            });
    }
}

