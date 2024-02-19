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
                <form class="form-inline mt-2 mt-md-0">
                    <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
            </div>
        </nav>
    </header>
</template>

<script>
    export default{
        name: 'Header'
    }

</script>
methods:{
}
<style scoped>
    article,aside,details,figcaption,figure,footer,header,main,menu,section{display:block}summary{display:list-item}
    section{background-color: #fff}
</style>