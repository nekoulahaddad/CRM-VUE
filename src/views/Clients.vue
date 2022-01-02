<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/clients_title.svg" alt="" />
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
      <div class="flex-1">
        <v-spinner v-if="!isLoading" />
        <table v-else class="table">
          <thead class="thead">
            <tr class="thead__top">
              <td colspan="9">
                <div class="table__title">Клиенты</div>
              </td>
            </tr>
            <tr class="thead__bottom">
              <td>№:</td>
              <td>Клиент</td>
              <td>Почта:</td>
              <td>Телефон:</td>
              <td>Регион:</td>
              <td>Дата:</td>
              <td>Сумма:</td>
              <td>Клубная карта:</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in dataset" :key="client.id">
              <td>1</td>
              <td class="text--blue">{{ client.name }}</td>
              <td>{{ client.email }}</td>
              <td>{{ client.phone }}</td>
              <td class="text--sapphire">Москва и М.О</td>
              <td class="text--green">13.12.2021</td>
              <td>7409.37 BYN</td>
              <td>...</td>
              <td>
                <img src="/icons/info_icon.svg" alt="" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import VFilter from "@/components/VFilter";
import VSpinner from "@/components/VSpinner";
import getDataFromPage from "@/api/getDataFromPage";

export default {
  components: { VFilter, VSpinner },
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
