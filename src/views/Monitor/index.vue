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
      <div class="page__right">
        <div class="scroll-horizontal">
          <v-top-blocks />
          <div class="d-flex">
            <!-- Заявки за текущей месяц -->
            <v-mail-by-month />
            <!-- Новые клиенты -->
            <v-clients />
          </div>
          <div class="d-flex">
            <!-- Топ продаваемых продуктов -->
            <v-top-products />
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
  data() {
    return {
      startDate: null,
      endDate: null,
      isLoading: false,
      type: "online",
      filtersOptions: {},
      users: 0,
      clients: 0,
      tasks: 0,
      workload: 0,
      sales: {
        today: 0,
        yesterday: 0,
        week: 0,
        month: 0,
      },
      orders: {
        all: 0,
        processed: 0,
        declained: 0,
      },
      ordersForMonth: [],
      rev: {
        today: 0,
        yesterday: 0,
        week: 0,
        weekAgo: 0,
        month: 0,
        monthAgo: 0,
      },
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
          this.workload = result.workload;
          this.sales = result.sales;
          this.orders = result.orders;
          this.ordersForMonth = result.ordersForMonth;
          this.rev = result.rev;
          this.$toast.success("Статистика обновлена!");
        })
        .finally(() => {
          this.isLoading = true;
        });
    },
    setRegionsPool(pool) {
      this.regionsPool = pool;
      this.isLoading = false;
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
}
</style>
