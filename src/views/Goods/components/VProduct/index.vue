<template>
  <div
    class="list__columns list__columns-shadow list__columns-white mail-list-columns"
  >
    <div class="list__column">{{ item.title }}</div>
    <div class="list__column">
      {{ item.article }}
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
