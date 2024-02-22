<template>
    <header>
        <!-- Fixed navbar -->
        <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <router-link class="navbar-brand" to="/board/list">자유게시판</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarCollapse">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <router-link v-if="!this.$store.state.isLogin" class="nav-link" to="/member/login">로그인</router-link>
                        <router-link v-if="this.$store.state.isLogin" class="nav-link" @click="fnLogout" to="">로그아웃</router-link>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#"></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link disabled" href="#"></a>
                    </li>
                </ul>
                <p id="userId">환영합니다! {{userId}} 님</p>
            </div>
        </nav>
    </header>
</template>

<script>
    import VueJwtDecode from "vue-jwt-decode";

    export default{
        data(){
            return {
                userId: null,
            };
        },
        created(){
            const token = localStorage.getItem('user_token');
            const decodedToken = VueJwtDecode.decode(token);
            this.userId = decodedToken.userId;
        },
        name: 'Header',
        methods:{
            fnLogout(){
                console.log("ddd")
                localStorage.clear()
                location.reload()
            }
        }
    }

</script>
<style scoped>
    article,aside,details,figcaption,figure,footer,header,main,menu,section{display:block}summary{display:list-item}
    section{background-color: #fff}
    #userId{color:#fff}
</style>