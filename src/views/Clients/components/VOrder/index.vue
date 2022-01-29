<template>
  <div
    class="list__columns list__body list__columns--shadow order-list-columns list__columns--white"
  >
    <div class="list__column list__column--number">
      {{ order.number }}
    </div>
    <div class="list__column text--green">
      {{ transformDate(order.buyed) }}
    </div>
    <div class="list__column" v-html="transformStatus(order.status)" />
    <div class="list__column">
      {{ order.deliver ? transformDate(order.deliver) : "" }}
    </div>
    <div class="list__column text--blue">
      {{
        order.manager && order.manager[0] ? transformFIO(order.manager[0]) : ""
      }}
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img
            alt=""
            v-if="!opened"
            @click="$emit('toggleSubInfo', user, order)"
            src="@/assets/icons/info_icon.svg"
          />
          <img
            alt=""
            v-else
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleSubInfo', user, order)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    opened: {
      type: Boolean,
      default: false,
    },
    infoItem: {
      type: Object,
    },
    user: {
      type: Object,
      required: true,
    },
    order: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.order-list-columns {
  background-color: $color-white !important;
}
.order-list-shadow {
  width: 100% !important;

  .list__header {
    height: auto;

    .list__columns {
      background-color: $color-white !important;
      grid-template-columns: 50px 330px 330px 330px 330px 30px !important;
      justify-content: center;
    }
  }
  .list__body {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    justify-content: center;
    grid-template-columns: 50px 330px 330px 330px 330px 33px !important;
  }
}
</style>
