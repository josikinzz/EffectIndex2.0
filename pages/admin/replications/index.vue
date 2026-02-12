<template>
  <div class="pageContent replicationManagement">
    <h1> Replications </h1>
    <nuxt-link
      class="replicationManagement__link"
      to="/admin/replications"
    >
      Replication List
    </nuxt-link>
    <nuxt-link 
      class="replicationManagement__link"
      to="/admin/replications/add"
    >
      Add New Replication
    </nuxt-link>
    <NuxtPage />
  </div>
</template>

<script>
definePageMeta({ middleware: 'auth' })

export default {
  head() {
    return {
      title: "Modify Replications"
    };
  }
};
</script>

<style scoped>
.replicationManagement__link {
  display: inline-block;
  margin-right: 2em;
}
</style>
