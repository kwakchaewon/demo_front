<template>
  <div class="board-detail">
    <form @submit.prevent="fnSave" enctype="multipart/form-data">
      <div class="common-buttons">
        <button type="button" class="w3-button w3-round w3-blue-gray">저장</button>&nbsp;
        <button type="button" class="w3-button w3-round w3-gray">목록</button>
      </div>
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
        <input type="file" id="file" @change="handleFileChange">
      </div>

      <!--<div class="board-contents">-->
      <!--    <tr>-->
      <!--      <th>첨부파일</th>-->
      <!--      <td colspan="3">-->
      <!--        <div class="file_list" ref="file_list">-->
      <!--          <div>-->
      <!--            <div class="file_input">-->
      <!--              <input type="text" readonly />-->
      <!--              <label> 첨부파일-->
      <!--                <input type="file" name="files" v-on:change="fnSelectFile" />-->
      <!--&lt;!&ndash;                <input type="file" name="files" v-model="selectedFile" @change="fnSelectFile(this)" />&ndash;&gt;-->
      <!--              </label>-->
      <!--              <button type="button" v-on:click="removeFile" class="btns del_btn"><span>삭제</span></button>-->
      <!--              <div v-for="(d,i) in addFileList" v-bind:key="d">-->
      <!--                <div class="file_input">-->
      <!--                  <input type="text" readonly />-->
      <!--                  <label> 첨부파일-->
      <!--                    <input id="file" type="file" name="files" v-on:change="fnSelectFile($event, i)"/>-->
      <!--                  </label>-->
      <!--                  <button type="button" v-on:click="removeFile(i)" class="btns del_btn"><span>삭제</span></button>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            <button type="button" v-on:click="addFile" class="btns fn_add_btn"><span>파일 추가</span></button>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </td>-->
      <!--    </tr>-->
      <!--</div>-->

      <!--    <div class="file_input board-contents">-->
      <!--      <label> 첨부파일-->
      <!--        <input type="file" id="files" name="files" @onchange="fnSelectFile(this)"/>-->
      <!--      </label>-->
      <!--    </div>-->
      <!--    <button type="button" @click="removeFile(this);" class="btns del_btn"><span>삭제</span></button>-->
      <!--    <button type="button" @click="addFile" class="btns fn_add_btn"><span>파일 추가</span></button>-->
      <div class="common-buttons">
        <button type="submit" class="w3-button w3-round w3-blue-gray">저장</button>&nbsp;
        <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
      </div>
    </form>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  data() { //변수생성
    return {
      title: '',
      contents: '',
      file: null
      // files: [],
      // addFileList: [{
      //   file: ''
      // }]
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
          this.title = res.data.title;
          this.contents = res.data.contents;
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
      const apiUrl = this.$serverUrl + '/board'

      const formData = new FormData();
      formData.append("title", this.title);
      formData.append("contents", this.contents);

      if (this.file){
        formData.append("file", this.file);
      }
      // formData.append("title", this.title)

      // this.form = {
      //   "contents": this.contents,
      //   "title": this.title,
      //   "file":this.file
      // }

      console.log(this.form);
      const blankPattern = /^\s*$/ // 공백 유효성 검사

      if (blankPattern.test(this.title)) {
        alert("빈 제목은 사용할 수 없습니다.");
      } else if (blankPattern.test(this.contents)) {
        alert("빈 내용은 입력할 수 없습니다.");
      } else {
        const token = Cookies.get('ACCESS_TOKEN');

        // 생성
        //INSERT
        this.$axios.post(apiUrl, formData, {
          headers: {
            'Content-Type':'multipart/form-data', // context-type 설정
            'Authorization': `Bearer ${token}` // JWT를 헤더에 포함하여 전송
          }
        })
            .then((res) => {
              alert('글이 저장되었습니다.');
              const boardId = parseInt(res.data.id);
              this.$router.push('' + boardId);
            }).catch((err) => {
          // ONLY_BLANk
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

    handleFileChange(event) {
      console.log(event.target.files)
      this.file = event.target.files[0];
    }

    // // 파일 선택
    // fnSelectFile(element) {
    //
    //   console.log(element)
    //   console.log(1)
    //
    //   const file = element.target.files[0];
    //   console.log(file)
    //   const filename = element.target.closest('.file_input').firstElementChild;
    //
    //   // 1. 파일 선택 창에서 취소 버튼이 클릭된 경우
    //   if (!file) {
    //     filename.value = '';
    //     return false;
    //   }
    //
    //   // 2. 파일 크기가 10MB를 초과하는 경우
    //   const fileSize = Math.floor(file.size / 1024 / 1024);
    //   if (fileSize > 10) {
    //     alert('10MB 이하의 파일로 업로드해 주세요.');
    //     filename.value = '';
    //     element.value = '';
    //     return false;
    //   }
    //   // 3. 파일명 지정
    //   filename.value = file.name;
    // },

    // // 파일 추가
    // addFile() {
    //   // const fileDiv = document.createElement('div');
    //   this.addFileList.push(0);
    //   // document.querySelector('.file_list').appendChild(fileDiv);
    // },

    // removeFile(i) {
    //   console.log(i)
    //   // this.addFileList = this.addFileList.filter((v, idx) => idx !== i)
    //   this.addFileList.splice(i,1);
    //
    // }
  }
}
</script>
<style scoped>

</style>