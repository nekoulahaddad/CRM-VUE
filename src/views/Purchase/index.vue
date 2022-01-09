<template>
  <div class="page purchase-page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/buying_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("pages.buying.pageTitle") }}</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter type="purchase" />
      </div>
      <div class="page__right">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <div class="scroll-horizontal">
            <div class="list">
              <div class="list__header">
                <div class="list__title">
                  {{ $t("pages.buying.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.buying.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>
              <div
                v-for="(item, index) in dataset"
                :key="item._id"
                class="list__row list__row--shadow list__row--white"
              >
                <v-item :item="item" />
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
import VItem from "./components/VItem";
import VFilter from "@/components/VFilter";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "../../api/getDataFromPage";

export default {
  components: { VFilter, VNotFoundQuery, VPagination, VSpinner, VItem },
  data() {
    return {
      isLoading: false,
      dataset: [],
      filtersOptions: {
        region: this.region || null,
        nesting: +this.$route.params.nesting - 1 || null,
      },
      open: false,
      addedItem: {},
      deleted: false,
      deletedItem: {},
      infoItem: {},
      edit: false,
      editedItem: {},
      info: false,
      count: 0,
      search: "",
      isSearch: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          `/purchase/get`,
          this.filtersOptions
        );

        this.dataset = data.dataList;
        this.count = data.count;
      } catch (e) {
      } finally {
        this.isLoading = true;
        this.$scrollTo("body", 300, {});
      }
    },
    toggleInfo(item) {
      this.editedItem = {};

      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
  },
  watch: {
    $route: function () {
      this.fetchData();
    },
    filtersOptions: {
      handler: function () {
        this.isSearch = false;
        this.search = "";
        this.fetchData();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.purchase-page {
  .list__columns {
    grid-template-columns: 30px 160px 160px 230px 160px 160px 160px 160px 160px 1fr;
  }
  .list__header {
    .list__column {
      &:first-child {
        text-align: left;
      }
    }
  }
}
</style>
