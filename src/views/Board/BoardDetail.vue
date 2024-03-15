<template>
  <div class="container my-3">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray"></button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray"></button>
    </div>

    <h2 class="border-bottom py-2">{{ title }}</h2>
    <div class="card my-3">
      <div class="card-body">
        <img :src="fileUrl" width="80%" style="margin: auto; display: block" v-if="fileUrl">
        <div class="card-text" style="white-space: pre-line;">{{ contents }}</div>
        <div class="d-flex justify-content-end">
          <div class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">작성자</div>
            <div>{{ memberId }}</div>
          </div>
          <div class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">작성일</div>
            <div>{{ createdAt }}</div>
          </div>
          <div v-if="this.updatedAt" class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">수정일</div>
            <div>{{ updatedAt }}</div>
          </div>
        </div>
        <div class="my-3" v-if="originalFile">
          <text>첨부파일(클릭시 다운) :</text>
          <a href="#" @click="fnDownload">{{ originalFile }}</a>
        </div>
        <div class="my-3">
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnCheckUpdate">수정</button>
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnDelete">삭제</button>
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnList">목록</button>
        </div>
      </div>
    </div>
  </div>
  <Comment/>
</template>

<script>
import Comment from "@/components/Comment.vue";

export default {
  components: {
    Comment
  },
  data() {
    return {
      id: '', //
      title: '', // 제목
      contents: '', // 내용
      createdAt: '', // 작성일
      updatedAt: '', // 수정일
      memberId: '', // 작성자
      originalFile: '', // 첨부파일명
      fileUrl: null
    }
  },
  computed: {
    // resolvedImgPath() {
      // 여기서 동적으로 이미지 경로를 처리
      // 실제 사용 시에는 웹팩이 파일 시스템의 절대 경로를 이해하지 못하므로,
      // 상대 경로나 정적 자원 경로를 사용해야 합니다.
      // return require(`${this.imgPath}`);
    // },
  },
  mounted() {
    this.fnGetView();
    this.fnGetImgfile();
  },
  methods: {

    // 게시글 상세
    fnGetView() {
      const id = this.$route.params.id;
      this.$axios.get(this.$serverUrl + '/board/' + id)
          .then((res) => {
            this.id = res.data.id;
            this.title = res.data.title;
            this.contents = res.data.contents;
            this.createdAt = res.data.createdAt;
            this.updatedAt = res.data.updatedAt;
            this.memberId = res.data.memberId;
            this.originalFile = res.data.originalFile;
          }).catch((err) => {
        // BOARD_NOTFOUND: 에러 메시지 출력 및 리스트로 이동
        if (err.response.data.status === "404" && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
          this.fnList()
        }
        else if(err.response.data.message){
          alert('알 수 없는 오류가 발생했습니다.');
          this.fnList();
        }
        else {
          alert('알 수 없는 오류가 발생했습니다.');
          this.fnList();
        }
      })
    },

    // 이미지 파일 출력
    fnGetImgfile() {
      const id = this.$route.params.id;
      this.$axios.get(this.$serverUrl + '/board/' + id + '/image', {responseType: 'blob'})
          .then((res) => {
            // 1. Blob 으로 받아온 데이터로 ULR 생성 후 fileUrl 에 바인딩
            const url = URL.createObjectURL(new Blob([res.data]));
            this.fileUrl = url;
          }).catch((err) => {

        // 2. IMAGE_NOTFOUND, BOARD_NOTFOUND, : 이미지 부재시, log 출력
        if (err.response.data.status === "404" && err.response.data.message) {
          console.log(err.response.data.message);
        }

        // 3. FILE_IOFAILED: 파일 입출력 실패시, alert & log 출력
        else if (err.response.data.status === "500" && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        }

        // 4. 그 외 Custom Exception 발생시 log 출력
        else if (err.response.data.status && err.response.data.message) {
          console.log(err.response.data.message);
        } else {
          console.log(err);
          console.log("이미지를 찾을 수 없습니다.");
        }
      })
    },

    // 파일 다운로드
    fnDownload() {
      const id = this.id
      this.$axios.get(this.$serverUrl + '/board/' + id + '/file',
          {responseType: 'blob'}
      ).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
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

        // 파일 다운로드 실패시, alert 경고문
      }).catch((err) => {
        console.log(err.response);
        if (err.response.status === 500) {
          alert("파일을 다운로드 할 수 없습니다.");
        }
        if (err.response.status === 404) {
          alert("존재하지 않는 게시글입니다.");
          this.fnList();
        }
        else {
          alert("파일을 다운로드 할 수 없습니다.");
        }
      })
    },

    fnList() {
      this.$router.push({
        path: '/board',
      });
    },

    fnCheckUpdate() {
      const id = this.$route.params.id;
      this.$axios.get(this.$serverUrl + '/board/' + id + '/check')
          .then(() => {
            this.$router.push({path: './' + id + '/update',});
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

        // 그 외 Custom Exception 발생시 alert 반환
        else if (err.response.data.status && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        }

        // 기타
        else {
          console.log("수정 권한 검증에 실패했습니다.");
          alert('수정 권한 검증에 실패했습니다.');
        }
      })
    },

    fnDelete() {
      if (!confirm("삭제하시겠습니까?")) return
      const id = this.$route.params.id;
      this.$axios.delete(this.$serverUrl + '/board/' + id)
          .then(() => {
            alert('삭제되었습니다.');
            this.fnList();
          }).catch((err) => {

        // NO_AUTHORIZATION: 권한 검증 실패시, alert 반환
        if (err.response.data.status === "403" && err.response.data.message) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
        }

        // BOARD_NOTFOUND, FILE_NOTFOUND: 게시글/파일 부재시, alert 반환 및 리스트로
        else if (err.response.data.status === "404" && err.response.data.message) {
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
          console.log('삭제에 실패했습니다.');
          alert('삭제에 실패했습니다.');
        }
      })
    },
  }
}
</script>
<style scoped>

</style>