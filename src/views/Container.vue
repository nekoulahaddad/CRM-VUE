<template>
  <div className="wrapper">
    <v-sidebar />
    <main className="main">
      <router-view />
    </main>
    <v-footer />
  </div>
</template>

<script>
import VSidebar from "@/components/VSidebar";
import VFooter from "@/components/VFooter";

export default {
  components: {
    VFooter,
    VSidebar,
  },
};
</script>
