<template>
  <child-component2 ref="child_component"/>
</template>

<script>
import ChildComponent2 from "@/views/test/ChildComponent2.vue";


export default {
  name: '', // 컴포넌트 이름
  components: {ChildComponent2}, // 다른 컴포넌트 사용시 컴포넌트 import 하고 배열로 저장
  data(){
    return {
      sampleData: '' // 템플릿과 스크립트서 사용할 데이터 변수
    };
  },

  setup(){}, // 컴포지션 api
  created() {}, // 컴포넌트 생성시 실행
  mounted() {
    this.$refs.child_component.callFromParent();
  }, // 데이터 바인딩 단계서 실행
  unmounted() {}, //
  methods: {} // 컴포넌트 내 메서드 정의
}

</script>



<style scoped>

</style>