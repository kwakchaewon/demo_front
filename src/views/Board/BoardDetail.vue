<template>
  <div class="container my-3">
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
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnCheckUpdate"
                  v-if="this.memberId == this.$store.state.user">수정
          </button>
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnDelete"
                  v-if="this.memberId == this.$store.state.user">삭제
          </button>
          <button class="btn btn-sm btn-outline-secondary" v-on:click="fnList">목록</button>
        </div>
      </div>
    </div>
  </div>
  <Comment/>
</template>

<script>
import Comment from "@/components/Comment.vue";
import {handleErrorWithAlert, consoleError, handleAnonymousError} from "@/utils/errorHandling";

export default {
  components: {
    Comment
  },
  data() {
    return {
      idx: this.$route.query.idx,
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
  mounted() {
    this.fnGetView();
    this.fnGetImgfile();
  },
  methods: {

    // 게시글 상세
    fnGetView() {
      console.log(this.idx)
      const id = this.$route.params.id;
      this.$axios.get(this.$serverUrl + '/board/' + id)
          .then((res) => {
            // 게시글 상세 조회 성공시
            if (res.status === 200) {
              this.id = res.data.id; // 아이디
              this.title = res.data.title; // 제목
              this.contents = res.data.contents; // 내용
              this.createdAt = res.data.createdAt; // 작성일
              this.updatedAt = res.data.updatedAt; // 수정일
              this.memberId = res.data.memberId; // 작성자
              this.originalFile = res.data.originalFile; // 첨부파일명
            }
            // 그 외, 분기 처리
            else {
              console.log('Unhandled status code:', res.status);
              alert("게시글 상세를 불러올 수 없습니다.");
              this.fnList();
            }
          }).catch((err) => {
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
      })
    },

    // 이미지 파일 출력
    fnGetImgfile() {
      const id = this.$route.params.id;
      this.$axios.get(this.$serverUrl + '/board/' + id + '/image', {responseType: 'blob'})
          .then((res) => {
            // 이미지 파일 출력 성공시
            if (res.status === 200) {
              // 1. Blob 으로 받아온 데이터로 ULR 생성 후 fileUrl 에 바인딩
              const url = URL.createObjectURL(new Blob([res.data]));
              this.fileUrl = url;
            }
            // 그 외 분기 처리
            else {
              console.log('Unhandled status code:', res.status);
              alert("이미지 파일을 불러올 수 없습니다.");
            }
          }).catch((err) => {
        const _status = err.response.status;

        // FileNotFoundException (게시글 / 이미지 파일 부재 / 파일 부재, 404), IoException (파일 입출력 실패, 500)
        if (_status === 404 || _status === 500) {
          // response 타입을 blob 으로 받을 경우 exception 메시지가 출력되지 않음
          console.log("이미지 파일을 출력할 수 없습니다.");
        }

        // 그 외 Exception 발생시 log 출력
        else {
          consoleError(err);
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

        // content-disposition 으로 파일명을 설정
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
        } else {
          alert("파일을 다운로드 할 수 없습니다.");
        }
      })
    },

    fnList() {
      this.$router.push({
        path: '/board',
      });
    },

    // 게시글 수정 권한 확인
    fnCheckUpdate() {
      const id = this.$route.params.id;
      this.$axios.get(this.$serverUrl + '/board/' + id + '/check')
          .then((res) => {
            // 게시글 수정 권한 확인 성공시
            if (res.status === 200) {
              this.$router.push({path: './write/' + id,});
            }
            // 그외 분기 처리
            else {
              console.log('Unhandled status code:', res.status);
              alert("게시글을 수정할 수 없습니다.");
            }
          }).catch((err) => {

        const _status = err.response.status;

        // AccessDeniedException(삭제 권한 없음)
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
          alert("수정할 수 없는 게시글입니다.");
          consoleError(err);
        }
      })
    },

    // 게시글 삭제
    fnDelete() {
      if (!confirm("삭제하시겠습니까?")) return
      const id = this.$route.params.id;
      this.$axios.delete(this.$serverUrl + '/board/' + id)
          .then((res) => {
            // 이미지 파일 출력 성공시
            if (res.status === 200) {
              alert('삭제되었습니다.');
              this.fnList();
            }
            // 그 외 분기 처리
            else {
              console.log('Unhandled status code:', res.status);
              alert("게시글 삭제에 실패했습니다.");
            }
          }).catch((err) => {
        const _status = err.response.status;

        // AccessDeniedException(삭제 권한 없음)
        if (_status === 403) {
          handleErrorWithAlert(err);
        }
        // ResponseStatusException (게시글 부재)
        else if (_status === 404) {
          handleErrorWithAlert(err);
          this.fnList();
        } else {
          alert("삭제에 실패했습니다.")
          handleAnonymousError(err);
        }
      })
    },
  }
}
</script>
<style scoped>

</style>