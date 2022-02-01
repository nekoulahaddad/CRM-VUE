<template>
  <div
    class="list__columns list__columns-shadow list__columns-white goods-list-columns"
  >
    <div class="list__column">
      <input type="checkbox" />
    </div>
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
          <img alt="" src="@/assets/icons/structure.svg" />
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

  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    min-width: 16px;
    height: 16px;
    background-color: #f5f5f5;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    cursor: pointer;
    margin-right: 10px;
    position: relative;

    &:checked:after {
      content: "";
      position: absolute;
      background: url("../../../../assets/icons/check.svg") no-repeat 1px 2px;
      border-radius: 2px;
      z-index: 100;
      width: 16px;
      height: 16px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  label {
    color: rgba(0, 0, 0, 0.3);
    display: flex;
  }
}
</style>
