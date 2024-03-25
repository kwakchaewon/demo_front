<template>
  <h2>{{title}}</h2>
</template>

<script>
export default {
  name: '', // 컴포넌트 이름
  components: {}, // 다른 컴포넌트 사용시 컴포넌트 import 하고 배열로 저장
  data() {
    return {
      sampleData: '' // 템플릿과 스크립트서 사용할 데이터 변수
    };
  },

  props: {
    title : {
      type: String,
      default: "페이지 제목입니다."
    }
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