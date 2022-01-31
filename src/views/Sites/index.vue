<template>
  <div class="page delivery-page">
    <v-page-header
      :title="$t('pages.sites.pageTitle')"
      icon="sites_title"
      :filterToggle="false"
    />
    <div class="page__body d-flex">
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
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import { mapGetters } from "vuex";
import axios from "@/api/axios";

export default {
  components: { VPageHeader, VSpinner, VNotFoundQuery, VPagination },
  data() {
    return {
      showFilter: false,
      dataset: [],
      filtersOptions: {},
      isLoading: false,
      item: {},
      status: false,
      excelImportForm: false,
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
      this.excelImportForm = !this.excelImportForm;
      if (this.excelImportForm) {
        this.item = item ? item : false;
      } else {
        this.item = null;
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
