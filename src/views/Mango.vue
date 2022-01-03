<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/mango_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Mango</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter type="mango" />
      </div>
      <div class="flex-1">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <table class="table">
            <thead class="thead">
              <tr class="thead__top">
                <td colspan="5">
                  <div class="table__title">Mango</div>
                </td>
              </tr>
              <tr class="thead__bottom">
                <td>№:</td>
                <td>Входящий телефон:</td>
                <td>Исходящий телефон:</td>
                <td>Сздан:</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dataset" :key="item.id">
                <td>
                  {{ index + 1 + ($route.params.page - 1) * 15 }}
                </td>
                <td class="text--blue">
                  {{ transformPhone(item.from.number) }}
                </td>
                <td>{{ transformPhone(item.to.number) }}</td>
                <td class="text--green">{{ transformTime(item.createdAt) }}</td>
                <td>
                  <img src="/icons/play_icon.svg" alt="" />
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
import getDataFromPage from "@/api/getDataFromPage";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import dateMixins from "@/mixins/date";
import phoneMixins from "@/mixins/phone";

export default {
  mixins: [dateMixins, phoneMixins],
  components: { VFilter, VSpinner, VNotFoundQuery, VPagination },
  data() {
    return {
      dataset: [],
      filtersOptions: {},
      isLoading: false,
      count: 0,
      play: {},
      status: false,
    };
  },
  methods: {
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          "/calls/get",
          this.filtersOptions
        );

        this.dataset = data.calls;
        this.count = data.count;
      } catch (e) {
      } finally {
        this.isLoading = true;
        this.$scrollTo("body", 300, {});
      }
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
