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
      contents: ''
    }
  },
  mounted() {
    this.fnGetView()
  },
  methods: {
    fnGetView() {
      if (this.idx !== undefined) {
        this.$axios.get(this.$serverUrl + '/board/' + this.idx, {
          params: this.requestBody
        }).then((res) => {
          this.title = res.data.title
          this.contents = res.data.contents
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    fnList() {
      delete this.requestBody.idx
      this.$router.push({
        path: './list',
        query: this.requestBody
      })
    },
    fnView(idx) {
      this.requestBody.idx = idx
      this.$router.push({
        path: '/board/' + idx
      })
    },
    fnSave() {
      let apiUrl = this.$serverUrl + '/board/write'
      this.form = {
        "contents": this.contents,
        "title": this.title,
      }

      const token = localStorage.getItem('user_token');
      console.log(token)

      // 생성
      //INSERT
      this.$axios.post(apiUrl, this.form, {
        headers: {
          'Authorization': `Bearer ${token}` // JWT를 헤더에 포함하여 전송
        }
      })
          .then((res) => {
            alert('글이 저장되었습니다.')
            var boardId = parseInt(res.data)
            console.log(res.data)
            this.$router.push('' + boardId)
          }).catch((err) => {
        if (err.response.status === 400) {
          alert(err.response.data);
        } else {
          alert(err.response.data);
        }
      })
    }
  }
}
</script>
<style scoped>

</style>