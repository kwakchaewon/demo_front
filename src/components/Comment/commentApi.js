import axios from "@/utils/axios";
import {serverUrl} from "@/main";

export default {

    // 댓글 리스트
    fetchCommentList(boardId) {
        return axios.get(serverUrl + '/board/' + boardId + '/comment')
            .then((res) => {
                if (res.data.state.statusCode === 200) {
                    return res.data.data;
                } else if (res.data.state.statusCode === 404) {
                    throw new Error("게시글을 찾을 수 없습니다.");
                } else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                if (err.message === "게시글을 찾을 수 없습니다.") {
                    throw err;
                } else {
                    throw err;
                }
            })
    },

    // 댓글 저장
    saveComment(boardId, form) {
        return axios.post(serverUrl + '/board/' + boardId + '/comment', form)
            .then((res) => {
                // 게시글 등록 성공
                if (res.data.state.statusCode === 200) {
                }

                // 게시글 부재시
                else if (res.data.state.statusCode === 404) {
                    throw new Error("게시글을 찾을 수 없습니다.");
                }

                // 기타 분기처리
                else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                throw err;
            })
    },

    // 댓글 삭제
    deleteComment(commmentId) {
        return axios.delete(serverUrl + '/comment/' + commmentId)
            .then((res) => {
                // 성공시
                if (res.data.state.statusCode === 200) {
                }

                // 댓글 부재시
                else if (res.data.state.statusCode === 404) {
                    throw new Error("댓글을 찾을 수 없습니다.");
                } else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                throw err;
            })
    },

    // 댓글 수정
    updateComment(row, form) {
        return axios.put(serverUrl + '/comment/' + row.id, form)
            .then((res) => {
                // 성공시
                if (res.data.state.statusCode === 200) {
                    return res.data.data
                }
                // 댓글 부재시
                else if (res.data.state.statusCode === 404) {
                    throw new Error("댓글을 찾을 수 없습니다.");
                }
                // 그외 실패
                else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err) => {
                throw err;
            })
    }
}

