<template>
  <div class="list__info list-info category-import">
    <div class="group__title text--blue">Импорт товара:</div>
    <form @submit.prevent="onExport">
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-600">Описание:</div>
          <div class="group__value">{{ description }}</div>
        </div>
      </div>

      <div class="group">
        <div class="group__title">Файл:</div>
        <div class="group__content">
          <input
            hidden
            type="file"
            id="document-file"
            accept=".xlsx, .xls"
            name="fileImport"
            @change="fileUpload($event)"
          />
          <label for="document-file">Загрузить файл</label>
        </div>
      </div>
      <v-button v-if="!start" red>Импортировать</v-button>
      <v-spinner small v-else />
    </form>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import axios from "@/api/axios";
import VButton from "@/components/VButton";
import VSpinner from "@/components/VSpinner";

export default {
  props: ["region", "category"],
  data() {
    return {
      categoryName: "",
      fileImport: null,
      text: {
        item: `Загрузка только новых товаров в выбранную категорию.\nУчитываются только строки таблицы, у которых отсутствует артикул, код товара и код категории.`,
        noitem: `Обновление существующих и загрузка новых товаров. \nОбновлению подлежат товары из строк, у которых указан артикул, код товара и код категории. \nДля загрузки новых товаров оставьте поле артикул пустым и укажите код категории.`,
      },
      title: "Импорт товаров",
      start: false,
    };
  },
  components: { VButton, VSpinner },
  computed: {
    description() {
      return this.category ? this.text.item : this.text.noitem;
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files[0];
    },
    onExport() {
      if (!this.fileImport) {
        this.$toast.error("Вы не загрузили файл!");
        return;
      }
      this.start = true;

      let categoryData = new FormData();
      categoryData.append("region", this.region);
      categoryData.append("category_id", this.category._id);
      categoryData.append("document", this.fileImport);

      this.changeStatus(false);
      axios({
        url: `/excel/importcategoryproducts/`,
        data: categoryData,
        method: "POST",
      })
        .then(async (res) => {
          this.$toast.success("Товары обновлены!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
          this.start = false;
        });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.category-import {
  .group__item {
    font-weight: 700;
  }
  .group__value {
    font-weight: 500;
    width: 715px;
  }
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 230px;
    height: 37px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(0, 0, 0, 0.3);
    background-color: $color-white;
    border-radius: $border-radius;
    cursor: pointer;
    font-weight: bold;
  }
}
</style>