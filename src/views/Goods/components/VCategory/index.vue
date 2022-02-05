<template>
  <div class="draggable-item">
    <div class="dropdown" v-if="dropDown && item && dropDown._id === item._id">
      <!-- Редактировать категорию -->
      <a
        href=""
        v-if="editedItem._id !== item._id"
        @click.prevent="$emit('toggleEdit', item)"
      >
        Редактировать категорию
      </a>
      <span v-else>Редактировать категорию</span>

      <!-- Копировать категорию -->
      <a
        href=""
        @click.prevent="$emit('toggleCopy', item)"
        v-if="copyItem._id !== item._id"
      >
        Копировать категорию
      </a>
      <span v-else>Копировать категорию</span>

      <!-- Экспорт в Excel -->
      <a
        href=""
        @click.prevent="$emit('toggleCategoryExport', item)"
        v-if="categoryExportItem._id !== item._id"
      >
        Экспорт в Excel
      </a>
      <span v-else>Экспорт в Excel</span>

      <!-- Импорт Excel -->
      <a href="">Импорт Excel</a>
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
        <VueCustomTooltip
          label="Скрыть"
          v-if="
            categoryExportItem._id === item._id ||
            copyItem._id === item._id ||
            editedItem._id === item._id
          "
        >
          <img
            @click="$emit('hideDetail')"
            src="@/assets/icons/arrow_top_icon.svg"
            alt=""
          />
        </VueCustomTooltip>
      </div>
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
          <img
            @click="$emit('toggleDeleteCategory', item)"
            src="@/assets/icons/trash_icon.svg"
            alt=""
          />
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
    copyItem: Object,
    editedItem: Object,
    categoryExportItem: Object,
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
  padding-left: 10px;
  padding-right: 10px;

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
  padding: 11px 14px 10px;
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
    height: 21px;
    line-height: 21px;
    color: rgba(0, 0, 0, 0.3);
  }

  a {
    display: block;
    font-size: 14px;
    font-weight: 500;
    position: relative;
    cursor: pointer;
    height: 21px;
    line-height: 21px;

    &:hover {
      color: $color-red;
    }
  }
}
</style>
