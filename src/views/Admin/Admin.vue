<template>
  <main>
    <div class="container my-3">
      <div class="common-buttons">
        <button type="button" class="w3-button w3-round w3-blue-gray"></button>&nbsp;
        <button type="button" class="w3-button w3-round w3-gray"></button>
      </div>
      <AdminManage/>
      <AdminMember/>
      <AdminBoard/>
    </div>
  </main>
</template>

<script>
import AdminMember from "@/components/MemberManage.vue";
import AdminBoard from "@/components/BoardManage.vue";
import AdminManage from "@/components/AdminManage.vue";

export default {
  components: {
    AdminManage,
    AdminBoard,
    AdminMember
  },
}

</script>

<style scoped>

</style>