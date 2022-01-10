<template>
  <div class="list__info list-info employee-list-info">
    <div class="group__title text--blue">
      {{ $t("pages.orders.info") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("orderNumber") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("profile") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("customer") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("phone") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("email") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("city") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("created") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("payed") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("payedType") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("deliveryType") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("status") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("oneC") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("delivered") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("manager") }}
        </div>
        <div class="group__value"></div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("managerComment") }}
        </div>
        <div class="group__value"></div>
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
