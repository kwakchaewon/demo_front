import axios from "@/utils/axios";
import {serverUrl} from "@/main";

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
                }
                // boardnotfound(404)
                else if (res.data.state.statusCode !== 200) {
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
    fetchBoardImage(id) {
        return axios.get(serverUrl + '/board/' + id + '/image', {responseType: 'blob'})
            .then((res) => {

                // 이미지 파일 출력 성공
                if (res.status === 200 && res.data.size !== 0) {
                    return URL.createObjectURL(new Blob([res.data]));
                }

                // 파일이 존재하지 않을 시
                else if (res.status === 200 && res.data.size === 0) {
                    return null;
                }

                // 그외 분기 처리
                else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                // IoException 발생 시
                if (err.response.status === 500) {
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

    // 게시글 수정
    updateBoard(id, formData) {
        return axios.put(serverUrl + "/board/" + id, formData)
            .then((res) => {
                if (res.data.state.statusCode === 200) {
                    const message = "게시글이 수정됐습니다.";
                    return message;
                }
                // 삭제된 게시글
                else if (res.data.state.statusCode === 404) {
                    throw new Error("삭제된 게시글입니다.")
                }
                // 그외
                else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                // AccessDeniedException,
                if (err.status === 403) {
                    throw err;
                }
                // 삭제된 게시글, 그외
                else {
                    throw err;
                }
            })
    },

    // 게시글 수정 권한 검증
    getWriteView(id) {
        return axios.get(serverUrl + '/board/' + id + '/check')
            .then((res) => {
                if (res.data.state.statusCode === 200) {
                    return res
                }
                // 삭제된 게시글
                if (res.data.state.statusCode === 404) {
                    throw new Error("삭제된 게시글입니다.")
                }
                // 그외
                else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                if (err.response.data.status === 403) {
                    throw new Error("수정 권한이 없습니다.");
                } else {
                    throw err;
                }
            })
    },

    DeleteBoard(id) {
        return axios.delete(serverUrl + '/board/' + id)
            .then((res) => {

                if (res.data.state.statusCode === 200) {
                    const message = "삭제되었습니다."
                    return message;
                }

                // 게시글 부재
                else if (res.data.state.statusCode === 404) {
                    throw new Error("삭제된 게시글입니다.")
                } else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                if (err.response.data.status === 403) {
                    throw new Error("삭제 권한이 없습니다.");
                } else throw err;
            })
    }
}

