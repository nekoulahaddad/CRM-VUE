<template>
  <div class="list__columns list__columns-shadow list__columns-white">
    <div class="list__column text--blue">
      {{ transformFIO(infoItem.leader) || "Не указан" }}
    </div>
    <div class="list__column text--green">
      {{ infoItem.count || "0" }}
    </div>
    <div class="list__column text--blue">
      <div class="bg bg--green-light">{{ infoItem.title }}</div>
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip label="Просмотр">
            <img src="@/assets/icons/info_icon.svg" alt="" />
          </VueCustomTooltip>
        </div>
        <div class="table__icon">
          <VueCustomTooltip label="Изменить">
            <img src="@/assets/icons/write_icon.svg" alt="" />
          </VueCustomTooltip>
        </div>
        <div class="table__icon">
          <VueCustomTooltip label="Удалить">
            <img src="@/assets/icons/trash_icon.svg" alt="" />
          </VueCustomTooltip>
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
  },
};
</script>
