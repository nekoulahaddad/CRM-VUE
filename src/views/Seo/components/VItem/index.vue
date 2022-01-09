<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column">{{ item.categoryName }}</div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img
            @click="$emit('toggleEdit', 'product', item)"
            src="@/assets/icons/write_icon.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
