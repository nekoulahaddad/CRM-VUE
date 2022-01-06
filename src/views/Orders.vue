<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/orders_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Заказы</h1>
    </div>
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left">
        <v-filter
          type="orders"
          :totalCost="cost"
          :totalProfit="profit"
          :totalShippedSum="shippedSum"
          :totalDeliverySum="deliverySum"
          @refreshDates="refreshDates"
        />
      </div>
      <div class="page__right">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="orders.length">
          <div class="list list-shadow">
            <div class="list__header">
              <div class="list__title">Заказы</div>
              <div class="list__columns">
                <div
                  v-for="field in $t('pages.orders.fields')"
                  class="list__column"
                >
                  {{ field }}
                </div>
              </div>
            </div>

            <div
              v-for="item in orders.slice(0, 15)"
              :key="item._id"
              class="list__row list__row-white"
            >
              <div
                class="list__columns list__columns-shadow list__columns-white"
              >
                <div class="list__column">{{ item.number }}</div>
                <div class="list__column text--blue">
                  {{ transformName(item.client) }}
                </div>
                <div class="list__column">{{ item.region.title }}</div>
                <div class="list__column text-green">
                  {{ transformDate(item.createdAt) }}
                </div>
                <div class="list__column text--sapphire">
                  {{ item && item.buyed ? transformDate(item.buyed) : "" }}
                </div>
                <div class="list__column text--sapphire">
                  {{ item.deliver ? transformDate(item.deliver) : "" }}
                </div>
                <div class="list__column">
                  {{ item.sum.toFixed(2) + " " + item.region.valute.icon }}
                </div>
                <div class="list__column">
                  {{
                    (item.deliverySum ? item.deliverySum.toFixed(2) : "0.00") +
                    " " +
                    item.region.valute.icon
                  }}
                </div>
                <div class="list__column text--blue">
                  {{ transformFIO(item.manager[0]) }}
                </div>
                <div
                  v-html="transformStatus(item.status)"
                  class="list__column"
                ></div>
                <div class="list__column"></div>
                <div class="list__column">
                  <div class="table__actions">
                    <div class="table__icon">
                      <img
                        :class="{
                          none: !item.oneC.requested,
                          req: item.oneC.requested && !item.oneC.accepted,
                        }"
                        :title="getOneCStatus(item.oneC)"
                        src="@/assets/icons/1c_icon.svg"
                        alt=""
                      />
                    </div>
                    <div class="table__icon">
                      <img src="@/assets/icons/info_icon.svg" alt="" />
                    </div>
                    <div class="table__icon">
                      <img src="@/assets/icons/write_icon.svg" alt="" />
                    </div>
                  </div>
                </div>
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
import axios from "@/api/axios";
import VFilter from "@/components/VFilter";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import dateMixins from "@/mixins/date";
import nameMixins from "@/mixins/name";
import oneCMixins from "@/mixins/oneC";
import roleMixins from "@/mixins/role";
import statusMixins from "@/mixins/status";
import fioMixins from "@/mixins/fio";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  mixins: [
    dateMixins,
    fioMixins,
    oneCMixins,
    nameMixins,
    roleMixins,
    statusMixins,
  ],
  components: { VFilter, VSpinner, VNotFoundQuery, VPagination },
  data() {
    return {
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
    }),
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
    toggleEdit(item) {
      if (!this.edit) {
        this.editedItem = item;
      } else {
        setTimeout(() => {
          this.editedItem = {};
        });
      }
      this.edit = !this.edit;
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
.list__columns {
  grid-template-columns: 60px 140px repeat(10, minmax(140px, 1fr));
}
</style>
