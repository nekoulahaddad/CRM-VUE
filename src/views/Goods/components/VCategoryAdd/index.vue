<template>
  <div class="list__info list-info category-add-form">
    <div class="category-add-form__title text--blue">
      Создать категорию:
      <img
        alt=""
        class="category-add-form__close"
        src="/icons/close_icon.svg"
        @click.prevent="
          $store.commit('toggleAction', {
            key: 'addGoodsCategory',
          })
        "
      />
    </div>
    <form @submit.prevent="onCategoryAdd">
      <div class="group">
        <div class="group__title">Название категории:</div>
        <div class="group__content">
          <input
            required
            class="form-control"
            type="text"
            name="categoryName"
            placeholder="Введите название категории..."
            @input="onChange($event)"
          />
        </div>
      </div>

      <div class="group">
        <div class="group__title">Часто ищут:</div>
        <div
          class="group__find"
          v-if="views && views.length"
          v-for="(chip, index) in views"
          :key="chip.categoryName"
        >
          {{ chip.categoryName }}

          <VueCustomTooltip label="Удалить">
            <img
              @click="deleteChip(index)"
              src="@/assets/icons/trash_icon.svg"
              alt=""
            />
          </VueCustomTooltip>
        </div>
        <div class="group__content">
          <autocomplete
            ref="executors"
            :search="searchByExecutor"
            :get-result-value="getResultValue"
            placeholder="Введите название категории..."
          >
            <template #result="{ result, props }">
              <li v-bind="props" @click="selectCategory(result)">
                {{ result.categoryName }}
              </li>
            </template>
          </autocomplete>
        </div>
      </div>

      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    region: String,
  },
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
      views: [],
      filters: [],
      itemFilters: [],
      currentInput: "",
      tempViews: [],
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      remove: [],
    };
  },
  methods: {
    deleteChip(index) {
      this.views.splice(index, 1);
    },
    onChange(e) {
      this[e.target.name] = e.target.value;
      this.tempViews = [];
    },
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files[0];
      this[e.target.name + "Url"] = URL.createObjectURL(files[0]);
    },
    getResultValue() {
      return "";
    },
    selectCategory(category) {
      let exist = false;
      for (let i = 0; i < this.views.length; i++) {
        if (this.views[i].categoryName === category.categoryName) {
          exist = true;
        }
      }
      if (exist) {
        this.$toast.error("Категория уже в списке", "Ошибка");
        this.tempViews = [];
      } else {
        this.$toast.success("Категория успешно добавлена!");
        this.views.push(category);
        this.tempViews = [];
        this.currentInput = "";
      }
    },
    saveChip() {
      axios({
        url: `/categories/getcategoriesbysearch/`,
        data: {
          title: this.currentInput,
          region: this.region,
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        if (!result.data.views.length) {
          this.$toast.error("Категория не найдена", "Ошибка");
          return;
        }
        if (result.data.views.length === 1) {
          this.$toast.success("Категория успешно добавлена!");
          this.views.push(result.data.views[0]);
          this.tempViews = [];
          this.currentInput = "";
          return;
        }
        this.tempViews = result.data.views;
      });
    },
    onCategoryAdd() {
      let categoryData = new FormData();

      categoryData.append("categoryName", this.categoryName);
      categoryData.append("nesting", this.$route.params.nesting - 1);
      categoryData.append("region", this.region);

      if (this.$route.params.parent_value) {
        categoryData.append("parent_value", this.$route.params.parent_value);
      }

      categoryData.append("categoryImage", this.categoryImage);
      categoryData.append("categoryIcon", this.categoryIcon);

      categoryData.append("categoryFilters", JSON.stringify(this.itemFilters));
      categoryData.append("categorySlide", this.categorySlide);
      categoryData.append("categoryBanner", this.categoryBanner);
      categoryData.append("categoryBannerMob", this.categoryBannerMob);

      if (this.views) {
        categoryData.append("views", JSON.stringify(this.views));
      }

      axios({
        url: `/categories/post/`,
        data: categoryData,
        method: "POST",
      })
        .then((res) => {
          if (res.data.exist) {
            this.$toast.success("Категория уже существует!");
          } else {
            this.$emit("refreshGoods");
            this.$toast.success("Категория успешно добавлена!");
          }
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    searchByExecutor(input) {
      if (input.trim().length < 1) {
        return [];
      }
      this.currentInput = input;
      return new Promise((resolve) => {
        axios({
          url: `/categories/getcategoriesandbrandsbysearch/`,
          data: {
            title: this.currentInput,
            region: this.region,
          },
          method: "POST",
        }).then(async (res) => {
          let result = await res;
          if (!result.data.views.length) {
            return;
          }
          if (result.data.views.length === 1) {
            if (result.data.views[0].name) {
              this.$toast.success("Бренд успешно выбран!");
            } else {
              this.$toast.success("Категория успешно выбрана!");
            }
            this.category = result.data.views[0];
            this.currentInput = "";
            return;
          }
          resolve(result.data.views);
          this.tempCategories = result.data.views;
        });
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.category-add-form {
  padding: 0;
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;

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
  .form-control {
    width: 976px;
  }
  .group__flex {
    display: flex;
    margin-bottom: 10px;

    .group {
      margin-top: 0;

      &__image {
        max-width: 200px;
        min-width: 123px;
        border-radius: $border-radius;
      }
    }
    .group__content {
      width: 280px;
      display: flex;
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
  .actions {
    &__btn {
      width: 33px;
      height: 33px;
      border-radius: $border-radius;
      border: 2px solid rgba(0, 0, 0, 0.3);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .group__left {
    margin-right: 10px;
  }

  .group__find {
    width: 976px;
    height: 40px;
    border-radius: $border-radius;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    padding: 10px;
    position: relative;

    span {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
    span[role="tooltip"] {
      &:after {
        background-color: $color-black;
        color: $color-white;
        border-radius: $border-radius;
      }
    }

    & + * {
      margin-top: 10px;
    }
  }
  .autocomplete-input {
    width: 976px;
  }

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
}
</style>
