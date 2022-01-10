<template>
  <div
    class="list__columns list__columns-shadow list__columns-white mail-list-columns"
  >
    <div class="list__column">{{ item.number }}</div>
    <div class="list__column text--blue">
      {{
        item.client && item.client[0]
          ? transformName(item.client[0])
          : item.name
      }}
    </div>
    <div class="list__column">{{ item.regionTitle }}</div>
    <div class="list__column text--green">
      {{ transformTime(item.createdAt) }}
    </div>
    <div class="list__column">{{ item.formType }}</div>
    <div class="list__column text--blue">
      {{ item.manager && item.manager[0] ? transformFIO(item.manager[0]) : "" }}
    </div>
    <div class="list__column">{{ item.orderNumber }}</div>
    <div class="list__column">
      <VueCustomTooltip
        v-if="item.comment"
        :multiline="true"
        :label="item.comment"
      >
        {{ $t("comment") }}
      </VueCustomTooltip>
    </div>
    <div class="list__column">
      <div
        :class="{
          'text--red': !item.status,
          'bg bg--green-light': item.status,
        }"
      >
        {{ item.status ? $t("processed") : $t("notProcessed") }}
      </div>
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img src="@/assets/icons/download_icon.svg" alt="" />
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
          <img
            alt=""
            src="@/assets/icons/write_icon.svg"
            v-if="editedItem._id !== item._id"
            @click="$emit('toggleEdit', item)"
          />
          <img
            alt=""
            v-else
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleEdit', item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
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
.mail-list-columns {
  .list__column {
    &:first-child {
      text-align: left;
    }
  }
}
</style>
