<template>
  <div class="board-detail">
    <form @submit.prevent="fnSave" enctype="multipart/form-data">
      <div class="board-contents">
        <input type="text" id="title" v-model="title" name='title' class="w3-input w3-border" placeholder="제목을 입력해주세요.">
      </div>
      <div class="board-contents">
      <textarea id="contents" name='contents' cols="30" rows="10" v-model="contents" class="w3-input w3-border"
                style="resize: none;"
                placeholder="내용을 입력해주세요.">
      </textarea>
      </div>
      <div class="board-contents">
        <label for="file">파일:</label>
        <input ref="fileInput" type="file" id="fileInput" @change="handleFileChange">
        <button type="button" v-if="fileInput" @click="resetFileInput">삭제</button>
      </div>
      <div class="common-buttons">
        <button type="submit" class="w3-button w3-round w3-blue-gray">저장</button>&nbsp;
        <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
      </div>
    </form>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import {handleErrorWithAlert, handleAnonymousError} from "@/utils/errorHandling";

export default {
  data() {
    return {
      title: '', // 제목
      contents: '', // 내용
      fileInput: null, // 첨부파일
    }
  },

  methods: {
    fnList() {
      this.$router.push({
        path: '/board',
      })
    },

    // 게시글 등록
    fnSave() {
      const apiUrl = this.$serverUrl + '/board'
      const formData = new FormData();

      formData.append("title", this.title);
      formData.append("contents", this.contents);

      if (this.fileInput) {
        formData.append("file", this.fileInput);
      }

      const blankPattern = /^\s*$/ // 공백 유효성 검사

      if (blankPattern.test(this.title)) {
        alert("빈 제목은 사용할 수 없습니다.");
      } else if (blankPattern.test(this.contents)) {
        alert("빈 내용은 입력할 수 없습니다.");
      } else {

        const token = Cookies.get('ACCESS_TOKEN');

        this.$axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        })
            .then((res) => {
              if (res.status === 200) {
                alert('글이 저장됐습니다.');
                const boardId = parseInt(res.data.id);
                this.$router.push('' + boardId);
              } else {
                console.log('Unhandled status code:', res.status);
                alert("게시글 저장에 실패했습니다.");
              }
            }).catch((err) => {
          const _status = err.response.data.status;

          // IllegalArgumentException(유효성 검사, 500), UsernameNotFoundException(계정 실패, 404), IoException(입출력 실패, 500)
          if (_status === 404 || _status === 500) {
            handleErrorWithAlert(err);
          }
          // 알 수 없는 에러 발생 시
          else {
            handleAnonymousError(err);
          }
          
        })
      }
    },

    // 첨부파일 등록
    handleFileChange(event) {
      const files = event.target.files;
      const maxSize = 1024; // 허용되는 최대 파일 크기 (KB)

      // 파일 최대 용량 1024 KB
      if (files.length > 0 && files[0].size > maxSize * 1024) {
        alert("1024kb 이상은 첨부할 수 없습니다.");
        event.target.value = '';
      } else {
        console.log(event.target.files)
        this.fileInput = event.target.files[0];
      }
    },

    // 첨부파일 초기화
    resetFileInput() {
      if (!confirm("파일을 삭제하시겠습니까?")) return
      this.$refs.fileInput.value = null;
      this.fileInput = null
    }

  }
}
</script>
<style scoped>

</style>