<template>
  <div class="page seo-page">
    <v-page-header
      :title="$t('pages.seo.pageTitle')"
      icon="seo_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />
    <div class="page__body d-flex">
      <div class="page__left" v-if="showFilter">
        <v-filter type="goods" ref="filters" />
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
        <div v-else-if="!filtersOptions.region">{{ $t("chooseRegion") }}</div>
        <template
          v-else-if="dataset.products.length || dataset.categories.length"
        >
          <div class="scroll-horizontal">
            <div class="list list-shadow">
              <div class="list__header">
                <v-search
                  @submit="getSearchData"
                  v-model="good"
                  placeholder="Поиск по категории, бренду, товару или артикулу"
                />
                <div class="list__title title">
                  <div class="title__item">
                    <router-link
                      :class="{ 'title__item--inactive': current.length }"
                      :to="`/dashboard/seo/1`"
                    >
                      {{ $t("pages.seo.pageTitle") }}
                    </router-link>
                  </div>
                  <router-link
                    class="title__item"
                    v-for="item in current"
                    :to="`/dashboard/seo/${
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
                    {{
                      dataset.categories.length
                        ? current.length
                          ? "Название подкатегории:"
                          : "Название категории:"
                        : "Название товара:"
                    }}
                  </div>
                </div>
              </div>
              <div
                v-for="item in dataset.categories"
                :key="item._id"
                class="list__row list__row--shadow list__row--white"
                :class="{ 'list__row--opened': editedItem._id === item._id }"
              >
                <v-item
                  :current="current"
                  :item="item"
                  :showEdit="editedItem._id === item._id"
                  @toggleEdit="toggleEdit"
                />

                <!-- Блок с формой редактирования -->
                <v-edit
                  v-if="editedItem._id === item._id"
                  type="categories"
                  :item="editedItem"
                  :region="filtersOptions.region"
                  @toggleEdit="toggleEdit"
                />
              </div>
              <div
                v-for="item in dataset.products"
                :key="item._id"
                class="list__row list__row--shadow list__row--white"
                :class="{ 'list__row--opened': editedItem._id === item._id }"
              >
                <v-product
                  :item="item"
                  :showEdit="editedItem._id === item._id"
                  @toggleEdit="toggleEdit"
                />

                <v-edit
                  v-if="editedItem._id === item._id"
                  type="products"
                  :item="editedItem"
                  :region="filtersOptions.region"
                  @toggleEdit="toggleEdit"
                />
              </div>
            </div>
          </div>
          <v-pagination v-if="count > 15" :count="count" />
        </template>
        <v-not-found-query v-else />
      </div>
    </div>
  </div>
</template>

<script>
import VEdit from "./components/VEdit";
import VItem from "./components/VItem";
import VProduct from "./components/VProduct";
import VFilter from "@/components/VFilter";
import axios from "@/api/axios";
import VSearch from "@/components/VSearch";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import getDataFromPage from "../../api/getDataFromPage";
import { mapGetters, mapMutations } from "vuex";
import { REGION_MOSCOW_ID } from "../../constants";

export default {
  components: {
    VFilter,
    VEdit,
    VItem,
    VNotFoundQuery,
    VPagination,
    VSpinner,
    VProduct,
    VSearch,
    VPageHeader,
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
  watch: {
    $route: function () {
      this.filtersOptions.nesting = +this.$route.params.nesting - 1;
      this.filtersOptions.parent_value = this.$route.params.parent_value;
      this.filtersOptions.type = this.$route.params.type;
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
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    getSearchData() {
      let search = this.good;

      if (!search.trim().length) {
        this.fetchData();
        return;
      }

      if (search.trim().length < 3) {
        this.$toast.error("Запрос слишком короткий!");
        this.changeStatus(true);
        return;
      }

      this.isLoading = false;

      this.dataset = {
        categories: [],
        brands: [],
        products: [],
      };

      //this.$router.push(`/dashboard/${this.$route.name}/1/search`);
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
        dataset.products = result.data.products;
        this.dataset = dataset;

        if (
          result.data.categories.length ||
          result.data.brands.length ||
          result.data.products.length
        ) {
          this.$toast.success("Результаты запросов!");
        } else {
          this.$toast.error("Результаты не найдены!");
          this.good = "";
          this.$router.push(`/dashboard/${this.$route.name}/1`);
        }
        this.isLoading = true;
        this.changeStatus(true);
      });
    },
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;
        this.filtersOptions.type = this.$route.params.type;

        const result = await getDataFromPage(
          `/${this.$route.params.type || "categories"}/get`,
          this.filtersOptions
        );

        this.dataset.categories = result.data.categories;
        this.dataset.products = result.data.products;
        this.count = result.data.count;
      } catch (e) {
      } finally {
        this.isLoading = true;
      }
    },
    toggleEdit(type, item) {
      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
        this.type = type;
      }
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.seo-page {
  .list__columns {
    grid-template-columns: 1fr 1fr;
  }

  .list__header {
    .list__column {
      img {
        margin-right: 10px;
      }
    }
  }

  .list__column {
    &:first-child {
      text-align: left;
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
  .title__item--inactive {
    color: rgba(0, 0, 0, 0.3);
  }

  .page__right--middle {
    .list {
      width: 1421px;
    }
  }
  .page__right--full {
    .list {
      width: 1590px;
    }
  }
}
</style>
