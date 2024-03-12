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
        <p id="userId" v-if="this.$store.state.isLogin">환영합니다! {{ this.userId }} 님</p>
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
      userId: null
    }
  },
  mounted() {
    this.fetchUserId();
    },

  updated() {
    this.fetchUserId();
  },
  
  methods: {
    fnLogout() {
      this.userId = null;
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('REFRESH_TOKEN');
      Cookies.remove('user_role');
      this.$store.state.isLogin = false;
    },

    async fetchUserId(){
      const token = Cookies.get('ACCESS_TOKEN');
      this.$axios.get(this.$serverUrl + '/member/userid', {
        headers: {
          'ACCESS_TOKEN': `Bearer ${token}` // JWT를 헤더에 포함하여 전송
        }
      }).then((res)=>{
        console.log(res.data)
        this.userId = res.data;
      }).catch((err)=>{
        console.log(err.message);
      })
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