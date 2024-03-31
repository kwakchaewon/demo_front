<template>
  <div class="board-detail">
    <div class="board-contents">
      <input type="text" id="title" v-model="title" class="w3-input w3-border" placeholder="제목을 입력해주세요.">
    </div>
    <div class="board-contents">
      <textarea id="contents" cols="30" rows="10" v-model="contents" class="w3-input w3-border" style="resize: none;"
                placeholder="내용을 입력해주세요.">
      </textarea>
    </div>

    <!-- 기존 파일 -->
    <!--  기존 첨부파일이 존재하고 업데이트 되지 않았을 경우 기존 첨부파일 표기  -->
    <div class="board-contents" v-if="originalFile && !isUpdatedFile">
      <text>첨부파일(클릭시 다운) :</text>
      <a ref="downloadLink" href="#" @click="fnDownload">{{ originalFile }}</a>
      <button type="button" @click="deleteOriginalFile">삭제</button>
    </div>

    <div class="board-contents" v-if="originalFile && isUpdatedFile">
      <text>이전 파일 복원 :</text>
      <!-- 기존 첨부파일이 존재하고 업데이트 됐을 경우 복원 버튼 표기 -->
      <button type="button" @click="restoreOriginalFile">복원</button>
    </div>

    <!-- 업데이트 파일  -->
    <!-- 기존의 파일이 없거나 업데이트가 됐을 경우 파일 input 표기    -->
    <div class="board-contents" v-if="!originalFile || isUpdatedFile">
      <label for="file">파일:</label>
      <input ref="fileInput" type="file" id="fileInput" @change="handleFileChange">
      <button type="button" @click="resetFileInput" v-if="fileInput">삭제</button>
    </div>

    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
  </div>
</template>

<script>
import {handleErrorWithAlert, consoleError, handleAnonymousError} from "@/utils/errorHandling";
import api from "@/views/Board/api";

export default {
  data() { //변수생성
    return {
      idx: this.$route.params.id,
      isEditing: false,
      title: '',
      contents: '',
      originalFile: null, // 기존 파일
      updateFile: null, // 업데이트 이후 파일
      isUpdatedFile: false, // 파일을 업데이트 할 것인지 아닌지를 결정
      fileInput: null
    };
  },

  created() {
    if (this.idx) {
      this.isEditing = true;
    }
  },

  mounted() {
    this.fnGetView();
  },

  methods: {
    // 게시글 저장 (생성 또는 수정)
    fnSave() {
      if (this.isEditing === false) {
        this.createBoard();
      } else {
        this.fnUdpate();
      }
    },

    // 게시글 생성
    createBoard() {
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
        api.createBoard(formData)
            .then((id) => {
              alert("게시글이 저장됐습니다.");
              const boardId = parseInt(id);
              this.$router.push(`/board/` + boardId);
            })
            .catch((err) => {
              alert(err.message);
            })
      }
    },

    fnGetView() {
      // 게시글 수정일 경우 해당 게시글 불러오고 그 외는 빈칸으로
      if (this.isEditing === true) {
        this.$axios.get(this.$serverUrl + `/board/` + this.idx)
            .then((res) => {

              // 수정 게시글 불러오기 성공시
              if (res.status === 200) {

                // 게시글 작성자와 memberId가 다를경우 강제 push
                if (this.$store.state.user !== res.data.memberId) {
                  alert("수정 권한이 없습니다.")
                  this.$router.push('/board/' + this.idx);
                } else {
                  this.title = res.data.title;
                  this.contents = res.data.contents;
                  this.originalFile = res.data.originalFile;
                }
              }

              // 그 외, 분기 처리
              else {
                console.log('Unhandled status code:', res.status);
                alert("해당 게시글을 불러올 수 없습니다.");
                this.fnList();
              }

            }).catch(err => {
          const _status = err.response.data.status;

          // ResponseStatusException (게시글 부재, 404)
          if (_status === 404) {
            handleErrorWithAlert(err);
            this.fnList();
          }

          // 알 수 없는 예외 발생시
          else {
            alert('알 수 없는 오류가 발생했습니다.');
            this.fnList();
          }
        });
      }
    },

    fnUdpate() {
      // 1. 파일 변경 사항이 없다면 (isUpdatedFile == false)
      // 2. 파일 변경 사항이 있다면 (isUpdatedFile == true)
      // 2.1 삭제: 백단에서 null 일 경우 파일 삭제 처리
      // 2.2 수정: 백단에서 파일 삭제 후 생성
      const formData = new FormData();

      // 1. 파일 변경 사항이 없다면 (isUpdatedFile == false)
      if (this.isUpdatedFile === false
      ) {
        formData.append("title", this.title);
        formData.append("contents", this.contents);
        formData.append("isUpdate", this.isUpdatedFile);
      }

      // 2. 파일 변경 사항이 있다면 (isUpdatedFile == true)
      else {
        // 기존 파일 삭제
        if (this.fileInput === null) {
          formData.append("title", this.title);
          formData.append("contents", this.contents);
          formData.append("isupdate", this.isUpdatedFile);
        }
        // 새로운 파일 등록
        else {
          formData.append("title", this.title);
          formData.append("contents", this.contents);
          formData.append("isupdate", this.isUpdatedFile);
          formData.append("file", this.fileInput);
        }
      }

      const blankPattern = /^\s*$/; // 공백 유효성 검사

      if (blankPattern.test(this.title)) {
        alert("빈 제목은 사용할 수 없습니다.");
      } else if (blankPattern.test(this.contents)) {
        alert("빈 내용은 입력할 수 없습니다.");
      } else {
        this.$axios.put(this.$serverUrl + `/board/` + this.idx, formData)
            .then((res) => {

              // 게시글 수정 성공시
              if (res.status === 200) {
                alert('글이 수정되었습니다.');
                this.$router.push(`/board/` + this.idx);
              }

              // 그 외 분기처리
              else {
                console.log('Unhandled status code:', res.status);
                alert("게시글을 수정할 수 없습니다.");
              }
            }).catch((err) => {
          const _status = err.response.status;

          // AccessDeniedException(수정 권한 없음)
          if (_status === 403) {
            handleErrorWithAlert(err);
          }

          // ResponseStatusException (게시글 부재)
          else if (_status === 404) {
            handleErrorWithAlert(err);
            this.fnList();
          }
          // 기타
          else {
            alert("게시글을 수정할 수 없습니다.");
            consoleError(err);
          }
        })
      }
    },


// 파일 다운로드
    fnDownload() {
      const id = this.idx;
      this.$axios.get(this.$serverUrl + '/board/' + id + '/file',
          {responseType: 'blob'}
      ).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        this.fileUrl = url;
        const link = document.createElement('a');

        // content-disposition 으로 파일명을 설정하려 했으나 UTF8 인코딩 문제 발생
        let fileName = res.headers['content-disposition'].split('filename=')[1];
        fileName = fileName.replace(/[""]/g, '');
        console.log(fileName)

        // UTF-8 디코딩
        const decodeFileName = decodeURI(fileName);

        // 파일 다운로드시 다른이름으로 저장
        link.href = url;
        link.setAttribute('download', decodeFileName);
        document.body.appendChild(link);
        link.click();
      })
    }
    ,

    fnList() {
      this.$router.push({path: '/board',});
    }
    ,

// 업데이트 첨부파일 삭졔: 클릭시 input 내 첨부파일 삭제
    resetFileInput() {
      if (!confirm("파일을 삭제하시겠습니까?")) return
      this.$refs.fileInput.value = null;
      this.fileInput = null;
    }
    ,

// 기존 첨부파일 삭제 버튼: 클릭시 isUpdatedFile true 설정. 기존 첨부파일 숨김
    deleteOriginalFile() {
      if (!confirm("파일을 삭제하시겠습니까?")) return
      this.isUpdatedFile = true;
      console.log(this.isUpdatedFile);
    }
    ,

// 기존 첨부파일 복원 버튼: 클릭시 isUpdatedFile false 설정. 첨부파일 input 숨기고 내용 삭제.
    restoreOriginalFile() {
      if (!confirm("이전 파일로 복원하시겠습니까? 현재 첨부파일은 삭제됩니다.")) return
      this.isUpdatedFile = false;
      this.$refs.fileInput.value = null;
    }
    ,

    handleFileChange(event) {
      const files = event.target.files;
      const maxSize = 1024; // 허용되는 최대 파일 크기 (KB)

      if (files.length > 0 && files[0].size > maxSize * 1024) {
        alert("1024kb 이상은 첨부할 수 없습니다.");
        event.target.value = '';
      } else {
        console.log(event.target.files)
        this.fileInput = event.target.files[0];
        this.isUpdatedFile = true;
      }
    }
    ,
  }
}

</script>
<style scoped>

</style>