<template>
  <div class="list__info list-info mail-list-info">
    <div class="group__title text--blue">
      {{ $t("pages.mail.info") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("client") }}
        </div>
        <div class="group__value">{{ item.name }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("phone") }}
        </div>
        <div class="group__value">{{ item.phone }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("region") }}
        </div>
        <div class="group__value">{{ item.regionTitle || "..." }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("date") }}
        </div>
        <div class="group__value">{{ transformTime(item.createdAt) }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("type") }}
        </div>
        <div class="group__value">{{ item.formType }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("status") }}
        </div>
        <div
          class="group__value"
          :class="{ 'text--red': !item.status, 'text--green': item.status }"
        >
          {{ item.status ? $t("processed") : $t("notProcessed") }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
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
