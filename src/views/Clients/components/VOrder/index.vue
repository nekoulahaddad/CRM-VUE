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
