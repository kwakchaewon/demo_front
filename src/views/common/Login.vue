<template>
  <main>
    <section class="jumbotron text-center">
      <div>
        <div>
          <h2>로그인</h2>
          <div id="loginForm">
            <form @submit.prevent="fnLogin">
              <p>
                <input class="w3-input" name="uid" placeholder="Enter your ID" v-model="user_id"><br>
              </p>
              <p>
                <input name="password" class="w3-input" placeholder="Enter your password" v-model="user_pw"
                       type="password">
              </p>
              <router-link to="/member/signup">회원가입</router-link>
              <p>
                <button type="submit" class="w3-button w3-green w3-round">로그인</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import Cookies from "js-cookie";

export default {
  data() {
    return {
      user_id: '',
      user_pw: ''
    };
  },
  mounted() {
    this.removeCookies();
  },
  methods: {
    ...mapActions(['login']), // actions.js 에서 선언한 login 함수 가져와 사용

    removeCookies(){
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('REFRESH_TOKEN');

      this.$store.state.isLogin = false;
      this.$store.state.user = null;
      this.$store.state.role = null;
    },

    async fnLogin() {
      if (this.user_id === '') {
        alert('ID를 입력하세요.');
        return;
      }

      if (this.user_pw === '') {
        alert('비밀번호를 입력하세요.');
        return;
      }

      try {
        const loginResult = await this.login({user_id: this.user_id, user_pw: this.user_pw});
        if (loginResult) this.goToPages();
      } catch (err) {
        if (err.message.indexOf('Network Error') > -1) {
          alert('서버에 접속할 수 없습니다. 상태를 확인해주세요.');
        }

        else {
          console.log(err)
          alert('로그인 정보를 확인할 수 없습니다.');
        }
      }
    },
    goToPages() {
      this.$router.push({name: 'BoardList'})
    }
  },
  computed: {
    ...mapGetters({
      errorState: 'getErrorState'
    })
  }
}
</script>

<style>
#loginForm {
  width: 500px;
  margin: auto;
}

.jumbotron {
  background-color: #ffffff;
}
</style>