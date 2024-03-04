<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
    <div class="board-contents">
      <input type="text" id="title" v-model="title" name='title' class="w3-input w3-border" placeholder="제목을 입력해주세요.">
    </div>
    <div class="board-contents">
      <textarea id="contents" name='contents' cols="30" rows="10" v-model="contents" class="w3-input w3-border" style="resize: none;"
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
import Cookies from 'js-cookie';

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
          if (err.response.data.status && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
          } else {
            console.log("알 수 없는 오류가 발생했습니다.");
            alert("알 수 없는 오류가 발생했습니다.");
          }
        })
      }
    },

    fnList() {
      this.$router.push({
        path: '/board',
      })
    },

    fnSave() {
      let apiUrl = this.$serverUrl + '/board'
      this.form = {
        "contents": this.contents,
        "title": this.title,
      }
      var blankPattern = /^\s*$/ // 공백 유효성 검사

      if (blankPattern.test(this.title)) {
        alert("빈 제목은 사용할 수 없습니다.")
      } else if (blankPattern.test(this.contents)) {
        alert("빈 내용은 입력할 수 없습니다.")
      }

      else {
        const token = Cookies.get('ACCESS_TOKEN');

        // 생성
        //INSERT
        this.$axios.post(apiUrl, this.form, {
          headers: {
            'Authorization': `Bearer ${token}` // JWT를 헤더에 포함하여 전송
          }
        })
            .then((res) => {
              alert('글이 저장되었습니다.')
              var boardId = parseInt(res.data.id)
              this.$router.push('' + boardId)
            }).catch((err) => {
          // ONLY_BLANk
          if (err.response.data.status && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
          }
          else {
            console.log("알 수 없는 오류가 발생했습니다.");
            alert("알 수 없는 오류가 발생했습니다.");
          }
        })
      }
    }
  }
}
</script>
<style scoped>

</style>