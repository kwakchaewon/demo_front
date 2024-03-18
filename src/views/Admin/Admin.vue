<template>
  <main>
    <div class="container my-3">
      <div class="common-buttons">
        <button type="button" class="w3-button w3-round w3-blue-gray"></button>&nbsp;
        <button type="button" class="w3-button w3-round w3-gray"></button>
      </div>
      <AdminMember/>
      <AdminBoard/>
    </div>
  </main>
</template>

<script>
import AdminMember from "@/components/AdminMember.vue";
import AdminBoard from "@/components/AdminBoard.vue";

export default {
  components: {
    AdminBoard,
    AdminMember
  },
}

</script>

<style scoped>

</style>