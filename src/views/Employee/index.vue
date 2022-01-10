<template>
  <div class="page employee-page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/employees_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("pages.employee.pageTitle") }}</h1>
    </div>
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left">
        <v-filter type="group" />
      </div>

      <!-- Контент -->
      <div class="page__right">
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
                />

                <!-- Блок с детальной информацией о сотруднике -->
                <v-info
                  v-if="infoItem._id === employee._id"
                  :employee="employee"
                />

                <!-- Блок с формой редактирования сотрудника -->
                <v-edit
                  v-if="editedItem._id === employee._id"
                  :item="employee"
                  :editedItem="editedItem"
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
import VFilter from "@/components/VFilter";
import VSearch from "@/components/VSearch";
import VSpinner from "@/components/VSpinner";
import VPagination from "@/components/VPagination";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "@/api/getDataFromPage";
import ratingMixins from "@/mixins/rating";
import roleMixins from "@/mixins/role";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VItem,
    VInfo,
    VSearch,
    VEdit,
  },
  mixins: [ratingMixins, roleMixins],
  data() {
    return {
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
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
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
    toggleDelete(id) {
      if (!this.open.delete) {
        this.deletedItem._id = id;
      } else {
        this.deletedItem = {};
      }
      this.open.delete = !this.open.delete;
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
  },
};
</script>

<style lang="scss">
.employee-page {
  .list__columns {
    grid-template-columns: 140px 140px 400px 100px 100px 200px minmax(
        140px,
        max-content
      );
  }
}
</style>
