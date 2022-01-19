<template>
  <div class="content-menu">
    <a href="" class="content-menu__item">Копировать ссылка на задачу</a>
    <a href="" class="content-menu__item">Удалить</a>
    <a href="" class="content-menu__item">Переместить наверх</a>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

.content-menu {
  background-color: $color-white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
  border-radius: $border-radius;
  position: absolute;
  left: 0;
  right: 0;
  top: 90%;
  padding: 10px;

  &__item {
    display: block;

    & + * {
      margin-top: 5px;
    }
  }
}
</style>
