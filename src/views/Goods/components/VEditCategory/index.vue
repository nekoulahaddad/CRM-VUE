<template>
  <div class="list__info list-info category-edit-form">
    <form>
      <div class="category-edit-form__title text--blue">
        Ответственный менеджер:
      </div>

      <div class="group">
        <div class="group__title">ФИО:</div>
        <div class="group__content">
          <input required class="form-control" type="text" />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Телефон:</div>
        <div class="group__content">
          <input required class="form-control" type="text" />
        </div>
      </div>

      <div class="category-edit-form__title text--blue">
        Редактировать категорию:
      </div>

      <div class="group">
        <div class="group__title">Название категории:</div>
        <div class="group__content">
          <input required class="form-control" type="text" />
        </div>
      </div>

      <div class="group__flex">
        <div class="group">
          <div class="group__title">Фото категории:</div>
          <div class="group__content">
            <div class="category-edit-form__default-img">
              <img src="@/assets/icons/goods_default.svg" alt="" />
              <span>Нажмите что бы выбрать</span>
            </div>
          </div>
        </div>

        <div class="group">
          <div class="group__title">Иконка категории:</div>
          <div class="group__content">
            <div class="category-edit-form__default-img">
              <img src="@/assets/icons/goods_default.svg" alt="" />
              <span>Нажмите что бы выбрать</span>
            </div>
          </div>
        </div>

        <div class="group">
          <div class="group__title">Изображение слайдера:</div>
          <div class="group__content">
            <div class="category-edit-form__default-img">
              <img src="@/assets/icons/goods_default.svg" alt="" />
              <span>Нажмите что бы выбрать</span>
            </div>
          </div>
        </div>

        <div class="group">
          <div class="group__title">Баннер категории:</div>
          <div class="group__content">
            <div class="category-edit-form__default-img">
              <img src="@/assets/icons/goods_default.svg" alt="" />
              <span>Нажмите что бы выбрать</span>
            </div>
          </div>
        </div>

        <div class="group">
          <div class="group__title">Банер категории (моб. версия):</div>
          <div class="group__content">
            <div class="category-edit-form__default-img">
              <img src="@/assets/icons/goods_default.svg" alt="" />
              <span>Нажмите что бы выбрать</span>
            </div>
          </div>
        </div>
      </div>

      <div class="group">
        <div class="group__title">Часто ищут:</div>
        <div class="group__content">
          <input
            required
            class="form-control"
            type="text"
            placeholder="Введите название категории..."
          />
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
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
  components: { VButton },
  data() {
    return {
      categoryName: "",
      categoryImage: "Выбрать файл",
      categoryImageUrl: require("@/assets/icons/goods_default.svg"),
      categoryIcon: "Выбрать файл",
      categoryIconUrl: require("@/assets/icons/goods_default.svg"),
      categorySlide: "Выбрать файл",
      categorySlideUrl: require("@/assets/icons/goods_default.svg"),
      categoryBanner: "Выбрать файл",
      categoryBannerUrl: require("@/assets/icons/goods_default.svg"),
      categoryBannerMob: "Выбрать файл",
      categoryBannerMobUrl: require("@/assets/icons/goods_default.svg"),
      views:
        this.editedItem && this.editedItem.views ? this.editedItem.views : [],
      filters: [],
      itemFilters: [],
      currentInput: "",
      tempViews: [],
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      title: this.editedItem ? "Редактировать категорию" : "Создать категорию",
      remove: [],
    };
  },
  created() {
    if (this.editedItem) {
      axios({
        url: `/categories/getviews/`,
        data: {
          parent_id: this.editedItem._id,
          nesting: this.editedItem.nesting,
          region: this.region,
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        this.editedItem.views = result.data.views;
        this.views = result.data.views;
        this.filters = result.data.filters;
        this.editedItem.filters
          ? (this.itemFilters = this.editedItem.filters)
          : false;
      });
    }
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.category-edit-form {
  &__title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .form-control {
    width: 976px;
  }
  .group__flex {
    display: flex;
    margin-bottom: 10px;

    .group {
      margin-top: 0;
    }
    .group__content {
      width: 280px;
    }
  }

  &__default-img {
    border: 2px solid rgba(0, 0, 0, 0.3);
    width: 200px;
    height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.3);
    cursor: pointer;

    img {
      margin-bottom: 10px;
    }
  }
  button {
  }
}
</style>
