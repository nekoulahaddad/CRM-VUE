<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-delivery-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Добавить поставщика
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addDelivery',
            })
          "
          class="add-delivery-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-delivery-row__inner">
      <v-delivery-form @fetchData="$emit('fetchData')" />
    </div>
  </div>
</template>

<script>
import VDeliveryForm from "../VDeliveryForm";

export default {
  components: { VDeliveryForm },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.add-delivery-row {
  .list__columns {
    grid-template-columns: 1fr !important;

    .list__column {
      text-align: left !important;
      padding-left: 0 !important;
      position: relative;
    }
  }

  .list__column--title {
    font-size: 16px;
  }

  &__inner {
    padding: 10px;
  }

  &__title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 10px;
    position: relative;
    padding-top: 10px;

    & + * {
      margin-bottom: 15px;
    }

    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      display: block;
      height: 2px;
      border-radius: $border-radius;
      background-color: $color-gray-secondary;
    }
  }

  &__close {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
}
</style>
