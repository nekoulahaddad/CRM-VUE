<template>
  <header class="mobile-header">
    <div>
      <img src="@/assets/icons/burger.svg" />
    </div>
    <router-link to="/monitor">
      <img src="@/assets/icons/logo.svg" />
    </router-link>
    <div></div>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.mobile-header {
  width: 100%;
  height: 80px;
  background-color: $color-white;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;

  @media (max-width: 767px) {
    & {
      display: flex;
    }
  }
}
</style>
