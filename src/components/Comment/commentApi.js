import axios from "@/utils/axios";
import {serverUrl} from "@/main";

export default {

    // 댓글 리스트
    fetchCommentList(boardId){
        return axios.get(serverUrl + '/board/' + boardId + '/comment')
            .then((res)=>{
                if(res.data.state.statusCode === 200){
                    return res.data.data;
                }

                else if(res.data.state.statusCode === 404){
                    throw new Error("게시글을 찾을 수 없습니다.");
                }

                else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err)=>{
                if (err.message === "게시글을 찾을 수 없습니다."){
                    throw err;
                }
                else {
                    throw err;
                }
            })
    },

    saveComment(boardId, form){
        return axios.post(serverUrl + '/board/' + boardId + '/comment', form)
            .then((res)=>{
                // 게시글 등록 성공
                if(res.data.state.statusCode === 200){
                }

                // 게시글 부재시
                else if(res.data.state.statusCode === 404){
                    throw new Error("게시글을 찾을 수 없습니다.");
                }

                // 기타 분기처리
                else {
                    throw new Error("Unhandled status code: " + res.status);
                }
            })
            .catch((err)=>{
                throw err;
            })
    },
}

