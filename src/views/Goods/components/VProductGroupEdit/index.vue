<template>
  <div class="list__info list-info group-edit-form">
    <form @submit.prevent="onGroupEdit">
      <div class="group-edit-form__title text--blue">Редактировать группу:</div>

      <div class="group">
        <div class="group__title">Заголовок группы:</div>
        <div class="group__content">
          <input
            required
            class="form-control"
            type="text"
            name="title"
            v-model="title"
          />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Свойства группы:</div>
        <div class="group__content">
          <select class="form-select" @change="onChange($event)">
            <option v-if="!group.groupProperties">Не выбрано</option>
            <option v-for="(product, index) in getOptions()" :value="product">
              {{ product }}
            </option>
          </select>
        </div>
      </div>
      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";

export default {
  components: { VButton },
  props: {
    region: {
      type: String,
    },
    group: {
      type: Object,
    },
  },
  data() {
    return {
      title: this.group && this.group.title ? this.group.title : "",
      groupProperties: this.group.groupProperties
        ? this.group.groupProperties
        : "",
    };
  },
  methods: {
    onGroupEdit() {
      if (!this.title) {
        this.$toast.error("Заголовок не заполнен!");
        return;
      }
      axios({
        url: `/groups/edit`,
        data: {
          title: this.title,
          groupId: this.group._id,
          region: this.region,
          groupProperties: this.groupProperties,
        },
        method: "POST",
      })
        .then(async () => {
          this.$emit("toggleEditGroup", this.group);
          this.$emit("refreshGoods");
          this.$toast.success("Группа успешно изменена!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    getOptions() {
      let arr = [];
      if (this.group.groupProperties) arr.push(this.group.groupProperties);

      this.group.products.map((i) => {
        i.options.map((options) => {
          arr.push(Object.keys(options) + "");
        });
      });
      arr.push("Размер");
      return Array.from(new Set(arr));
    },
    onChange(e) {
      this.groupProperties = e.target.value;
    },
  },
};
</script>

<style lang="scss">
.group-edit-form {
  .form-control {
    width: 976px;
  }
  .form-select {
    width: 401px;
  }
  &__title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 10px;
  }
}
</style>
