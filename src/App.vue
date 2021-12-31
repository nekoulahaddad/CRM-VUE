<template>
  <div class="wrapper">
    <v-sidebar />
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script>
import VSidebar from "@/components/VSidebar";

export default {
  components: {
    VSidebar,
  },
};
</script>
