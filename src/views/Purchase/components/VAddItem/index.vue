<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-vacancy-row"
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
          class="add-vacancy-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-vacancy-row__inner">
      <VForm @onCreate="onCreate" />
    </div>
  </div>
</template>

<script>
import VForm from "../VForm";

export default {
  components: { VForm },
};
</script>
