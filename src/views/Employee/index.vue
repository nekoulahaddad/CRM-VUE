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
            <img :src="require(`@/assets/icons/employees_title.svg`)" alt="" />
          </div>
          <h1 class="page__title">{{ $t("pages.employee.pageTitle") }}</h1>
          <div class="page__buttons">
            <v-button
              :red="index === 0"
              :white="index !== 0"
              v-for="(item, index) in $t('pages.employee.buttons')"
              @click="goToLink(item.url)"
            >
              {{ item.value }}
            </v-button>
          </div>
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
        <div class="scroll-container">
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

            <!-- Блок для добавления сотрудника -->
            <v-add-item v-if="addEmployee" @refresh="refresh" />

            <v-spinner v-if="!isLoading" />

            <template v-else-if="dataset.length">
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
                  :options="options"
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
                  @refresh="refresh"
                  @toggleEdit="toggleEdit"
                  @addToUsers="addToUsers"
                  @changeUser="changeUser"
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
import VEdit from "./components/VEdit";
import VInfo from "./components/VInfo";
import VAddItem from "./components/VAddItem";
import VDeleteItem from "./components/VDeleteItem";
import VButton from "@/components/VButton";
import VFilter from "@/components/VFilter";
import VFilterToggle from "@/components/VFilterToggle";
import VPageHeader from "@/components/VPageHeader";
import VSearch from "@/components/VSearch";
import VSpinner from "@/components/VSpinner";
import VPagination from "@/components/VPagination";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import dataMixins from "@/mixins/data";
import axios from "@/api/axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  mixins: [dataMixins],
  components: {
    VAddItem,
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VItem,
    VButton,
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
    ...mapGetters({ sidebar: "sidebar" }),
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
    this.$store.commit("setFilterOptions", this.filtersOptions);
    this.$store.commit("deactivateAction", "addEmployee");
    this.getData();
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    goToLink(name) {
      this.$router.push({ name });
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },

    addToUsers(user) {
      this.addedItem = user;
      let users = this.dataset;

      if (users.length !== 15) {
        users.push(user);
        this.dataset = users;
      }
      this.count++;
      setTimeout(() => {
        this.addedItem = {};
      }, 500);
      this.changeStatus(true);
    },
    changeUser(user) {
      this.updatedItem = user[0];
      let updatedUser = user[0];
      let index = this.dataset.findIndex(
        (item) => item._id === updatedUser._id
      );
      this.dataset[index] = updatedUser;
      setTimeout(() => {
        this.updatedUser = {};
      }, 500);
      this.changeStatus(true);
    },
    async getData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await this.getDataFromPage(
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

        const { data } = await this.getDataFromPage(
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
      if (!this.user.trim().length) {
        this.getData();
        return;
      }

      if (this.user.trim().length < 3) {
        this.$toast.error("Запрос слишком короткий!");
      } else {
        this.isLoading = false;

        axios
          .get(`/user/getsearchwithoutdirector/${this.user}`)
          .then(async (res) => {
            if (res.data.users.length) {
              this.dataset = res.data.users;
              this.count = res.data.count ? res.data.count : 0;
            } else {
              this.user = "";
            }

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
        this.infoItem = {};
        this.editedItem = {};
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
    grid-template-columns: 120px 120px 329px 100px 100px 180px 200px 1fr;
  }
  .list__column:last-child {
    padding-left: 20px;
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 160px 200px 425px 130px 130px 240px 260px 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 120px 220px 352px 120px 120px 250px 250px 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: 120px 140px 343px 120px 120px 200px 220px 1fr;
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

  .page__header {
    padding-right: 20px;
    max-width: 1837px;
    .page__buttons {
      margin-left: 14px;
    }
    button {
      min-width: 250px !important;
      & + * {
        margin-left: 20px;
      }
    }
  }
}
</style>
