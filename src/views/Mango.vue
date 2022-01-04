<template>
  <div class="page">
    <a-player
      v-if="this.status"
      @focus="togglePlay()"
      autoplay
      :volume="0.3"
      :music="{
        title: this.play.client ? transformName(this.play.client) : '',
        artist: this.play.client
          ? this.play.client.phone
          : transformPhone(this.play.to.number),
        src: this.play.recording_url,
      }"
    />
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
                <td>Создан:</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in dataset" :key="item.id">
                <td>
                  {{ index + 1 + ($route.params.page - 1) * 15 }}
                </td>
                <td>
                  <div class="bg bg--blue-light">
                    {{ transformPhone(item.from.number) }}
                  </div>
                </td>
                <td class="text--green">
                  {{ transformPhone(item.to.number) }}
                </td>
                <td>
                  <div class="bg bg--green-light">
                    {{ transformTime(item.createdAt) }}
                  </div>
                </td>
                <td>
                  <div class="table__actions">
                    <div class="table__icon">
                      <img
                        @click="togglePlay(item)"
                        src="/icons/play_icon.svg"
                        alt=""
                      />
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
import getDataFromPage from "@/api/getDataFromPage";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import nameMixins from "@/mixins/name";
import dateMixins from "@/mixins/date";
import phoneMixins from "@/mixins/phone";
import APlayer from "vue-aplayer";
APlayer.disableVersionBadge = true;

export default {
  mixins: [dateMixins, nameMixins, phoneMixins],
  components: { APlayer, VFilter, VSpinner, VNotFoundQuery, VPagination },
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
    togglePlay(item) {
      if (!this.status) {
        this.play = item;
      } else {
        this.item = {};
      }
      this.status = !this.status;
    },
  },
  mounted() {
    this.fetchData();
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
};
</script>

<style scoped lang="scss">
.table {
  .thead__bottom {
    td:first-child {
      text-align: left;
    }
  }
}
</style>
