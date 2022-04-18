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
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <div class="departments" v-if="orgTree && orgTree._id">
          <v-item
            :level="1"
            :item="orgTree"
            :hLine="
              orgTree.children.length && openedItems.includes(orgTree._id)
            "
            :opened="openedItems.includes(orgTree._id)"
            :openedItems="openedItems"
            @deleteItem="handleDialog"
            @toggleOpened="toggleOpened"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import { mapGetters, mapMutations } from "vuex";
import VButton from "@/components/VButton";
import VItem from "./components/VItem";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VPagination from "@/components/VPagination";

export default {
  components: {
    VButton,
    VPageHeader,
    VSpinner,
    VItem,
    VPagination,
  },
  computed: {
    ...mapGetters({ sidebar: "sidebar" }),
  },
  data() {
    return {
      openedItems: [],
      showFilter: false,
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
    handleDialog(node) {
      if (node.children.length) {
        this.$toast.warning(
          "Там есть дочерние разделы, сначала удалите дочерние разделы, пожалуйста"
        );
        return;
      }
      return;
      this.dialog.callback = () => callback(node);
      this.dialog.header = msg.header;
      this.dialog.message = msg.message;
    },
    toggleOpened(id) {
      if (this.openedItems.includes(id)) {
        this.openedItems = this.openedItems.filter((value) => value !== id);
      } else {
        this.openedItems.push(id);
      }
    },
    goToLink(name) {
      this.$router.push({
        name,
        params: {
          page: 1,
        },
      });
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
    this.getData(`/orgtree/getfirst`).then((res) => {
      this.orgTree = res.data.dataTree || {};
      this.currentTreeId = res.data._id;
    });
    this.pageLoading = false;
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.org-chart-page {
  .list {
    max-width: 100%;
  }
  .page__right--fluid {
    .departments {
      width: 1704px;
    }
  }

  .page__right--full {
    .list {
      max-width: 100%;
    }
    .departments {
      width: 1591px;
    }
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
  }
}
</style>
