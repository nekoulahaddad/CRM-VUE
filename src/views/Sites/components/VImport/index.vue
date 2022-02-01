<template>
  <div class="list__info list-info sites-list-info">
    <div class="group__title text--blue">Импорт товаров:</div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">Сайт:</div>
        <div class="group__value">{{ item.url }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">Описание:</div>
        <div class="group__value">{{ description }}</div>
      </div>
    </div>
    <div class="group">
      <div class="group__title">Загрузка файла:</div>
      <div class="group__content">
        <input
          hidden
          type="file"
          id="document-file"
          accept=".xlsx, .xls"
          name="fileImport"
          @change="fileUpload($event)"
        />
        <label for="document-file">
          {{ fileImport ? fileImport.name : "Выбрать файл" }}
        </label>
      </div>
    </div>
    <v-button red>Импортировать</v-button>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";

export default {
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    VButton,
  },
  data() {
    return {
      categoryName: "",
      fileImport: null,
      url: "www.example.com",
      title: "Импорт товаров",
      selected: null,
    };
  },
  computed: {
    description() {
      return `Обновление цен на товары для сайта ${this.item.url}`;
    },
    regions() {
      let regions = this.item.regions;
      return regions;
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
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.sites-list-info {
  .group__title {
    font-size: 16px;
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
    color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
}
</style>
