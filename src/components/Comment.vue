<template>
  <div class="container my-3">
    <h5 class="border-bottom my-3 py-2">댓글</h5>
    <div class="card my-3" v-for="(row, id) in list" :key="id">
      <div class="card-body">
        <div class="card-text" style="white-space: pre-line;">{{ row.contents }}</div>
        <div class="d-flex justify-content-end">
          <div class="badge bg-light text-dark p-2 text-start">
            <div>{{ row.createdAt }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card my-3">
      <div class="board-contents">
      <textarea id="" cols="30" rows="3" v-model="contents" class="w3-input w3-border" style="resize: none;"
                placeholder="내용을 입력해주세요.">
      </textarea>
      </div>
      <div class="common-buttons">
        <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'Comment',

  data() { //변수생성
    return {
      list: {}
    }
  },
  mounted() {
    this.fnGetview()
  },
  methods: {
    // 댓글 리스트
    fnGetview() {
      const id = this.$route.params.id
      console.log(this.$serverUrl + "/board/" + id + "/comment")
      this.$axios.get(this.$serverUrl + "/board/" + id + "/comment").then((res) => {
        console.log(res.data)
        this.list = res.data
      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    },

    // 댓글 저장
    fnSave() {

    }
  }
}
</script>
<style scoped>

</style>