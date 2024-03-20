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
import AdminMember from "@/components/Admin/MemberManage.vue";
import AdminBoard from "@/components/Admin/BoardManage.vue";
import AdminManage from "@/components/Admin/AdminManage.vue";

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