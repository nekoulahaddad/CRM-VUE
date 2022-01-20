<template>
  <div class="list create-section-list">
    <div class="list__row list__row--shadow list__row--opened">
      <div
        class="list__columns list__columns--shadow list__columns--white education-list-columns"
      >
        <div class="list__column">Добавить новый раздел:</div>
        <img
          @click="$emit('close')"
          class="close-icon"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>

      <div class="list__info list-info education-list-info">
        <form @submit.prevent="onSectionAdd">
          <div class="edit__inner">
            <!-- Наименование раздела -->
            <div class="group">
              <div class="group__title">Наименование раздела:</div>
              <div class="group__content">
                <input
                  class="form-control"
                  placeholder="Введите название раздела..."
                  type="text"
                  v-model="title"
                  @change="onChange($event)"
                  name="title"
                />
              </div>
            </div>
            <!-- Для какой роли -->
            <div class="group">
              <div class="group__title">Для какой роли:</div>
              <div class="group__content">
                <select
                  class="form-select"
                  v-model="role"
                  name="role"
                  @change="onChange($event)"
                >
                  <option value="all">Все роли</option>
                  <option :value="key" v-for="(role, key) in $t('roles')">
                    {{ role }}
                  </option>
                </select>
              </div>
            </div>
            <!-- Для какого отдела -->
            <div class="group">
              <div class="group__title">Для какого отдела:</div>
              <div class="group__content">
                <select
                  class="form-select"
                  v-model="department"
                  name="department"
                  @change="onChange($event)"
                >
                  <option
                    v-for="department in departments"
                    :value="department.value"
                  >
                    {{ department.title }}
                  </option>
                </select>
              </div>
            </div>
            <!-- Описание раздела -->
            <div class="group">
              <div class="group__title">Описание раздела:</div>
              <div class="group__content">
                <textarea
                  class="form-textarea"
                  placeholder="Введите описание раздела..."
                  name="description"
                  v-model="description"
                  @change="onChange($event)"
                />
              </div>
            </div>
            <v-button red>{{ $t("Отправить") }}</v-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  props: {
    type: String,
  },
  components: { VButton },
  data() {
    return {
      date: new Date().toString(),
      title: "",
      role: "all",
      department: "all",
      description: "",
      documents: ["Выбрать файлы"],
      departments: [],
      titleName: this.editedItem ? "Редактировать раздел" : "Добавить раздел",
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
      if (this.title) {
        sectionData.title = this.title;
      }
      if (this.type) {
        sectionData.type = this.type;
      }
      if (this.role) {
        sectionData.role = this.role;
      }
      if (this.department) {
        sectionData.department = this.department;
      }
      if (this.description) {
        sectionData.description = this.description;
      }
      console.log(sectionData);

      axios({
        url: "/educations/post/",
        data: sectionData,
        method: "POST",
      })
        .then(async () => {
          alert();
          //await this.$emit("refreshEducations");
          //this.$toast.success("Секция успешно добавлена!");
          //this.$emit("toggleOpen");
          //this.changeStatus(true);
        })
        .catch((err) => {
          console.log(err);
          //this.$toast.error(err.response.data.message);
          //this.changeStatus(true);
        });
    },
  },
  mounted() {
    if (this.editedItem) {
      this.role = this.editedItem.role;
      this.department = this.editedItem.department;
      this.title = this.editedItem.title;
      this.description = this.editedItem.description;
    }

    axios({
      url: "/user/getdepartments",
    }).then(async (res) => {
      let result = await res;
      let departments = result.data.departments;
      departments.unshift({
        title: "Все отделы",
        value: "all",
      });
      this.departments = departments;
    });
  },
};
</script>

<style lang="scss">
.create-section-list {
  .close-icon {
    cursor: pointer;
    right: 10px;
    top: 13px;
    position: absolute;
  }

  .form-select {
    max-width: 371px;
  }
}
</style>
