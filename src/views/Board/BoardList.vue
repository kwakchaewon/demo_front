<template>
  <main>
    <section class="jumbotron text-center">
      <div class="board-list">
        <table class="w3-table-all">
          <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성일</th>
            <th>작성자</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, id) in list" :key="id">
<!--            <td>{{ setRangePage[id] }}</td>-->
            <td>{{ paging.totalListCnt - (paging.page * paging.pageSize) - id + 10 }}</td>
            <td><a v-on:click="fnView(`${row.id}`)">{{ row.title }}</a></td>
            <td>{{ row.createdAt }}</td>
            <td>{{ row.memberId }}</td>
          </tr>
          </tbody>
        </table>

        <div class="pagination w3-bar w3-padding-16 w3-small" v-if="paging.totalListCnt > 0" style="justify-content: center">
          <span class="pg">
          <a href="javascript:;" @click="fnPage(1)" class="first w3-button w3-border">&lt;&lt;</a>
          <a href="javascript:;" v-if="paging.startPage > 10" @click="fnPage(`${paging.startPage-1}`)"
             class="prev w3-button w3-border">&lt;</a>
          <template v-for=" (n,index) in paginavigation()">
              <template v-if="paging.page==n">
                  <strong class="w3-button w3-border w3-green" :key="index">{{ n }}</strong>
              </template>
              <template v-else>
                  <a class="w3-button w3-border" href="javascript:;" @click="fnPage(`${n}`)" :key="index">{{ n }}</a>
              </template>
          </template>
          <a v-if="paging.totalPageCnt > paging.endPage"
             @click="fnPage(`${paging.endPage+1}`)" class="next w3-button w3-border">&gt;</a>
          <a @click="fnPage(`${paging.totalPageCnt}`)" class="last w3-button w3-border">&gt;&gt;</a>
          </span>
        </div>
        <div class="common-buttons">
          <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnWrite">등록</button>
        </div>
      </div>
    </section>
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
      keyword: this.$route.query.keyword,
      paginavigation: function () { //페이징 처리 for문 커스텀
        const pageNumber = [] //;
        const startPage = this.paging.startPage;
        const endPage = this.paging.endPage;
        for (let i = startPage; i <= endPage; i++) pageNumber.push(i);
        return pageNumber;
      }
    }
  },
  computed:{
    // setRangePage: function (id){
    //   console.log(id);
    //   return this.paging.totalListCnt - (this.paging.page * this.paging.pageSize) -id + 10
    // }
  },
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      this.requestBody = { // 데이터 전송
        keyword: this.keyword,
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
        if(err.response.data.status && err.response.data.message){
          alert(err.response.data.message);
          console.log(err.response.data.message);
        }
        else {
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
        this.fnGetList();
      }
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