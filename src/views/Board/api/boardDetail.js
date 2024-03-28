// import {handleErrorWithAlert} from "@/utils/errorHandling";
import axios from "@/utils/axios";
import {serverUrl} from "@/main";
import router from "@/router";
import {handleErrorWithAlert} from "@/utils/errorHandling";


function pushBoard() {
    router.push('/board');
}

// export const fetchBoardDetail = async (boardId) => {
//     try {
//         const response = await axios.get(serverUrl + '/board/' + boardId);
//
//         if (response.status === 200) {
//             const board = {
//                 id: response.data.id,
//                 title: response.data.title,
//                 contents: response.data.contents,
//                 memberId: response.data.memberId,
//                 createdAt: response.data.createdAt,
//                 updatedAt: response.data.updatedAt,
//                 originalFile: response.data.originalFile
//             }
//
//             console.log(11);
//             return board;
//         } else {
//             console.log(12);
//             alert("게시글을 불러올 수 없습니다.");
//             pushBoard;
//         }
//
//
//     } catch (error) {
//         console.error('Error fetching post:', error);
//         alert('게시글을 불러오는 중에 오류가 발생했습니다.')
//         pushBoard;
//         console.log(13);
//     }
// }

export const GetBoardDetail = (id) => {
    return axios
        .get(serverUrl + '/board/' + id)
        .then((res) => {
            if (res.status === 200) {
                return res.data;
            } else {
                console.log('Unhandled status code:', res.status);
                alert("게시글 상세를 불러올 수 없습니다.");
                pushBoard();
            }
        })
        .catch((err) => {
            const _status = err.response.data.status;

            // ResponseStatusException (게시글 부재, 404)
            if (_status === 404) {
                handleErrorWithAlert(err);
                pushBoard();
                throw err;
            }

            // 알 수 없는 예외 발생시
            else {
                alert('알 수 없는 오류가 발생했습니다.');
                pushBoard();
                throw err;
            }
        });
}

