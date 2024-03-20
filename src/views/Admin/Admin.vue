<template>
  <main>
    <div class="container my-3">
      <AdminManage/>
      <AdminMember/>
      <AdminBoard/>
    </div>
  </main>
</template>

<script>
import AdminMember from "@/components/Admin/AdminManage.vue";
import AdminBoard from "@/components/Admin/BoardManage.vue";
import AdminManage from "@/components/Admin/SuperManage.vue";

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