<template>
  <div
    class="list__columns list__columns--shadow list__columns--white education-list-columns"
  >
    <div class="list__column">
      {{ item.title }}
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img
            alt=""
            :src="
              editedItem._id !== item._id
                ? require('@/assets/icons/write_icon.svg')
                : require('@/assets/icons/arrow_top_icon.svg')
            "
            @click="$emit('toggleEdit', item)"
          />
        </div>
        <div class="table__icon">
          <img :src="require('@/assets/icons/trash_icon.svg')" alt="" />
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
    editedItem: Object,
  },
};
</script>

<style lang="scss">
.education-list-columns {
  font-size: 16px;
}
</style>
