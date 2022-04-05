<template>
  <div class="page orders-page">
    <!-- Модальное окно для подтверждения удаления заказа -->
    <v-delete-item
      :deletedItem="deletedItem"
      :selectedItems="selectedItems"
      :deleteMany="deleteMany"
      @afterDelete="afterDelete"
    />

    <v-order-action-modal :dialog="dialog" />

    <!-- Модальное окно для отправки закупщику заказа -->
    <v-send-delivery :editedItem="sendDeliveryItem" @toggleEdit="toggleEdit" />

    <v-page-header
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
        <div class="scroll-horizontal">
          <div class="list list-shadow">
            <div class="list__header">
              <v-search
                @submit="getSearchData"
                @input="searchInput"
                v-model="searchStr"
                placeholder="Поиск по Ф.И.О. или номеру заказа"
              />
              <div class="list__title">
                {{ $t("pages.orders.pageTitle") }}
              </div>
              <div class="list__columns">
                <div class="list__column list__column--filter">
                  <input
                    type="checkbox"
                    class="form-checkbox"
                    v-model="selectAll"
                    @change="selectAllItems"
                    :disabled="!isLoading || role !== 'superadmin'"
                  />
                  <span @click="sort('number')">
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
                  </span>
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
                      'list__filter-icon--active': filtersOptions.buyed === -1,
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
            <v-add-item v-if="addOrder" @afterAddOrder="afterAddOrder" />

            <v-spinner v-if="!isLoading" />

            <template v-else-if="orders.length">
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
                  :role="role"
                  :checked="selectedItems.includes(item._id)"
                  @toggleInfo="toggleInfo"
                  @toggleEdit="toggleEdit"
                  @toggleDelete="toggleDelete"
                />

                <!-- Блок с детальной информацией о заказе -->
                <v-info :infoItem="infoItem" v-if="infoItem._id === item._id" />

                <v-edit
                  type="edit"
                  :editedItem="item"
                  v-if="editedItem._id === item._id"
                  @toggleEdit="toggleEdit"
                  @refreshDates="refreshDates"
                  @setDialog="setDialog"
                  @toggleSendDelivery="toggleSendDelivery"
                />
              </div>
              <v-pagination :count="getOrdersCount" />
            </template>
            <v-not-found-query v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VItem from "./components/VItem";
import VAddItem from "./components/VAddItem";
import VInfo from "./components/VInfo";
import VEdit from "./components/VEdit";
import VDeleteItem from "./components/VDeleteItem";
import VSendDelivery from "./components/VSendDelivery";
import VDeclainedModal from "./components/VDeclainedModal";
import VOrderActionModal from "./components/VOrderActionModal";
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
    VDeleteItem,
    VOrderActionModal,
    VDeclainedModal,
    VSendDelivery,
  },
  data() {
    return {
      searched: false,
      deleteMany: false,
      sendDeliveryItem: {},
      showFilter: false,
      startDate: null,
      endDate: null,
      count: 0,
      selectAll: false,
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
      dialog: {
        data: { title: "", msg: "" },
      },
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
    deleteSelectedItems() {
      return this.$store.state.deleteSelectedItems;
    },
    selectedItems() {
      const items = this.$store.getters.selectedItems;

      if (!items.length) {
        this.selectAll = false;
      }

      return items;
    },
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
      if (this.searched) {
        this.getSearchData();
      } else {
        this.fetchData();
      }
    },
    deleteSelectedItems(value) {
      if (value) {
        this.toggleDeleteAll();
      }
    },
    filtersOptions: {
      handler: async function () {
        if (this.filtersOptions.dates === "another") {
          return;
        }
        await this.$store.commit("setFilterOptions", this.filtersOptions);
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
    this.$store.commit("deactivateAction", "addOrder");
    this.filtersOptions.executor =
      this.role === "manager" ? this.$store.state._id : null;
    this.fetchData();
    this.$store.commit("setFilterOptions", this.filtersOptions);
  },
  methods: {
    ...mapActions({
      getOrdersFromPage: "getOrdersFromPage",
    }),
    searchInput() {
      if (!this.searchStr.trim().length && this.searched) {
        this.searched = false;
        this.fetchData();
      }
    },
    selectAllItems() {
      this.$store.commit("selectAllItems", {
        ids: this.orders.map((item) => item._id),
        selectAll: this.selectAll,
      });
    },
    setDialog(dialog) {
      this.dialog = dialog;
      this.$modal.show("orderActionModal");
    },
    afterAddOrder() {
      this.$store.commit("toggleAction", { key: "addOrder" });
      this.fetchData();
    },
    afterDelete() {
      this.getOrdersFromPage({
        page: +this.$route.params.page,
        filtersOptions: this.filtersOptions,
      })
        .then(() => {
          if (this.orders.length < 2) {
            this.$router.push({ params: { page: "1" } });
          }
        })
        .finally(() => {
          this.$modal.hide("deleteOrder");
          if (this.deleteMany) {
            this.deleteMany = false;
            this.$store.commit("clearSelectedItems");
          }
          this.$store.commit("toggleDeleteSelectedItems", false);
        });
    },
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
    toggleSendDelivery(item) {
      this.sendDeliveryItem = item;
      this.$modal.show("sendDelivery");
    },
    toggleDelete(item) {
      this.deleteMany = false;
      this.deletedItem = item;
      this.$modal.show("deleteOrder");
    },
    toggleDeleteAll(item) {
      this.deleteMany = true;
      this.$modal.show("deleteOrder");
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
      if (!this.searchStr.trim().length) {
        this.fetchData();
        return;
      }

      this.isLoading = false;
      this.filtersOptions.search = this.searchStr.trim();

      await this.getOrdersFromPage({
        page: +this.$route.params.page,
        filtersOptions: this.filtersOptions,
      });
      this.searched = true;
      delete this.filtersOptions.search;
      this.isLoading = true;
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
  },
};
</script>

<style scoped lang="scss">
.orders-page {
  .list__header .list__column:last-child {
    text-align: right;
    position: relative;
    right: 158px;
  }
  .list__columns {
    grid-template-columns: 70px 120px 100px 100px 100px 100px 100px 100px 120px 215px 1fr;
  }
  .list__columns {
    .list__column:first-child {
      text-align: left;
    }
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 70px 167px 160px 156px 120px 120px 120px 140px 140px 312px 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 70px 200px 120px 140px 110px 110px 110px 120px 160px 240px 1fr;
    }
    .sub-list {
      max-width: 1571px !important;
    }
  }

  .page__right--middle {
    .list__row,
    .list__header {
      width: 1422px;
    }
    .list__columns {
      grid-template-columns: 70px 120px 120px 140px 110px 110px 120px 120px 120px 215px 1fr;
    }
  }
  .page__header {
    max-width: 1827px;
    padding-right: 10px;
  }
}
</style>
