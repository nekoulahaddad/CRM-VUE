<template>
  <div
    class="list__columns list__columns--shadow set-list__columns list__columns--white"
  >
    <div class="list__column">
      <div v-if="infoItem.region">{{ infoItem.region.title }}</div>
      <div v-else>...</div>
    </div>
    <div class="list__column">
      {{ infoItem.role }}
    </div>
    <div class="list__column">
      {{ infoItem.department.title }}
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip v-if="!showInfo" label="Просмотр">
            <img
              @click="$emit('toggleInfo', infoItem)"
              src="@/assets/icons/info_icon.svg"
              alt=""
            />
          </VueCustomTooltip>
          <img
            alt=""
            src="@/assets/icons/arrow_top_icon.svg"
            v-else
            @click="$emit('toggleInfo', infoItem)"
          />
        </div>
        <div class="table__icon" style="width: 28px">
          <VueCustomTooltip v-if="!showEdit" label="Изменить">
            <img
              @click="$emit('toggleEdit', editedItem)"
              src="@/assets/icons/write_icon.svg"
              alt=""
            />
          </VueCustomTooltip>
          <img
            alt=""
            src="@/assets/icons/arrow_top_icon.svg"
            v-else
            @click="$emit('toggleEdit', editedItem)"
          />
        </div>
        <div class="table__icon">
          <VueCustomTooltip label="Удалить">
            <img
              @click="$emit('toggleDelete', infoItem)"
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
    showEdit: Boolean,
    showInfo: Boolean,
    editedItem: {
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
