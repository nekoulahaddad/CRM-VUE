<template>
  <div class="page mail-page">
    <popover name="foo"> 123 </popover>
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/mails_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("pages.mail.pageTitle") }}</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter type="callbacks" />
      </div>
      <div class="page__right">
        <v-spinner v-if="!isLoading" />
        <template v-else-if="dataset.length">
          <div class="scroll-horizontal">
            <div class="list">
              <div class="list__header">
                <div class="list__title">
                  {{ $t("pages.mail.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.mail.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>
              <div
                v-for="item in dataset"
                :key="item._id"
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened':
                    infoItem._id === item._id || editedItem._id === item._id,
                }"
              >
                <v-item
                  :item="item"
                  :infoItem="infoItem"
                  :editedItem="editedItem"
                  @toggleInfo="toggleInfo"
                  @toggleEdit="toggleEdit"
                />

                <!-- Блок с детальной информацией о сотруднике -->
                <v-info v-if="infoItem._id === item._id" :item="item" />

                <!-- Блок с формой редактирования сотрудника -->
                <v-edit
                  v-if="editedItem._id === item._id"
                  :item="item"
                  :editedItem="editedItem"
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
import VItem from "./components/VItem";
import VEdit from "./components/VEdit";
import VInfo from "./components/VInfo";
import VFilter from "@/components/VFilter";
import getDataFromPage from "@/api/getDataFromPage";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VPagination from "@/components/VPagination";
import VSpinner from "@/components/VSpinner";
import dateMixins from "@/mixins/date";
import nameMixins from "@/mixins/name";
import fioMixins from "@/mixins/fio";

export default {
  mixins: [dateMixins, fioMixins, nameMixins],
  components: {
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VPagination,
    VItem,
    VInfo,
    VEdit,
  },
  data() {
    return {
      count: 0,
      dataset: [],
      search: "",
      filtersOptions: {
        dates: "all",
        created: null,
        deliver: null,
        buyed: null,
        type: "callbacks",
        number: 1,
        status: "all",
        region: null,
        executor: this.role === "manager" ? this.$store.state._id : null,
      },
      infoItem: {},
      editedItem: {},
      isLoading: false,
      edit: false,
      view: false,
      deleted: false,
      deletedItem: {},
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        this.isLoading = false;
        this.filtersOptions.page = this.$route.params.page;

        const { data } = await getDataFromPage(
          "/callbacks/get",
          this.filtersOptions
        );

        this.dataset = data.callbacks;
        this.count = data.count;
        localStorage.setItem("callbacks", data.callbacks);
        localStorage.setItem("callbaksCount", data.count);
      } catch (e) {
      } finally {
        this.isLoading = true;
        this.$scrollTo("body", 300, {});
      }
    },
    toggleInfo(item) {
      this.editedItem = {};

      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
    toggleEdit(item) {
      this.infoItem = {};

      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }
    },
  },
  watch: {
    $route: function () {
      this.getData();
    },
    filtersOptions: {
      handler: function () {
        this.getData();
      },
      deep: true,
    },
    callbacks: {
      handler: function () {},
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.mail-page {
  .list__columns {
    grid-template-columns: minmax(50px, 70px) repeat(9, 160px) 1fr;
  }
  .list__header {
    .list__column {
      &:first-child {
        text-align: left;
      }
    }
  }
}
</style>
