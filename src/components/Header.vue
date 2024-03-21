<template>
  <header>
    <!-- Fixed navbar -->
<!--    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">-->
<!--      &lt;!&ndash;      <router-link class="navbar-brand" v-on:click="fnReset">자유게시판</router-link>&ndash;&gt;-->
<!--      <router-link class="navbar-brand" to="/board">자유게시판</router-link>-->
<!--      &lt;!&ndash;            <a class="navbar-brand" v-on:click="fnReset">자유게시판</a>&ndash;&gt;-->
<!--      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"-->
<!--              aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">-->
<!--        <span class="navbar-toggler-icon"></span>-->
<!--      </button>-->
<!--      <div class="collapse navbar-collapse" id="navbarCollapse">-->
<!--        <ul class="navbar-nav mr-auto">-->
<!--          <li class="nav-item active">-->
<!--            <router-link v-if="!this.$store.state.isLogin" class="nav-link" to="/member/login">로그인</router-link>-->
<!--            &lt;!&ndash; SUPER, ADMIN 계정일 경우에만 버튼 표기 &ndash;&gt;-->
<!--            <router-link v-if="this.$store.state.role === 'ROLE_SUPERVISOR' || this.$store.state.role === 'ROLE_ADMIN'"-->
<!--                         class="nav-link" to="/admin">관리자-->
<!--            </router-link>-->
<!--            <router-link v-if="this.$store.state.isLogin" class="nav-link" to="/member/login" @click="fnLogout">로그아웃-->
<!--            </router-link>-->
<!--          </li>-->
<!--          <li class="nav-item">-->
<!--            <a class="nav-link" href="#"></a>-->
<!--          </li>-->
<!--          <li class="nav-item">-->
<!--            <a class="nav-link disabled" href="#"></a>-->
<!--          </li>-->
<!--        </ul>-->
<!--        <p id="userId" v-if="this.$store.state.isLogin">환영합니다! {{ this.$store.state.user }} 님</p>-->
<!--      </div>-->
<!--    </nav>-->

    <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div class="container-fluid">
        <a class="navbar-brand" href="/board">자유 게시판</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-if="!this.$store.state.isLogin">
              <router-link class="nav-link" to="/member/login">로그인</router-link>
            </li>
            <li class="nav-item" v-if="this.$store.state.isLogin">
              <router-link class="nav-link" to="/member/login" @click="fnLogout">로그아웃</router-link>
            </li>
            <li class="nav-item" v-if="this.$store.state.role === 'ROLE_SUPERVISOR' || this.$store.state.role === 'ROLE_ADMIN'">
              <router-link class="nav-link" to="/admin">관리자</router-link>
            </li>
          </ul>
        </div>
        <p id="userId" v-if="this.$store.state.isLogin" style="color: black">환영합니다! {{ this.$store.state.user }} 님</p>
      </div>
    </nav>
  </header>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'Header',
  data() {
    return {
      userId: null,
      cnt: 0,
    }
  },

  methods: {
    fnLogout() {
      this.userId = null;
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('REFRESH_TOKEN');

      this.$store.state.isLogin = false;
      this.$store.state.user = null;
      this.$store.state.role = null;

      sessionStorage.removeItem('vuex-state');
    },

    fnReset() {
      // Object.assign(this.$data);
      // this.cnt = this.cnt+1;
      // console.log(this.cnt);
      // this.$router.push({
      //   path: '/board',
      //   query: {
      //     page:1,
      //     keyword: ''
      //   }
      // });
      // this.$route.param =
      // this.$router.push({name: 'BoardList', params:{page:1, keyword:''}
      // this.$router.push({name: 'BoardList', query:{page:1, keyword:''}
      // , query:{page:1, keyword:''}
    }

  }
}

</script>
<style scoped>
article, aside, details, figcaption, figure, footer, header, main, menu, section {
  display: block
}

summary {
  display: list-item
}

section {
  background-color: #fff
}

#userId {
  color: #fff
}
</style>