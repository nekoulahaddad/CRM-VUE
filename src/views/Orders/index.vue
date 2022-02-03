<template>
  <div class="page orders-page">
    <v-page-header
      :title="$t('pages.orders.pageTitle')"
      icon="orders_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left" v-if="showFilter">
        <v-filter
          type="orders"
          :totalCost="cost"
          :totalProfit="profit"
          :totalShippedSum="shippedSum"
          :totalDeliverySum="deliverySum"
          @refreshDates="refreshDates"
        />
      </div>

      <!-- Контент -->
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <v-spinner v-if="!isLoading" />
        <template v-else-if="orders.length">
          <div class="scroll-horizontal">
            <div class="list list-shadow">
              <div class="list__header">
                <v-search
                  @submit="getSearchData"
                  v-model="searchStr"
                  :placeholder="$t('pages.employee.searchPlaceholder')"
                />
                <div class="list__title">
                  {{ $t("pages.orders.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    class="list__column list__column--filter"
                    @click="sort('number')"
                  >
                    <span>№:</span>
                    <img
                      alt=""
                      src="@/assets/icons/filter_down.svg"
                      :class="{
                        'list__filter-icon--active':
                          filtersOptions.number === -1,
                      }"
                      class="list__filter-icon"
                    />
                  </div>
                  <div class="list__column">Клиент:</div>
                  <div class="list__column">Регион:</div>
                  <div
                    class="list__column list__column--filter"
                    @click="sort('created')"
                  >
                    <span>Дата создания:</span>
                    <img
                      alt=""
                      src="@/assets/icons/filter_down.svg"
                      :class="{
                        'list__filter-icon--active':
                          filtersOptions.created === -1,
                      }"
                      class="list__filter-icon"
                    />
                  </div>
                  <div
                    class="list__column list__column--filter"
                    @click="sort('buyed')"
                  >
                    <span>Оплачен:</span>
                    <img
                      alt=""
                      src="@/assets/icons/filter_down.svg"
                      :class="{
                        'list__filter-icon--active':
                          filtersOptions.buyed === -1,
                      }"
                      class="list__filter-icon"
                    />
                  </div>
                  <div
                    class="list__column list__column--filter"
                    @click="sort('deliver')"
                  >
                    <span>Доставлен:</span>
                    <img
                      alt=""
                      src="@/assets/icons/filter_down.svg"
                      :class="{
                        'list__filter-icon--active':
                          filtersOptions.deliver === -1,
                      }"
                      class="list__filter-icon"
                    />
                  </div>
                  <div class="list__column">Сумма:</div>
                  <div class="list__column">Доставка:</div>
                  <div class="list__column">Менеджер:</div>
                  <div class="list__column">Статус:</div>
                  <div class="list__column">1С:</div>
                </div>
              </div>

              <!-- Блок для добавления нового заказа -->
              <v-add-item v-if="addOrder" />

              <div
                v-for="item in orders.slice(0, 15)"
                :key="item._id"
                class="list__row list__row--white"
                :class="{
                  'list__row--opened':
                    infoItem._id === item._id || editedItem._id === item._id,
                }"
              >
                <v-item
                  :item="item"
                  :infoItem="infoItem"
                  :editedItem="editedItem"
                  @toggleInfo="toggleInfo"
                  @toggleEdit="toggleEdit"
                />

                <!-- Блок с детальной информацией о заказе -->
                <v-info :infoItem="infoItem" v-if="infoItem._id === item._id" />

                <v-edit
                  :editedItem="item"
                  v-if="editedItem._id === item._id"
                  @refreshDates="refreshDates"
                />
              </div>
            </div>
          </div>
          <v-pagination :count="getOrdersCount" />
        </template>
        <v-not-found-query v-else />
      </div>
    </div>
  </div>
</template>

<script>
import VItem from "./components/VItem";
import VAddItem from "./components/VAddItem";
import VInfo from "./components/VInfo";
import VEdit from "./components/VEdit";
import axios from "@/api/axios";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VSearch from "@/components/VSearch";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VSearch,
    VItem,
    VInfo,
    VEdit,
    VAddItem,
    VPageHeader,
  },
  data() {
    return {
      showFilter: false,
      startDate: null,
      endDate: null,
      count: 0,
      filtersOptions: {
        dates: "all",
        client: "all",
        created: -1,
        deliver: null,
        buyed: null,
        number: null,
        status: "all",
        region: null,
        executor: this.role === "manager" ? this.$store.state._id : null,
        search: "",
        type: "all",
      },
      isLoading: false,
      add: false,
      open: false,
      infoItem: {},
      edit: false,
      editedItem: {},
      searchStr: "",
      deletedItem: {},
      deleted: false,
      downloadExcelFile: false,
    };
  },
  computed: {
    ...mapGetters({
      getOrders: "getOrders",
      getOrdersCount: "getOrdersCount",
      getTotalCost: "getTotalCost",
      getTotalProfit: "getTotalProfit",
      getTotalShippedSum: "getTotalShippedSum",
      getTotalDelivery: "getTotalDelivery",
      sidebar: "sidebar",
    }),
    addOrder() {
      return this.$store.state.actions.addOrder;
    },
    orders: {
      get: function () {
        return this.getOrders;
      },
      set: function (newValue) {
        this.orders.push(newValue);
      },
    },
    role: {
      get: function () {
        let role = this.getUserRole();

        return role.role;
      },
    },
    cost: {
      get: function () {
        return this.getTotalCost;
      },
    },
    profit: {
      get: function () {
        return this.getTotalProfit;
      },
    },
    shippedSum: {
      get: function () {
        return this.getTotalShippedSum;
      },
    },
    deliverySum: {
      get: function () {
        return this.getTotalDelivery;
      },
    },
  },
  watch: {
    $route: function () {
      this.fetchData();
    },
    filtersOptions: {
      handler: async function () {
        await this.fetchData();
        if (
          this.filtersOptions.region &&
          this.filtersOptions.region !== "all"
        ) {
          this.downloadExcelFile = true;
        } else {
          this.downloadExcelFile = false;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.filtersOptions.executor =
      this.role === "manager" ? this.$store.state._id : null;
    this.fetchData();
  },
  methods: {
    ...mapActions({
      getOrdersFromPage: "getOrdersFromPage",
    }),
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    async getManagerOrders(executor) {
      this.isLoading = false;
      if (executor === this.filtersOptions.executor) {
        this.filtersOptions.executor = null;
        return;
      }
      this.filtersOptions.executor = executor;
      this.$router.push(`/dashboard/${this.$route.name}/1`);
      await this.getOrdersFromPage({
        page: +this.$route.params.page,
        filtersOptions: this.filtersOptions,
      });
      this.isLoading = true;
    },
    async getUserOrders(client) {
      this.isLoading = false;
      if (client === this.filtersOptions.client) {
        this.filtersOptions.client = "all";
        return;
      }
      this.filtersOptions.client = client;
      this.$router.push(`/dashboard/${this.$route.name}/1`);
      await this.getOrdersFromPage({
        page: +this.$route.params.page,
        filtersOptions: this.filtersOptions,
      });
      this.isLoading = true;
    },
    refreshDates(startDate, endDate) {
      this.isLoading = false;
      this.filtersOptions.startDate = startDate;
      this.filtersOptions.endDate = endDate;
      this.fetchData();
      this.isLoading = true;
    },
    sort(type) {
      switch (type) {
        case "created":
          if (this.filtersOptions.created) {
            this.filtersOptions.created *= -1;
            this.filtersOptions.buyed = null;
            this.filtersOptions.deliver = null;
            this.filtersOptions.number = null;
            return;
          }
          this.filtersOptions.created = -1;
          this.filtersOptions.buyed = null;
          this.filtersOptions.deliver = null;
          this.filtersOptions.number = null;
          break;
        case "buyed":
          if (this.filtersOptions.buyed) {
            this.filtersOptions.buyed *= -1;
            this.filtersOptions.created = null;
            this.filtersOptions.deliver = null;
            this.filtersOptions.number = null;
            return;
          }
          this.filtersOptions.buyed = -1;
          this.filtersOptions.created = null;
          this.filtersOptions.deliver = null;
          this.filtersOptions.number = null;
          break;
        case "deliver":
          if (this.filtersOptions.deliver) {
            this.filtersOptions.deliver *= -1;
            this.filtersOptions.buyed = null;
            this.filtersOptions.created = null;
            this.filtersOptions.number = null;
            return;
          }
          this.filtersOptions.deliver = -1;
          this.filtersOptions.buyed = null;
          this.filtersOptions.created = null;
          this.filtersOptions.number = null;
          break;
        case "number":
          if (this.filtersOptions.number) {
            this.filtersOptions.number *= -1;
            this.filtersOptions.buyed = null;
            this.filtersOptions.deliver = null;
            this.filtersOptions.created = null;
            return;
          }
          this.filtersOptions.number = -1;
          this.filtersOptions.buyed = null;
          this.filtersOptions.deliver = null;
          this.filtersOptions.created = null;
          break;
      }
    },
    toggleAdd() {
      this.add = !this.add;
    },
    toggleDelete(item) {
      if (!this.deleted) {
        this.deletedItem = item;
      } else {
        this.deletedItem = {};
      }
      this.deleted = !this.deleted;
    },
    async deleteOrder() {
      await this.getOrdersFromPage({
        page: +this.$route.params.page,
        filtersOptions: this.filtersOptions,
      });
    },
    toggleOpen(item) {
      if (!this.open) {
        this.infoItem = item;
      } else {
        setTimeout(() => {
          this.infoItem = {};
        });
      }
      this.open = !this.open;
    },
    toggleInfo(item) {
      this.editedItem = {};

      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
    toggleEdit(item) {
      this.infoItem = {};

      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }
    },
    async getSearchData() {
      if (this.searchStr.length) {
        this.filtersOptions.search = this.searchStr.trim();
        this.$router.push(`/dashboard/${this.$route.name}/1`);
        await this.getOrdersFromPage({
          page: +this.$route.params.page,
          filtersOptions: this.filtersOptions,
        });
        return;
      }
      delete this.filtersOptions.search;
      await this.getOrdersFromPage({
        page: +this.$route.params.page,
        filtersOptions: this.filtersOptions,
      });
    },
    async fetchData() {
      this.downloadExcelFile = true;
      this.isLoading = false;

      await this.getOrdersFromPage({
        page: +this.$route.params.page,
        filtersOptions: this.filtersOptions,
      }).finally(() => {
        this.isLoading = true;
        this.$scrollTo("body", 300, {});
      });
    },
    async downloadExcel() {
      this.changeStatus(false);
      this.downloadExcelFile = false;
      axios({
        url: "/regions/getbyslug",
        data: {
          slug: this.filtersOptions.region,
        },
        method: "POST",
      }).then(async (res) => {
        axios({
          url: "/excel/getordersfromregion",
          data: {
            region: res.data.region._id,
            status: this.filtersOptions.status,
          },
          method: "POST",
        }).then(async () => {
          this.$toast.success("Начинаю генерировать Excel!");
        });
      });

      this.changeStatus(true);
    },
  },
};
</script>

<style scoped lang="scss">
.orders-page {
  .list__header .list__column:last-child {
    text-align: right;
    position: relative;
    right: 107px;
  }
  .list__columns {
    grid-template-columns: 50px 120px 100px 100px 100px 100px 100px 100px 120px 250px 1fr;
  }
  .list__columns {
    .list__column:first-child {
      text-align: left;
    }
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 50px 167px 160px 156px 140px 140px 140px 140px 140px 321px 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 50px 160px 200px 140px 120px 120px 120px 120px 160px 240px 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: 50px 120px 120px 140px 120px 120px 120px 120px 120px 240px 1fr;
    }
  }
}
</style>
