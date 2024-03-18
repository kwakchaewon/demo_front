<template>
  <br>
  <h2 class="border-bottom py-2">회원 관리</h2>
  <table class="table">
    <thead class="table-dark">
    <tr class="text-center">
      <th>번호</th>
      <th style="width:30%">아이디</th>
      <th>이메일</th>
      <th>생성일자</th>
      <th>관리</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(row, id) in members" :key="id" class="text-center">
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
  <br>
</template>
<script>
export default {
  name: 'AdminMember',

  data() {
    return{
      members: {}
    }
  },

  mounted() {
    this.fnGetMemberList();
  },

  methods: {
    // 사용자 조회
    fnGetMemberList() {
      console.log(1)
      console.log(this.$serverUrl)
      this.$axios.get(this.$serverUrl + '/admin')
          .then((res) => {
            console.log(2)
            this.members = res.data;
            console.log(3)
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
    fnDeleteMember(id) {
      if (!confirm("회원을 삭제하시겠습니까?")) return
      this.$axios.delete(this.$serverUrl + '/admin/member/' + id)
          .then(() => {
            this.fnGetMemberList();
          }).catch(() => {
        alert("사용자 삭제에 실패했습니다.");
        console("사용자 삭제에 실패했습니다.");
      })
    },
  }
}
</script>
<style scoped>

</style>