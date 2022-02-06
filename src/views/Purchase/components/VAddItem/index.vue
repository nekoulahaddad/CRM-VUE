<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-purchase-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Добавить закупку

        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addPurchase',
            })
          "
          class="add-purchase-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-purchase-row__inner">
      <VForm />
    </div>
  </div>
</template>

<script>
import VForm from "../VForm";

export default {
  components: { VForm },
};
</script>

<style lang="scss">
.add-purchase-row {
  &__title {
    position: relative;
  }
  &__close {
    cursor: pointer;
    right: 10px;
    top: 13px;
    position: absolute;
  }

  &__inner {
    padding: 10px;
  }
  .list__columns {
    grid-template-columns: 1fr !important;
    .list__column {
      text-align: left !important;
      font-size: 16px;
    }
  }
}
</style>
