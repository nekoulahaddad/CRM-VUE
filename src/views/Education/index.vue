<template>
  <div class="page education-page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/education_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("pages.education.pageTitle") }}</h1>
      <v-filter type="education" />
    </div>
    <div class="page__body">
      <v-spinner v-if="!isLoading" />
      <template v-else-if="educations.length">
        <div class="page__content content">
          <div class="content__title">{{ title }}</div>
          <div class="scroll-horizontal">
            <div class="list">
              <div
                v-for="item in educations"
                :key="item._id"
                class="list__row list__row--shadow list__row--white"
              >
                <v-item
                  :item="item"
                  :editedItem="editedItem"
                  @toggleEdit="toggleEdit"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import VItem from "./components/VItem";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VFilter from "@/components/VFilter";
import VSpinner from "@/components/VSpinner";
import VAddDocument from "./components/VAddDocument";
import roleMixins from "@/mixins/role";
import axios from "@/api/axios";

export default {
  mixins: [roleMixins],
  components: {
    VButton,
    VAddDocument,
    VFilter,
    VSpinner,
    VNotFoundQuery,
    VItem,
  },
  data() {
    return {
      typeE: "crm",
      isLoading: false,
      filtersOptions: {},
      activeIndex: -1,
      add: false,
      edit: false,
      deleteEducationForm: false,
      deleteDocument: false,
      upload: false,
      title: "",
      editedItem: {},
      addDocumentItem: {},
      deletedItem: {},
      educationsArr: [],
      uploadedItem: {},
      deletedDocument: {},
      whoCanDoChanges: ["Якубовский", "Евдокимова", "Аракелов", "Марценюк"],
    };
  },
  computed: {
    educations: {
      cache: false,
      get: function () {
        return this.educationsArr;
      },
      set: function (educations) {
        this.educationsArr = educations.map((item) => {
          return {
            _id: item._id,
            type: item.type,
            title: item.title,
            description: item.description,
            documents: item.documents,
            role: item.role,
            department: item.department,
            content: item.description,
          };
        });
      },
    },
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
    userLastName: {
      get: function () {
        let user = this.getUserRole();
        return user.surname;
      },
    },
    department: {
      get: function () {
        let role = this.getUserRole();
        return role.department;
      },
    },
    type: {
      cache: false,
      get: function () {
        return this.typeE;
      },
      set: function (type) {
        this.typeE = type;
        return this.typeE;
      },
    },
    canChanges: {
      get: function () {
        return this.whoCanDoChanges.some((v) => v === this.userLastName.trim());
      },
    },
  },
  watch: {
    $route: function () {
      this.activeIndex = -1;
      this.fetchData();
    },
    typeE: {
      handler: function () {
        this.activeIndex = -1;
        this.fetchData();
      },
      deep: true,
    },
  },
  beforeMount() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      let data = {
        type: this.typeE,
      };

      data.role = this.role;
      data.department = this.department;

      if (this.typeE === "employee") {
        data.department = this.department;
      }

      this.isLoading = false;

      try {
        const response = await axios({
          url: `/educations/get/?page=${this.$route.params.page}`,
          params: data,
          method: "GET",
        });

        this.educations = response.data.educations;
      } catch (e) {
      } finally {
        this.isLoading = true;
      }
    },
    toggleAddDocument(item) {
      if (this.addDocumentItem === item) {
        this.addDocumentItem = null;
      } else {
        this.addDocumentItem = item;
      }
    },
    toggleEdit(item) {
      this.addDocumentItem = null;

      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }
    },
    toggleDelete(item) {
      if (!this.deleteEducationForm) {
        this.deletedItem = item;
      } else {
        this.deletedItem = {};
      }
      this.deleteEducationForm = !this.deleteEducationForm;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.education-page {
  .list__columns {
    grid-template-columns: 1fr 1fr;
  }
  .list__column {
    &:first-child {
      text-align: left;
    }
  }
  .page__content {
    padding: 20px 17px 15px 20px;
    background-color: $color-white;
    border-radius: $border-radius;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
  }
  .content__title {
    font-size: 18px;
    line-height: 30px;
    font-weight: bold;
    margin-bottom: 7px;
  }
  .list {
    margin-top: 3px;
    margin-right: 3px;
  }
}
</style>
