<template>
  <child-component @send-message="sendMessage" ref="child_component" />
  <ChildComponent @send-message="sendMessage" ref="child_component" />
</template>

<script>
import ChildComponent from "@/views/test/ChildComponent.vue";

export default {
  name: '', // 컴포넌트 이름
  components: {
    ChildComponent
  }, // 다른 컴포넌트 사용시 컴포넌트 import 하고 배열로 저장
  data(){
    return {
      sampleData: '' // 템플릿과 스크립트서 사용할 데이터 변수
    };
  },

  setup(){}, // 컴포지션 api
  created() {}, // 컴포넌트 생성시 실행
  mounted() {
    this.$refs.child_component.$refs.btn.click();
    // 1. 부모 컴포넌트에서 자식 컴포넌트인 child-component 에 ref child_component 를 지정해 $refs로 접근하도록 함
    // 2. 이렇게 설정하면 부모컴포넌트에서 자식 컴포넌트 안에 정의된 HTML 객체에 대한 접근이 가능해지고
    // ref = btn 이름으로 버튼에 접근해 click 이벤트를 발생시킬수 있게 됨


  }, // 데이터 바인딩 단계서 실행
  unmounted() {}, //
  methods: {} // 컴포넌트 내 메서드 정의
}

</script>

<style scoped>

</style>