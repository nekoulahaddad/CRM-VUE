<template>
  <div
    class="list__columns list__columns--shadow list__columns--white education-list-columns"
  >
    <div class="list__column" style="overflow: hidden">
      <a href="" @click.prevent="$emit('toggleInfo', item)">{{ item.title }}</a>
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip label="Изменить">
            <img
              alt=""
              :src="
                editedItem._id !== item._id
                  ? require('@/assets/icons/write_icon.svg')
                  : require('@/assets/icons/arrow_top_icon.svg')
              "
              @click="$emit('toggleEdit', item)"
            />
          </VueCustomTooltip>
        </div>
        <div class="table__icon" v-if="role === 'superadmin'">
          <VueCustomTooltip label="Удалить">
            <img
              @click="$emit('toggleDelete', item)"
              :src="require('@/assets/icons/trash_icon.svg')"
              alt=""
            />
          </VueCustomTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    role: String,
    item: {
      type: Object,
      required: true,
    },
    editedItem: Object,
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.education-list-columns {
  font-size: 16px;
  position: relative;

  .list__row--opened &::after {
    position: absolute;
    content: "";
    display: block;
    bottom: 0;
    left: 10px;
    right: 10px;
    height: 2px;
    background-color: $color-white;
    border-radius: $border-radius;
  }

  a {
    display: block;
  }
}
</style>
