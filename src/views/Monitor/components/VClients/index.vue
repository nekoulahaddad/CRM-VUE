<template>
  <div class="clients">
    <div class="clients__inner">123</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.clients {
  margin-top: 10px;
  box-shadow: 0 3.5px 5.5px rgba(0, 0, 0, 0.02);
  margin-left: 11px;

  &__inner {
    background-color: $color-white;
    width: 489px;
    height: 162px;
    border-radius: $border-radius;
  }
}
</style>
