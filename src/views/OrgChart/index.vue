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

    <div class="page__body d-flex">
      <div class="departments">
        <div class="departments__item">
          <v-department gradient="red" :node="orgTree" />
        </div>
        <div class="departments__item">
          <v-department
            gradient="purple"
            :node="item"
            :show-line="true"
            v-for="item in orgTree.children"
          />
        </div>
        <div class="departments__item">
          <v-department
            :show-line="true"
            gradient="green"
            :node="item"
            v-for="item in levels"
          />
        </div>
        <div class="departments__item">
          <v-department
            gradient="blue"
            :show-line="true"
            :node="item"
            v-for="item in subLevels"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VDepartment from "./components/VDepartment";
import axios from "@/api/axios";
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
    VDepartment,
  },
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
  },
  data() {
    return {
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      pageLoading: true,
      roles: {
        director: "Директор",
        admin: "Администратор",
        content: "Контент-менеджер",
        manager: "Менеджер по работе с клиентами",
        seo: "SEO-оптимизатор",
        call: "Сотрудник Call - центра",
        worker: "Сотрудник",
        buyer: "Закупщик",
      },
      currentTreeId: null,
      openBranch: false,
      openDirector: false,
      openEmployee: false,
      isLoading: false,
      fio: "",
      levels: [],
      subLevels: [],
      users: [],
      newTree: [],
      departments: [],
      orgTree: {},
      selectedNode: null,
      selectedUser: null,
      selectedUserType: null,
      departmentForm: {},
      parentDepartment: {},
      showUser: false,
      confirmMsg: {
        header: "Вы уверены?",
        message: "Подтвердите действие.",
      },
      dialog: {
        header: "",
        message: "",
        callback: null,
        args: [],
      },
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
    async getData(url, params = null) {
      let result = axios({
        url: `${url}`,
        data: params,
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        return result;
      });
      return result;
    },
  },
  created() {
    this.getData(`/user/getuserstree`).then(
      (res) => (this.users = res.data.users)
    );
    this.getData(`/orgtree/getfirst`).then((res) => {
      this.orgTree = res.data.dataTree || {};
      this.currentTreeId = res.data._id;

      for (const item of this.orgTree.children) {
        if (item.children.length) {
          this.levels.push(...item.children);
        } else {
          this.levels.push(null);
        }

        for (const subItem of item.children) {
          if (subItem.children.length) {
            this.subLevels.push(...subItem.children);
          } else {
            this.subLevels.push(null);
          }
        }
      }
      console.log(this.levels);
    });
    axios.get("/departments/all").then(async (res) => {
      let result = await res;
      this.departments = result.data;
    });
    this.pageLoading = false;
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

  .departments {
    display: flex;
    margin-bottom: 30px;

    &__item {
      & + * {
        margin-left: 60px;
      }
    }

    .department__empty,
    .department {
      & + * {
        margin-top: 10px;
      }
    }
  }
}
</style>
