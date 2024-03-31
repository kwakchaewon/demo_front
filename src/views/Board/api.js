import axios from "@/utils/axios";
import {serverUrl} from "@/main";
// import router from "@/router";

export default {

    // 게시글 등록
    createBoard(formData) {
        return axios.post(serverUrl + '/board', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        })
            .then((res) => {
                if (res.data.state.statusCode === 200) {
                    return res.data.data.id;
                } else if (res.data.state.statusCode !== 200 && res.data.state.statusCode) {
                    throw new Error(res.data.state.message);
                } else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                throw err;
            })
    },


    // 게시글 상세 조회
    fetchBoardDetail(id) {
        return axios.get(serverUrl + '/board/' + id)
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
    },

    // 게시글 이미지 조회
    fetchBoardImage(id){
        return axios.get(serverUrl + '/board/' + id + '/image', {responseType: 'blob'})
            .then((res) => {
                
                // 이미지 파일 출력 성공
                if (res.status === 200 && res.data.size !== 0) {
                    return URL.createObjectURL(new Blob([res.data]));
                }

                // 파일이 존재하지 않을 시
                else if(res.status === 200 && res.data.size === 0){
                    return null;
                }
                
                // 그외 분기 처리
                else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                // IoException 발생 시
                if (err.response.status === 500){
                    throw new Error("이미지 파일을 출력할 수 없습니다.");
                }
            });
    },

    // 게시글 리스트 조회
    fetchBoardList(requestBody) {
        return axios.get(serverUrl + "/board", {
            params: requestBody
        })
            .then((res) => {
                if (res.data.state.statusCode === 200) {
                    return res.data;
                } else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                throw err;
            })
    },
}

