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
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderProfile") }}
        </div>
        <div class="group__value">{{ transformProfile(order.payment) }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderCustomer") }}
        </div>
        <div class="group__value">
          {{
            user
              ? transformName(user)
              : order.client
              ? transformName(order.client)
              : ""
          }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderPhone") }}
        </div>
        <div class="group__value">
          {{ user ? user.phone : order.client.phone }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderCity") }}
        </div>
        <div class="group__value">
          {{ user ? user.region.title : order.region.title }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderCreated") }}
        </div>
        <div class="group__value">{{ transformDate(order.createdAt) }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderPayed") }}
        </div>
        <div class="group__value">
          {{ transformDate(order.buyed) }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderPayedType") }}
        </div>
        <div class="group__value">
          {{ transformPayment(order.payment, order.acquiringNum) }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderStatus") }}
        </div>
        <div class="group__value" v-html="transformStatus(order.status)" />
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderOneC") }}
        </div>
        <div class="group__value">{{ getOneCStatus(order.oneC) }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderDelivered") }}
        </div>
        <div class="group__value">
          {{ order.deliver ? transformDate(order.deliver) : "" }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderManager") }}
        </div>
        <div class="group__value">
          {{
            order.manager !== null
              ? Array.isArray(order.manager)
                ? transformFIO(order.manager[0])
                : transformFIO(order.manager)
              : ""
          }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.clients.orderManagerComment") }}
        </div>
        <div class="group__value">{{ order.manager_comment }}</div>
      </div>
    </div>
    <template v-if="order.products.length">
      <div class="group__title text--blue">Товары:</div>
      <div class="list">
        <div class="list__header">
          <div class="list__columns">
            <div class="list__column">№:</div>
            <div class="list__column">Название товара:</div>
            <div class="list__column">Артикул:</div>
            <div class="list__column">Кол-во:</div>
            <div class="list__column">Цена за ед.:</div>
            <div class="list__column">Итог:</div>
          </div>
        </div>
      </div>
      <div v-for="(product, index) in order.products" :key="product._id">
        <div>{{ index + 1 }}</div>
        <div>{{ product.title }}</div>
        <div>{{ product.article }}</div>
        <div>{{ product.quantity }}</div>
        <div>
          {{ product.cost.toFixed(2) + " " + order.region.valute.icon }}
        </div>
        <div>
          {{
            (product.cost * product.quantity).toFixed(2) +
            " " +
            order.region.valute.icon
          }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.group__title {
  position: relative;

  &:not(:first-child) {
    padding-top: 10px;

    &:before {
      content: "";
      position: absolute;
      display: flex;
      height: 2px;
      background-color: $color-gray-secondary;
      top: 0;
      left: 0;
      right: 0;
    }
  }
}
</style>
