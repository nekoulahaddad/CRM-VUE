<template>
  <div class="list__info list-info vacancy-edit-form">
    <form @submit.prevent="onSectionAdd">
      <div class="add-vacancy-row__title text--blue">Основная информация:</div>

      <div class="d-flex justify-content-between">
        <div class="flex-1" style="margin-right: 25px">
          <div class="group">
            <div class="group__title">Должность:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите должность..."
                name="role"
                @change="onChange($event)"
                v-model.trim="$v.role.$model"
                maxlength="100"
                :class="{ 'form-control--error': $v.role.$error }"
              />
            </div>
          </div>
          <div class="group">
            <div class="group__title">Требования:</div>
            <div class="group__content">
              <textarea
                class="form-textarea"
                name="description.requirements"
                placeholder="Введите требования для кандидата..."
                @change="onChange($event)"
                v-model.trim="$v.description.requirements.$model"
                :class="{
                  'form-control--error': $v.description.requirements.$error,
                }"
                maxlength="3000"
              />
            </div>
          </div>
          <div class="group">
            <div class="group__title">Обязаности:</div>
            <div class="group__content">
              <textarea
                class="form-textarea"
                placeholder="Введите обязаности кандидата..."
                name="description.responsibilities"
                @change="onChange($event)"
                v-model.trim="$v.description.responsibilities.$model"
                :class="{
                  'form-control--error': $v.description.responsibilities.$error,
                }"
                maxlength="3000"
              />
            </div>
          </div>
          <div class="group">
            <div class="group__title">Условия:</div>
            <div class="group__content">
              <textarea
                class="form-textarea"
                placeholder="Опишите условия работы..."
                name="description.conditions"
                @change="onChange($event)"
                v-model.trim="$v.description.conditions.$model"
                :class="{
                  'form-control--error': $v.description.conditions.$error,
                }"
                maxlength="3000"
              />
            </div>
          </div>
          <div class="group">
            <div class="group__title">Ссылка:</div>
            <div class="group__content">
              <input
                type="text"
                class="form-control"
                placeholder="Вставьте ссылку..."
                name="vLink"
                @change="onChange($event)"
                v-model.trim="$v.vLink.$model"
                :class="{ 'form-control--error': $v.vLink.$error }"
                maxlength="100"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="group">
            <div class="group__title">Отделы:</div>
            <div class="group__content">
              <v-select
                :options="
                  departments.map((department) => ({
                    label: department.title,
                    value: department._id,
                  }))
                "
                :reduce="(item) => item.value"
                v-model.trim="$v.department.$model"
                :class="{
                  'form-control--error': $v.department.$error,
                }"
              />
            </div>
          </div>
          <div class="group">
            <div class="group__title">Регионы:</div>
            <div class="group__content">
              <v-select
                :options="
                  regions.map((region) => ({
                    label: region.title,
                    value: region._id,
                  }))
                "
                :reduce="(item) => item.value"
                v-model.trim="$v.region.$model"
                :class="{ 'form-control--error': $v.region.$error }"
              />
            </div>
          </div>
        </div>
      </div>

      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";
import { required, url } from "vuelidate/lib/validators";

export default {
  props: {
    showEdit: Boolean,
    editedItem: {
      type: Object,
      required: true,
    },
  },
  components: { VButton },
  validations: {
    department: {
      required,
    },
    region: {
      required,
    },
    role: { required },
    description: {
      requirements: {
        required,
      },
      responsibilities: {
        required,
      },
      conditions: {
        required,
      },
    },
    vLink: {
      url,
      required,
    },
  },
  data() {
    return {
      regions: [],
      region: {
        title: "Выберите регион",
        value: null,
      },
      date: new Date().toString(),
      title: "",
      vLink: "",
      link: "",
      role: "",
      category: "",
      department: {
        title: "Выберите отдел",
        value: null,
      },
      description: {
        requirements: "",
        responsibilities: "",
        conditions: "",
      },
      departments: [],
      titleName: this.editedItem
        ? "Редактировать вакансию"
        : "Добавить вакансию",
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    onSectionAdd() {
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }

      let sectionData = {};
      sectionData.description = {};
      if (this.link) {
        sectionData.link = this.link;
      }
      if (this.role) {
        sectionData.role = this.role;
      }
      if (this.department) {
        sectionData.department = this.department;
      }
      if (this.description.requirements) {
        sectionData.description.requirements = this.description.requirements;
      }
      if (this.description.responsibilities) {
        sectionData.description.responsibilities =
          this.description.responsibilities;
      }
      if (this.description.conditions) {
        sectionData.description.conditions = this.description.conditions;
      }
      if (this.region) {
        sectionData.region = this.region;
      }

      sectionData.educationId = this.editedItem._id;
      axios({
        url: `/vacancies/update/`,
        data: sectionData,
        method: "POST",
      })
        .then(async () => {
          this.$emit("refresh");
          this.$emit("toggleEdit", this.editedItem);
          this.$toast.success("Вакансия успешно изменена!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
  },
  mounted() {
    for (let p in this.editedItem) {
      this[p] = this.editedItem[p];
    }
    this.region = this.editedItem.region._id;
    this.department = this.editedItem.department._id;

    axios({
      url: "/user/getdepartments",
    }).then((res) => {
      this.departments = res.data.departments;
    });

    axios({
      url: "/regions/get",
    }).then(async (res) => {
      let result = await res;
      this.regions = result.data.regions;
    });
  },
};
</script>

<style lang="scss">
.vacancy-edit-form {
  .form-select {
    width: 401px;
  }
  .form-textarea,
  .form-control {
  }
  button {
    margin-top: 10px;
  }
}
</style>
