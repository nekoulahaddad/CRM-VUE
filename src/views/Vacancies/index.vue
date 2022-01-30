<template>
  <div class="page vacancies-page">
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
        <template v-else-if="dataset.length">
          <div class="scroll-horizontal">
            <div class="list">
              <div class="list__header">
                <v-search
                  @submit="getSearchData"
                  v-model="user"
                  :placeholder="$t('pages.employee.searchPlaceholder')"
                />
                <div class="list__title">Вакансии</div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.departments.fields')"
                    class="list__column"
                  >
                    {{ field }}
                  </div>
                </div>
              </div>
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
                <v-item :infoItem="department" />
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
import { mapGetters, mapMutations } from "vuex";
import getDataFromPage from "@/api/getDataFromPage";
import VFilterToggle from "@/components/VFilterToggle";
import VPageHeader from "@/components/VPageHeader";
import VPagination from "@/components/VPagination";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VButton from "@/components/VButton";
import VSpinner from "@/components/VSpinner";
import VFilter from "@/components/VFilter";
import VSearch from "@/components/VSearch";

export default {
  computed: {
    ...mapGetters(["sidebar"]),
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
    VPageHeader,
    VSearch,
    VFilterToggle,
    VSpinner,
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    async refresh() {
      let result = this.getDataFromPage("/vacancies/get", this.filtersOptions);
      let res = await result;
      this.updateVacancies(res);
      this.$forceUpdate();
    },
    async updateVacancies(res) {
      this.isLoading = false;
      console.log(res.data);
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
    await this.refresh();
  },
};
</script>

<style lang="scss">
.vacancies-page {
  .list__columns {
    grid-template-columns: 300px 450px 450px 1fr;
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
      grid-template-columns: 300px 450px 450px 1fr;
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
