<template>
  <main>
    <section class="jumbotron text-center">
      <div class="board-list">
        <table class="w3-table-all">
          <thead>
          <tr>
            <th>No</th>
            <th>아이디</th>
            <th>이메일</th>
            <th>생성일자</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, id) in list" :key="id">
            <td>{{ row.id }}</td>
            <td>{{ row.userId }}</td>
            <td>{{ row.email }}</td>
            <td>{{ row.createdAt }}</td>
            <td>
              <button class="delete-btn" @click="fnDeleteMember(`${row.id}`)">삭제</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script>

export default {
  data() {
    return {
      list: {}
    }
  },
  mounted() {
    this.fnGetMemberList();
  },
  methods: {
    fnGetMemberList() {
      this.$axios.get(this.$serverUrl + '/admin')
          .then((res) => {
            this.list = res.data;
            // alert("admin 접속 완료");
          }).catch((err) => {
        if (err.response.status === 403) {
          // console.log(err.response);
          alert("일반 사용자는 접근 불가합니다");
          this.$router.push({name: 'BoardList'})
        } else {
          alert("알 수 없는 오류가 발생했습니다.");
          this.$router.push({name: 'BoardList'})
        }
      })
    },

    // 사용자 삭제
    fnDeleteMember(id){
      this.$axios.delete(this.$serverUrl + '/admin/member/'+id)
          .then(() => {
            this.fnGetMemberList();
          }).catch(() => {
        alert("사용자 삭제에 실패했습니다.");
        console("사용자 삭제에 실패했습니다.");
      })
    }
  }
}

</script>

<style scoped>

</style>