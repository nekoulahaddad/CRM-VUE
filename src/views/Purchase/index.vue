<template>
  <div class="page purchase-page">
    <v-delete-item :deletedItem="deletedItem" @fetchData="fetchData" />

    <v-page-header
      icon="buying_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />
    <div class="page__body d-flex">
      <div class="page__left" v-if="showFilter">
        <v-filter type="purchase" />
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

            <!-- Блок добавления закупки -->
            <v-add-item v-if="addPurchase" />

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
                <v-item
                  :item="item"
                  :infoItem="infoItem"
                  :editedItem="editedItem"
                  @toggleInfo="toggleInfo"
                  @toggleEdit="toggleEdit"
                  @toggleDelete="toggleDelete"
                />

                <!-- Блок с детальной информацией о закупке -->
                <v-info :item="item" v-if="infoItem._id === item._id" />

                <!-- Блок для редактирования закупки -->
                <v-edit
                  :item="item"
                  v-if="editedItem._id === item._id"
                  @fetchData="fetchData"
                  @toggleEdit="toggleEdit"
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
import VItem from "./components/VItem";
import VAddItem from "./components/VAddItem";
import VInfo from "./components/VInfo";
import VEdit from "./components/VEdit";
import VDeleteItem from "./components/VDeleteItem";
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
    VNotFoundQuery,
    VPagination,
    VSpinner,
    VItem,
    VEdit,
    VInfo,
    VAddItem,
    VDeleteItem,
    VPageHeader,
  },
  computed: {
    ...mapGetters(["sidebar"]),
    addPurchase() {
      return this.$store.state.actions.addPurchase;
    },
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
    this.$store.commit("deactivateAction", "addPurchase");
    this.fetchData();
  },
  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    toggleDelete(deletedItem) {
      this.deletedItem = deletedItem;
      this.$modal.show("deletePurchase");
    },
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;
        this.filtersOptions.initiator = null;

        const { data } = await this.getDataFromPage(
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
.purchase-page {
  .page__header {
    max-width: 1837px;
    padding-right: 20px;
  }

  .list__columns {
    grid-template-columns: 30px 120px 130px 230px 140px 140px 110px 110px 110px 1fr;
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
      grid-template-columns: 30px 160px 160px 300px 180px 180px 180px 180px 160px 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 30px 160px 160px 230px 160px 160px 160px 160px 160px 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: 30px 120px 160px 230px 160px 160px 139px 160px 120px 1fr;
    }
  }
}
</style>
