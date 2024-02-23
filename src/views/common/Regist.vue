<template>
  <main>
    <section class="jumbotron text-center">
      <div>
        <div>
          <h2>회원가입</h2>
          <div id="loginForm">
            <form @submit.prevent="submitForm">
              <p>
                <input class="w3-input" name="userId" placeholder="ID 를 입력하세요." v-model="userId"><br>
              </p>
              <p>
                <input name="userPw" class="w3-input" placeholder="비밀번호를 입력하세요." id="userPw" v-model="userPw"
                       type="userPw">
              </p>
              <p>
                <input name="password2" class="w3-input" placeholder="비밀번호를 확인하세요." type="password">
              </p>
              <p>
                <input class="w3-input" name="email" placeholder="이메일을 입력하세요." id="email" v-model="email"><br>
              </p>
              <p>
                <button type="submit" class="w3-button w3-green w3-round" v-on:click="fnRegist">가입</button>
                <!--                                <button type="submit" class="w3-button w3-green w3-round">취소</button>-->
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
export default {
  name: 'Regist',
  components: {},

  data() {
    return {
      userId: '',
      userPw: '',
      email: ''
    }
  },

  methods: {
    submitForm() {
      this.form = {
        "userId": this.userId,
        "userPw": this.userPw,
        "email": this.email
      }

      console.log(this.$serverUrl+'/member/regist')


      this.$axios.post(this.$serverUrl+'/member/regist',this.form)
          .then(() => {
            alert('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.')
            this.$router.push('/member/login')
          }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    }
  }
}
</script>