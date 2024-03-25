<template>
  <!-- 부모 컴포넌트에서 자식 컴포넌트로 데이터 전달 -->
  <PageTitle title="부모 컴포넌트에서 자식 컴포넌트로 데이터 전달"/>

  <!-- 동적 페이지 타이틀 -->
  <page-title :title="title"/>

  <!-- 페이지 제목입니다.  -->
  <page-title/>

  <blog-post likes="42"/>
</template>

<script>
import PageTitle from '../../components/test/PageTitle.vue'

export default {
  name: '', // 컴포넌트 이름
  components: {PageTitle}, // 다른 컴포넌트 사용시 컴포넌트 import 하고 배열로 저장
  data() {
    return {
      title: '동적 페이지 타이틀',
      sampleData: '' // 템플릿과 스크립트서 사용할 데이터 변수
    };
  },

  setup() {
  }, // 컴포지션 api
  created() {
  }, // 컴포넌트 생성시 실행
  mounted() {
  }, // 데이터 바인딩 단계서 실행
  unmounted() {
  }, //
  methods: {} // 컴포넌트 내 메서드 정의
}

</script>


<style scoped>

</style>