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
            this.content = response.data.content;
          })
          .catch(error => {
            console.error('Error fetching post:', error);
          });
    },

    fnSave() {
      let postId = this.$route.params.id;
      this.form = {
        "title": this.title,
        "contents": this.contents
      }

      this.$axios.put(this.$serverUrl + `/board/${postId}`, this.form)
          .then((res) => {
            alert('글이 수정되었습니다.')
            this.$router.push(`/board/${postId}`)
          }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
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