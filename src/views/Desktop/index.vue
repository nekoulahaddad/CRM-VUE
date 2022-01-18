<template>
  <div class="page desktop-page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/desktop_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Рабочий стол</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <div class="tasks">
          <div class="tasks__title"></div>
        </div>
      </div>
      <div class="page__right">12</div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.desktop-page {
  .page {
    &__left {
      flex: 1;
    }

    &__right {
      max-width: 300px;
      width: 100%;
    }
  }

  .tasks {
    background-color: $color-white;
    border-radius: $border-radius;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
    padding: 10px;
  }
}
</style>
