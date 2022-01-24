<template>
  <div class="page">
    <v-page-header
      title="Снабженец"
      icon="storage_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />
    <div class="page__body d-flex">
      <div class="page__left" v-if="showFilter">
        <v-filter type="goods" />
      </div>
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <div v-if="!filtersOptions.region">Выберите регион</div>
        <v-spinner v-else-if="!isLoading" />
        <template v-else-if="dataset.categories.length">
          <table class="table table--separate">
            <thead class="thead">
              <tr class="thead__top">
                <td colspan="12">
                  <div class="table__title">Заказы</div>
                </td>
              </tr>
              <tr class="thead__bottom">
                <td>Название категории:</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in dataset.categories" :key="item.id">
                <td>{{ item.categoryName }}</td>
              </tr>
            </tbody>
          </table>
          <v-pagination :count="count" />
        </template>
        <v-not-found-query v-else />
      </div>
    </div>
  </div>
</template>

<script>
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import { mapGetters, mapMutations } from "vuex";
import getDataFromPage from "../../api/getDataFromPage";
import { REGION_MOSCOW_ID } from "../../constants";

export default {
  components: { VFilter, VPagination, VSpinner, VNotFoundQuery, VPageHeader },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  data() {
    return {
      showFilter: false,
      isLoading: false,
      dataset: {
        products: [],
        categories: [],
        brands: [],
      },
      type: "",
      current: [],
      filtersOptions: {
        region: REGION_MOSCOW_ID,
      },
      count: 0,
      editForm: false,
      editedItem: {},
      good: "",
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    updateGoods(res) {
      this.dataset.categories = res.data.categories;
      this.dataset.products = res.data.products;
      this.dataset.brands = res.data.brands;
      this.count = res.data.count;
    },
    async fetchData() {
      try {
        this.isLoading = false;
        this.updateGoods(
          await getDataFromPage(
            `/${this.$route.params.type || "categories"}/get`,
            this.filtersOptions
          )
        );
      } catch (e) {
      } finally {
        this.isLoading = true;
      }
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.isLoading = false;
    if (parseInt(to.params.nesting) < parseInt(from.params.nesting)) {
      this.current.splice(to.params.nesting - 1, this.current.length);
    }
    if (parseInt(to.params.nesting) <= 1 || !to.params.nesting) {
      this.current.splice(0, this.current.length);
    }
    this.isLoading = true;
    next();
  },
  watch: {
    $route: function () {
      this.filtersOptions.nesting = +this.$route.params.nesting - 1;
      this.filtersOptions.parent_value = this.$route.params.parent_value;
      this.filtersOptions.type = this.$route.params.type;
      this.filtersOptions.page = this.$route.params.page;
      if (this.$route.params.type !== "search") {
        this.fetchData();
      }
    },
    filtersOptions: {
      handler: function () {
        if (this.$route.params.type !== "search") {
          this.fetchData();
        }
      },
      deep: true,
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped lang="scss">
.table {
  .thead__bottom {
    td {
      text-align: left;
    }
  }
}
</style>
