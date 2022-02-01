<template>
  <div class="page storage-page">
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
          <div class="scroll-horizontal">
            <div class="list list-shadow">
              <div class="list__header">
                <div class="list__title title title">
                  <div class="title__item">Снабженец</div>
                  <router-link
                    v-for="item in current"
                    :to="`/dashboard/storage/${
                      item.categoryName
                        ? +item.nesting + 2
                        : +$route.params.nesting + 1
                    }/categories/${item._id}/1`"
                  >
                    {{
                      item.categoryName
                        ? item.categoryName
                        : item.name
                        ? item.name
                        : ""
                    }}
                  </router-link>
                </div>
              </div>
              <div
                class="list__row list__row--shadow list__row--white"
                v-for="item in dataset.categories"
              >
                <v-category :key="item._id" :item="item" />
              </div>
            </div>
            <div class="list list-shadow">
              <div
                class="list__row list__row--shadow list__row--white"
                v-for="item in dataset.products"
                :class="{
                  'list__row--opened': editedItem._id === item._id,
                }"
              >
                <v-product
                  :key="item._id"
                  :item="item"
                  @toggleEdit="toggleEdit"
                />

                <v-product-edit
                  v-if="editedItem._id === item._id"
                  :editedItem="editedItem"
                  :region="filtersOptions.region"
                  @toggleEdit="toggleEdit"
                  @editItem="editItem"
                />
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
import VProductEdit from "./components/VProductEdit";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VPagination from "@/components/VPagination";
import VCategory from "./components/VCategory";
import VProduct from "./components/VProduct";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import { mapGetters, mapMutations } from "vuex";
import getDataFromPage from "../../api/getDataFromPage";
import { REGION_MOSCOW_ID } from "../../constants";

export default {
  components: {
    VFilter,
    VPagination,
    VSpinner,
    VNotFoundQuery,
    VPageHeader,
    VCategory,
    VProductEdit,
    VProduct,
  },
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
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
    toggleEdit(item) {
      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }
    },
    editItem(data) {
      let product = data.product;
      let index = this.dataset.products.findIndex(
        (item) => item._id === product._id
      );
      setTimeout(() => {
        let dataset = this.dataset.products;

        dataset[index] = product;
        this.dataset.products = dataset;
        this.editedItem = {};
      }, 500);
      this.changeStatus(true);
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
.storage-page {
  .list__columns {
    grid-template-columns: 1fr;
  }
}
</style>
