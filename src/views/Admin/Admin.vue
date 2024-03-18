<template>
  <main>
    <div class="container my-3">
      <div class="common-buttons">
        <button type="button" class="w3-button w3-round w3-blue-gray"></button>&nbsp;
        <button type="button" class="w3-button w3-round w3-gray"></button>
      </div>
      <AdminMember/>
      <AdminBoard/>
    </div>
  </main>
</template>

<script>
import AdminMember from "@/components/AdminMember.vue";
import AdminBoard from "@/components/AdminBoard.vue";

export default {
  components: {
    AdminBoard,
    AdminMember
  },
  // data() {
  //   return {
  //     list: {}, //리스트 데이터
  //     no: '', //게시판 숫자처리
  //     paging: {
  //       block: 0,
  //       endPage: 0,
  //       nextBlock: 0,
  //       page: 0,
  //       pageSize: 0,
  //       prevBlock: 0,
  //       startIndex: 0,
  //       startPage: 0,
  //       totalBlockCnt: 0,
  //       totalListCnt: 0,
  //       totalPageCnt: 0,
  //     }, //페이징 데이터
  //     page: this.$route.query.page ? this.$route.query.page : 1,
  //     size: this.$route.query.size ? this.$route.query.size : 10,
  //     // page: this.$route.params.page ? this.$route.params.page : 1,
  //     keyword: this.$route.query.keyword ? this.$route.query.keyword : '',
  //
  //     paginavigation: function () { //페이징 처리 for문 커스텀
  //       const pageNumber = [];
  //       const startPage = this.paging.startPage;
  //       const endPage = this.paging.endPage;
  //       for (let i = startPage; i <= endPage; i++) pageNumber.push(i);
  //       return pageNumber;
  //     }
  //   }
  // },
  mounted() {
    // this.fnGetMemberList();
    // this.fnGetList();
  },
  methods: {
    // fnGetMemberList() {
    //   this.$axios.get(this.$serverUrl + '/admin')
    //       .then((res) => {
    //         this.members = res.data;
    //         // alert("admin 접속 완료");
    //       }).catch((err) => {
    //     if (err.response.status === 403) {
    //       // console.log(err.response);
    //       alert("일반 사용자는 접근 불가합니다");
    //       this.$router.push({name: 'BoardList'})
    //     } else {
    //       alert("알 수 없는 오류가 발생했습니다.");
    //       this.$router.push({name: 'BoardList'})
    //     }
    //   })
    // },

    // // 사용자 삭제
    // fnDeleteMember(id) {
    //   if (!confirm("회원을 삭제하시겠습니까?")) return
    //   this.$axios.delete(this.$serverUrl + '/admin/member/' + id)
    //       .then(() => {
    //         this.fnGetMemberList();
    //       }).catch(() => {
    //     alert("사용자 삭제에 실패했습니다.");
    //     console("사용자 삭제에 실패했습니다.");
    //   })
    // },

    // // 게시글 조회
    // fnGetList() {
    //   console.log(this.page)
    //   this.requestBody = { // 데이터 전송
    //     keyword: this.keyword,
    //     // page: this.page,
    //     // page: this.$route.query.page,
    //     page: this.page,
    //     size: this.size
    //   }
    //   console.log(this.requestBody);
    //   this.$axios.get(this.$serverUrl + "/board", {
    //     params: this.requestBody,
    //     headers: {}
    //   }).then((res) => {
    //     this.list = res.data.boards.content;
    //     this.paging = res.data.pagination;
    //     this.no = this.paging.totalListCnt - ((this.paging.page - 1) * this.paging.pageSize);
    //   }).catch((err) => {
    //     if (err.response.data.status && err.response.data.message) {
    //       alert(err.response.data.message);
    //       console.log(err.response.data.message);
    //     } else {
    //       alert('게시글 리스트를 불러올 수 없습니다.');
    //     }
    //   })
    // },
    //
    // fnPage(n) {
    //   if (this.page !== n) {
    //     this.page = n;
    //   }
    //
    //   this.fnGetList();
    // },

  }
}

</script>

<style scoped>

</style>