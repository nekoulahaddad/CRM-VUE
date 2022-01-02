<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/education_title.svg" alt="" />
      </div>
      <h1 class="page__title">Обучение</h1>
      <v-filter type="education" />
    </div>
    <div class="page__body">
      <v-spinner v-if="!isLoading" />
      <div v-else-if="educations.length" class="card card--white">
        <table class="table">
          <tbody>
            <template v-for="(item, index) in educations">
              <tr v-if="editedItem !== item" class="shadow" :key="item.id">
                <td>{{ item.title }}</td>
                <td>
                  <div class="table__actions">
                    <div class="table__icon">
                      <img
                        @click="toggleEdit(item)"
                        src="/icons/write_icon.svg"
                        alt=""
                      />
                    </div>
                    <div class="table__icon">
                      <img src="/icons/trash_icon.svg" alt="" />
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="shadow" v-else>
                <td class="inner" colspan="2">
                  <div class="table-inner">
                    <div class="table-inner__title">
                      {{ item.title }}
                      <img
                        @click="toggleEdit(item)"
                        class="table-inner__close"
                        src="/icons/close_icon.svg"
                        alt=""
                      />
                    </div>
                    <div class="table-inner__description description">
                      <div class="description__title">Описание</div>
                      <div class="description__content">
                        {{ item.description }}
                      </div>
                    </div>
                    <div v-if="false" class="table-inner__table">
                      <table class="table">
                        <tr class="shadow">
                          <td>Тест</td>
                          <td>
                            <div class="table__actions">
                              <div class="table__icon">
                                <img src="/icons/file_icon.svg" alt="" />
                              </div>
                              <div class="table__icon">
                                <img src="/icons/trash_icon.svg" alt="" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Форма добавления документа -->
                    <v-add-document
                      @toggleAddDocument="toggleAddDocument"
                      v-if="addDocumentItem === item"
                    />

                    <div v-else class="table-inner__actions">
                      <v-button @click="toggleAddDocument(item)" red
                        >Добавить документ</v-button
                      >
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <v-not-found-query v-else />
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import VFilter from "@/components/VFilter";
import VSpinner from "@/components/VSpinner";
import VAddDocument from "./components/VAddDocument";
import roleMixins from "@/mixins/role";
import axios from "@/api/axios";

export default {
  mixins: [roleMixins],
  components: { VButton, VAddDocument, VFilter, VSpinner, VNotFoundQuery },
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
        console.log(role);
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
          url: `/educations/get/`,
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

      if (this.editedItem === item) {
        this.editedItem = null;
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
