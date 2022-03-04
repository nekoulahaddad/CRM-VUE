<template>
  <div class="page mango-page">
    <a-player
      v-if="status"
      @focus="togglePlay"
      :autoplay="true"
      :volume="0.3"
      :music="{
        title: this.play.client ? transformName(this.play.client) : '',
        artist: this.play.client
          ? this.play.client.phone
          : transformPhone(this.play.to.number),
        src: this.play.recording_url,
        pic: '',
      }"
    />
    <v-page-header
      icon="mango_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />
    <div class="page__body d-flex">
      <div class="page__left" v-if="showFilter">
        <v-filter type="mango" @refreshDates="refreshDates" />
      </div>
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <div class="scroll-horizontal">
            <div class="list list-shadow">
              <div class="list__header">
                <div class="list__title">
                  {{ $t("pages.mango.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.mango.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>
              <div
                v-for="(item, index) in dataset"
                :key="item._id"
                class="list__row list__row--shadow list__row--white"
              >
                <v-mango
                  :index="index"
                  :item="item"
                  :play="play"
                  :status="status"
                  @togglePlay="togglePlay"
                />
              </div>
            </div>
          </div>
          <v-pagination :count="count" />
        </template>
        <v-not-found-query v-else />
      </div>
    </div>
  </div>
</template>

<script>
import VMango from "./components/VMango";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import dataMixins from "@/mixins/data";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import APlayer from "vue-aplayer";
import { mapGetters } from "vuex";
APlayer.disableVersionBadge = true;

export default {
  mixins: [dataMixins],
  components: {
    APlayer,
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VMango,
    VPageHeader,
  },
  computed: {
    ...mapGetters(["sidebar"]),
  },
  data() {
    return {
      showFilter: false,
      dataset: [],
      filtersOptions: {},
      isLoading: false,
      count: 0,
      play: {},
      status: false,
    };
  },
  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    async fetchData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await this.getDataFromPage(
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
    refreshDates(startDate, endDate) {
      this.filtersOptions.startDate = startDate;
      this.filtersOptions.endDate = endDate;
      this.fetchData();
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
.mango-page {
  .list__columns {
    grid-template-columns: minmax(30px, 70px) repeat(4, 1fr);
  }
  .list__header {
    .list__column {
      &:first-child {
        text-align: left;
      }
    }
  }
  .aplayer {
    position: fixed;
    bottom: 25px;
    width: 500px;
    z-index: 1000;
    left: 50%;
    transform: translateX(-50%) !important;
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: minmax(30px, 70px) repeat(3, 500px) 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: minmax(30px, 70px) repeat(3, 450px) 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: minmax(30px, 70px) repeat(3, 400px) 1fr;
    }
  }
}
</style>
