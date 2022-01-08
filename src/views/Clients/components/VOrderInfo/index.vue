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
