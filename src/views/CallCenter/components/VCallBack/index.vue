<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column list__column--number">
      {{ item.number }}
    </div>
    <div class="list__column">
      {{ item.orderNumber ? item.orderNumber : "-" }}
    </div>
    <div class="list__column text--green">
      {{ transformDate(item.createdAt) }}
    </div>
    <div class="list__column text--blue">
      {{ transformFIO(item.client) }}
    </div>
    <div class="list__column">
      {{ item.phone }}
    </div>
    <div class="list__column">
      {{ item.region.title && item.region.title }}
    </div>
    <div class="list__column">
      <div class="bg bg--blue-light">
        {{ item.category && item.category.category.categoryName }}
      </div>
    </div>
    <div class="list__column text--blue">
      {{ transformFIO(item.issuedBy) }}
    </div>
    <div class="list__column text--blue">
      {{ transformFIO(item.issuedTo) }}
    </div>
    <div class="list__column">
      <VueCustomTooltip
        v-if="item.message"
        :multiline="true"
        :label="item.message"
      >
        Описание
      </VueCustomTooltip>
    </div>
    <div
      class="list__column"
      :class="
        item.status === 'отказ'
          ? 'text--red'
          : item.status === 'подтвержденный'
          ? 'text--green'
          : !item.confirmedAt
          ? 'text--orange'
          : 'text--blue-delos'
      "
    >
      {{ item.status ? item.status : "не подтвержденный" }}
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img
            alt=""
            src="@/assets/icons/info_icon.svg"
            v-if="item._id !== infoItem._id"
            @click="$emit('toggleInfo', item)"
          />
          <img
            alt=""
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleInfo', item)"
            v-else
          />
        </div>
        <div
          v-if="role === 'superadmin' || role === 'call' || role === 'buyer'"
          class="table__icon"
          style="width: 28px"
        >
          <VueCustomTooltip label="Изменить" v-if="item._id !== editedItem._id">
            <img
              alt=""
              src="@/assets/icons/write_icon.svg"
              @click="$emit('toggleEdit', item)"
            />
          </VueCustomTooltip>
          <img
            alt=""
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleEdit', item)"
            v-else
          />
        </div>
        <div
          class="table__icon"
          v-if="role === 'superadmin' || role === 'call' || role === 'buyer'"
        >
          <VueCustomTooltip label="Удалить">
            <img
              @click="$emit('toggleDelete', item)"
              src="@/assets/icons/trash_icon.svg"
              alt=""
            />
          </VueCustomTooltip>
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
    item: {
      type: Object,
      required: true,
    },
    infoItem: {
      type: Object,
      required: true,
    },
    role: String,
  },
};
</script>
