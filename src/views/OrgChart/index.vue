<template>
  <div class="page org-chart-page">
    <div
      class="page__header page-header"
      :class="{ 'page-header--collapse': sidebar }"
    >
      <div class="page-header__inner">
        <div class="page-header__left">
          <div class="page__icon">
            <img :src="require(`@/assets/icons/employees_title.svg`)" alt="" />
          </div>
          <h1 class="page__title">{{ $t("pages.employee.pageTitle") }}</h1>
          <v-button
            :red="index === 3"
            :white="index !== 3"
            v-for="(item, index) in $t('pages.employee.buttons')"
            @click="goToLink(item.url)"
          >
            {{ item.value }}
          </v-button>
        </div>
      </div>
    </div>

    <div class="page__body d-flex"></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import VButton from "@/components/VButton";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VPagination from "@/components/VPagination";

export default {
  components: {
    VButton,
    VPageHeader,
    VSpinner,
    VPagination,
  },
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
  },
  data() {
    return {
      showFilter: false,
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    goToLink(name) {
      this.$router.push({ name });
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
  },
};
</script>

<style lang="scss">
.org-chart-page {
  .list__columns {
    grid-template-columns: 240px 400px 450px 1fr;
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
