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
          <img src="/icons/info_icon.svg" alt="" />
        </div>
        <div class="table__icon">
          <img src="/icons/write_icon.svg" alt="" />
        </div>
        <div class="table__icon">
          <img src="/icons/trash_icon.svg" alt="" />
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
  },
};
</script>
