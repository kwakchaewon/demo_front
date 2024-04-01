<template>
  <div class="container my-3">
    <h2 class="border-bottom py-2">{{ board.title }}</h2>
    <div class="card my-3">
      <div class="card-body">
        <img :src="this.fileUrl" width="80%" style="margin: auto; display: block" v-if="this.fileUrl !== null">
        <div class="card-text" style="white-space: pre-line;">{{ board.contents }}</div>
        <div class="d-flex justify-content-end">
          <div class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">작성자</div>
            <div>{{ board.memberId }}</div>
          </div>
          <div class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">작성일</div>
            <div>{{ board.createdAt }}</div>
          </div>
          <div v-if="board.updatedAt" class="badge bg-light text-dark p-2 text-start mx-3">
            <div class="mb-2">수정일</div>
            <div>{{ board.updatedAt }}</div>
          </div>
        </div>
        <div class="my-3" v-if="board.originalFile">
          <text>첨부파일(클릭시 다운) :</text>
          <a href="#" @click="fnDownload">{{ board.originalFile }}</a>
        </div>
        <div class="my-3">
          <button class="btn btn-sm btn-outline-secondary" v-on:click="goUpdate"
                  v-if="board.memberId === this.$store.state.user">수정
          </button>
          <button class="btn btn-sm btn-outline-secondary" v-on:click="DeleteBoard"
                  v-if="board.memberId === this.$store.state.user">삭제
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
import {handleErrorWithAlert, consoleError} from "@/utils/errorHandling";
import api from "@/views/Board/api";


export default {
  components: {
    Comment
  },
  data() {
    return {
      id: this.$route.params.id,
      board: {},
      fileUrl: null
    }
  },

  created() {
    this.fetchBoardDetail();
  },

  mounted() {
    this.fetchBoardImage();
  },
  methods: {
    // 게시글 상세 조회 (완료)
    fetchBoardDetail() {
      api.fetchBoardDetail(this.id)
          .then((board) => {
            this.board = board;
          })
          .catch((err) => {
            alert(err.message);
            this.fnList();
          })
    },

    // 게시글 이미지 출력
    fetchBoardImage() {
      const id = this.$route.params.id;

      api.fetchBoardImage(id)
          .then((imageUrl) => {
            this.fileUrl = imageUrl;
          })
          .catch((err) => {
            // 이미지 파일 추출에 실패 할경우 alert 메시지
            alert(err.message);
          })
    },

// 파일 다운로드
    fnDownload() {
      const id = this.id
      this.$axios.get(this.$serverUrl + '/board/' + id + '/file',
          {responseType: 'blob'}
      ).then((res) => {

        // 파일 다운로드 성공시
        if (res.status === 200) {
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
        }
        // 파일 다운로드 실패시 분기처리
        else {
          console.log('Unhandled status code:', res.status);
          alert("파일 다운로드에 실패했습니다.")
        }
        // 파일 다운로드 실패시, alert 경고문
      }).catch((err) => {

        // IOException, UnsupportedEncodingException
        if (err.response.status === 500) {
          consoleError(err);
          alert("파일 다운로드에 실패했습니다.");
        }

        // ResponseStatusException 파일 부재시
        else if (err.response.status === 404) {
          alert("게시글이 존재하지 않습니다. 게시글 리스트로 돌아갑니다.");
          consoleError(err);
          this.fnList();
        } else {
          handleErrorWithAlert(err);
        }
      })
    },

    fnList() {
      this.$router.push({
        path: '/board',
      });
    },

    // 수정 페이지 이동
    goUpdate() {
      this.$router.push('./write/' + this.$route.params.id);
    },

    // 게시글 삭제
    DeleteBoard() {
      if (!confirm("삭제하시겠습니까?")) return
      api.DeleteBoard(this.$route.params.id)
          .then((message) => {
            alert(message);
            this.fnList();
          })
          .catch((err) => {
            alert(err.message);

            // 삭제된 게시글일 경우 리스트로 이동
            if (err.message === "삭제된 게시글입니다.") {
              this.fnList();
            }
          })
    },
  }
}
</script>
<style scoped>

</style>