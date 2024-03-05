<template>
  <header>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <router-link class="navbar-brand" to="/board">자유게시판</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
              aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link v-if="!this.$store.state.isLogin" class="nav-link" to="/member/login">로그인</router-link>
            <router-link v-if="this.$store.state.isLogin" class="nav-link" to="/member/login" @click="fnLogout" >로그아웃</router-link>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#"></a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" href="#"></a>
          </li>
        </ul>
<!--        <p id="userId">환영합니다! {{ this.$store.state }} 님</p>-->
      </div>
    </nav>
  </header>
</template>

<script>
import Cookies from 'js-cookie';
export default {
  name: 'Header',
  methods: {
    fnLogout() {
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('REFRESH_TOKEN');
      Cookies.remove('user_role');

      // localStorage.removeItem('ACCESS_TOKEN')
      // localStorage.removeItem('REFRESH_TOKEN')
      // localStorage.removeItem('user_role')
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