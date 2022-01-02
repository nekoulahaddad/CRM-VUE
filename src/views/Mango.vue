<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/mango_title.svg" alt="" />
      </div>
      <h1 class="page__title">Mango</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter type="mango" />
      </div>
      <div class="flex-1">
        <table class="table">
          <thead class="thead">
            <tr class="thead__top">
              <td colspan="5">
                <div class="table__title">Заявки</div>
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
              <td class="text--blue">{{ transformPhone(item.from.number) }}</td>
              <td>{{ transformPhone(item.to.number) }}</td>
              <td class="text--green">{{ transformTime(item.createdAt) }}</td>
              <td>
                <img src="/icons/play_icon.svg" alt="" />
              </td>
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
import phoneMixins from "@/mixins/phone";

export default {
  mixins: [dateMixins, phoneMixins],
  components: { VFilter },
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
        const { data } = await getDataFromPage(
          "/calls/get",
          this.filtersOptions
        );

        this.isLoading = false;
        this.dataset = data.calls;
        this.count = data.count;
        this.isLoading = true;
      } catch (e) {}
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>
