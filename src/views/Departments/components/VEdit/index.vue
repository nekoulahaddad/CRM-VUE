<template>
  <div class="list__info list-info employee-edit-form">
    <form @submit.prevent="onSectionAdd">
      <div class="group__title group__title--big text--blue">
        Редактировать отдел:
      </div>
      <div class="group">
        <div class="group__title">Название</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            name="role"
            v-model="title"
            @change="onChange($event)"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Руководитель</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            name="role"
            v-model="title"
            @change="onChange($event)"
          />
        </div>
      </div>
      <v-button red>Отправить</v-button>
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import VEmployeeForm from "../VEmployeeForm";
import axios from "@/api/axios";
import { Datetime } from "vue-datetime";
import VButton from "@/components/VButton";

export default {
  components: { Datetime, VButton, VEmployeeForm, VButton },
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      title: "",
      fio: "",
      leader: null,
      users: [],
      titleName: this.editedItem ? "Редактировать отдел" : "Добавить отдел",
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    async getUsersByFIO() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        axios(`/user/getsearch/${this.fio}`).then(async (res) => {
          let result = await res;
          this.users = result.data;
        });
      }, 300);
    },
    onSectionAdd() {
      this.changeStatus(false);
      let sectionData = {};
      if (this.title) {
        sectionData.title = this.title;
      }
      if (this.fio) {
        sectionData.leader = this.leader._id;
      }
      if (this.editedItem) {
        sectionData.departmentId = this.editedItem._id;

        axios({
          url: `/departments/update/`,
          data: sectionData,
          method: "POST",
        })
          .then(async () => {
            this.$emit("refresh");
            this.$toast.success("Отдел успешно обновлен!");
            this.$emit("toggleOpen");
            this.changeStatus(true);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
            this.changeStatus(true);
          });
      } else {
        axios({
          url: `/departments/post/`,
          data: sectionData,
          method: "POST",
        })
          .then(async () => {
            await this.$emit("refresh");
            this.$toast.success("Отдел успешно добавлен!");
            this.$emit("toggleOpen");
            this.changeStatus(true);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
            this.changeStatus(true);
          });
      }
    },
  },
  mounted() {
    if (this.editedItem) {
      this.title = this.editedItem.title;
      if (this.editedItem.leader) {
        (this.fio = this.transformFullFIO(this.editedItem.leader)),
          (this.leader = this.editedItem.leader);
      }
    }
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.employee-edit-form {
  .group {
    max-width: 976px;

    select {
      max-width: 401px;
    }
  }
  .group__title {
    position: relative;

    &:not(:first-child) {
      padding-top: 10px;

      &::before {
        display: block;
        content: "";
        position: absolute;
        height: 2px;
        width: 100%;
        top: 0;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }
  }
  select,
  input[type="text"] {
    font-weight: 500;
  }
  .vdatetime-popup__header {
    background: $color-red;
  }
}
</style>
