<template>
  <div class="list__info list-info category-import">
    <div class="category-import__title group__title text--blue">
      Импорт товара:
    </div>
    <form @submit.prevent="onExport">
      <div class="list-info__group group">
        <div class="group__content">
          <div class="group__item text--bold-600">Описание:</div>
          <div class="group__value">{{ description }}</div>
        </div>
      </div>

      <div class="group">
        <div class="group__title">Файл:</div>
        <div class="group__document" v-if="fileImport">
          <span class="word-break">{{ fileImport.name }}</span>
        </div>
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
  props: {
    region: String,
    local: Boolean,
  },
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

      const category = !this.local
        ? false
        : this.$route.params.type === "categories" &&
          this.$route.params.parent_value;

      let categoryData = new FormData();
      categoryData.append("region", this.region);
      categoryData.append("category_id", category);
      categoryData.append("document", this.fileImport);

      axios({
        url: `/excel/importcategoryproducts/`,
        data: categoryData,
        method: "POST",
      })
        .then(() => {
          this.$toast.success("Товары обновлены!");

          if (this.local) {
            this.$emit("toggleCategoryImport", { _id: category });
          } else {
            this.$store.commit("toggleAction", { key: "importGoods" });
          }
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.start = false;
        });
    },
  },
  created() {
    console.log(this.$route);
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.category-import {
  padding: 0;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;

  form {
    padding: 10px;
  }

  &__close {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

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
  &__title {
    font-weight: 700;
    margin-bottom: 10px;
    background-color: $color-gray-secondary;
    height: 48px;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    display: flex;
    align-items: center;
    padding-left: 10px;
    color: $color-black;
    font-size: 16px;
    position: relative;
  }
  .group__document {
    width: 401px;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 33px;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 10px;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-weight: normal;
    }
  }
}
</style>
