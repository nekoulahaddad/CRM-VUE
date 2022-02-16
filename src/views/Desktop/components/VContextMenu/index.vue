<template>
  <div class="content-menu">
    <a
      href=""
      class="content-menu__item"
      @click.prevent="$emit('toggleDelete', item, type, status)"
    >
      <img src="@/assets/icons/trash_icon.svg" alt="" />
      Удалить
    </a>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    type: String,
    status: String,
  },
};
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
  z-index: 100;

  &__item {
    display: flex;
    align-items: center;

    &:hover {
      color: $color-red;
    }

    & + * {
      margin-top: 5px;
    }

    img {
      width: 18px;
      margin-right: 10px;
    }
  }
}
</style>
