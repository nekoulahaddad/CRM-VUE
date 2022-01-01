<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/employees_title.svg" alt="" />
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
        <table class="table">
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
            <tr v-for="employee in dataset" :key="employee.id">
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
              <td>{{ employee.position }}</td>
              <td v-html="transformRating(employee.rating)"></td>
              <td>{{ employee.tasks.length }}</td>
              <td>{{ employee.department.title }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import VFilter from "@/components/VFilter";
import getDataFromPage from "../api/getDataFromPage";
import ratingMixins from "@/mixins/rating";

export default {
  components: { VFilter },
  mixins: [ratingMixins],
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
  async mounted() {
    await this.getData();
  },
  methods: {
    async getData() {
      this.updateData(await getDataFromPage("/user/get", this.filtersOptions));
    },
    updateData(res) {
      this.isLoading = false;
      this.dataset = res.data.users;
      this.count = res.data.count ? res.data.count : 0;
      this.isLoading = true;
    },
    resetFilters() {
      this.$refs.filters.filterOptions = {};
      this.$refs.filters.activeIndex = 0;
      this.filtersOptions = {};
    },
  },
};
</script>
