<template>
  <div
    class="list__columns list__columns--shadow list__columns--white storage-list-columns"
  >
    <div class="list__column">
      <a target="_blank" :href="`https://tdcsk.com/products/${item.slug}`">
        {{ item.title }}
      </a>
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img
            @click="$emit('toggleEdit', item)"
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

<style lang="scss">
.storage-list-columns {
  grid-template-columns: 1fr 100px !important;
  a {
    display: block;
  }
}
</style>
