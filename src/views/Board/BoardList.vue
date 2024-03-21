`
<template>
  <main>
    <div class="container my-3">
      <h2 class="border-bottom py-2">자유 게시판</h2>
      <table class="table">
        <span v-if="!paging.totalListCnt || list.length === 0">게시글이 존재하지 않습니다.</span>
        <thead class="table-dark">
        <tr class="text-center">
          <th>번호</th>
          <th style="width:50%">제목</th>
          <th>작성자</th>
          <th>작성일</th>
        </tr>
        </thead>
        <tbody>
        <tr class="text-center" v-for="(row, id) in list" :key="id">
          <td>{{ paging.totalListCnt - (paging.page * paging.pageSize) - id + 10 }}</td>
          <td><a v-on:click="fnView(`${row.id}`)">{{ row.title }}</a></td>
          <td>{{ row.memberId }}</td>
          <td>{{ row.createdAt }}</td>
        </tr>
        </tbody>
      </table>

      <div class="row my-3" style="justify-content: center;">
        <div class="col-6">
          <div class="input-group">
            <input ref="keyword" type="text" id="search_keyword" class="form-control" v-bind:value="keyword"
                   @keyup.enter="fnKeywordSearch">
            <button class="btn btn-outline-secondary" type="button" id="btn_search" v-on:click="fnKeywordSearch">찾기
            </button>
          </div>
        </div>
      </div>

      <!-- 페이징 처리 시작 -->
      <div class="pagination w3-bar w3-padding-16 w3-small" v-if="paging.totalListCnt > 0  && list.length > 0"
           style="justify-content: center">
                  <span class="pg">
                  <a href="javascript:;" @click="fnPage(1)" class="first w3-button w3-border">처음</a>
                  <a href="javascript:;" v-if="paging.startPage > 10" @click="fnPage(`${paging.startPage-1}`)"
                     class="prev w3-button w3-border">이전</a>
                  <template v-for=" (n,index) in paginavigation()">
                      <template v-if="paging.page==n">
                          <strong class="w3-button w3-border w3-green" :key="index">{{ n }}</strong>
                      </template>
                      <template v-else>
                          <a class="w3-button w3-border" href="javascript:;" @click="fnPage(`${n}`)" :key="index">
                            {{ n }}
                          </a>
                      </template>
                  </template>
                  <a v-if="paging.totalPageCnt > paging.endPage"
                     @click="fnPage(`${paging.endPage+1}`)" class="next w3-button w3-border">다음</a>
                  <a @click="fnPage(`${paging.totalPageCnt}`)" class="last w3-button w3-border">끝</a>
                  </span>
      </div>

      <!-- 등록 버튼 -->
      <div class="common-buttons">
        <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnWrite">등록</button>
      </div>
    </div>
    <br>
  </main>
</template>
<script>
export default {
  data() { //변수생성
    return {
      requestBody: {}, //리스트 페이지 데이터전송
      list: {}, //리스트 데이터
      no: '', //게시판 숫자처리
      paging: {
        block: 0,
        endPage: 0,
        nextBlock: 0,
        page: 0,
        pageSize: 0,
        prevBlock: 0,
        startIndex: 0,
        startPage: 0,
        totalBlockCnt: 0,
        totalListCnt: 0,
        totalPageCnt: 0,
      }, //페이징 데이터
      page: this.$route.query.page ? this.$route.query.page : 1,
      size: this.$route.query.size ? this.$route.query.size : 10,
      // page: this.$route.params.page ? this.$route.params.page : 1,
      keyword: this.$route.query.keyword ? this.$route.query.keyword : '',

      paginavigation: function () { //페이징 처리 for문 커스텀
        const pageNumber = [];
        const startPage = this.paging.startPage;
        const endPage = this.paging.endPage;
        for (let i = startPage; i <= endPage; i++) pageNumber.push(i);
        return pageNumber;
      }
    }
  },
  // watch:{
  //   'queryPage':'fnGetList'
  // },
  // created() {
  // console.log(history.state);
  // console.log(this.$router.params.page)
  // },

  mounted() {
    this.fnGetList();
  },
  // computed:{
  //   queryPage(){
  //     console.log(1)
  //     // console.log(this.$route.query)
  //     // this.page = this.$route.query;
  //     return this.$route.query.page;
  //   }
  // },
  // beforeUpdate() {
  //   this.fnGetList();
  // },
  methods: {
    fnGetList() {
      this.requestBody = { // 데이터 전송
        keyword: this.keyword,
        // page: this.page,
        // page: this.$route.query.page,
        page: this.page,
        size: this.size
      }
      this.$axios.get(this.$serverUrl + "/board", {
        params: this.requestBody,
        headers: {}
      }).then((res) => {
        this.list = res.data.boards.content;
        this.paging = res.data.pagination;
        this.no = this.paging.totalListCnt - ((this.paging.page - 1) * this.paging.pageSize);
      }).catch((err) => {
        if (err.response.data.status && err.response.data.message) {
          alert(err.response.data.message);
          console.log(err.response.data.message);
        } else {
          alert('게시글 리스트를 불러올 수 없습니다.');
        }
      })
    },

    fnView(id) {
      this.$router.push({path: '/board/' + id,});
    },

    fnWrite() {
      this.$router.push({path: './board/writeform'});
    },

    fnPage(n) {
      if (this.page !== n) {
        this.page = n;
      }

      this.fnGetList();
    },

    fnKeywordSearch() {
      this.keyword = this.$refs.keyword.value;
      this.page = 0;
      // this.paging.page = 0;
      this.fnGetList();
    }
  }
}
</script>
<style scoped>
article, aside, details, figcaption, figure, footer, header, main, menu, nav, section {
  display: block
}

summary {
  display: list-item
}

section {
  background-color: #fff
}
</style>