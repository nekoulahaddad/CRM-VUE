<template>
  <div
    class="list__columns list__columns--shadow set-list__columns list__columns--white"
  >
    <div class="list__column">{{ index + 1 }}</div>
    <div class="list__column bg bg--blue-light">{{ item.categoryName }}</div>
    <div class="list__column">
      <a :href="item.url" target="_blank">{{ item.url }}</a>
    </div>
    <div class="list__column"></div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img src="@/assets/icons/reload.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: Number,
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
