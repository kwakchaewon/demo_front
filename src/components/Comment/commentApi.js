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
                }
                else {
                    throw err;
                }
            })
    }
}

