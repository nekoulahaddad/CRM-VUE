<template>
  <div class="list__info list-info category-edit-form">
    <form @submit.prevent="onCategoryCopy">
      <div class="category-edit-form__title text--blue">
        Ответственный менеджер:
      </div>

      <div class="group">
        <div class="group__title">ФИО:</div>
        <div class="group__content">
          <input required class="form-control" type="text" />
        </div>
      </div>

      <div class="group__content">
        <div class="group__item text--bold-700">Телефон:</div>
        <div class="group__value">{{ phone || "" }}</div>
      </div>

      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    region: {
      type: String,
      default: () => "",
    },
    managerItem: {
      type: Object,
      default: () => false,
    },
  },
  data() {
    return {
      regions: [],
      targetRegion: "",
      users: [],
      phone: "",
      timer: null,
      fio: "",
      manager: null,
    };
  },
  computed: {
    editedManager: {
      get() {
        return this.managerItem.manager[0] ? this.managerItem.manager[0] : null;
      },
    },
    notChanged: {
      get() {
        return this.manager
          ? this.editedManager
            ? this.manager._id === this.editedManager._id
            : false
          : true;
      },
    },
  },
  methods: {
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    setManager(clear) {
      this.manager._id = clear ? null : this.manager._id;
      axios({
        url: `/categories/setmanager/`,
        data: {
          categoryId: this.managerItem._id,
          region: this.region,
          managerId: this.manager._id,
        },
        method: "POST",
      })
        .then(() => {
          this.$emit("refreshGoods");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
  },
  beforeMount() {
    if (this.managerItem.manager[0]) {
      this.fio = this.transformFullFIO(this.managerItem.manager[0]);
      this.phone = this.managerItem.manager[0].phone;
      this.manager = this.managerItem.manager[0];
    }
  },
};
</script>

<style lang="scss">
.group__value {
  font-weight: 500;
}
</style>
