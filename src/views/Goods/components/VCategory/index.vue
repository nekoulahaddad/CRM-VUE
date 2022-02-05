<template>
  <div class="draggable-item list__columns">
    <div class="dropdown" v-if="dropDown && item && dropDown._id === item._id">
      <a href="" @click.prevent="$emit('toggleEdit', item)">
        Редактировать категорию
      </a>
      <a href="" @click.prevent="$emit('toggleCopy', item)">
        Копировать категорию
      </a>
      <a href="">Экспорт в Excel</a>
      <a href="">Импорт Excel</a>
      <img
        alt=""
        src="@/assets/icons/close_icon.svg"
        class="close"
        @click="$emit('toggleDropDown', item)"
      />
    </div>
    <div class="list__column draggable-item__left">
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
      <div class="table__icon" v-if="show">
        <img
          :class="{ 'table__icon--opacity': opacity }"
          @click="$emit('addToGoogleDoc', item)"
          src="@/assets/icons/google_doc.svg"
          alt=""
        />
      </div>
      <div class="table__icon">
        <VueCustomTooltip label="Видимость категории">
          <img
            alt=""
            :src="
              item.visible
                ? require('@/assets/icons/eye_close.svg')
                : require('@/assets/icons/eye.svg')
            "
            @click="$emit('changeVisibility', item._id, item.visible)"
          />
        </VueCustomTooltip>
      </div>
      <div class="table__icon">
        <img
          @click="$emit('toggleDropDown', item)"
          src="@/assets/icons/option.svg"
          alt=""
        />
      </div>
      <div class="table__icon">
        <VueCustomTooltip label="Удалить">
          <img src="@/assets/icons/trash_icon.svg" alt="" />
        </VueCustomTooltip>
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
    opacity: {
      type: Boolean,
    },
    show: {
      type: Boolean,
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

  .handle {
    width: 24px;
  }

  .table__icon--opacity {
    filter: grayscale(100%);
    opacity: 0.3;
  }
}

.smooth-dnd-draggable-wrapper {
  overflow: visible !important;
}

.dropdown {
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

  a {
    display: block;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    cursor: pointer;
    height: 24px;
    line-height: 24px;

    &:hover {
      color: $color-red;
    }
  }
}
</style>
