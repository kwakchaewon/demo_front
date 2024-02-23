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
                <input name="password1" class="w3-input" placeholder="비밀번호를 입력하세요." id="password" v-model="password"
                       type="password">
              </p>
              <p>
                <input name="password2" class="w3-input" placeholder="비밀번호를 확인하세요." type="password">
              </p>
              <p>
                <input class="w3-input" name="email" placeholder="이메일을 입력하세요." id="email" v-model="userName"><br>
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
      paswword1: '',
      paswword2: '',
      email: ''
    }
  },

  methods: {
    submitForm() {
      let apiUrl = 'localhost:8080' + '/member/regist'
      console.log(apiUrl)

      this.form = {
        "userId": this.userId,
        "password1": this.password1,
        "password2": this.password2,
        "email": this.email
      }

      this.$axios.post(apiUrl, this.form)
          .then((res) => {
            alert('회원가입 완료')
            this.$router.push(this.$serverUrl + res.data.id)
          }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    }
  }
}
</script>