<template>
  <div class="page seo-page">
    <v-page-header
      :title="$t('pages.seo.pageTitle')"
      icon="seo_title"
      @toggleFilter="toggleFilter"
    />
    <div class="page__body d-flex">
      <div class="page__left" v-if="showFilter">
        <v-filter type="goods" ref="filters" />
      </div>
      <div class="page__right" :class="{ 'page__right--full': !showFilter }">
        <div v-if="!filtersOptions.region">{{ $t("chooseRegion") }}</div>
        <v-spinner v-else-if="!isLoading" />
        <template v-else-if="dataset.categories.length">
          <div class="scroll-horizontal">
            <div class="list list-shadow">
              <div class="list__header">
                <div class="list__title">
                  {{ $t("pages.seo.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.seo.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>
              <div
                v-for="(item, index) in dataset.categories"
                :key="item._id"
                class="list__row list__row--shadow list__row--white"
                :class="{ 'list__row--opened': editedItem._id === item._id }"
              >
                <v-item :item="item" @toggleEdit="toggleEdit" />

                <!-- Блок с формой редактирования -->
                <v-edit v-if="editedItem._id === item._id" :item="item" />
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
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import getDataFromPage from "../../api/getDataFromPage";
import { mapMutations } from "vuex";

export default {
  components: {
    VFilter,
    VEdit,
    VItem,
    VNotFoundQuery,
    VPagination,
    VSpinner,
    VPageHeader,
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
      filtersOptions: {},
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
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

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
};
</script>

<style lang="scss">
.seo-page {
  .list__columns {
    grid-template-columns: 1fr 1fr;
  }

  .list__column {
    &:first-child {
      text-align: left;
    }
  }
}
</style>
