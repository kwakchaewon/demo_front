<template>
  <header>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <!--      <router-link class="navbar-brand" v-on:click="fnReset">자유게시판</router-link>-->
<!--      <router-link class="navbar-brand" to="/">자유게시판</router-link>-->
            <a class="navbar-brand" v-on:click="fnReset">자유게시판</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
              aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link v-if="!this.$store.state.isLogin" class="nav-link" to="/member/login">로그인</router-link>
            <router-link v-if="this.$store.state.isLogin" class="nav-link" to="/member/login" @click="fnLogout">로그아웃
            </router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"></a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#"></a>
          </li>
        </ul>
        <p id="userId" v-if="this.$store.state.isLogin">환영합니다! {{ this.$store.state.user }} 님</p>
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
      this.$router.push({name: 'BoardList'});
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