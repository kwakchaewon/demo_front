<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnSave">저장</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
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

      <!-- 기존 첨부파일이 존재하고 업데이트 됐을 경우 복원 버튼 표기 -->
<!--      <button type="button" @click="restoreOriginalFile" v-if="originalFile && isUpdatedFile">복원</button>-->
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
      <button type="button" @click="resetFileInput">삭제</button>
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
      contents: '',
      originalFile: null, // 기존 파일
      updateFile: null, // 업데이트 이후 파일
      isUpdatedFile:false, // 파일을 업데이트 할 것인지 아닌지를 결정
      fileInput: null
    };
  },
  mounted() {
    this.fnGetView();
  },
  methods: {
    fnGetView() {
      // URL 에서 게시글 ID 가져옴
      const postId = this.$route.params.id;

      // 해당 게시글 불러오기
      this.$axios.get(this.$serverUrl + `/board/${postId}`)
          .then(response => {
            this.title = response.data.title;
            this.contents = response.data.contents;
            this.originalFile = response.data.originalFile;
          })
          .catch(err => {
            if (err.response.data.status === "400" && err.response.data.message) {
              console.log(err.response.data.message);
              alert(err.response.data.message);
            }
            // BOARD_NOTFOUND
            else if (err.response.data.status === "404" && err.response.data.message) {
              console.log(err.response.data.message);
              alert(err.response.data.message);
              this.fnList();
            } else if (err.response.data.status && err.response.data.message) {
              console.log(err.response.data.message);
              alert(err.response.data.message);
            } else {
              alert('알 수 없는 오류가 발생했습니다.');
            }
          });
    },

    fnSave() {
      // 1. 파일 변경 사항이 없다면 (isUpdatedFile == false)
      // 2. 파일 변경 사항이 있다면 (isUpdatedFile == true)
      // 2.1 삭제: 백단에서 null 일 경우 파일 삭제 처리
      // 2.2 수정: 백단에서 파일 삭제 후 생성

      const postId = this.$route.params.id;
      const formData = new FormData();

      // 1. 파일 변경 사항이 없다면 (isUpdatedFile == false)
      if (this.isUpdatedFile===false){
        formData.append("title", this.title);
        formData.append("contents", this.contents);
        formData.append("isUpdate", this.isUpdatedFile);
      }

      // 2. 파일 변경 사항이 있다면 (isUpdatedFile == true)
      else {
          // 기존 파일 삭제
          if(this.fileInput === null){
            console.log("?")
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
        console.log(formData.get("isUpdate"));
        console.log(formData.get("title"));
        this.$axios.put(this.$serverUrl + `/board/${postId}`, formData)
            .then(() => {
              alert('글이 수정되었습니다.');
              this.$router.push(`/board/${postId}`);
            }).catch((err) => {

          // NO_AUTHORIZATION: 권한 검증 실패시, alert 반환
          if (err.response.data.status === "403" && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
          }

          // BOARD_NOTFOUND: 게시글 부재시, alert 반환 및 리스트로
          else if (err.response.data.status === "404" && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
            this.fnList();
          }

          // FILE_IOFAILED: 파일 입출력 실패시, alert 반환
          else if (err.response.data.status === "500" && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
            this.fnList();
          }

          // 그 외 Custom Exception 발생시 alert 반환
          else if (err.response.data.status && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
          }

          // 기타
          else {
            console.log('수정에 실패했습니다.');
            alert('수정에 실패했습니다.');
          }
        })
      }
    },

    // 파일 다운로드
    fnDownload() {
      const id = this.$route.params.id;
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
    },

    fnList() {
      this.$router.push({path: '/board',});
    },

    // 업데이트 첨부파일 삭졔: 클릭시 input 내 첨부파일 삭제
    resetFileInput(){
      if (!confirm("파일을 삭제하시겠습니까?")) return
      this.$refs.fileInput.value = null;
    },

    // 기존 첨부파일 삭제 버튼: 클릭시 isUpdatedFile true 설정. 기존 첨부파일 숨김
    deleteOriginalFile(){
      if (!confirm("파일을 삭제하시겠습니까?")) return
      this.isUpdatedFile = true;
      console.log(this.isUpdatedFile);
    },

    // 기존 첨부파일 복원 버튼: 클릭시 isUpdatedFile false 설정. 첨부파일 input 숨기고 내용 삭제.
    restoreOriginalFile(){
      if (!confirm("이전 파일로 복원하시겠습니까? 현재 첨부파일은 삭제됩니다.")) return
      this.isUpdatedFile = false;
      this.$refs.fileInput.value = null;
    },

    handleFileChange(event) {
      const files = event.target.files;
      const maxSize = 1024; // 허용되는 최대 파일 크기 (KB)

      if (files.length > 0 && files[0].size > maxSize * 1024){
        alert("1024kb 이상은 첨부할 수 없습니다.");
        event.target.value = '';
      } else {
        console.log(event.target.files)
        this.fileInput = event.target.files[0];
        this.isUpdatedFile = true;
      }
    },
  }
}

</script>
<style scoped>

</style>