<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
    <div class="board-contents">
      <input type="text" id="title" v-model="title" class="w3-input w3-border" placeholder="제목을 입력해주세요.">
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
      title: '',
      content: ''
    };
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      // URL 에서 게시글 ID 가져옴
      let postId = this.$route.params.id;
      this.postId = postId;

      // 해당 게시글 불러오기
      this.$axios.get(this.$serverUrl + `/board/${postId}`)
          .then(response => {
            this.title = response.data.title;
            this.contents = response.data.contents;
          })
          .catch(err => {
            if (err.response.data.status === "400" && err.response.data.message) {
              console.log(err.response.data.message);
              alert(err.response.data.message);
            }
            // BOARD_NOTFOUND
            else if(err.response.data.status === "404" && err.response.data.message){
              console.log(err.response.data.message);
              alert(err.response.data.message);
              this.fnList();
            }
            else if(err.response.data.status && err.response.data.message){
              console.log(err.response.data.message);
              alert(err.response.data.message);
            } else{
              alert('알 수 없는 오류가 발생했습니다.');
            }
          });
    },

    fnSave() {
      const postId = this.$route.params.id;
      this.form = {
        "title": this.title,
        "contents": this.contents
      }

      const blankPattern = /^\s*$/; // 공백 유효성 검사

      if (blankPattern.test(this.title)) {
        alert("빈 제목은 사용할 수 없습니다.");
      } else if (blankPattern.test(this.contents)) {
        alert("빈 내용은 입력할 수 없습니다.");
      } else {
        this.$axios.put(this.$serverUrl + `/board/${postId}`, this.form)
            .then(() => {
              alert('글이 수정되었습니다.');
              this.$router.push(`/board/${postId}`);
            }).catch((err) => {

          // NO_AUTHORIZATION: 권한 검증 실패시, alert 반환
          if (err.response.data.status === "403" && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
          }

          // BOARD_NOTFOUND: 게시글 부재시, alert 반환 및 리스트로
          else if (err.response.data.status === "404" && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
            this.fnList();
          }

          // 그 외 Custom Exception 발생시 alert 반환
          else if(err.response.data.status && err.response.data.message){
            console.log(err.response.data.message);
            alert(err.response.data.message);
          }

          // 기타
          else {
            console.log('수정에 실패했습니다.');
            alert('수정에 실패했습니다.');
          }
        })
      }
    },

    fnList() {
      this.$router.push({path: '/board',});
    },

  }
}

</script>
<style scoped>

</style>