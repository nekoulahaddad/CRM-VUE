<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/reports_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Отчеты</h1>
    </div>
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left">
        <v-filter type="reports" />
      </div>

      <!-- Контент -->
      <div class="page__right">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <table class="table table--separate">
            <thead class="thead">
              <tr class="thead__top">
                <td colspan="9">
                  <div class="table__title">Отчеты</div>
                </td>
              </tr>
              <tr class="thead__bottom">
                <td>№:</td>
                <td>Задача:</td>
                <td>Дата создания:</td>
                <td>Автор</td>
                <td>Исполнитель:</td>
                <td>Регион:</td>
                <td>Статус:</td>
                <td>Оценка</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dataset" :key="item.id">
                <td>
                  {{ item.number || index + 1 + ($route.params.page - 1) * 15 }}
                </td>
                <td>
                  <div class="bg bg--blue-light">{{ item.title }}</div>
                </td>
                <td class="text--green">{{ transformDate(item.created) }}</td>
                <td class="text--blue">{{ transformFIO(item.initiator) }}</td>
                <td>{{ transformFIO(item.executor) }}</td>
                <td class="text--sapphire">
                  {{
                    item.executor.region.title.length > 15
                      ? item.executor.region.title.slice(0, -14) + "..."
                      : item.executor.region.title
                  }}
                </td>
                <td v-html="transformStatus(item.status)"></td>
                <td v-html="transformMark(item.mark)"></td>
                <td>
                  <div class="table__actions">
                    <div class="table__icon">
                      <img src="@/assets/icons/info_icon.svg" alt="" />
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
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import getDataFromPage from "@/api/getDataFromPage";
import dateMixins from "@/mixins/date";
import fioMixins from "@/mixins/fio";
import markMixins from "@/mixins/mark";
import statusMixins from "@/mixins/status";

export default {
  mixins: [dateMixins, fioMixins, markMixins, statusMixins],
  components: { VFilter, VSpinner, VNotFoundQuery, VPagination },
  data() {
    return {
      infoForm: false,
      isLoading: false,
      dataset: [],
      infoItem: {},
      count: 0,
      filtersOptions: {
        dates: "all",
      },
    };
  },
  computed: {
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
  },
  watch: {
    $route: function () {
      this.fetchData();
    },
    filtersOptions: {
      handler: function () {
        this.fetchData();
      },
      deep: true,
    },
  },
  mounted() {
    if (this.user) {
      this.filtersOptions.executor = this.user._id;
    }
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          "/reports/get",
          this.filtersOptions
        );

        this.dataset = data.reports;
        this.count = data.count;
      } catch (e) {
      } finally {
        this.isLoading = true;
        this.$scrollTo("body", 300, {});
      }
    },
  },
};
</script>
