<template>
  <div class="list__columns list__columns-shadow list__columns-white">
    <div class="list__column text--blue">
      {{ transformFIO(item.leader) || "Не указан" }}
    </div>
    <div class="list__column text--green">
      {{ item.count || "0" }}
    </div>
    <div class="list__column text--blue">
      <div class="bg bg--green-light">{{ item.title }}</div>
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip v-if="infoItem._id !== item._id" label="Просмотр">
            <img
              @click="$emit('toggleInfo', item)"
              src="@/assets/icons/info_icon.svg"
              alt=""
            />
          </VueCustomTooltip>
          <img
            alt=""
            v-else
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleInfo', item)"
          />
        </div>
        <div class="table__icon">
          <VueCustomTooltip v-if="editedItem._id !== item._id" label="Изменить">
            <img
              @click="$emit('toggleEdit', item)"
              src="@/assets/icons/write_icon.svg"
              alt=""
            />
          </VueCustomTooltip>
          <img
            alt=""
            v-else
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleEdit', item)"
          />
        </div>
        <div class="table__icon">
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
    item: {
      type: Object,
    },
    editedItem: {
      type: Object,
    },
    infoItem: {
      type: Object,
    },
  },
};
</script>
