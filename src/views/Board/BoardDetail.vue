<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnUpdate">수정</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-red" v-on:click="fnDelete">삭제</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
    <div class="board-contents">
      <h3>{{ title }}</h3>
    </div>
    <div class="board-contents">
      <span>{{ contents }}</span>
    </div>
    <div class="board-contents">
      <span>{{ createdAt }}</span>
    </div>
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnCheckUpdate">수정</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-red" v-on:click="fnDelete">삭제</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
  </div>
</template>

<script>
export default {
  data() { //변수생성
    return {
      title: '', // 제목
      contents: '', // 내용
      createdAt: '' // 작성일
    }
  },
  mounted() {
    this.fnGetView()
  },
  methods: {
    fnGetView() {
      const id = this.$route.params.id
      this.$axios.get(this.$serverUrl + '/board/' + id)
          .then((res) => {
            this.title = res.data.title
            this.contents = res.data.contents
            this.createdAt = res.data.createdAt
          }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    },
    fnList() {
      this.$router.push({
        path: '/board/list',
      })
    },
    fnUpdate() {
      const id = this.$route.params.id
      this.$router.push({
        path: './' + id + '/update',
      })
    },
    fnCheckUpdate() {
      const id = this.$route.params.id
      this.$axios.get(this.$serverUrl + '/board/' + id + '/updatecheck')
          .then(() => {
            this.$router.push({path: './' + id + '/update',})
          }).catch((err) => {
        if (err.response.status === 400) {
          alert('수정 권한이 없습니다.'); // 400 응답 코드에 대한 알림 메시지
        } else {
          console.err('에러:', err); // 기타 에러 처리
        }
      })
    },
    async fnDelete() {
      if (!confirm("삭제하시겠습니까?")) return
      const id = this.$route.params.id
      this.$axios.delete(this.$serverUrl + '/board/' + id)
          .then(() => {
            alert('삭제되었습니다.')
            this.fnList();
          }).catch((err) => {
        if (err.response.status === 400) {
          alert('삭제 권한이 없습니다.');
        } else {
          console.log(err.response);
        }
      })
    }
  }
}
</script>
<style scoped>

</style>