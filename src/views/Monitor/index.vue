<template>
  <div class="page monitor-page">
    <v-page-header title="Дашборд" icon="monitor_title" :filterToggle="false" />
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter
          type="monitor"
          @refreshDates="refreshDates"
          @setRegionsPool="setRegionsPool"
        />
        <v-revs :isLoading="isLoading" :rev="rev" />
      </div>
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <div class="scroll-horizontal">
          <v-top-blocks :rev="rev" :clientsForMonth="clientsForMonth" />
          <div class="d-flex">
            <!-- Заявки за текущей месяц -->
            <v-mail-by-month />
            <!-- Новые клиенты -->
            <v-clients
              :workload="workload"
              :clientCount="clients"
              :taskCount="tasks"
              :employeeCount="users"
            />
          </div>
          <div class="d-flex">
            <!-- Топ продаваемых продуктов -->
            <v-top-products :items="popularItems" />
            <div class="d-flex flex-column">
              <v-chart :sales="sales" :ordersForMonth="ordersForMonth" />
              <!-- Обучение -->
              <v-learn />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VLearn from "./components/VLearn";
import VRevs from "./components/VRevs";
import VChart from "./components/VChart";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VTopBlocks from "./components/VTopBlocks";
import VClients from "./components/VClients";
import VMailByMonth from "./components/VMailByMonth";
import VTopProducts from "./components/VTopProducts";
import axios from "@/api/axios";
import { mapGetters } from "vuex";

export default {
  components: {
    VClients,
    VFilter,
    VChart,
    VLearn,
    VMailByMonth,
    VRevs,
    VTopBlocks,
    VTopProducts,
    VPageHeader,
  },
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
  },
  data() {
    return {
      showFilter: true,
      startDate: null,
      endDate: null,
      clientsForMonth: 0,
      isLoading: false,
      type: "online",
      filtersOptions: {},
      users: 0,
      clients: 0,
      tasks: 0,
      workload: 0,
      sales: {},
      popularItems: [],
      orders: {
        all: 0,
        processed: 0,
        declained: 0,
      },
      ordersForMonth: [],
      rev: {},
    };
  },
  methods: {
    async getStats() {
      this.isLoading = false;

      axios({
        url: "/stats/get/",
        data: {
          startDate: this.startDate ? this.startDate : null,
          endDate: this.endDate ? this.endDate : null,
          regionsPool: this.regionsPool,
        },
        method: "POST",
      })
        .then(async (res) => {
          let result = await res.data;
          this.users = result.users;
          this.clients = result.clients;
          this.tasks = result.tasks;
          this.clientsForMonth = result.clientsForMonth;
          this.workload = result.workload;
          this.sales = result.sales;
          this.orders = result.orders;
          this.ordersForMonth = result.ordersForMonth;
          this.popularItems = result.popularItems;
          this.rev = result.rev;
          this.$toast.success("Статистика обновлена!");
        })
        .finally(() => {
          this.isLoading = true;
        });
    },
    setRegionsPool(pool) {
      this.regionsPool = pool;
      this.getStats();
    },
    refreshDates(startDate, endDate, pool) {
      this.startDate = startDate;
      this.endDate = endDate;
      this.regionsPool = pool;
      this.getStats();
    },
  },
  mounted() {
    this.getStats();
  },
};
</script>

<style lang="scss">
.monitor-page {
  .page__left {
    margin-right: 6px;
  }
  .scroll-horizontal {
    padding-left: 0;
  }
  .page-header {
    max-width: 1822px !important;
  }
}
</style>
