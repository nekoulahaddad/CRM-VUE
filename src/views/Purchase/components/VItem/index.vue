<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column list__column--number">
      {{ item.number }}
    </div>
    <div class="list__column text--green">
      {{ transformDate(item.createdAt) }}
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
      {{ transformFIO(item.initiator) }}
    </div>
    <div class="list__column text--blue">
      {{ transformFIO(item.executor) }}
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
    <div class="list__column">
      <div
        :class="
          item.status === 'отказ'
            ? 'text--red'
            : item.status === 'подтвержденный'
            ? 'text--green'
            : 'text--blue-delos'
        "
      >
        {{ item.status ? item.status : "-" }}
      </div>
    </div>
    <div class="list__column text--green">
      {{ item.deliveryDate ? transformDate(item.deliveryDate) : "-" }}
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img src="@/assets/icons/info_icon.svg" alt="" />
        </div>
      </div>
    </div>
    <div class="list__column"></div>
    <div class="list__column"></div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
