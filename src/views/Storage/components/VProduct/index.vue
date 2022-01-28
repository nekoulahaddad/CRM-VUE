<template>
  <div
    class="list__columns list__columns--shadow list__columns--white storage-list-columns"
  >
    <div class="list__column">
      <router-link
        :to="`/dashboard/storage/${+item.nesting + 2}/categories/${item._id}/1`"
      >
        {{ item.title }}
      </router-link>
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img src="@/assets/icons/write_icon.svg" alt="" />
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
