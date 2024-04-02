<template>
  <div class="container my-3">
    <h5 class="border-bottom my-3 py-2">댓글</h5>
    <div class="card my-3" v-for="(row, id) in list" :key="id">
      <div class="card-body">
        <div v-if="row.editing">
          <textarea v-model="row.editContent"></textarea>
        </div>
        <div v-else class="card-text" style="white-space: pre-line;">{{ row.contents }}</div>
        <br>
        <div class="d-flex justify-content-end">
          <div class="badge bg-light text-dark p-2 text-start mx-3" v-if="!row.editing">
            <div class="mb-2">작성자</div>
            <div>{{ row.memberId }}</div>
          </div>
          <div class="badge bg-light text-dark p-2 text-start mx-3" v-if="!row.editing">
            <div class="mb-2">작성일</div>
            <div>{{ row.createdAt }}</div>
          </div>
          <div class="badge bg-light text-dark p-2 text-start mx-3" v-if="row.updatedAt && !row.editing">
            <div class="mb-2">수정일</div>
            <div>{{ row.updatedAt }}</div>
          </div>
        </div>
        <div class="my-3">
          <button class="btn btn-sm btn-outline-secondary" v-on:click="toggleEdit(row)"
                  v-if="row.memberId == this.$store.state.user && !row.editing">수정
          </button>
          <button class="btn btn-sm btn-outline-secondary" v-on:click="updateComment(row)"
                  v-if="row.memberId == this.$store.state.user && row.editing">수정
          </button>
          <button class="btn btn-sm btn-outline-secondary" v-on:click="toggleEditCancel(row)"
                  v-if="row.memberId == this.$store.state.user && row.editing">취소
          </button>
          <button class="delete btn btn-sm btn-outline-secondary" v-on:click="DeleteComment(`${row.id}`)"
                  v-if="row.memberId == this.$store.state.user && !row.editing">삭제
          </button>
        </div>
      </div>
    </div>
    <div class="card my-3">
      <div class="board-contents">
      <textarea id="contents" cols="30" rows="3" v-model="contents" class="w3-input w3-border" style="resize: none;"
                placeholder="내용을 입력해주세요.">
      </textarea>
      </div>
      <div class="common-buttons">
        <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="saveComment">저장</button>&nbsp;
      </div>
    </div>
  </div>
  <br>
</template>
<script>
import commentApi from "@/components/Comment/commentApi";

export default {
  name: 'Comment',

  data() { //변수생성
    return {
      list: {},
      contents: ''
    };
  },
  mounted() {
    this.fetchCommentList();
  },
  methods: {
    toggleEdit: function (row) {
      row.editing = !row.editing; // 수정 모드 토클
      if (row.editing) {
        row.editContent = row.contents; // 수정 내용을 기존내용으로 초기화
      }
    },

    toggleEditCancel: function (row) {
      row.editing = !row.editing; // 수정 모드 토클
    },

    updateComment(row) {
      const commentId = row.id;

      this.form = {
        "contents": row.editContent
      };

      const blankPattern = /^\s*$/ // 공백 유효성 검사

      if (blankPattern.test(row.editContent)) {
        alert("빈 내용은 입력할 수 없습니다.")
      } else {
        this.$axios.put(this.$serverUrl + `/comment/${commentId}`, this.form)
            .then((res) => {
              alert('댓글이 수정되었습니다.');
              row.editContent = res.data.contents; // editContent 에 res.data.contents 업데이트
              row.contents = row.editContent; // 수정된 내용을 표시 중인 내용으로 업데이트
              row.editing = false; // 수정 모드 종료
              this.fetchCommentList();
            }).catch((err) => {

          // COMMENT_NOTFOUND: 댓글 부재시, alert 반환
          if (err.response.data.status === "404" && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
          }

          // 403 권한없음 예외 처리
          else if (err.response.data.status === 403) {
            console.log(err.message);
            alert("수정 권한이 없습니다.")
          }

          // 그 외 Custom Exception 발생시 alert 반환
          else if (err.response.data.status && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
          }

          // 기타
          else {
            console.log('댓글 수정에 실패했습니다.');
            alert('댓글 수정에 실패했습니다.');
          }
        })
      }
    },

    // 댓글 리스트
    fetchCommentList() {
      commentApi.fetchCommentList(this.$route.params.id)
          .then((res) => {
            this.list = res;
          })
          .catch((err) => {
            alert(err.message);
          })
    },

    saveComment() {
      const blankPattern = /^\s*$/ // 공백 유효성 검사
      const boardId = this.$route.params.id;

      this.form = {
        "contents": this.contents
      };

      if (blankPattern.test(this.contents)) {
        alert("빈 내용은 입력할 수 없습니다.");
      } else {
        commentApi.saveComment(boardId, this.form)
            .then(() => {
              alert('댓글이 저장되었습니다.');
              this.contents = '';
              this.fetchCommentList();
            })
            .catch((err) => {
              if (err.message === "게시글을 찾을 수 없습니다.") {
                alert("게시글이 존재하지 않습니다. 게시글 리스트로 이동합니다.");
                this.$router.push({path: '/board'});
              } else {
                alert("댓글 저장에 실패했습니다.");
              }
            })
      }
    },

    // // 댓글 수정 권한 확인
    // fnCheckUpdate(id) {
    //   this.$axios.get(this.$serverUrl + '/comment/' + id + '/check')
    //       .then(() => {
    //         this.$router.push({
    //           path: '/comment/' + id + '/update',
    //         });
    //       }).catch((err) => {
    //
    //     if (err.response.data.status === 403) {
    //       console.log(err.message);
    //       alert("수정 권한이 없습니다.");
    //     }
    //
    //     // COMMENT_NOTFOUND: 댓글 부재시, 댓글 리스트 리로딩
    //     else if (err.response.data.status === "404" && err.response.data.message) {
    //       console.log(err.response.data.message);
    //       alert(err.response.data.message);
    //       this.fetchCommentList();
    //     }
    //
    //     // 그 외 Custom Exception 발생시 alert 반환
    //     else if (err.response.data.status && err.response.data.message) {
    //       console.log(err.response.data.message);
    //       alert(err.response.data.message);
    //     }
    //
    //     // 기타
    //     else {
    //       console.log('알 수 없는 오류가 발생했습니다.');
    //       alert('알 수 없는 오류가 발생했습니다.');
    //     }
    //   })
    // },

    DeleteComment(id) {
      if (!confirm("삭제하시겠습니까?")) return
      commentApi.deleteComment(id)
          .then(() => {
            alert('삭제되었습니다.');
            this.fetchCommentList();
          })
          .catch((err) => {
            alert(err.message);
          })
    },
  }
}
</script>
<style scoped>
textarea {
  resize: none;
  width: 100%;
}
</style>