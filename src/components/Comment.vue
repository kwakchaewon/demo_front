<template>
  <div class="container my-3">
    <h5 class="border-bottom my-3 py-2">댓글</h5>
    <div class="card my-3" v-for="(row, id) in list" :key="id">
      <div class="card-body">
        <div class="card-text" style="white-space: pre-line;">{{ row.contents }}</div>
        <div class="d-flex justify-content-end">
          <div class="badge bg-light text-dark p-2 text-start">
            <div>{{ row.createdAt }}</div>
          </div>
        </div>
        <div class="my-3">
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnCheckUpdate(row.id)">수정</button>
          <button class="delete btn btn-sm btn-outline-secondary" v-on:click="fnDelete(`${row.id}`)">삭제</button>
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
</template>
<script>
import Cookies from "js-cookie";

export default {
  name: 'Comment',

  data() { //변수생성
    return {
      list: {},
      contents: ''
    }
  },
  mounted() {
    this.fnGetview()
  },
  methods: {
    // 댓글 리스트
    fnGetview() {
      let id = this.$route.params.id
      this.$axios.get(this.$serverUrl + "/board/" + id + "/comment").then((res) => {
        this.list = res.data
      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    },

    // 댓글 저장
    fnSave() {
      var blankPattern = /^\s*$/ // 공백 유효성 검사
      this.form = {
        "contents": this.contents
      }

      if (blankPattern.test(this.contents)) {
        alert("빈 내용은 입력할 수 없습니다.")
      } else {
        const id = this.$route.params.id
        let apiUrl = this.$serverUrl + '/board/' + id + '/comment'
        const token = Cookies.get('ACCESS_TOKEN');
        this.$axios.post(apiUrl, this.form, {
          headers: {
            'ACCESS_TOKEN': `Bearer ${token}` // JWT를 헤더에 포함하여 전송
          }
        })
            .then(() => {
              alert('댓글이 저장되었습니다.')
              this.contents = ''
              this.fnGetview()
            }).catch((err) => {
          if (err.response.data.status === "400" && err.response.data.message) {
            alert(err.response.data.message);
          } else {
            alert("알 수 없는 오류가 발생했습니다.");
          }
        })
      }
    },

    // 댓글 수정 권한 확인
    fnCheckUpdate(id){
      this.$axios.get(this.$serverUrl + '/comment/' + id + '/check')
          .then(() => {
            this.$router.push({
              path: '/comment/' + id+ '/update',
            })
          }).catch((err) => {
        if (err.response.data.status === "400" && err.response.data.message) {
          alert(err.response.data.message) // 400 응답 코드에 대한 알림 메시지
        } else {
          alert('알 수 없는 오류가 발생했습니다.')
        }
      })
    },

    // 댓글 삭제
    fnDelete(id){
      if (!confirm("삭제하시겠습니까?")) return
      this.$axios.delete(this.$serverUrl + '/comment/' + id)
          .then(() => {
            alert('삭제되었습니다.')
            this.fnGetview();
          }).catch((err) => {
        if (err.response.data.status === "400" && err.response.data.message) {
          alert(err.response.data.message);
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
        }
      })
    }
  }
}
</script>
<style scoped>

</style>