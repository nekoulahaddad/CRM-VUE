<template>
  <div class="list__info list-info purchase-list-info">
    <div class="group__title text--blue">
      {{ $t("pages.buying.info") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">ФИО инициатора:</div>
        <div class="group__value">{{ transformFIO(item.initiator) }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("orderNumber") }}
        </div>
        <div class="group__value">{{ item.orderNumber }}</div>
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
          {{ $t("executor") }}
        </div>
        <div class="group__value">{{ transformFIO(item.executor) }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("description") }}
        </div>
        <div class="group__value">{{ item.message }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("status") }}
        </div>
        <div class="group__value">{{ item.status }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("comment") }}
        </div>
        <div class="group__value">{{ item.comment }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("goods") }}
        </div>
        <div class="group__value">
          <div
            v-for="product in item.products"
            class="group__goods group-goods"
          >
            <div class="group-goods__item">
              <div class="group-goods__title">{{ $t("name") }}</div>
              <div class="group-goods__value">{{ product.title }}</div>
            </div>
            <div class="group-goods__item">
              <div class="group-goods__title">{{ $t("article") }}</div>
              <div class="group-goods__value">{{ product.article }}</div>
            </div>
            <div class="group-goods__item">
              <div class="group-goods__title">{{ $t("quantity") }}</div>
              <div class="group-goods__value">{{ product.quantity }}</div>
            </div>
            <div class="group-goods__item">
              <div class="group-goods__title">{{ $t("total") }}</div>
              <div class="group-goods__value">
                {{ product.cost }} {{ product.valute }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("dateDelivery") }}
        </div>
        <div class="group__value">{{ transformDate(item.createdAt) }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("created") }}
        </div>
        <div class="group__value">{{ transformDate(item.createdAt) }}</div>
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

.purchase-list-info {
  .group__title {
    font-size: 16px;
  }

  .group-goods {
    position: relative;

    &:not(:first-child) {
      padding-top: 10px;

      &::before {
        content: "";
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }

    & + * {
      margin-top: 10px;
    }

    &__item {
      display: flex;

      & + * {
        margin-top: 5px;
      }
    }
    &__title {
      font-weight: 600;
      margin-right: 5px;
    }
    &__value {
    }
  }
}
</style>
