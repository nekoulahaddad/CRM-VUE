<template>
  <div class="list__columns list__columns-shadow list__columns-white">
    <div class="list__column text--blue">
      {{ transformFIO(infoItem.leader) || "Не указан" }}
    </div>
    <div class="list__column text--green">
      {{ infoItem.count || "0" }}
    </div>
    <div class="list__column text--blue">
      {{ infoItem.title }}
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <img src="@/assets/icons/info_icon.svg" alt="" />
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
