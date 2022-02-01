<template>
  <div class="list__columns list__columns-shadow list__columns-white">
    <div class="list__column">
      {{ index + 1 + ($route.params.page - 1) * 15 }}
    </div>
    <div class="list__column">
      <div class="bg bg--blue-light">
        {{ item.name }}
      </div>
    </div>
    <div class="list__column">
      {{ item.specialist ? item.specialist.name : "" }}
    </div>
    <div class="list__column text--green">
      {{ item.specialist ? item.specialist.phone : "" }}
    </div>
    <div class="list__column">
      {{ item.specialist ? item.specialist.email : "" }}
    </div>
    <div class="list__column text--sapphire">
      {{ item.office_address }}
    </div>
    <div class="list__column">
      <div class="table__actions">
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
            src="@/assets/icons/arrow_top_icon.svg"
            v-else
            @click="$emit('toggleInfo', item)"
          />
        </div>
        <div class="table__icon">
          <VueCustomTooltip label="Изменить">
            <img src="/icons/write_icon.svg" alt="" />
          </VueCustomTooltip>
        </div>
        <div class="table__icon">
          <VueCustomTooltip label="Удалить">
            <img
              @click="$emit('toggleDelete', item)"
              src="/icons/trash_icon.svg"
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
    index: Number,
    item: {
      type: Object,
      required: true,
    },
    infoItem: {
      type: Object,
      required: true,
    },
  },
};
</script>
