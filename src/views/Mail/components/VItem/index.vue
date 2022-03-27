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
    <div class="list__column">{{ item.order[0] && item.order[0].number }}</div>
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
          <template v-if="item.zip">
            <img
              @click="$emit('downloadItem', item.zipPath + item.zip, item.zip)"
              src="@/assets/icons/download_icon.svg"
              alt=""
            />
          </template>
          <div class="table__hidden-icon" v-else></div>
        </div>
        <div class="table__icon">
          <VueCustomTooltip v-if="infoItem._id !== item._id" label="Просмотр">
            <img
              alt=""
              src="@/assets/icons/info_icon.svg"
              @click="$emit('toggleInfo', item)"
            />
          </VueCustomTooltip>
          <img
            alt=""
            v-else
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleInfo', item)"
          />
        </div>
        <div
          v-if="role === 'superadmin' || role === 'manager' || role === 'call'"
          class="table__icon"
          style="width: 28px"
        >
          <VueCustomTooltip v-if="editedItem._id !== item._id" label="Изменить">
            <img
              alt=""
              src="@/assets/icons/write_icon.svg"
              @click="$emit('toggleEdit', item)"
            />
          </VueCustomTooltip>
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
    role: String,
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.mail-list-columns {
  .list__column {
    &:first-child {
      text-align: left;
    }
  }
  .table__actions {
    align-items: center;
  }
}
</style>
