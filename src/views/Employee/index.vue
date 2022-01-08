<template>
  <div class="page">
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
            <div class="list list-shadow">
              <div class="list__header">
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
                class="list__row list__row--white"
                :class="{
                  'list__row--opened': infoItem._id === employee._id,
                }"
              >
                <v-employee
                  :index="index"
                  :role="role"
                  :infoItem="infoItem"
                  :employee="employee"
                  @toggleInfo="toggleInfo"
                />

                <!-- Блок с детальной информацией о сотруднике -->
                <v-employee-info
                  v-if="infoItem._id === employee._id"
                  :employee="employee"
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
import VEmployee from "./components/VEmployee";
import VEmployeeInfo from "./components/VEmployeeInfo";
import VFilter from "@/components/VFilter";
import VSpinner from "@/components/VSpinner";
import VPagination from "@/components/VPagination";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "@/api/getDataFromPage";
import ratingMixins from "@/mixins/rating";
import roleMixins from "@/mixins/role";

export default {
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VEmployee,
    VEmployeeInfo,
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
      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
    toggleEdit(item) {
      if (!this.open.edit) {
        this.infoItem = item;
      } else {
        setTimeout(() => {
          this.infoItem = {};
        }, 500);
      }
      this.open.edit = !this.open.edit;
    },
    toggleDelete(id) {
      if (!this.open.delete) {
        this.deletedItem._id = id;
      } else {
        this.deletedItem = {};
      }
      this.open.delete = !this.open.delete;
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

<style scoped lang="scss">
.list__columns {
  grid-template-columns: 140px 140px 400px 100px 100px 200px 140px;
}
</style>
