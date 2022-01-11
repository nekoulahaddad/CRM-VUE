<template>
  <div class="draggable-item">
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
        <img src="@/assets/icons/option.svg" alt="" />
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
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
