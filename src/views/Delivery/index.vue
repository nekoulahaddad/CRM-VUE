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
          <div class="page__buttons">
            <v-button v-if="false" red>Партнеры</v-button>
            <v-button v-if="false" @click="goToLink('deliveryMap')" white>
              Карта поставщиков
            </v-button>
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
        <div class="scroll-horizontal">
          <div class="list">
            <div class="list__header">
              <v-search
                @submit="getSearchData"
                v-model="search"
                :placeholder="$t('pages.delivery.searchPlaceholder')"
              />
              <div class="list__title">Партнеры</div>
              <div class="list__columns">
                <div
                  v-for="field in $t('pages.delivery.fields')"
                  class="list__column"
                >
                  {{ field }}
                </div>
              </div>
            </div>
            <!-- Блок для добавления поставщика -->
            <v-add-item v-if="addDelivery" @fetchData="fetchData" />

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
                  :index="index"
                  :item="item"
                  :infoItem="infoItem"
                  :editedItem="editedItem"
                  @toggleInfo="toggleInfo"
                  @toggleEdit="toggleEdit"
                  @toggleDelete="toggleDelete"
                />

                <!-- Блок с детальной информацией о доставке -->
                <v-info v-if="infoItem._id === item._id" :item="item" />

                <!-- Блок редактирования информации о доставке -->
                <v-edit
                  v-if="editedItem._id === item._id"
                  :editedItem="editedItem"
                  :item="item"
                  @toggleEdit="toggleEdit"
                  @refresh="fetchData"
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
import VEdit from "./components/VEdit";
import VItem from "./components/VItem";
import VInfo from "./components/VInfo";
import VAddItem from "./components/VAddItem";
import VDeleteModal from "./components/VDeleteModal";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VButton from "@/components/VButton";
import VSearch from "@/components/VSearch";
import VFilterToggle from "@/components/VFilterToggle";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import dataMixins from "@/mixins/data";
import axios from "@/api/axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  mixins: [dataMixins],
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
    VAddItem,
    VPageHeader,
    VFilterToggle,
    VDeleteModal,
  },
  computed: {
    ...mapGetters(["sidebar"]),
    addDelivery() {
      return this.$store.state.actions.addDelivery;
    },
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
    goToLink(name) {
      this.$router.push({ name });
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    toggleInfo(item) {
      this.editedItem = {};

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
      this.infoItem = {};

      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }
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

        const { data } = await this.getDataFromPage(
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
      let search = this.search;

      if (!search.trim().length) {
        this.fetchData();
        return;
      }

      if (search.length < 3) {
        this.$toast.error("Запрос слишком короткий!");
        return;
      }

      this.isLoading = false;

      axios({
        url: "/providers/getfromsearch",
        data: { search },
        method: "POST",
      })
        .then((res) => {
          this.dataset = res.data.providers;
        })
        .finally(() => {
          this.isLoading = true;
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

  .page__header {
    max-width: 1827px;
  }
  .filter-toggle {
    right: 10px;
  }
}
</style>
