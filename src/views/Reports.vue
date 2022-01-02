<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/reports_title.svg" alt="" />
      </div>
      <h1 class="page__title">Отчеты</h1>
    </div>
    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left">
        <v-filter type="reports" />
      </div>

      <!-- Контент -->
      <div class="flex-1">
        <table class="table">
          <thead class="thead">
            <tr class="thead__top">
              <td colspan="9">
                <div class="table__title">Клиенты</div>
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
              <td>{{ item.title }}</td>
              <td>{{ transformDate(item.created) }}</td>
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
import getDataFromPage from "@/api/getDataFromPage";
import dateMixins from "@/mixins/date";
import fioMixins from "@/mixins/fio";
import markMixins from "@/mixins/mark";
import statusMixins from "@/mixins/status";

export default {
  mixins: [dateMixins, fioMixins, markMixins, statusMixins],
  components: { VFilter },
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
      getDataFromPage("/reports/get", this.filtersOptions);
    },
    filtersOptions: {
      handler: function () {
        getDataFromPage("/reports/get", this.filtersOptions);
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
        const { data } = await getDataFromPage(
          "/reports/get",
          this.filtersOptions
        );

        this.isLoading = false;
        this.dataset = data.reports;
        this.count = data.count;
        this.isLoading = true;
      } catch (e) {}
    },
  },
};
</script>
