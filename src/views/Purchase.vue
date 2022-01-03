<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/buying_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Закупка</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter type="purchase" />
      </div>
      <div class="flex-1">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <table class="table">
            <thead class="thead">
              <tr class="thead__top">
                <td colspan="10">
                  <div class="table__title">Закупка</div>
                </td>
              </tr>
              <tr class="thead__bottom">
                <td>№:</td>
                <td>Дата создания:</td>
                <td>Регион:</td>
                <td>Категория:</td>
                <td>Автор:</td>
                <td>Исполнитель:</td>
                <td>Описание:</td>
                <td>Статус:</td>
                <td>Дата поставки:</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in dataset" :key="item.id">
                <td>{{ item.number }}</td>
                <td>{{ transformDate(item.createdAt) }}</td>
                <td>{{ item.region.title && item.region.title }}</td>
                <td>
                  {{ item.category && item.category.category.categoryName }}
                </td>
                <td>{{ transformFIO(item.initiator) }}</td>
                <td>{{ transformFIO(item.executor) }}</td>
                <td>{{ item.message }}</td>
                <td>{{ item.status ? item.status : "-" }}</td>
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
import roleMixins from "@/mixins/role";

export default {
  mixins: [dateMixins, fioMixins, roleMixins],
  components: { VFilter, VNotFoundQuery, VPagination, VSpinner },
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
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          `/purchase/get`,
          this.filtersOptions
        );

        this.dataset = data.dataList;
        this.count = data.count;
      } catch (e) {
      } finally {
        this.isLoading = true;
        this.$scrollTo("body", 300, {});
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
