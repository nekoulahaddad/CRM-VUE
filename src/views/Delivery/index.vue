<template>
  <div class="page delivery-page">
    <v-delete-modal
      :deletedItem="deletedItem"
      @removeProvider="removeProvider"
    />

    <div
      class="page__header page-header"
      :class="{ 'page-header--collapse': sidebar }"
    >
      <div class="page-header__inner">
        <div class="page-header__left">
          <div class="page__icon">
            <img :src="require(`@/assets/icons/delivery_title.svg`)" alt="" />
          </div>
          <h1 class="page__title">{{ $t("pages.delivery.pageTitle") }}</h1>
          <div class="page__buttons">
            <v-button red>Поставщики</v-button>
            <v-button white>Карта поставщиков</v-button>
          </div>
          <v-filter-toggle @toggleFilter="toggleFilter" :active="showFilter" />
        </div>
      </div>
    </div>

    <div class="page__body d-flex">
      <div class="page__left" v-if="showFilter">
        <v-filter type="providers" />
      </div>
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
                  @toggleDelete="toggleDelete"
                />

                <!-- Блок с детальной информацией о доставке -->
                <v-info v-if="infoItem._id === item._id" :item="item" />

                <!-- Блок редактирования информации о доставке -->
                <v-edit />
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
import VEdit from "./components/VEdit";
import VItem from "./components/VItem";
import VInfo from "./components/VInfo";
import VDeleteModal from "./components/VDeleteModal";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VButton from "@/components/VButton";
import VSearch from "@/components/VSearch";
import VFilterToggle from "@/components/VFilterToggle";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import getDataFromPage from "@/api/getDataFromPage";
import axios from "@/api/axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VInfo,
    VItem,
    VEdit,
    VButton,
    VSearch,
    VPageHeader,
    VFilterToggle,
    VDeleteModal,
  },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  data() {
    return {
      showFilter: false,
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
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
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
    toggleDelete(deletedItem) {
      this.deletedItem = deletedItem;
      this.$modal.show("deleteDelivery");
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

      this.isLoading = false;

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
    grid-template-columns: 30px 318px 220px 160px 140px 260px 1fr;
  }
  .list__column {
    &:first-child {
      text-align: left;
    }
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 30px 400px 350px 220px 220px 260px 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 30px 350px 350px 200px 180px 300px 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: 30px 350px 350px 180px 180px 260px 1fr;
    }
  }

  .filter-toggle {
    position: absolute;
    right: 0;
  }

  .page__buttons {
    margin-left: 10px;
  }
}
</style>
