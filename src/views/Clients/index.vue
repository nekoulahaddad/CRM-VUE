<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/clients_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Клиенты</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <!-- Фильтр -->
        <v-filter
          type="clients"
          :countClients="countClients"
          :totalCost="totalCost"
          :totalProfit="profit"
          :totalShippedSum="shippedSum"
          @refreshDates="refreshDates"
        />
      </div>
      <div class="page__right">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <div class="scroll-horizontal">
            <div class="list list-shadow">
              <div class="list__header">
                <div class="list__title">
                  {{ $t("pages.clients.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.clients.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>
              <div
                v-for="(item, index) in dataset"
                :key="item._id"
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened': infoItem._id === item._id,
                }"
              >
                <!-- Блок с клиентом -->
                <v-client
                  :index="index"
                  :client="item"
                  :infoItem="infoItem"
                  @toggleInfo="toggleInfo"
                />

                <div
                  v-for="(order, index) in item.orders"
                  :key="order._id"
                  class="list__row list__row--shadow list__row--white"
                >
                  <!-- Блок с заказами клиента -->
                  <v-order
                    v-if="infoItem._id === item._id"
                    :order="order"
                    :infoItem="infoItem"
                    @toggleSubInfo="toggleSubInfo"
                  />

                  <!-- Блок с детальной информацией о заказе -->
                  <v-order-info
                    v-if="infoSubItem._id === order._id"
                    :order="order"
                  />
                </div>
              </div>
            </div>
          </div>
          <v-pagination :count="count" />
        </template>
        <v-not-found-query v-else />
      </div>
    </div>
  </div>
</template>

<script>
import VClient from "./components/VClient";
import VOrder from "./components/VOrder";
import VOrderInfo from "./components/VOrderInfo";
import VFilter from "@/components/VFilter";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "@/api/getDataFromPage";
import nameMixins from "@/mixins/name";

export default {
  mixins: [nameMixins],
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VClient,
    VOrderInfo,
    VOrder,
  },
  mounted() {
    this.fetchData();
  },
  data() {
    return {
      openFormEdit: false,
      editedItem: {},
      isLoading: false,
      activeElement: -1,
      filtersOptions: {
        search: "",
        type: "clients",
        clubcard: null,
      },
      dataset: [],
      count: 0,
      countClients: 0,
      totalCost: 0,
      profit: 0,
      shippedSum: 0,
      openForm: false,
      infoItem: {},
      infoSubItem: {},
      searchStr: "",
      openFormAdd: false,
      openFormDelete: false,
      deletedItem: {},
    };
  },
  methods: {
    refreshDates(startDate, endDate) {
      this.fetchData();
    },
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          `/clients/get`,
          this.filtersOptions
        );

        this.dataset = data.clients;
        this.count = data.count;
        this.countClients = data.countClients;
        this.totalCost = data.totalCost;
        this.profit = data.profit;
        this.shippedSum = data.shippedSum;
      } catch (e) {
      } finally {
        this.isLoading = true;
        this.infoItem = {};
        this.infoSubItem = {};
        this.$scrollTo("body", 300, {});
      }
    },
    toggleInfo(item) {
      this.infoSubItem = {};

      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
    toggleSubInfo(item) {
      if (this.infoSubItem._id === item._id) {
        this.infoSubItem = {};
      } else {
        this.infoSubItem = item;
      }
    },
  },
  watch: {
    $route: function () {
      this.fetchData();
    },
    filtersOptions: {
      handler: function () {
        this.fetchData();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.list__columns {
  grid-template-columns: 30px 250px 250px 140px 120px 120px 120px 120px 120px;
}
.list__header {
  .list__column {
    &:first-child {
      text-align: left;
    }
  }
}
</style>
