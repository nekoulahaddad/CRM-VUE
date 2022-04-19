<template>
  <div class="list__info list-info sites-list-info">
    <form @submit.prevent="addManager">
      <div class="group__title text--blue">Редактировать менеджера:</div>
      <div class="group__content">
        <div class="group__item text--bold-700">Ф.И.О:</div>
        <div
          class="group__value"
          style="border-bottom: 1px dashed; cursor: pointer"
          @click="changeManager = !changeManager"
        >
          {{ fio || "Добавить менеджера" }}
        </div>
      </div>
      <div class="group" v-if="changeManager">
        <autocomplete
          ref="executors"
          :search="searchByExecutor"
          :get-result-value="getResultValue"
          placeholder="Введите Ф.И.О. ответственного..."
        >
          <template #result="{ result, props }">
            <li v-bind="props" @click="selectUser(result)">
              {{ transformFIO(result) }}
            </li>
          </template>
        </autocomplete>
      </div>
      <v-button :disabled="!manager" red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    item: Object,
  },
  data() {
    return {
      fio: "",
      changeManager: false,
      manager: null,
    };
  },
  methods: {
    addManager() {
      if (!this.manager) {
        this.$toast.error("Вы не выбрали менеджера");
      }

      axios({
        url: "/sites/addmanager/",
        method: "post",
        data: {
          siteId: this.item._id,
          manager: this.manager,
        },
      })
        .then(() => {
          this.$toast.success("Менеджер успешно изменен!");
          this.$emit("toggleManager", this.item);
          this.$emit("refreshData");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    getResultValue() {
      return "";
    },
    selectUser(user) {
      this.manager = user._id;
      this.changeManager = false;
      this.fio = this.transformFullFIO(user);
    },
    searchByExecutor(input) {
      if (input.length < 1) {
        return [];
      }
      return new Promise((resolve) => {
        axios(`/user/getsearch/${input}`).then(async (res) => {
          resolve(res.data);
        });
      });
    },
  },
  beforeMount() {
    if (Array.isArray(this.item.manager) && this.item.manager[0]) {
      this.fio = this.transformFullFIO(this.item.manager[0]);
    }
  },
};
</script>

<style lang="scss"></style>
