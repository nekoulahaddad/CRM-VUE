<template>
  <div class="list__info list-info storage-list-info">
    <form @submit.prevent="onItemEdit">
      <div class="group__title text--blue">Редактировать товар:</div>
      <div class="group">
        <div class="group__title">Минимальное количество:</div>
        <div class="group__content">
          <input
            class="form-control"
            placeholder="Введите минимальное количество..."
            name="minq"
            type="number"
            v-model="minq"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Поставщики:</div>
        <div class="group__content">
          <input
            class="form-control"
            type="text"
            placeholder="Введите наименование организации..."
            v-model="currentInput"
            @keypress.enter.prevent="saveChip"
            @keydown.delete="backspaceDelete"
          />
        </div>
      </div>
      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";
import axios from "@/api/axios";

export default {
  props: {
    region: {
      type: String,
    },
    editedItem: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentInput: "",
      providers:
        this.editedItem.providers && this.editedItem.providers.length
          ? this.editedItem.providers
          : [],
    };
  },
  components: {
    VButton,
  },
  computed: {
    minq: {
      get: function () {
        return this.editedItem && this.editedItem.minq
          ? this.editedItem.minq
          : 0;
      },
      set: function (minq) {
        this.editedItem.minq = minq;
      },
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    onItemEdit() {
      this.changeStatus(false);
      let infoData = {};
      infoData.id = this.editedItem._id;
      infoData.region = this.region;
      if ((this.providers && this.providers.length === 0) || this.providers) {
        infoData.providers = this.providers;
      }
      if (this.editedItem.minq || this.editedItem.minq === 0) {
        infoData.minq =
          this.editedItem && this.editedItem.minq ? this.editedItem.minq : 0;
      } else {
        infoData.minq = 0;
      }
      axios
        .post(`/products/provider/update`, infoData)
        .then(async (res) => {
          let result = await res;
          this.$emit("editItem", result.data);
          this.$toast.success("Элемент успешно изменен!");
          this.$emit("toggleEdit", this.editedItem);
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
        });
    },
    saveChip() {
      const { providers, currentInput } = this;
      axios({
        url: `/providers/getprovidersbyname/`,
        data: {
          title: currentInput,
          region: this.region,
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        if (!result.data.provider) {
          this.$toast.error("Поставщик не найден", "Ошибка");
          return;
        }
        let exist = false;
        for (let i = 0; i < providers.length; i++) {
          if (providers[i].name === result.data.provider.name) exist = true;
        }
        if (exist) {
          this.$toast.error("Поставщик уже в списке", "Ошибка");
        } else {
          this.$toast.success("Поставщик успешно добавлен!");
          this.providers.push(result.data.provider);
        }
      });
      this.currentInput = "";
    },
    deleteChip(index) {
      this.providers.splice(index, 1);
    },
    backspaceDelete({ which }) {
      which == 8 &&
        this.currentInput === "" &&
        this.providers.splice(this.providers.length - 1);
    },
  },
};
</script>

<style lang="scss">
.storage-list-info {
  .form-control {
    width: 976px;
  }
}
</style>
