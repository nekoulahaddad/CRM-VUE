<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/callbacks_title.svg')" alt="" />
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
                  <div class="table__title">Обращения</div>
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
                <td>
                  {{ item.orderNumber ? item.orderNumber : "-" }}
                </td>
                <td class="text--green">{{ transformDate(item.createdAt) }}</td>
                <td class="text--blue">{{ transformFIO(item.client) }}</td>
                <td>{{ item.phone }}</td>
                <td>{{ item.region.title && item.region.title }}</td>
                <td>
                  <div class="bg bg--blue-light">
                    {{ item.category && item.category.category.categoryName }}
                  </div>
                </td>
                <td class="text--blue">{{ transformFIO(item.issuedBy) }}</td>
                <td class="text--blue">{{ transformFIO(item.issuedTo) }}</td>
                <td>
                  <VueCustomTooltip
                    v-if="item.message"
                    :multiline="true"
                    :label="item.message"
                  >
                    Описание
                  </VueCustomTooltip>
                </td>
                <td
                  :class="
                    item.status === 'отказ'
                      ? 'text--red'
                      : item.status === 'подтвержденный'
                      ? 'text--green'
                      : !item.confirmedAt
                      ? 'text--orange'
                      : 'text--blue-delos'
                  "
                >
                  {{ item.status ? item.status : "не подтвержденный" }}
                </td>
                <td>
                  <div class="table__actions">
                    <div class="table__icon">
                      <img src="@/assets/icons/info_icon.svg" alt="" />
                    </div>
                    <div class="table__icon">
                      <img src="@/assets/icons/write_icon.svg" alt="" />
                    </div>
                    <div class="table__icon">
                      <img src="@/assets/icons/trash_icon.svg" alt="" />
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
