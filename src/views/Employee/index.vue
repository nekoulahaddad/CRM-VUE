<template>
  <div class="page employee-page">
    <v-delete-item :deletedItem="deletedItem" @refresh="refresh" />

    <div
      class="page__header page-header"
      :class="{ 'page-header--collapse': sidebar }"
    >
      <div class="page-header__inner">
        <div class="page-header__left">
          <div class="page__icon">
            <img :src="require(`@/assets/icons/education_title.svg`)" alt="" />
          </div>
          <h1 class="page__title">{{ $t("pages.employee.pageTitle") }}</h1>
          <v-filter type="employee" />
          <v-filter-toggle @toggleFilter="toggleFilter" :active="showFilter" />
        </div>
      </div>
    </div>

    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left" v-if="showFilter">
        <v-filter type="group" />
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
            <v-add-item v-if="addEmployee" />
            <div class="list">
              <div class="list__header">
                <v-search
                  @submit="getSearchData"
                  v-model="user"
                  :placeholder="$t('pages.employee.searchPlaceholder')"
                />
                <div class="list__title">
                  {{ $t("pages.employee.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.employee.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>
              <div
                v-for="(employee, index) in dataset"
                :key="employee._id"
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened':
                    infoItem._id === employee._id ||
                    editedItem._id === employee._id,
                }"
              >
                <v-item
                  :index="index"
                  :role="role"
                  :infoItem="infoItem"
                  :employee="employee"
                  :editedItem="editedItem"
                  @toggleInfo="toggleInfo"
                  @toggleEdit="toggleEdit"
                  @toggleDelete="toggleDelete"
                />

                <!-- Блок с детальной информацией о сотруднике -->
                <v-info
                  v-if="infoItem._id === employee._id"
                  :employee="employee"
                />

                <!-- Блок с формой редактирования сотрудника -->
                <v-edit
                  v-if="editedItem._id === employee._id"
                  :infoItem="editedItem"
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
import VItem from "./components/VItem";
import VEdit from "./components/VEdit";
import VInfo from "./components/VInfo";
import VAddItem from "./components/VAddItem";
import VDeleteItem from "./components/VDeleteItem";
import VFilter from "@/components/VFilter";
import VFilterToggle from "@/components/VFilterToggle";
import VPageHeader from "@/components/VPageHeader";
import VSearch from "@/components/VSearch";
import VSpinner from "@/components/VSpinner";
import VPagination from "@/components/VPagination";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "@/api/getDataFromPage";
import axios from "@/api/axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    VAddItem,
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VItem,
    VInfo,
    VSearch,
    VEdit,
    VFilterToggle,
    VPageHeader,
    VDeleteItem,
  },
  data() {
    return {
      showFilter: false,
      openEdit: false,
      openDelete: false,
      open: {
        create: false,
        view: false,
        edit: false,
        delete: false,
        childrenExport: false,
      },
      dataset: [],
      addedItem: {},
      deletedItem: {},
      updatedItem: {},
      infoItem: {},
      editedItem: {},
      isLoading: false,
      count: 0,
      filtersOptions: {},
      user: "",
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
    addEmployee() {
      return this.$store.state.actions.addEmployee;
    },
    firedUsers() {
      return this.$store.state.actions.firedUsers;
    },
    options: {
      get: function () {
        let options = this.getUserRole();
        return options.options;
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    async getData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          "/user/get",
          this.filtersOptions
        );

        this.dataset = data.users;
        this.count = data.count;
      } catch (e) {
      } finally {
        this.isLoading = true;
        this.infoItem = {};
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
    async refresh() {
      try {
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          "/user/get",
          this.filtersOptions
        );

        this.dataset = data.users;
        this.count = data.count;
      } catch (e) {
      } finally {
        this.infoItem = {};
        this.$scrollTo("body", 300, {});
      }
    },
    toggleDelete(deletedItem) {
      this.deletedItem = deletedItem;
      this.$modal.show("deleteEmployee");
    },
    getSearchData() {
      this.changeStatus(false);

      if (this.user.trim().length < 3) {
        this.$toast.error("Запрос слишком короткий!");
        this.changeStatus(true);
      } else {
        this.isLoading = false;

        axios
          .get(`/user/getsearchwithoutdirector/${this.user}`)
          .then(async (res) => {
            if (res.data.users.length) {
              this.dataset = res.data.users;
              this.count = res.data.count ? res.data.count : 0;
              this.$toast.success("Результаты запросов!");
            } else {
              this.$toast.error("Результаты не найдены!");
              this.user = "";
            }

            this.changeStatus(true);
            this.$forceUpdate();
          })
          .finally(() => {
            this.isLoading = true;
          });
      }
    },
    resetFilters() {
      this.$refs.filters.filterOptions = {};
      this.$refs.filters.activeIndex = 0;
      this.filtersOptions = {};
    },
    async downloadUsers() {
      this.changeStatus(false);
      axios({
        url: `/excel/users`,
        data: {
          region: this.filtersOptions.region ?? "all",
        },
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.$toast.success(result.data.message);
        })
        .catch((error) => {
          this.$toast.error(error.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
  },
  watch: {
    $route: async function () {
      await this.getData();
    },
    filtersOptions: {
      handler: async function () {
        await this.getData();
      },
      deep: true,
    },
    firedUsers() {
      if (this.firedUsers) {
        this.downloadUsers();
      }
    },
  },
};
</script>

<style lang="scss">
.employee-page {
  .list__columns {
    grid-template-columns: 160px 160px 350px 120px 120px 250px 1fr;
  }
  .list__column:last-child {
    padding-left: 20px;
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 200px 260px 440px 170px 170px 300px 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: 160px 160px 400px 150px 150px 300px 1fr;
    }
  }

  .page-header__left {
    position: relative;
    width: 100%;
  }

  .filter-toggle {
    position: absolute;
    right: 0;
  }
}
</style>
