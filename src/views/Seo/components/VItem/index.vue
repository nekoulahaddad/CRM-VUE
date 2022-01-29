<template>
  <div
    class="list__columns list__columns--shadow set-list__columns list__columns--white"
  >
    <div
      class="list__column"
      @click="
        current[current.length - 1] !== item.categoryName
          ? current.push(item)
          : false
      "
    >
      <router-link
        :to="`/dashboard/seo/${+item.nesting + 2}/categories/${item._id}/1`"
      >
        {{ item.categoryName }}
      </router-link>
    </div>
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
    current: Array,
  },
};
</script>

<style lang="scss">
.set-list__columns {
  a {
    display: block;
  }
}
</style>
