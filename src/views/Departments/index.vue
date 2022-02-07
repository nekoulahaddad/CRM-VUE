<template>
  <div class="page departments-page">
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
          <v-button
            :red="index === 2"
            :white="index !== 2"
            v-for="(item, index) in $t('pages.employee.buttons')"
            @click="goToLink(item.url)"
          >
            {{ item.value }}
          </v-button>
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
            <div class="list">
              <div class="list__header">
                <v-search
                  @submit="getSearchData"
                  v-model="user"
                  :placeholder="$t('pages.employee.searchPlaceholder')"
                />
                <div class="list__title">Отделы</div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.departments.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>

              <!-- Блок добавления нового отдела -->
              <v-add-item v-if="addDepartment" />

              <div
                v-for="(department, index) in dataset"
                :key="department._id"
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened':
                    infoItem._id === department._id ||
                    editedItem._id === department._id,
                }"
              >
                <v-item
                  :item="department"
                  :infoItem="infoItem"
                  :editedItem="editedItem"
                  @toggleInfo="toggleInfo"
                  @toggleEdit="toggleEdit"
                  @toggleDelete="toggleDelete"
                />

                <!-- Блок с детальной информацией об отделе -->
                <v-info
                  v-if="infoItem._id === department._id"
                  :infoItem="infoItem"
                />

                <v-edit
                  :editedItem="editedItem"
                  v-if="editedItem._id === department._id"
                  @toggleEdit="toggleEdit"
                  @refresh="refresh"
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
import VButton from "@/components/VButton";
import VFilter from "@/components/VFilter";
import VSearch from "@/components/VSearch";
import VFilterToggle from "@/components/VFilterToggle";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VPagination from "@/components/VPagination";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "@/api/getDataFromPage";
import axios from "@/api/axios";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    VItem,
    VEdit,
    VInfo,
    VAddItem,
    VSearch,
    VButton,
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VFilterToggle,
    VDeleteItem,
    VPageHeader,
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
    addDepartment() {
      return this.$store.state.actions.addDepartment;
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
    this.$store.commit("deactivateAction", "addDepartment");
    this.refresh();
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
          "/departments/get",
          this.filtersOptions
        );

        this.dataset = data.departments;
        this.count = data.count ? data.count : 0;
      } catch (e) {
      } finally {
        this.infoItem = {};
        this.isLoading = true;
        this.$scrollTo("body", 300, {});
      }
    },
    toggleDelete(deletedItem) {
      this.deletedItem = deletedItem;
      this.$modal.show("deleteDepartment");
    },
    getSearchData() {
      this.changeStatus(false);
      let search = this.user;
      if (search.length < 3) {
        this.$toast.error("Запрос слишком короткий!");
        this.changeStatus(true);
        return;
      }
      axios
        .get(`/user/getsearchwithoutdirector/${search}`)
        .then(async (res) => {
          let result = await res;
          if (result.data.users.length) {
            this.count = result.data.length;
            //this.updateUsers(result);
            this.$toast.success("Результаты запросов!");
          } else {
            this.$toast.error("Результаты не найдены!");
            this.user = "";
          }
          this.changeStatus(true);
          this.$forceUpdate();
        });
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
      await this.refresh();
    },
    filtersOptions: {
      handler: async function () {
        await this.refresh();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.departments-page {
  .list__columns {
    grid-template-columns: 240px 400px 450px 1fr;
  }
  .list__column:last-child {
    padding-left: 20px;
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 300px 450px 450px 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 300px 450px 450px 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: 300px 450px 450px 1fr;
    }
  }

  .list__column {
    &:first-child {
      text-align: left;
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
    button {
      width: 250px;
      margin-left: 20px;
    }
  }
}
</style>
