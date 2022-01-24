<template>
  <div class="page education-page">
    <!-- Модальное окно для удаления элементв -->
    <v-delete-item
      :deletedItem="deletedItem"
      @deleteSuccess="deleteSuccess"
      @refreshEducations="getEducations"
    />

    <!-- Модальное окно для удаления документа -->
    <v-delete-document
      :infoItem="infoItem"
      :deletedDocument="deletedDocument"
      @refreshEducations="getEducations"
      @deleteDocumentSuccess="deleteDocumentSuccess"
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
          <h1 class="page__title">{{ $t("pages.education.pageTitle") }}</h1>
          <v-filter type="education" />
        </div>
      </div>
    </div>

    <div class="page__body" :class="{ 'page__body--fluid': sidebar }">
      <v-spinner v-if="!isLoading" />
      <div class="page__content content" v-else>
        <div class="content__title">{{ title }}</div>
        <div class="scroll-horizontal">
          <!-- Блок для добавления нового раздела -->
          <v-create-section
            @refreshEducations="getEducations"
            @close="toggleCreateSection"
            v-if="createSection"
          />

          <template v-if="educations.length">
            <div class="list">
              <div
                v-for="item in educations"
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
                  @toggleDelete="toggleDelete"
                />

                <!-- Блок с детальной информацией -->
                <v-info
                  :infoItem="infoItem"
                  v-if="infoItem._id === item._id"
                  @toggleDeleteDocument="toggleDeleteDocument"
                  @refreshEducations="getEducations"
                />

                <!-- Блок для редактирование элемента -->
                <v-edit
                  :editedItem="editedItem"
                  v-if="editedItem._id === item._id"
                  @toggleEdit="toggleEdit"
                  @refreshEducations="getEducations"
                />
              </div>
            </div>
          </template>
          <v-not-found-query v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VItem from "./components/VItem";
import VDeleteItem from "./components/VDeleteItem";
import VDeleteDocument from "./components/VDeleteDocument";
import VInfo from "./components/VInfo";
import VEdit from "./components/VEdit";
import VCreateSection from "./components/VCreateSection";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VSpinner from "@/components/VSpinner";
import VAddDocument from "./components/VAddDocument";
import axios from "@/api/axios";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  components: {
    VDeleteItem,
    VDeleteDocument,
    VButton,
    VAddDocument,
    VSpinner,
    VNotFoundQuery,
    VEdit,
    VItem,
    VFilter,
    VInfo,
    VPageHeader,
    VCreateSection,
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
      title: "CRM",
      infoItem: {},
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
    ...mapGetters(["sidebar"]),
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
    createSection() {
      return this.$store.state.actions.createEducationSection;
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
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
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
    toggleCreateSection() {
      this.$store.commit("toggleAction", { key: "createEducationSection" });
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
      this.addDocumentItem = null;

      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }
    },
    toggleDeleteDocument(deletedDocument) {
      this.deletedDocument = deletedDocument;
      this.$modal.show("deleteDocument");
    },
    deleteSuccess() {
      this.deletedItem = {};
      this.$modal.hide("delete");
    },
    deleteDocumentSuccess() {
      this.infoItem.documents = this.infoItem.documents.filter(
        (item) => item._id !== this.deletedDocument._id
      );
      this.deletedDocument = {};
      this.$modal.hide("deleteDocument");
    },
    toggleDelete(item) {
      this.deletedItem = item;
      this.$modal.show("delete");
    },
    getEducations() {
      const params = {
        type: this.typeE,
      };
      params.role = this.role;
      params.department = this.department;

      if (this.typeE === "employee") {
        params.department = this.department;
      }

      axios({
        url: "/educations/get/",
        params: params,
        method: "GET",
      })
        .then((res) => {
          this.educations = res.data.educations;
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.education-page {
  .list__columns {
    grid-template-columns: 1fr 100px;
  }
  .list__column {
    &:first-child {
      text-align: left;
    }
  }
  .page__content {
    padding: 10px 17px 15px 16px;
    background-color: $color-white;
    border-radius: $border-radius;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
  }
  .content__title {
    font-size: 18px;
    line-height: 30px;
    font-weight: bold;
    margin-bottom: 7px;
    margin-left: 3px;
  }
  .list {
    margin-top: 3px;
    margin-right: 3px;
  }
  .empty-data {
    margin-left: 3px;
  }
}
</style>
