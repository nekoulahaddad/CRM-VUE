<template>
  <div
    class="list__columns list__columns-shadow list__columns-white order-item"
  >
    <div class="list__column">{{ item.number }}</div>
    <div class="list__column text--blue">
      {{ transformName(item.client) }}
    </div>
    <div class="list__column">{{ item.region.title }}</div>
    <div class="list__column text-green">
      {{ transformDate(item.createdAt) }}
    </div>
    <div class="list__column text--sapphire">
      {{ item && item.buyed ? transformDate(item.buyed) : "" }}
    </div>
    <div class="list__column text--sapphire">
      {{ item.deliver ? transformDate(item.deliver) : "" }}
    </div>
    <div class="list__column">
      {{ item.sum.toFixed(2) + " " + item.region.valute.icon }}
    </div>
    <div class="list__column">
      {{
        (item.deliverySum ? item.deliverySum.toFixed(2) : "0.00") +
        " " +
        item.region.valute.icon
      }}
    </div>
    <div class="list__column text--blue">
      {{ transformFIO(item.manager[0]) }}
    </div>
    <div v-html="transformStatus(item.status)" class="list__column"></div>
    <div class="list__column"></div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img
            :class="{
              none: !item.oneC.requested,
              req: item.oneC.requested && !item.oneC.accepted,
            }"
            :title="getOneCStatus(item.oneC)"
            src="@/assets/icons/1c_icon.svg"
            alt=""
          />
        </div>
        <div class="table__icon">
          <img
            alt=""
            src="@/assets/icons/info_icon.svg"
            v-if="infoItem._id !== item._id"
            @click="$emit('toggleInfo', item)"
          />
          <img
            alt=""
            v-else
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleInfo', item)"
          />
        </div>
        <div class="table__icon">
          <img src="@/assets/icons/write_icon.svg" alt="" />
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
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.order-item {
  .list__column:first-child {
    text-align: left;
  }
  .none {
    opacity: 0.3;
    filter: grayscale(100%);
  }
}
</style>
