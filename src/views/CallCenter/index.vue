<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/callbacks_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("pages.callbacks.pageTitle") }}</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter type="callCenterIssues" />
      </div>
      <div class="page__right">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <div class="scroll-horizontal">
            <div class="list list-shadow">
              <div class="list__header">
                <div class="list__title">
                  {{ $t("pages.callbacks.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.callbacks.fields')"
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
                :class="{
                  'list__row--opened':
                    infoItem._id === item._id || editedItem._id === item._id,
                }"
              >
                <v-call-back
                  :item="item"
                  :infoItem="infoItem"
                  :editedItem="editedItem"
                  @toggleInfo="toggleInfo"
                  @toggleEdit="toggleEdit"
                />

                <!-- Блок с детальной информацией об обращении -->
                <v-call-back-info
                  :item="item"
                  v-if="infoItem._id === item._id"
                />

                <!-- Блок с формой редактирования обращения -->
                <v-edit-form
                  :editedItem="editedItem"
                  v-if="editedItem._id === item._id"
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
import VCallBack from "./components/VCallBack";
import VEditForm from "./components/VEditForm";
import VCallBackInfo from "./components/VCallBackInfo";
import VFilter from "@/components/VFilter";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "@/api/getDataFromPage";
import dateMixins from "@/mixins/date";
import fioMixins from "@/mixins/fio";

export default {
  mixins: [dateMixins, fioMixins],
  components: {
    VFilter,
    VNotFoundQuery,
    VPagination,
    VSpinner,
    VCallBack,
    VEditForm,
    VCallBackInfo,
  },
  mounted() {
    this.fetchData();
  },
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
      edit: false,
      editedItem: {},
      info: false,
      count: 0,
      search: "",
      infoItem: {},
      isSearch: false,
    };
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          `/callcenterissues/get`,
          this.filtersOptions
        );

        this.dataset = data.callCenterIssues;
        this.count = data.count;
      } catch (e) {
      } finally {
        this.editedItem = {};
        this.infoItem = {};
        this.isLoading = true;
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
    toggleEdit(item) {
      this.infoItem = {};

      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
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
.list__columns {
  grid-template-columns: 30px 120px 140px 140px 140px 140px 230px 140px 140px 140px 230px 1fr;
}
.list__header {
  .list__column {
    &:first-child {
      text-align: left;
    }
  }
}
</style>
