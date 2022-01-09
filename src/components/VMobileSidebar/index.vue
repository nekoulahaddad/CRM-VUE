<template>
  <div class="mobile-sidebar"></div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.mobile-sidebar {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: $color-white;
  z-index: 200;
  transition: transform 0.2s linear 0s;
  will-change: transform;
  transform: translateX(-100%);

  &--opened {
    transform: translateX(0);
  }

  @media (max-width: 767px) {
    & {
      display: flex;
    }
  }
}
</style>
