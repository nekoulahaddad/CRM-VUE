<template>
  <div
    class="list__columns region-list-columns list__columns--shadow set-list__columns list__columns--white"
  >
    <div class="list__column">{{ item.title }}</div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip v-show="infoItem._id !== item._id" label="Просмотр">
            <img
              alt=""
              @click="$emit('toggleInfo', item)"
              src="@/assets/icons/arrow_down_icon.svg"
            />
          </VueCustomTooltip>
          <img
            alt=""
            v-show="infoItem._id === item._id"
            @click="$emit('toggleInfo', item)"
            src="@/assets/icons/arrow_top_icon.svg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    infoItem: Object,
  },
};
</script>

<style lang="scss"></style>
