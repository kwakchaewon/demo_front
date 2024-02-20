<template>
    <main>
        <section class="jumbotron text-center">
            <div>
                <div>
                    <h2>회원가입</h2>
                    <div id="loginForm">
                        <form @submit.prevent="fnLogin">
                            <p>
                                <input class="w3-input" name="uid" placeholder="ID 를 입력하세요." v-model="user_id"><br>
                            </p>
                            <p>
                                <input name="password" class="w3-input" placeholder="비밀번호를 입력하세요." v-model="user_pw" type="password">
                            </p>
                            <p>
                                <input name="password" class="w3-input" placeholder="비밀번호를 확인하세요." v-model="user_pw" type="password">
                            </p>
                            <p>
                                <input class="w3-input" name="uid" placeholder="닉네임을 입력하세요." v-model="user_id"><br>
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
      components: {
      },
    }
</script>