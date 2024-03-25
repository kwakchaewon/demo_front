<template>
  <div>
    <h2 class="border-bottom py-2">회원 관리</h2>
    <table class="table"  v-if="this.$store.state.role === 'ROLE_SUPERVISOR'">
      <thead class="table-dark">
      <tr class="text-center">
        <th>번호</th>
        <th style="width:30%">아이디</th>
        <th>이메일</th>
        <th>생성일</th>
        <th>권한</th>
        <th>관리</th>
        <th>삭제</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, id) in list" :key="id" class="text-center">
        <td>{{ paging.totalListCnt - (paging.page * paging.pageSize) - id + 10 }}</td>
        <td>{{ row.userId }}</td>
        <td>{{ row.email }}</td>
        <td>{{ row.createdAt }}</td>
        <td>
          <select v-model="row.auth">
            <option value="ROLE_ADMIN" :selected="row.auth === 'ROLE_ADMIN'">관리자</option>
            <option value="ROLE_USER" :selected="row.auth === 'ROLE_USER'">일반 사용자</option>
          </select>
        </td>
        <td>
          <button class="delete-btn" @click="fnAuthCommit(`${row.id}`,`${row.auth}`)">반영</button>
        </td>
        <td>
          <button class="delete-btn" @click="fnDeleteMember(`${row.id}`)">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>

    <table class="table"  v-if="this.$store.state.role === 'ROLE_ADMIN'">
      <thead class="table-dark">
      <tr class="text-center">
        <th>번호</th>
        <th style="width:30%">아이디</th>
        <th>이메일</th>
        <th>생성일</th>
        <th>삭제</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, id) in list" :key="id" class="text-center">
        <td>{{ paging.totalListCnt - (paging.page * paging.pageSize) - id + 10 }}</td>
        <td>{{ row.userId }}</td>
        <td>{{ row.email }}</td>
        <td>{{ row.createdAt }}</td>
        <td>
          <button class="delete-btn" @click="fnDeleteMember(`${row.id}`)">삭제</button>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="pagination w3-bar w3-padding-16 w3-small" v-if="paging.totalListCnt > 0 && list.length > 0"
         style="justify-content: center">
                  <span class="pg">
                  <a href="javascript:;" @click="fnPage(1)" class="first w3-button w3-border">처음</a>
                  <a href="javascript:;" v-if="paging.startPage > 10" @click="fnPage(`${paging.startPage-1}`)"
                     class="prev w3-button w3-border">이전</a>
                  <template v-for=" (n,index) in paginavigation()">
                      <template v-if="paging.page==n">
                          <strong class="w3-button w3-border w3-green" :key="index">{{ n }}</strong>
                      </template>
                      <template v-else>
                          <a class="w3-button w3-border" href="javascript:;" @click="fnPage(`${n}`)" :key="index">
                            {{ n }}
                          </a>
                      </template>
                  </template>
                  <a v-if="paging.totalPageCnt > paging.endPage"
                     @click="fnPage(`${paging.endPage+1}`)" class="next w3-button w3-border">다음</a>
                  <a @click="fnPage(`${paging.totalPageCnt}`)" class="last w3-button w3-border">끝</a>
                  </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MemberManage',
  data() {
    return {
      list: {},
      no: '', //게시판 숫자처리
      paging: {
        block: 0,
        endPage: 0,
        nextBlock: 0,
        page: 0,
        pageSize: 0,
        prevBlock: 0,
        startIndex: 0,
        startPage: 0,
        totalBlockCnt: 0,
        totalListCnt: 0,
        totalPageCnt: 0,
      }, //페이징 데이터
      page: this.$route.query.page ? this.$route.query.page : 1,
      size: this.$route.query.size ? this.$route.query.size : 10,
      // page: this.$route.params.page ? this.$route.params.page : 1,

      paginavigation: function () { //페이징 처리 for문 커스텀
        const pageNumber = [];
        const startPage = this.paging.startPage;
        const endPage = this.paging.endPage;
        for (let i = startPage; i <= endPage; i++) pageNumber.push(i);
        return pageNumber;
      }
    }
  },
  mounted() {
    this.fnGetMemberList();
  },

  methods: {
    // 사용자 + 관리자 조회
    fnGetMemberList() {
      this.requestBody = { // 데이터 전송
        page: this.page,
        size: this.size
      }

      this.$axios.get(this.$serverUrl + "/member/list", {
        params: this.requestBody,
        headers: {}
      }).then((res) => {
        this.list = res.data.list.content;
        this.paging = res.data.pagination;
        this.no = this.paging.totalListCnt - ((this.paging.page - 1) * this.paging.pageSize);
      }).catch((err) => {
        // 403 권한없음 예외 처리
        if (err.response.data.status === 403) {
          console.log(err.response.message);
        } else if (err.response.data.status && err.response.data.message) {
          alert(err.response.data.message);
          console.log(err.response.data.message);
        } else {
          alert('권한 리스트를 불러올 수 없습니다.');
        }
      })
    },

    // 페이지 이동
    fnPage(n) {
      if (this.page !== n) {
        this.page = n;
      }

      this.fnGetMemberList();
    },

    // 권한 변경
    fnAuthCommit(id, auth) {
      if (!confirm("권한을 수정하시겠습니까?")) return
      const data = {
        auth: auth
      }
      this.$axios.put(this.$serverUrl + "/member/" + id + "/auth", data).then(() => {
        alert("권한 수정에 성공했습니다.")
        this.fnGetMemberList();
      }).catch((err) => {

        // 403 권한없음 예외 처리
        if (err.response.data.status === 403) {
          console.log(err.message);
          alert("권한이 없습니다.")
        }

        // 그 외
        else {
          console.log(err.messasge);
          alert("권한 수정 실패");
        }
      })
    },

    // 사용자 삭제
    fnDeleteMember(id) {
      if (!confirm("회원을 삭제하시겠습니까?")) return
      this.$axios.delete(this.$serverUrl + '/member/' + id)
          .then(() => {
            alert("회원이 삭제됐습니다.")
            this.fnGetMemberList();
          }).catch((err) => {

        // 회원이 존재하지 않을 경우
        if (err.response.data.status === "404" && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
          this.fnGetMemberList();
        }

        // 커스텀 에러 존재시
        else if (err.response.data.status && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
          this.fnGetMemberList();
        }

        // 403 권한없음 삭제 권한이 없을 경우
        else if (err.response.data.status === 403) {
          console.log("권한이 없습니다. 로그인 페이지로 이동합니다.");
          alert("삭제 권한이 없습니다.");
        }

        // 그외
        else {
          console.log(err.message);
          alert("회원 삭제에 실패했습니다.");
        }
      })
    }
  }
}


</script>

<style scoped>

</style>