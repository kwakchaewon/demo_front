<template>
  <div class="container my-3">
    <h5 class="border-bottom my-3 py-2">댓글</h5>
    <div class="card my-3" v-for="(row, id) in list" :key="id">
      <div class="card-body">
        <div class="card-text" style="white-space: pre-line;">{{ row.contents }}</div>
        <div class="d-flex justify-content-end">
          <div class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">작성자</div>
            <div>{{ row.memberId }}</div>
          </div>
          <div class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">작성일</div>
            <div>{{ row.createdAt }}</div>
          </div>
          <div v-if="row.updatedAt" class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">수정일</div>
            <div>{{ row.updatedAt }}</div>
          </div>
        </div>
        <div class="my-3">
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnCheckUpdate(row.id)"
                  v-if="row.memberId == this.$store.state.user ">수정
          </button>
          <button class="delete btn btn-sm btn-outline-secondary" v-on:click="fnDelete(`${row.id}`)"
                  v-if="row.memberId == this.$store.state.user ">삭제
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
        <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      </div>
    </div>
  </div>
  <br>
</template>
<script>
import Cookies from "js-cookie";
import {consoleError} from "@/utils/errorHandling";

export default {
  name: 'Comment',

  data() { //변수생성
    return {
      list: {},
      contents: ''
    };
  },
  mounted() {
    this.fnGetview();
  },
  methods: {
    fnList() {
      this.$router.push({path: '/board',});
    },

    // 댓글 리스트
    fnGetview() {
      const id = this.$route.params.id;
      this.$axios.get(this.$serverUrl + "/board/" + id + "/comment")
          .then((res) => {
            if (res.status === 200) {
              this.list = res.data;
            } else {
              console.log('Unhandled status code:', res.status);
              console.log("댓글을 불러올 수 없습니다.");
            }
          }).catch((err) => {

        const _status = err.response.status;

        // ResponseStatusException (게시글 부재)
        if (_status === 404) {
          consoleError(err);
        }

        // 기타
        else {
          consoleError(err);
        }
      })
    },

    // 댓글 저장
    fnSave() {
      const blankPattern = /^\s*$/ // 공백 유효성 검사
      this.form = {
        "contents": this.contents
      };

      if (blankPattern.test(this.contents)) {
        alert("빈 내용은 입력할 수 없습니다.");
      } else {
        const id = this.$route.params.id;
        const apiUrl = this.$serverUrl + '/board/' + id + '/comment';
        const token = Cookies.get('ACCESS_TOKEN');
        this.$axios.post(apiUrl, this.form, {
          headers: {
            'ACCESS_TOKEN': `Bearer ${token}` // JWT를 헤더에 포함하여 전송
          }
        })
            .then((res) => {
              // 댓글 저장 성공시
              if (res.status === 200) {
                alert('댓글이 저장되었습니다.');
                this.contents = '';
                this.fnGetview();
              }

              // 그외 분기 처리
              else {
                console.log('Unhandled status code:', res.status);
                alert("댓글 저장에 실패했습니다.");
              }
            }).catch((err) => {

          const _status = err.response.data.status;

          // ResponseStatusException, UsernameNotFoundException (게시글 부재, 404)
          if (_status === 404) {
            consoleError(err);
          }

          // 알 수 없는 예외 발생시
          else {
            consoleError(err);
          }
        })
      }
    },

    // 댓글 수정 권한 확인
    fnCheckUpdate(id) {
      this.$axios.get(this.$serverUrl + '/comment/' + id + '/check')
          .then(() => {
            this.$router.push({
              path: '/comment/' + id + '/update',
            });
          }).catch((err) => {

        if (err.response.data.status === 403) {
          console.log(err.message);
          alert("수정 권한이 없습니다.");
        }

        // COMMENT_NOTFOUND: 댓글 부재시, 댓글 리스트 리로딩
        else if (err.response.data.status === "404" && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
          this.fnGetview();
        }

        // 그 외 Custom Exception 발생시 alert 반환
        else if (err.response.data.status && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        }

        // 기타
        else {
          console.log('알 수 없는 오류가 발생했습니다.');
          alert('알 수 없는 오류가 발생했습니다.');
        }
      })
    },

    // 댓글 삭제
    fnDelete(id) {
      if (!confirm("삭제하시겠습니까?")) return
      this.$axios.delete(this.$serverUrl + '/comment/' + id)
          .then(() => {
            alert('삭제되었습니다.');
            this.fnGetview();
          }).catch((err) => {

        // UNKNOWN_ERROR: 댓글 삭제 실패시, alert 반환
        if (err.response.data.status === "400" && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        }

        // 403 권한없음 예외 처리
        else if (err.response.data.status === 403) {
          alert("권한이 없습니다.");
          console.log("권한이 없습니다.");
        }

        // COMMENT_NOTFOUND: 댓글 부재시, alert 반환 및 댓글 리스트 reload
        else if (err.response.data.status === "404" && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
          this.fnGetview();
        }

        // 그 외 Custom Exception 발생시 alert 반환
        else if (err.response.data.status && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        }

        // 기타
        else {
          console.log("게시글 삭제에 실패했습니다.");
          alert("게시글 삭제에 실패했습니다.");
        }
      })
    }
  }
}
</script>
<style scoped>

</style>