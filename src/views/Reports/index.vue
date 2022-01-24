<template>
  <div class="page reports-page">
    <v-page-header
      :title="$t('pages.reports.pageTitle')"
      icon="reports_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left" v-if="showFilter">
        <v-filter type="reports" />
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
        <template v-else-if="dataset.length">
          <div class="scroll-horizontal">
            <div class="list list-shadow">
              <div class="list__header">
                <div class="list__title">
                  {{ $t("pages.reports.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.reports.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>
              <div
                v-for="(item, index) in dataset"
                :key="index"
                class="list__row list__row--shadow list__row--white"
                :class="{ 'list__row--opened': item._id === infoItem._id }"
              >
                <v-report
                  :index="index"
                  :report="item"
                  :infoItem="infoItem"
                  @toggleInfo="toggleInfo"
                />
                <v-report-info
                  v-if="item._id === infoItem._id"
                  :report="item"
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
import VReport from "./components/VReport";
import VReportInfo from "./components/VReportInfo";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import getDataFromPage from "@/api/getDataFromPage";
import { mapGetters } from "vuex";

export default {
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VReport,
    VReportInfo,
    VPageHeader,
  },
  data() {
    return {
      showFilter: false,
      infoForm: false,
      isLoading: false,
      dataset: [],
      infoItem: {},
      count: 0,
      filtersOptions: {
        dates: "all",
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
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
  mounted() {
    if (this.user) {
      this.filtersOptions.executor = this.user._id;
    }
    this.fetchData();
  },
  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          "/reports/get",
          this.filtersOptions
        );

        this.dataset = data.reports;
        this.count = data.count;
      } catch (e) {
      } finally {
        this.isLoading = true;
        this.$scrollTo("body", 300, {});
      }
    },
    toggleInfo(item) {
      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
    resetFilters() {
      this.$refs.filters.filterOptions = {};
      this.$refs.filters.activeIndex = 0;
      this.filtersOptions = {};
    },
  },
};
</script>

<style lang="scss">
.reports-page {
  .list__columns {
    grid-template-columns: 30px 318px 140px 140px 140px 140px 140px 140px 1fr;
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
