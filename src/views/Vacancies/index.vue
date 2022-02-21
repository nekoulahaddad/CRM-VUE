<template>
  <div class="page vacancies-page">
    <v-delete-item
      :deletedItem="deletedItem"
      @afterDelete="afterDelete"
      @refresh="refresh"
    />

    <div
      class="page__header page-header"
      :class="{ 'page-header--collapse': sidebar }"
    >
      <div class="page-header__inner">
        <div class="page-header__left">
          <div class="page__icon">
            <img :src="require(`@/assets/icons/education_title.svg`)" alt="" />
          </div>
          <h1 class="page__title">{{ $t("pages.employee.pageTitle") }}</h1>
          <v-button
            :red="index === 1"
            :white="index !== 1"
            v-for="(item, index) in $t('pages.employee.buttons')"
            @click="goToLink(item.url)"
          >
            {{ item.value }}
          </v-button>
          <v-filter-toggle @toggleFilter="toggleFilter" :active="showFilter" />
        </div>
      </div>
    </div>

    <div class="page__body d-flex">
      <!-- Фильтр -->
      <div class="page__left" v-if="showFilter">
        <v-filter type="group" />
      </div>

      <!-- Контент -->
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <v-spinner v-if="!isLoading" />
        <template v-else>
          <div class="scroll-horizontal">
            <div class="list">
              <div class="list__header">
                <v-search @submit="getSearchData" v-model="user" v-if="false" />
                <div class="list__title">
                  {{ $t("pages.vacancies.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.vacancies.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>

              <!-- Добавление новой вакансии -->
              <v-add-item v-if="addVacancy" @refresh="refresh" />

              <template v-if="dataset.length">
                <div
                  v-for="(department, index) in dataset"
                  :key="department._id"
                  class="list__row list__row--shadow list__row--white"
                  :class="{
                    'list__row--opened':
                      infoItem._id === department._id ||
                      editedItem._id === department._id,
                  }"
                >
                  <v-item
                    :showInfo="infoItem._id === department._id"
                    :showEdit="editedItem._id === department._id"
                    :infoItem="department"
                    :editedItem="department"
                    @toggleInfo="toggleInfo"
                    @toggleEdit="toggleEdit"
                    @toggleDelete="toggleDelete"
                  />

                  <!-- Блок для просмотра детальной информации о вакансии -->
                  <v-info
                    v-if="infoItem._id === department._id"
                    :infoItem="infoItem"
                  />

                  <!-- Блок для изменения вакансии -->
                  <v-edit
                    v-if="editedItem._id === department._id"
                    :editedItem="editedItem"
                    @toggleEdit="toggleEdit"
                    @refresh="refresh"
                  />
                </div>
                <v-pagination :count="count" />
              </template>
              <v-not-found-query v-else />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import VItem from "./components/VItem";
import VEdit from "./components/VEdit";
import VInfo from "./components/VInfo";
import VDeleteItem from "./components/VDeleteItem";
import VAddItem from "./components/VAddItem";
import { mapGetters, mapMutations } from "vuex";
import axios from "@/api/axios";
import VFilterToggle from "@/components/VFilterToggle";
import VPageHeader from "@/components/VPageHeader";
import VPagination from "@/components/VPagination";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VButton from "@/components/VButton";
import VSpinner from "@/components/VSpinner";
import VFilter from "@/components/VFilter";
import VSearch from "@/components/VSearch";
import dataMixins from "@/mixins/data";

export default {
  mixins: [dataMixins],
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
    addVacancy() {
      return this.$store.state.actions.addVacancy;
    },
  },
  data() {
    return {
      showFilter: false,
      openEdit: false,
      openDelete: false,
      open: {
        create: false,
        view: false,
        edit: false,
        delete: false,
      },
      editedItem: {},
      dataset: [],
      addedItem: {},
      deletedItem: {},
      updatedItem: {},
      infoItem: {},
      isLoading: false,
      count: 0,
      filtersOptions: {},
      user: "",
    };
  },
  components: {
    VItem,
    VPagination,
    VNotFoundQuery,
    VButton,
    VFilter,
    VInfo,
    VEdit,
    VPageHeader,
    VAddItem,
    VSearch,
    VFilterToggle,
    VSpinner,
    VDeleteItem,
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    toggleEdit(item) {
      this.infoItem = {};

      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }
    },
    afterDelete() {
      if (!this.dataset.length) {
        location.reload();
      }
    },
    async refresh() {
      let result = this.getDataFromPage("/vacancies/get", this.filtersOptions);
      let res = await result;
      this.updateVacancies(res);
      this.$forceUpdate();
    },
    async updateVacancies(res) {
      this.isLoading = false;
      this.dataset = res.data.vacancies;
      this.count = res.data.count ? res.data.count : 0;
      this.isLoading = true;
    },
    getSearchData() {
      this.changeStatus(false);
      let search = this.user;
      if (search.length < 3) {
        this.$toast.error("Запрос слишком короткий!");
        this.changeStatus(true);
        return;
      }
      axios
        .get(`/user/getsearchwithoutdirector/${search}`)
        .then(async (res) => {
          let result = await res;
          if (result.data.users.length) {
            this.count = result.data.length;
            //this.updateUsers(result);
            this.$toast.success("Результаты запросов!");
          } else {
            this.$toast.error("Результаты не найдены!");
            this.user = "";
          }
          this.changeStatus(true);
          this.$forceUpdate();
        });
    },
    resetFilters() {
      this.$refs.filters.filterOptions = {};
      this.$refs.filters.activeIndex = 0;
      this.filtersOptions = {};
    },
    goToLink(name) {
      this.$router.push({ name });
    },
    toggleInfo(item) {
      this.editedItem = {};

      if (this.infoItem._id === item._id) {
        this.infoItem = {};
      } else {
        this.infoItem = item;
      }
    },
    toggleDelete(deletedItem) {
      this.deletedItem = deletedItem;
      this.$modal.show("deleteVacancy");
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    navigateToUserTasks(e, user) {
      if (user.tasks.length) {
        this.$router.replace({
          name: "tasks",
          params: {
            user: user,
          },
        });
      }
    },
  },
  watch: {
    $route: async function () {
      await this.refresh();
    },
    filtersOptions: {
      handler: async function () {
        await this.refresh();
      },
      deep: true,
    },
  },
  async mounted() {
    this.$store.commit("deactivateAction", "addVacancy");
    await this.refresh();
  },
};
</script>

<style lang="scss">
.vacancies-page {
  .list__columns {
    grid-template-columns: 300px 350px 350px 1fr;
  }
  .list__column:last-child {
    padding-left: 20px;
  }

  .page__right--fluid {
    .list__columns {
      grid-template-columns: 300px 450px 450px 1fr;
    }
  }

  .page__right--full {
    .list__columns {
      grid-template-columns: 300px 450px 450px 1fr;
    }
  }

  .page__right--middle {
    .list__columns {
      grid-template-columns: 300px 500px 459px 1fr;
    }
  }

  .list__column {
    &:first-child {
      text-align: left;
    }
  }

  .page-header__left {
    position: relative;
    width: 100%;
  }

  .filter-toggle {
    position: absolute;
    right: 0;
  }

  .page__header {
    button {
      width: 250px;
      margin-left: 20px;
    }
  }
}
</style>
