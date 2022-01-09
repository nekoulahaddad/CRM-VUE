<template>
  <div class="page delivery-page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/delivery_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("pages.delivery.pageTitle") }}</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter type="providers" />
      </div>
      <div class="page__right">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <div class="scroll-horizontal">
            <div class="list">
              <div class="list__header">
                <v-search
                  @submit="getSearchData"
                  v-model="search"
                  :placeholder="$t('pages.delivery.searchPlaceholder')"
                />
                <div class="list__title">
                  {{ $t("pages.delivery.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.delivery.fields')"
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
                  'list__row--opened': infoItem._id === item._id,
                }"
              >
                <v-item
                  :index="index"
                  :item="item"
                  :infoItem="infoItem"
                  @toggleInfo="toggleInfo"
                />

                <!-- Блок с детальной информацией о доставке -->
                <v-info v-if="infoItem._id === item._id" :item="item" />
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
import VInfo from "./components/VInfo";
import VFilter from "@/components/VFilter";
import VSearch from "@/components/VSearch";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import getDataFromPage from "@/api/getDataFromPage";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VInfo,
    VItem,
    VSearch,
  },
  data() {
    return {
      isLoading: false,
      dataset: [],
      filtersOptions: {
        region: "all",
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
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    toggleInfo(item) {
      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
    toggleOpen() {
      this.open = !this.open;
    },
    toggleDelete(id) {
      this.deleted = !this.deleted;
      this.deletedItem._id = id;
    },
    toggleEdit(item) {
      if (!this.edit) {
        this.editedItem = item;
      } else {
        setTimeout(() => {
          this.editedItem = {};
        }, 500);
      }
      this.edit = !this.edit;
    },
    addProvider(provider) {
      this.addedItem = provider;
      let dataset = this.dataset;
      if (dataset.length !== 15) {
        dataset.push(provider);
        this.dataset = dataset;
      }
      this.count++;
      setTimeout(() => {
        this.addedItem = {};
      }, 500);
    },
    removeProvider(provider) {
      this.deletedItem = provider;
      let index = this.dataset.findIndex((item) => item._id === provider._id);
      setTimeout(() => {
        let dataset = this.dataset;
        dataset.splice(index, 1);
        this.dataset = dataset;
      }, 500);
      this.deletedItem = {};
    },
    editProvider(provider) {
      this.editedItem = provider;
      setTimeout(() => {
        let dataset = this.dataset;
        let index = dataset.findIndex((item) => item._id === provider._id);
        dataset[index] = provider;
        this.dataset = dataset;
      }, 500);
      this.editedItem = {};
    },
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          "/providers/get",
          this.filtersOptions
        );

        this.dataset = data.providers;
        this.count = data.count;
      } catch (e) {
      } finally {
        this.isLoading = true;
        this.$scrollTo("body", 300, {});
      }
    },
    getSearchData() {
      this.changeStatus(false);
      this.isSearch = true;
      let search = this.search;
      if (search.length < 3) {
        this.$toast.error("Запрос слишком короткий!");
        this.changeStatus(true);
        return;
      }

      axios({
        url: "/providers/getfromsearch",
        data: { search },
        method: "POST",
      }).then(async (res) => {
        const providers = res.data.providers;
        if (providers.length) {
          this.$toast.success("Результаты запросов!");
        } else {
          this.$toast.error("Результаты не найдены!");
          this.search = "";
        }
        this.dataset = providers;
        this.isLoading = true;
        this.changeStatus(true);
      });
    },
  },
};
</script>

<style lang="scss">
.delivery-page {
  .list__columns {
    grid-template-columns: 30px 350px 220px 160px 140px 260px 1fr;
  }
  .list__column {
    &:first-child {
      text-align: left;
    }
  }
}
</style>
