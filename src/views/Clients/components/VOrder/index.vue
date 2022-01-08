<template>
  <div class="list__columns list__columns--shadow list__columns--white">
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
            v-if="infoItem._id !== order._id"
            src="@/assets/icons/info_icon.svg"
            alt=""
          />
          <img v-else src="@/assets/icons/arrow_top_icon.svg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoItem: {
      type: Object,
    },
    order: {
      type: Array,
      default: [],
      required: true,
    },
  },
};
</script>
