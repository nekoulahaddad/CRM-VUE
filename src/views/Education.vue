<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/education_title.svg" alt="" />
      </div>
      <h1 class="page__title">Обучение</h1>
    </div>
    <div class="page__body">
      <div class="card card--white">
        <table class="table">
          <tbody>
            <tr v-for="item in educations" :key="item.id">
              <td>{{ item.title }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  data() {
    return {
      typeE: "crm",
      filtersOptions: {},
      activeIndex: -1,
      add: false,
      edit: false,
      deleteEducationForm: false,
      deleteDocument: false,
      upload: false,
      editedItem: {},
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

      try {
        const response = await axios({
          url: `/educations/get/`,
          params: data,
          method: "GET",
        });

        this.educations = response.data.educations;
      } catch (e) {}
    },
  },
};
</script>
