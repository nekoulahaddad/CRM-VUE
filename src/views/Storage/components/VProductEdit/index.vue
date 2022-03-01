<template>
  <div class="list__info list-info storage-list-info">
    <form @submit.prevent="onItemEdit">
      <div class="group__title text--blue">Редактировать товар:</div>
      <div class="group">
        <div class="group__title">Минимальное количество:</div>
        <div class="group__content">
          <input
            class="form-control hide-arrows"
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
        <div class="group__chips">
          <chip
            v-for="provider in providers"
            :key="provider._id"
            :close="true"
            :text="provider.name"
            @closed="chipClosed(index)"
          />
        </div>
        <autocomplete
          :search="searchByExecutor"
          :get-result-value="getResultValue"
          placeholder="Введите наименование организации..."
        >
          <template #result="{ result, props }">
            <li v-bind="props" @click="selectProvider(result)">
              {{ result.name }}
            </li>
          </template>
        </autocomplete>
      </div>
      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import Chip from "vue-chip";
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
    Chip,
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
    selectProvider(provider) {
      this.providers.push(provider);
    },
    chipClosed(index) {
      this.providers.splice(index, 1);
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
    getResultValue(result) {
      return "";
    },
    searchByExecutor(input) {
      if (input.trim().length < 1) {
        return [];
      }

      const { providers } = this;
      return new Promise((resolve) => {
        axios({
          url: `/providers/getprovidersbyname/`,
          data: {
            title: input,
            region: this.region,
          },
          method: "POST",
        }).then((res) => {
          if (!res.data.provider) {
            return [];
          }
          let exist = false;
          for (let i = 0; i < providers.length; i++) {
            if (providers[i].name === res.data.provider.name) {
              exist = true;
              break;
            }
          }
          if (exist) {
            this.$toast.error("Поставщик уже в списке", "Ошибка");
          } else {
            resolve([res.data.provider]);
          }
        });
      });
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
@import "@/styles/_variables";

.storage-list-info {
  .group__title {
    font-size: 14px;
    &.text--blue {
      font-size: 16px;
    }
  }
  .form-control {
  }
  .chip {
    background-color: $color-gray-secondary;
    margin-bottom: 10px;
    position: relative;
    padding-right: 40px;
    border-radius: 2px;

    & + * {
      margin-left: 5px;
    }

    i {
      font-size: 37px;
      position: absolute;
      right: 17px;
    }
  }
  .autocomplete-input {
    width: 100%;
  }
}
</style>
