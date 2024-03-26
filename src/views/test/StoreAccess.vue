<template>
  <p>Count: {{count}}</p>
  <p>cart count: {{cartCount}}</p>
  <button type="button" @click="increment">Increment</button>
</template>

<script>
export default {
  name: '', // 컴포넌트 이름
  components: {}, // 다른 컴포넌트 사용시 컴포넌트 import 하고 배열로 저장
  data(){
    return {
      sampleData: '' // 템플릿과 스크립트서 사용할 데이터 변수
    };
  },

  computed: {
    count(){
      return this.$store.state.count;
    },
    cartCount(){
      return this.$store.getters.cartCount;
    }
  },
  methods: {
    increment(){
      this.$store.commit('increment');
      // store.commit: 상태 변경을 트리거.
      // store값은 직접 변경하는 것을 권장하지 않는다.
    }
  } // 컴포넌트 내 메서드 정의
}

</script>



<style scoped>

</style>