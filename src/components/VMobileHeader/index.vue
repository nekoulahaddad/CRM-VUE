<template>
  <header class="mobile-header"></header>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.mobile-header {
  width: 100%;
  height: 60px;
  background-color: $color-white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
