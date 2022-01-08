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
                <v-client
                  :index="index"
                  :client="item"
                  :infoItem="infoItem"
                  @toggleInfo="toggleInfo"
                />

                <!-- Блок с детальной информацией о заказе -->
                <v-client-info v-if="infoItem._id === item._id" />
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
import VClientInfo from "./components/VClientInfo";
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
    VClientInfo,
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
        this.$scrollTo("body", 300, {});
      }
    },
    toggleInfo(item) {
      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
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
</style>
