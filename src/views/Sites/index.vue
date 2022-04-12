<template>
  <div class="page sites-page">
    <v-page-header icon="sites_title" :filterToggle="false" />
    <div class="page__body d-flex">
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <div class="scroll-horizontal">
          <div class="list">
            <div class="list__header">
              <div class="list__title">
                {{ $t("pages.sites.pageTitle") }}
              </div>
              <div class="list__columns">
                <div class="list__column">Регион:</div>
              </div>
            </div>

            <v-spinner v-if="!isLoading" />

            <template v-else-if="dataset.length">
              <div
                v-for="item in dataset"
                :key="item._id"
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened': infoItem._id === item._id,
                }"
              >
                <v-region
                  :item="item"
                  :infoItem="infoItem"
                  @toggleInfo="toggleInfo"
                />

                <template v-if="infoItem._id === item._id">
                  <div
                    class="list__columns site-list-columns list__columns--shadow set-list__columns"
                  >
                    <div
                      class="list__column"
                      v-for="field in $t('pages.sites.fields')"
                    >
                      {{ field }}
                    </div>
                  </div>
                  <template v-for="(item, index) in item.sites">
                    <div
                      class="list__row list__row--shadow"
                      style="
                        margin-left: 10px;
                        margin-right: 10px;
                        margin-bottom: 10px;
                      "
                    >
                      <v-item
                        :index="index"
                        :infoItem="item"
                        :role="role"
                        :excelImportForm="excelImportForm"
                        @updateSite="updateSite"
                        @toggleImportExcel="toggleImportExcel"
                      />
                    </div>

                    <v-import
                      :item="item"
                      v-if="excelImportForm._id === item._id"
                      @toggleImportExcel="toggleImportExcel"
                    />
                  </template>
                </template>
              </div>
            </template>
            <v-not-found-query v-else />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VItem from "./components/VItem";
import VImport from "./components/VImport";
import VRegion from "./components/VRegion";
import dataMixins from "@/mixins/data";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import { mapGetters } from "vuex";
import axios from "@/api/axios";

export default {
  mixins: [dataMixins],
  components: {
    VPageHeader,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VItem,
    VRegion,
    VImport,
  },
  data() {
    return {
      infoItem: {},
      showFilter: false,
      dataset: [],
      filtersOptions: {},
      isLoading: false,
      item: {},
      status: false,
      excelImportForm: {},
    };
  },
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
  },
  methods: {
    toggleInfo(item) {
      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
    toggleImportExcel(item) {
      if (this.excelImportForm._id === item._id) {
        this.excelImportForm = {};
      } else {
        this.excelImportForm = item;
      }
    },
    async getSites(result) {
      this.isLoading = false;
      let res = await result;
      this.count = res.data.count;
      this.isLoading = true;

      let data = {};

      res.data.data.map((item) => {
        if (!data[item.regionId]) {
          data[item.regionId] = {
            _id: item.regionId,
            title: item.regionTitle,
            sites: [item],
          };
        } else {
          data[item.regionId].sites.push(item);
        }
      });

      this.dataset = Object.values(data).sort((a, b) =>
        a.title > b.title ? 1 : -1
      );
    },
    updateSite(id) {
      axios({
        url: `/sites/update/`,
        data: { id: id },
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.$toast.success(result.data.message);
          this.$emit("toggleOpen");
          this.refreshData();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    refreshData() {
      this.isLoading = false;
      let result = this.getDataFromPage("/sites/get", this.filtersOptions);
      this.getSites(result);
      this.isLoading = true;
    },
  },
  mounted() {
    let result = this.getDataFromPage("/sites/get", this.filtersOptions);
    this.getSites(result);
  },
};
</script>

<style lang="scss">
.sites-page {
  .site-list-columns {
    grid-template-columns: 50px 700px 350px 100px 1fr;
    background-color: #fff;
  }
  .list__column {
    &:first-child {
      text-align: left;
    }
  }

  .page__right--full {
    .site-list-columns {
      grid-template-columns: 50px 700px 400px 300px 1fr !important;
    }
  }

  .page__right--fluid {
    .site-list-columns {
      grid-template-columns: 50px 700px 400px 400px 1fr !important;
    }
  }

  .region-list-columns {
    grid-template-columns: 1fr 1fr;
  }

  .list__row--opened {
    padding-bottom: 5px;
  }
}
</style>
