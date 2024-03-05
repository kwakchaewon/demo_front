<template>
  <div class="container my-3">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray"></button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray"></button>
    </div>

    <h2 class="border-bottom py-2">{{ title }}</h2>
    <div class="card my-3">
      <div class="card-body">
        <div class="card-text" style="white-space: pre-line;">{{ contents }}</div>
        <div class="d-flex justify-content-end">
          <div class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">작성자</div>
            <div>{{ memberId }}</div>
          </div>
          <div class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">작성일</div>
            <div>{{ createdAt }}</div>
          </div>
          <div v-if="this.updatedAt" class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">수정일</div>
            <div>{{ updatedAt }}</div>
          </div>
        </div>
        <div class="my-3">
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnCheckUpdate">수정</button>
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnDelete">삭제</button>
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnList">목록</button>
        </div>
      </div>
    </div>
  </div>
  <Comment/>
</template>

<script>
import Comment from "@/components/Comment.vue";

export default {
  components: {
    Comment
  },
  data() { //변수생성
    return {
      title: '', // 제목
      contents: '', // 내용
      createdAt: '', // 작성일
      updatedAt: '', // 수정일
      memberId: '' // 작성자
    }
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      const id = this.$route.params.id;
      this.$axios.get(this.$serverUrl + '/board/' + id)
          .then((res) => {
            this.title = res.data.title
            this.contents = res.data.contents
            this.createdAt = res.data.createdAt
            this.updatedAt = res.data.updatedAt
            this.memberId = res.data.memberId;
          }).catch((err) => {
        // BOARD_NOTFOUND
        if (err.response.data.status === "404" && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
          this.fnList()
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
          this.fnList();
        }
      })
    },

    fnList() {
      this.$router.push({
        path: '/board',
      });
    },

    fnCheckUpdate() {
      const id = this.$route.params.id;
      this.$axios.get(this.$serverUrl + '/board/' + id + '/check')
          .then(() => {
            this.$router.push({path: './' + id + '/update',});
          }).catch((err) => {

        // NO_AUTHORIZATION: 권한 검증 실패시, alert 반환
        if (err.response.data.status === "403" && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        }

        // BOARD_NOTFOUND: 게시글 부재시, alert 반환 및 리스트로
        else if(err.response.data.status === "404" && err.response.data.message){
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
          console.log("수정 권한 검증에 실패했습니다.");
          alert('수정 권한 검증에 실패했습니다.');
        }
      })
    },
    async fnDelete() {
      if (!confirm("삭제하시겠습니까?")) return
      const id = this.$route.params.id;
      this.$axios.delete(this.$serverUrl + '/board/' + id)
          .then(() => {
            alert('삭제되었습니다.');
            this.fnList();
          }).catch((err) => {

        // NO_AUTHORIZATION: 권한 검증 실패시, alert 반환
        if (err.response.data.status === "403" && err.response.data.message){
          console.log(err.response.data.message);
          alert(err.response.data.message);
        }

        // BOARD_NOTFOUND: 게시글 부재시, alert 반환 및 리스트로
        else if(err.response.data.status === "404" && err.response.data.message){
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
          console.log('삭제에 실패했습니다.');
          alert('삭제에 실패했습니다.');
        }
      })
    },
  }
}
</script>
<style scoped>

</style>