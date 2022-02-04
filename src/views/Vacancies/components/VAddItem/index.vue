<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-vacancy-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Новая вакансия
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addVacancy',
            })
          "
          class="add-vacancy-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-vacancy-row__inner">
      <form @submit.prevent="onSectionAdd">
        <div class="add-vacancy-row__title text--blue">
          Основная информация:
        </div>
        <div class="group">
          <div class="group__title">Должность:</div>
          <div class="group__content">
            <input
              required
              class="form-control"
              type="text"
              placeholder="Введите должность..."
              name="role"
              v-model="role"
              @change="onChange($event)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Отделы:</div>
          <div class="group__content">
            <select
              required
              class="form-select"
              name="department"
              v-model="department"
              @change="onChange($event)"
            >
              <option selected disabled :value="null">Выберите отдел</option>
              <option v-for="department in departments" :value="department._id">
                {{ department.title }}
              </option>
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Регионы:</div>
          <div class="group__content">
            <select
              required
              class="form-select"
              name="region"
              v-model="region"
              @change="onChange($event)"
            >
              <option selected disabled :value="null">Выберите регион</option>
              <option v-for="region in regions" :value="region._id">
                {{ region.title }}
              </option>
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Требования:</div>
          <div class="group__content">
            <textarea
              required
              class="form-textarea"
              name="description.requirements"
              placeholder="Введите требования для кандидата..."
              v-model="description.requirements"
              @change="onChange($event)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Обязаности:</div>
          <div class="group__content">
            <textarea
              required
              class="form-textarea"
              placeholder="Введите обязаности кандидата..."
              name="description.responsibilities"
              v-model="description.responsibilities"
              @change="onChange($event)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Условия:</div>
          <div class="group__content">
            <textarea
              required
              class="form-textarea"
              placeholder="Опишите условия работы..."
              name="description.conditions"
              v-model="description.conditions"
              @change="onChange($event)"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Ссылка:</div>
          <div class="group__content">
            <input
              required
              type="text"
              class="form-control"
              placeholder="Вставьте ссылку..."
              name="vLink"
              v-model="vLink"
              @change="onChange($event)"
            />
          </div>
        </div>
        <v-button red>Создать</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  props: {
    type: {
      type: String,
    },
    editedItem: {
      type: Object,
    },
  },
  components: { VButton },
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
      this.changeStatus(false);
      let sectionData = {};
      sectionData.description = {};
      if (this.vLink) {
        sectionData.link = this.vLink;
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
      if (this.editedItem) {
        sectionData.educationId = this.editedItem._id;
        axios({
          url: `/vacancies/update/`,
          data: sectionData,
          method: "POST",
        })
          .then(async () => {
            this.$emit("refresh");
            this.$toast.success("Вакансия успешно изменена!");
            this.$store.commit("toggleAction", {
              key: "addVacancy",
            });
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          })
          .finally(() => {
            this.changeStatus(true);
          });
      } else {
        axios({
          url: `/vacancies/post/`,
          data: sectionData,
          method: "POST",
        })
          .then(async () => {
            this.$emit("refresh");
            this.$toast.success("Вакансия успешно добавлена!");
            this.$store.commit("toggleAction", {
              key: "addVacancy",
            });
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          })
          .finally(() => {
            this.changeStatus(true);
          });
      }
    },
  },
  mounted() {
    if (this.editedItem) {
      for (let p in this.editedItem) {
        this[p] = this.editedItem[p];
      }
      this.region = this.editedItem.region._id;
      this.department = this.editedItem.department._id;
    }

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
.add-vacancy-row {
  .list__columns {
    grid-template-columns: 1fr !important;

    .list__column {
      text-align: left !important;
      padding-left: 0 !important;
      position: relative;
    }
  }

  .list__column--title {
    font-size: 16px !important;
  }

  &__inner {
    padding: 10px;
  }

  &__close {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  &__title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 10px;
  }

  button {
    width: 230px;
    height: 37px;
  }
  .form-select {
    width: 401px;
  }

  .form-textarea,
  .form-control {
    width: 976px;
  }
}
</style>
