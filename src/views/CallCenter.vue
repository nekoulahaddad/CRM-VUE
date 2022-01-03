<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/callbacks_title.svg" alt="" />
      </div>
      <h1 class="page__title">Обращения</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter type="callCenterIssues" />
      </div>
      <div class="flex-1">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <table class="table">
            <thead class="thead">
              <tr class="thead__top">
                <td colspan="12">
                  <div class="table__title">Заявки</div>
                </td>
              </tr>
              <tr class="thead__bottom">
                <td>№:</td>
                <td>№ заказа:</td>
                <td>Дата создания:</td>
                <td>Клиент:</td>
                <td>Телефон:</td>
                <td>Регион:</td>
                <td>Категория:</td>
                <td>Автор:</td>
                <td>Исполнитель:</td>
                <td>Описание:</td>
                <td>Статус:</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in dataset" :key="item.id">
                <td>{{ item.number }}</td>
                <td>{{ item.orderNumber ? item.orderNumber : "-" }}</td>
                <td>{{ transformDate(item.createdAt) }}</td>
                <td>{{ transformFIO(item.client) }}</td>
                <td>{{ item.phone }}</td>
                <td>{{ item.region.title && item.region.title }}</td>
                <td>
                  {{ item.category && item.category.category.categoryName }}
                </td>
                <td>{{ transformFIO(item.issuedBy) }}</td>
                <td>{{ transformFIO(item.issuedTo) }}</td>
                <td>{{ item.message }}</td>
                <td></td>
                <td></td>
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
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "../api/getDataFromPage";
import dateMixins from "@/mixins/date";
import fioMixins from "@/mixins/fio";

export default {
  mixins: [dateMixins, fioMixins],
  components: { VFilter, VNotFoundQuery, VPagination, VSpinner },
  mounted() {
    this.fetchData();
  },
  data() {
    return {
      isLoading: false,
      dataset: [],
      filtersOptions: {
        region: this.region || null,
        nesting: +this.$route.params.nesting - 1 || null,
      },
      open: false,
      addedItem: {},
      deleted: false,
      deletedItem: {},
      edit: false,
      editedItem: {},
      info: false,
      count: 0,
      search: "",
      isSearch: false,
    };
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          `/callcenterissues/get`,
          this.filtersOptions
        );

        this.dataset = data.callCenterIssues;
        this.count = data.count;
        this.isLoading = true;
      } catch (e) {
      } finally {
        this.isLoading = true;
      }
    },
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
};
</script>
