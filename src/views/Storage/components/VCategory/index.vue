<template>
  <div
    class="list__columns list__columns--shadow list__columns--white education-list-columns"
  >
    <div class="list__column">
      <a href="" @click.prevent="$emit('toggleInfo', item)">
        {{ item.categoryName }}
      </a>
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
<style lang="scss">
.storage-page {
  .list__column {
    &:first-child {
      text-align: left !important;
    }
  }
}
</style>
