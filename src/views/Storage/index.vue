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
                <v-search
                  @submit="getSearchData"
                  v-model="search"
                  placeholder="Поиск по категории, бренду, товару или артикулу"
                />
                <div class="list__title title">
                  <div class="title__item">
                    <router-link
                      :class="{ 'title__item--inactive': current.length }"
                      :to="`/dashboard/storage/1`"
                    >
                      Снабженец
                    </router-link>
                  </div>
                  <router-link
                    class="title__item"
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
                <div class="list__columns">
                  <div class="list__column">
                    <img
                      alt=""
                      v-if="current.length"
                      src="@/assets/icons/back.svg"
                      @click="$router.go(-1)"
                    />
                    Название категории
                  </div>
                </div>
              </div>
              <div
                class="list__row list__row--shadow list__row--white"
                v-for="item in dataset.categories"
              >
                <v-category :current="current" :key="item._id" :item="item" />
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
import VSearch from "@/components/VSearch";
import axios from "@/api/axios";
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
    VSearch,
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
      search: "",
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
    getSearchData() {
      this.dataset = {
        categories: [],
        brands: [],
        products: [],
      };
      let search = this.good;
      if (search.length < 3) {
        this.$toast.error("Запрос слишком короткий!");
        this.changeStatus(true);
        return;
      }
      this.$router.push(`/dashboard/${this.$route.name}/1/search`);
      axios({
        url: `/categories/getfromsearch`,
        data: {
          search: search,
          region: this.filtersOptions.region,
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        let dataset = {};
        dataset.categories = result.data.categories;
        dataset.brands = result.data.brands;
        dataset.products = result.data.products;
        this.dataset = dataset;
        this.$toast.success("Результаты запросов!");
        this.isLoading = true;
      });
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
@import "@/styles/_variables";

.storage-page {
  .list__header {
    .list__columns {
      grid-template-columns: 1fr;
    }
  }
  .list__column {
    text-align: left !important;

    img {
      margin-right: 10px;
    }

    &:first-child {
    }
  }

  .title {
    display: flex;

    &__item {
      color: rgba(0, 0, 0, 0.3);
      position: relative;
      margin-right: 10px;

      &.router-link-active {
        color: $color-black;
      }

      & + * {
        padding-left: 15px;

        &::before {
          content: "/";
          position: absolute;
          color: rgba(0, 0, 0, 0.3);
          left: 0;
          top: 0;
          bottom: 0;
        }
      }
    }
  }

  .list__columns {
    grid-template-columns: 1fr;
  }

  .title__item--inactive {
    color: rgba(0, 0, 0, 0.3);
  }
}
</style>
