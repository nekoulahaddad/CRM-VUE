<template>
  <div
    class="list__columns list__columns-shadow list__columns-white goods-list-columns"
  >
    <div class="list__column"></div>
    <div class="list__column">{{ item.title }}</div>
    <div class="list__column">
      {{ item.article }}
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img src="@/assets/icons/add_to_group.svg" alt="" />
        </div>
        <div class="table__icon">
          <img src="@/assets/icons/move_goods.svg" alt="" />
        </div>
        <div class="table__icon">
          <img alt="" src="@/assets/icons/eye_close.svg" />
        </div>
        <div class="table__icon">
          <img alt="" src="@/assets/icons/write_icon.svg" />
        </div>
        <div class="table__icon">
          <img alt="" src="@/assets/icons/trash_icon.svg" />
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
.goods-list-columns {
  grid-template-columns: 50px 1fr 1fr 1fr;
}
</style>
