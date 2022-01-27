<template>
  <div class="draggable-item">
    <div
      class="draggable-item__dropdown"
      v-if="dropDown && item && dropDown._id === item._id"
    >
      <span>Редактировать категорию</span>
      <span>Копировать категорию</span>
      <span>Экспорт в Excel</span>
      <span>Импорт Excel</span>
      <img
        alt=""
        src="@/assets/icons/close_icon.svg"
        class="close"
        @click="$emit('toggleDropDown', item)"
      />
    </div>
    <div class="draggable-item__left">
      <img class="next handle left move" src="@/assets/icons/move.svg" alt="" />
      <div>
        <router-link
          :to="`/dashboard/goods/${+item.nesting + 2}/categories/${item._id}/1`"
        >
          <div
            class="table__icon"
            @click="
              current[current.length - 1] !== item.categoryName
                ? current.push(item)
                : false
            "
          >
            {{ item.categoryName }}
          </div>
        </router-link>
      </div>
    </div>
    <div class="table__actions">
      <div class="table__icon">
        <img
          alt=""
          :src="
            item.visible
              ? require('@/assets/icons/eye_close.svg')
              : require('@/assets/icons/eye.svg')
          "
          @click="$emit('changeVisibility', item._id, item.visible)"
        />
      </div>
      <div class="table__icon">
        <img
          @click="$emit('toggleDropDown', item)"
          src="@/assets/icons/option.svg"
          alt=""
        />
      </div>
      <div class="table__icon">
        <img src="@/assets/icons/trash_icon.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    current: Array,
    dropDown: {
      type: Object,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showDropDown: false,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.draggable-item {
  position: relative;

  &__dropdown {
    position: absolute;
    right: 50px;
    top: 30px;
    z-index: 100;
    width: 249px;
    padding: 0 10px 10px;
    height: 102px;
    border-radius: $border-radius;
    background-color: $color-white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);

    .close {
      position: absolute;
      top: 5px;
      right: 5px;
    }

    span {
      display: block;
      font-size: 14px;
      font-weight: 500;
      height: 17px;
      position: relative;
      top: -5px;

      & + * {
        margin-top: 5px;
      }
    }
  }
}

.smooth-dnd-draggable-wrapper {
  overflow: visible !important;
}
</style>
