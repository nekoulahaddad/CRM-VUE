<template>
  <div class="list__info list-info callback-list-info">
    <div class="group__title text--blue">
      {{ $t("pages.callbacks.callbackInfo") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("phone") }}
        </div>
        <div class="group__value">{{ item.phone }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("fio") }}
        </div>
        <div class="group__value">
          {{ transformFIO(item.client) }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("region") }}
        </div>
        <div class="group__value">{{ item.region.title }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("category") }}
        </div>
        <div class="group__value">
          {{ item.category.category.categoryName }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("description") }}
        </div>
        <div class="group__value">{{ item.message }}</div>
      </div>
    </div>
    <div class="group__title text--blue">
      {{ $t("executor") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("fio") }}
        </div>
        <div class="group__value">{{ transformFIO(item.issuedTo) }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("status") }}
        </div>
        <div class="group__value">{{ item.status }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("orderNumber") }}
        </div>
        <div class="group__value">
          {{ item.orderNumber ? item.orderNumber : "-" }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("comment") }}
        </div>
        <div class="group__value">{{ item.comment }}</div>
      </div>
    </div>
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

<style lang="scss">
@import "@/styles/_variables";

.callback-list-info {
  .group__title {
    position: relative;

    &:not(:first-child) {
      padding-top: 10px;
      &::before {
        display: block;
        content: "";
        position: absolute;
        height: 2px;
        width: 100%;
        top: 0;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }
  }
}
</style>
