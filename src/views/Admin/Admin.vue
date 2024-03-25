<template>
  <main>
    <div class="container my-3">
      <MemberManage/>
      <br>
      <BoardManage/>
    </div>
  </main>
</template>

<script>
import BoardManage from "@/components/Admin/BoardManage.vue";
import MemberManage from "@/components/Admin/MemberManage.vue";

export default {
  components: {
    MemberManage,
    BoardManage,
  },
}

</script>

<style scoped>

</style>