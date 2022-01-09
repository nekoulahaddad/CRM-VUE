<template>
  <div class="page reports-page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/reports_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("pages.reports.pageTitle") }}</h1>
    </div>
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left">
        <v-filter type="reports" />
      </div>

      <!-- Контент -->
      <div class="page__right">
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
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import getDataFromPage from "@/api/getDataFromPage";
import dateMixins from "@/mixins/date";
import fioMixins from "@/mixins/fio";
import markMixins from "@/mixins/mark";
import statusMixins from "@/mixins/status";

export default {
  mixins: [dateMixins, fioMixins, markMixins, statusMixins],
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VReport,
    VReportInfo,
  },
  data() {
    return {
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
    grid-template-columns: 30px 450px 140px 140px 140px 140px 140px 140px 1fr;
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
