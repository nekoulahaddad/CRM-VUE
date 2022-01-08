<template>
  <div class="list__info list-info">
    <div class="group__title text--blue">
      {{ $t("pages.clients.clientInfo") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderNumber") }}
        </div>
        <div class="group__value">{{ order.number }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
};
</script>
