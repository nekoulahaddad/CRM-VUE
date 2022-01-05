<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/employees_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Сотрудники</h1>
    </div>
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left">
        <v-filter type="group" />
      </div>

      <!-- Контент -->
      <div class="flex-1">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <table class="table table--separate">
            <thead class="thead">
              <tr class="thead__top">
                <td colspan="7">
                  <div class="table__title">Сотрудники</div>
                </td>
              </tr>
              <tr class="thead__bottom">
                <td>ФИО:</td>
                <td>Регион</td>
                <td>Должность:</td>
                <td>Рейтинг:</td>
                <td>Задачи:</td>
                <td>Отдел:</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr class="shadow" v-for="employee in dataset" :key="employee.id">
                <td class="text--blue">
                  {{
                    `${employee.surname} ${employee.name.charAt(0)}.${
                      employee.lastname ? employee.lastname.charAt(0) + "." : ""
                    }`
                  }}
                </td>
                <td>
                  {{
                    employee.region.title.length > 15
                      ? employee.region.title.slice(0, -14) + "..."
                      : employee.region.title
                  }}
                </td>
                <td>
                  <div class="bg bg--blue-light">{{ employee.position }}</div>
                </td>
                <td v-html="transformRating(employee.rating)"></td>
                <td>{{ employee.tasks.length }}</td>
                <td>
                  <div class="bg bg--green-light">
                    {{ employee.department.title }}
                  </div>
                </td>
                <td>
                  <div class="table__actions">
                    <div class="table__icon">
                      <img src="@/assets/icons/info_icon.svg" alt="" />
                    </div>
                    <div class="table__icon">
                      <img
                        v-if="role === 'director' || options.userEditor"
                        src="@/assets/icons/write_icon.svg"
                        @click="toggleEdit(employee)"
                        alt=""
                      />
                      <div class="table__hidden-icon" v-else></div>
                    </div>
                    <div class="table__icon">
                      <img
                        v-if="role === 'director'"
                        src="@/assets/icons/trash_icon.svg"
                        @click="toggleDelete(employee._id)"
                        alt=""
                      />
                      <div class="table__hidden-icon" v-else></div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <v-pagination :count="count" />
        </template>
        <v-not-found-query v-else />
      </div>
    </div>
  </div>
</template>

<script>
import VFilter from "@/components/VFilter";
import VSpinner from "@/components/VSpinner";
import VPagination from "@/components/VPagination";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "../api/getDataFromPage";
import ratingMixins from "@/mixins/rating";
import roleMixins from "@/mixins/role";

export default {
  components: { VFilter, VSpinner, VNotFoundQuery, VPagination },
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
        this.$scrollTo("body", 300, {});
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
