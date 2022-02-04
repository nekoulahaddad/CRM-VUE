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
    <template v-if="products.length">
      <div class="group__title text--blue">{{ $t("order") }}</div>
      <div class="list sub-list">
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
        <div
          v-for="(product, index) in products"
          :key="product._id"
          class="list__row list__row--shadow list__row--white"
        >
          <div class="list__columns">
            <div class="list__column">{{ index + 1 }}</div>
            <div class="list__column bg bg--blue-light">
              {{ product.title }}
            </div>
            <div class="list__column">{{ product.article }}</div>
            <div class="list__column">{{ product.quantity }}</div>
            <div class="list__column">
              {{ product.cost.toFixed(2) + " " + item.region[0].valute.icon }}
            </div>
            <div class="list__column">
              {{
                (product.cost * product.quantity).toFixed(2) +
                " " +
                item.region[0].valute.icon
              }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import axios from "@/api/axios";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      users: [],
      fio: "",
      titleName: "Просмотр заявки",
      products: [],
      order: null,
    };
  },
  async beforeMount() {
    if (this.item.order.length) {
      this.order = this.item.order[0];
      await this.getProducts(this.order._id);
    }
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    async getProducts(id) {
      axios({
        url: `/orders/getproducts/`,
        data: {
          orderId: id,
        },
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.products = result.data;
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.mail-list-info {
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
  .sub-list {
    width: 100%;

    .list__header {
      position: relative;
      padding-bottom: 10px;
      margin-bottom: 10px;
      height: auto;

      &:after {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }

      .list__columns {
        background-color: $color-white;
      }
    }
    .list__columns {
      justify-content: left !important;
      grid-template-columns: 70px 350px 280px 280px 260px 260px !important;

      .list__column:first-child {
        text-align: left;
        padding-left: 5px;
      }
    }
  }
}
</style>
