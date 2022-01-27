<template>
  <div class="page clients-page">
    <v-page-header
      title="Клиенты"
      icon="clients_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />
    <div class="page__body d-flex">
      <div class="page__left" v-if="showFilter">
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
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
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
                    :opened="infoSubItem._id === order._id"
                    :user="item"
                    @toggleSubInfo="toggleSubInfo"
                  />

                  <!-- Блок с детальной информацией о заказе -->
                  <v-order-info
                    v-if="infoSubItem._id === order._id"
                    :user="item"
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
import VPageHeader from "@/components/VPageHeader";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "@/api/getDataFromPage";
import { mapGetters } from "vuex";

export default {
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VClient,
    VOrderInfo,
    VOrder,
    VPageHeader,
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  data() {
    return {
      showFilter: false,
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
    toggleFilter() {
      this.showFilter = !this.showFilter;
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
    toggleSubInfo(user, item) {
      if (this.infoSubItem._id === item._id) {
        this.infoSubItem = {};
        this.user = user;
      } else {
        this.user = user;
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
.clients-page {
  .list__columns {
    grid-template-columns: 30px 250px 250px 140px 120px 120px 120px 120px 1fr;
  }
  .list__header {
    .list__column {
      &:first-child {
        text-align: left;
      }
    }
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 30px 250px 250px 250px 250px 250px 220px 250px 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 30px 220px 220px 400px 200px 200px 200px 200px 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: 30px 250px 220px 220px 220px 180px 180px 180px 1fr;
    }
  }
}
</style>
