<template>
  <div class="page callbacks-page">
    <v-delete-callback :deletedItem="deletedItem" @fetchData="fetchData" />

    <v-page-header
      icon="callbacks_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />
    <div class="page__body d-flex">
      <div class="page__left" v-if="showFilter">
        <v-filter type="callCenterIssues" />
      </div>
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
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

            <v-add-call-back
              :regions="regions"
              v-if="addCallback"
              @fetchData="fetchData"
            />

            <v-spinner v-if="!isLoading" />
            <template v-else-if="dataset.length">
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
                  :role="role"
                  @toggleInfo="toggleInfo"
                  @toggleEdit="toggleEdit"
                  @toggleDelete="toggleDelete"
                />

                <!-- Блок с детальной информацией об обращении -->
                <v-call-back-info
                  :item="item"
                  v-if="infoItem._id === item._id"
                />

                <!-- Блок с формой редактирования обращения -->
                <v-edit-form
                  :editedItem="editedItem"
                  :regions="regions"
                  @toggleEdit="toggleEdit"
                  @fetchData="fetchData"
                  v-if="editedItem._id === item._id"
                />
              </div>
              <v-pagination :count="count" />
            </template>
            <v-not-found-query v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import VAddCallBack from "./components/VAddCallBack";
import VCallBack from "./components/VCallBack";
import VDeleteCallback from "./components/VDeleteCallback";
import VEditForm from "./components/VEditForm";
import VCallBackInfo from "./components/VCallBackInfo";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import dataMixins from "@/mixins/data";
import { mapGetters } from "vuex";

export default {
  mixins: [dataMixins],
  components: {
    VFilter,
    VAddCallBack,
    VNotFoundQuery,
    VPagination,
    VSpinner,
    VCallBack,
    VEditForm,
    VCallBackInfo,
    VPageHeader,
    VDeleteCallback,
  },
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
    addCallback() {
      return this.$store.state.actions.addCallback;
    },
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
  },
  created() {
    axios({
      url: "/regions/get",
    }).then(async (res) => {
      let result = await res;
      this.regions = result.data.regions;
    });
  },
  mounted() {
    this.$store.commit("deactivateAction", "addCallback");
    this.fetchData();
  },
  data() {
    return {
      showFilter: false,
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
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    toggleDelete(item) {
      this.deletedItem = item;
      this.$modal.show("deleteCallback");
    },
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await this.getDataFromPage(
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
.callbacks-page {
  .list__columns {
    grid-template-columns: 30px 80px 100px 120px 100px 120px 120px 120px 120px 120px 135px 1fr;
  }
  .list__header {
    .list__column {
      &:first-child {
        text-align: left;
      }
    }
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 30px 100px 120px 140px 140px 140px 230px 140px 140px 140px 230px 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 30px 100px 100px 140px 140px 140px 200px 140px 140px 130px 180px 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: 30px 131px 120px 120px 120px 120px 200px 120px 120px 120px 200px 1fr;
    }
  }
}
</style>
