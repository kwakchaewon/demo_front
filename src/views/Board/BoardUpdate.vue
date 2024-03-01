<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
    <div class="board-contents">
      <input type="text" v-model="title" class="w3-input w3-border" placeholder="제목을 입력해주세요.">
    </div>
    <div class="board-contents">
      <textarea id="" cols="30" rows="10" v-model="contents" class="w3-input w3-border" style="resize: none;"
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
    }
  },
  mounted() {
    this.fnGetView()
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
          .catch(error => {
            console.error('Error fetching post:', error);
          });
    },

    fnSave() {
      console.log(1)
      let postId = this.$route.params.id;
      this.form = {
        "title": this.title,
        "contents": this.contents
      }

      this.$axios.put(this.$serverUrl + `/board/${postId}`, this.form)
          .then(() => {
            alert('글이 수정되었습니다.')
            this.$router.push(`/board/${postId}`)
          }).catch((err) => {
            console.log(err)
            if(err.response.data.status === "400" && err.response.data.message){
              alert(err.response.data.message);
            } else{
              alert('알 수 없는 오류가 발생했습니다.')
            }
      })
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