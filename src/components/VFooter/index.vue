<template>
  <footer class="footer">
    <div class="footer__inner"></div>
  </footer>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.footer {
  background-color: $color-white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
}
</style>
