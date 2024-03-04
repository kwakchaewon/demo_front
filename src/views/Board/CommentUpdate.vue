<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
    <div class="board-contents">
      <textarea id="contents" cols="30" rows="10" v-model="contents" class="w3-input w3-border" style="resize: none;"
                placeholder="내용을 입력해주세요.">
      </textarea>
    </div>
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
  </div>
</template>

<script>
export default {
  data() { //변수생성
    return {
      contents: ''
    }
  },
  mounted() {
    this.fnGetView()
  },
  methods: {
    fnGetView() {
      // URL 에서 게시글 ID 가져옴
      let commentId = this.$route.params.id;
      this.commentId = commentId;

      // 해당 댓글 불러오기
      this.$axios.get(this.$serverUrl + `/comment/${commentId}`)
          .then(response => {
            this.contents = response.data.contents;
          })
          .catch(err => {
            console.log(err)
            if (err.response.data.status && err.response.data.message) {
              alert(err.response.data.message);
            } else {
              alert('알 수 없는 오류가 발생했습니다.')
            }
          })
    },

    fnSave() {
      let commentId = this.$route.params.id;
      this.form = {
        "contents": this.contents
      }

      var blankPattern = /^\s*$/ // 공백 유효성 검사

      if (blankPattern.test(this.contents)) {
        alert("빈 내용은 입력할 수 없습니다.")
      } else {
        this.$axios.put(this.$serverUrl + `/comment/${commentId}`, this.form)
            .then((res) => {
              alert('글이 수정되었습니다.')
              let boardId = res.data.boardId
              this.$router.push(`/board/${boardId}`)
            }).catch((err) => {
          console.log(err)
          if (err.response.data.status && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
          } else {
            console.log('알 수 없는 오류가 발생했습니다.')
            alert('알 수 없는 오류가 발생했습니다.')
          }
        })
      }
    },

    fnList() {
      this.$router.push({
        path: '/board',
      })
    },

  }
}

</script>
<style scoped>

</style>