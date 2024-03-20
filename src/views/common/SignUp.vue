<template>
  <main>
    <section class="jumbotron text-center">
      <div>
        <div>
          <h2>회원가입</h2>
          <div id="loginForm">
            <form @submit.prevent="submitForm">
              <input class="w3-input" name="userId" placeholder="ID 를 입력하세요." v-model="userId"><br>
              <p>
                <input name="userPw" class="w3-input" placeholder="비밀번호를 입력하세요." id="userPw" v-model="userPw"
                       type="password">
              </p>
              <p>
                <input name="password2" class="w3-input" placeholder="비밀번호를 확인하세요." type="password" id="userPwCk"
                       v-model="userPwCk">
              </p>
              <p>
                <input class="w3-input" name="email" placeholder="이메일을 입력하세요." id="email" v-model="email"><br>
              </p>

              <p style="text-align: left">아이디 조건: 4~12자 영문 또는 숫자</p>
              <p style="text-align: left">비밀번호 조건: 8글자 이상 영문, 숫자, 특수문자 조합 비밀번호</p>
              <br>
              <p>
                <button type="submit" class="w3-button w3-green w3-round" v-on:click="fnRegist">가입</button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import Cookies from "js-cookie";

export default {
  name: 'SingUp',
  components: {},

  data() {
    return {
      userId: '',
      userPw: '',
      email: '',
      userPwCk: ''
    };
  },

  mounted() {
    this.removeCookies();
  },

  methods: {
    removeCookies() {
      Cookies.remove('ACCESS_TOKEN');
      Cookies.remove('REFRESH_TOKEN');
    },
    submitForm() {
      this.form = {
        "userId": this.userId,
        "userPw": this.userPw,
        "email": this.email,
        "userPwCk": this.userPwCk
      };

      // @을 기준으로 앞 구간이 알파벳 or 숫자 조합으로 이루어져 있는지 체크
      // @을 기준으로 뒷 구간이 알파벳 or 숫자 조합으로 이루어져 있는지 체크
      // @을 기준으로 뒷 구간에서 . 뒷 구간이 알파벳 or 숫자 조합으로 이루어져 있는지 체크

      //eslint-disable-next-line
      const emailPattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/; // 이메일 유효성 검사:
      const idCheckPattern = /^[0-9a-zA-Z]{4,12}$/; // 아이디 유효성 검사: 영어 또는 숫자만 허용
      const passwordCheck = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // 비밀번호 유효성 검사: 8글자 이상 영문, 숫자, 특수문자 사용 비밀번호

      if (this.userId === '') {
        alert('ID를 입력하세요.');
        return
      } else if (!idCheckPattern.test(this.userId)) {
        alert('올바르지 못한 ID 입니다. \n4~12자의 영문 또는 숫자로 생성 가능합니다.');
        return;
      } else if (this.userPw === '') {
        alert('비밀번호를 입력하세요.');
        return;
      } else if (this.userPwCk === '') {
        alert('비밀번호 확인을 입력하세요.');
        return;
      } else if (!passwordCheck.test(this.userPw)) {
        alert('비밀번호가 올바르지 않습니다. \n8자 이상 영문,숫자,특수문자 조합으로 생성하세요.')
      } else if (this.userPwCk !== this.userPw) {
        alert('비밀번호와 비밀번호 확인이 다릅니다.');
        return
      } else if (!this.email || !emailPattern.test(this.email)) {
        alert('이메일 주소가 올바르지 않습니다.');
        return
      } else {
        this.$axios.post(this.$serverUrl + '/member/signup', this.form)
            .then(() => {
              alert('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.');
              this.$router.push('/member/login');
            }).catch((err) => {

          // 아이디, 이메일 중복검사 예외
          if (err.response.data.status === '400' && err.response.data.message) {
            console.log(err.response.data.message);
            alert(err.response.data.message);
          }
          // 기타
          else {
            console.log(err.message);
            alert("회원가입에 실패했습니다.");
          }
        })
      }
    }
  }
}
</script>
<style scoped>
#errorMessages {
  text-align: left;
  //width: 140%;
  //align-content: center;
  margin: 0 auto;
}
</style>