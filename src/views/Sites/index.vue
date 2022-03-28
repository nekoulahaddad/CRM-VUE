<template>
  <div class="page sites-page">
    <v-page-header icon="sites_title" :filterToggle="false" />
    <div class="page__body d-flex">
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <div class="scroll-horizontal">
          <div class="list">
            <div class="list__header">
              <div class="list__title">
                {{ $t("pages.sites.pageTitle") }}
              </div>
              <div class="list__columns">
                <div
                  v-for="field in $t('pages.sites.fields')"
                  class="list__column"
                >
                  {{ field }}
                </div>
              </div>
            </div>

            <v-spinner v-if="!isLoading" />

            <template v-else-if="dataset.length">
              <div
                v-for="(item, index) in dataset"
                :key="item._id"
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened': excelImportForm._id === item._id,
                }"
              >
                <v-item
                  :index="index"
                  :infoItem="item"
                  :role="role"
                  :excelImportForm="excelImportForm"
                  @updateSite="updateSite"
                  @toggleImportExcel="toggleImportExcel"
                />

                <v-import
                  :item="item"
                  v-if="excelImportForm._id === item._id"
                  @toggleImportExcel="toggleImportExcel"
                />
              </div>
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
import VImport from "./components/VImport";
import dataMixins from "@/mixins/data";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import { mapGetters } from "vuex";
import axios from "@/api/axios";

export default {
  mixins: [dataMixins],
  components: {
    VPageHeader,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VItem,
    VImport,
  },
  data() {
    return {
      showFilter: false,
      dataset: [],
      filtersOptions: {},
      isLoading: false,
      item: {},
      status: false,
      excelImportForm: {},
    };
  },
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
  },
  methods: {
    toggleImportExcel(item) {
      if (this.excelImportForm._id === item._id) {
        this.excelImportForm = {};
      } else {
        this.excelImportForm = item;
      }
    },
    async getSites(result) {
      this.isLoading = false;
      let res = await result;
      this.dataset = res.data.data;
      this.count = res.data.count;
      this.isLoading = true;
    },
    updateSite(id) {
      axios({
        url: `/sites/update/`,
        data: { id: id },
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.$toast.success(result.data.message);
          this.$emit("toggleOpen");
          this.refreshData();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    refreshData() {
      this.isLoading = false;
      let result = this.getDataFromPage("/sites/get", this.filtersOptions);
      this.getSites(result);
      this.isLoading = true;
    },
  },
  mounted() {
    let result = this.getDataFromPage("/sites/get", this.filtersOptions);
    this.getSites(result);
  },
};
</script>

<style lang="scss">
.sites-page {
  .list__columns {
    grid-template-columns: 50px 450px 350px 350px 1fr;
  }
  .list__column {
    &:first-child {
      text-align: left;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 200px 400px 400px 400px 1fr !important;
    }
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 200px 400px 400px 400px 1fr !important;
    }
  }
}
</style>
