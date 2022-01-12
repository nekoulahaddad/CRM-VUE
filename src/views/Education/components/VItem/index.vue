<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column">
      {{ item.title }}
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
