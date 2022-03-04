<template>
  <div class="list__info list-info category-edit-form">
    <form @submit.prevent="onCategoryAdd">
      <div class="category-edit-form__title text--blue">
        Редактировать категорию:
      </div>

      <div class="group">
        <div class="group__title">Название категории:</div>
        <div class="group__content">
          <input
            required
            class="form-control"
            type="text"
            name="categoryName"
            :value="categoryName ? categoryName : editedItem.categoryName"
            @input="onChange($event)"
          />
        </div>
      </div>

      <div class="group__flex">
        <div class="group flex-1">
          <div class="group__title">Фото категории:</div>
          <div class="group__content">
            <div class="group__left">
              <img
                alt=""
                class="group__image"
                :src="
                  editedItem && categoryImage === 'Выбрать файл'
                    ? serverAddr + editedItem.path + editedItem.img
                    : categoryImageUrl
                "
                @click.prevent="
                  downloadItem(
                    serverAddr + editedItem.path + editedItem.img,
                    editedItem.img
                  )
                "
              />
            </div>
            <div class="group__right">
              <div class="group__actions actions">
                <div class="actions__btn">
                  <label for="categoryImage">
                    <input
                      type="file"
                      id="categoryImage"
                      name="categoryImage"
                      @change="fileUpload($event)"
                      hidden
                    />
                    <VueCustomTooltip label="Выбрать фото">
                      <img src="@/assets/icons/goods_upload.svg" alt="" />
                    </VueCustomTooltip>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="group flex-1"
          v-if="$route.params.nesting - 1 === 0 && editedItem.nesting === 0"
        >
          <div class="group__title">Иконка категории:</div>
          <div class="group__content">
            <div class="group__left">
              <img
                alt=""
                class="group__image"
                :src="
                  editedItem && categoryIcon === 'Выбрать файл'
                    ? serverAddr + editedItem.iconPath + editedItem.icon
                    : categoryIconUrl
                "
                @click.prevent="
                  downloadItem(
                    serverAddr + editedItem.iconPath + editedItem.icon,
                    editedItem.icon
                  )
                "
              />
            </div>
            <div class="group__right">
              <div class="group__actions actions">
                <div class="actions__btn">
                  <label for="categoryIcon">
                    <input
                      type="file"
                      id="categoryIcon"
                      name="categoryIcon"
                      @change="fileUpload($event)"
                      hidden
                    />
                    <VueCustomTooltip label="Выбрать фото">
                      <img src="@/assets/icons/goods_upload.svg" alt="" />
                    </VueCustomTooltip>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="group flex-1">
          <div class="group__title">Изображение слайдера:</div>
          <div class="group__content">
            <div class="group__left">
              <img
                alt=""
                class="group__image"
                :src="
                  editedItem && categorySlide === 'Выбрать файл'
                    ? serverAddr + editedItem.slidePath + editedItem.slide
                    : categorySlideUrl
                "
                @click.prevent="
                  editedItem.slide !== 'default.jpeg'
                    ? downloadItem(
                        serverAddr + editedItem.slidePath + editedItem.slide,
                        editedItem.slide
                      )
                    : false
                "
              />
            </div>
            <div class="group__right">
              <div class="group__actions actions">
                <div class="actions__btn">
                  <label for="categorySlide">
                    <input
                      type="file"
                      id="categorySlide"
                      name="categorySlide"
                      @change="fileUpload($event)"
                      hidden
                    />
                    <VueCustomTooltip label="Выбрать фото">
                      <img src="@/assets/icons/goods_upload.svg" alt="" />
                    </VueCustomTooltip>
                  </label>
                </div>
                <div
                  v-if="editedItem && editedItem.slide !== 'default.jpeg'"
                  class="actions__btn"
                  style="border-color: #db1f35"
                >
                  <VueCustomTooltip label="Удалить">
                    <img
                      width="17px"
                      src="@/assets/icons/trash_icon.svg"
                      alt=""
                      @click.prevent="deleteImage('slide', $event)"
                    />
                  </VueCustomTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="group flex-1">
          <div class="group__title">Баннер категории:</div>
          <div class="group__content">
            <div class="group__left">
              <img
                alt=""
                class="group__image"
                :src="
                  editedItem && categoryBanner === 'Выбрать файл'
                    ? serverAddr + editedItem.bannerPath + editedItem.banner
                    : categoryBannerUrl
                "
                @click.prevent="
                  downloadItem(
                    serverAddr + editedItem.bannerPath + editedItem.banner,
                    editedItem.banner
                  )
                "
              />
            </div>
            <div class="group__right">
              <div class="group__actions actions">
                <div class="actions__btn">
                  <label for="categoryBanner">
                    <input
                      type="file"
                      id="categoryBanner"
                      name="categoryBanner"
                      @change="fileUpload($event)"
                      hidden
                    />
                    <VueCustomTooltip label="Выбрать фото">
                      <img src="@/assets/icons/goods_upload.svg" alt="" />
                    </VueCustomTooltip>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="group flex-1">
          <div class="group__title">Банер категории (моб. версия):</div>
          <div class="group__content">
            <div class="group__left">
              <img
                alt=""
                class="group__image"
                :src="
                  editedItem && categoryBannerMob === 'Выбрать файл'
                    ? serverAddr +
                      editedItem.bannerPathMob +
                      editedItem.bannerMob
                    : categoryBannerMobUrl
                "
                @click.prevent="
                  downloadItem(
                    serverAddr +
                      editedItem.bannerPathMob +
                      editedItem.bannerMob,
                    editedItem.bannerMob
                  )
                "
              />
              <div v-if="false" class="category-edit-form__default-img">
                <img src="@/assets/icons/goods_default.svg" alt="" />
              </div>
            </div>

            <div class="group__right">
              <div class="group__actions actions">
                <div class="actions__btn">
                  <label for="categoryBannerMob">
                    <input
                      type="file"
                      id="categoryBannerMob"
                      name="categoryBannerMob"
                      @change="fileUpload($event)"
                      hidden
                    />
                    <VueCustomTooltip label="Выбрать фото">
                      <img src="@/assets/icons/goods_upload.svg" alt="" />
                    </VueCustomTooltip>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="group">
        <div class="group__title">Часто ищут:</div>
        <div
          class="group__find"
          v-if="views && views.length"
          v-for="(chip, index) in views ? views : this.editedItem.views"
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
            :search="getCategoriesBySearch"
            :get-result-value="getResult"
            placeholder="Введите категорию..."
            style="width: 100%"
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
import VButton from "@/components/VButton";
import axios from "@/api/axios";

export default {
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
    region: {
      type: String,
      default: () => "",
    },
  },
  components: { VButton },
  methods: {
    selectCategory(result) {
      this.views.push(result);
    },
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files[0];
      this[e.target.name + "Url"] = URL.createObjectURL(files[0]);
    },
    getResult(result) {
      return "";
    },
    getCategoriesBySearch(input) {
      if (input.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios({
          url: `/categories/getcategoriesbysearch/`,
          data: {
            title: input,
            region: this.region,
            nesting: this.editedItem.nesting,
          },
          method: "POST",
        }).then((result) => {
          resolve(result.data.views);
        });
      });
    },
    deleteImage(type, e) {
      let fields = {
        img: type,
        path: type + "Path",
        category: "category" + type.charAt(0).toUpperCase() + type.slice(1),
      };
      this.editedItem[fields.img] = "default.jpeg";
      this.editedItem[fields.path] = "/uploads/";
      this[fields.category] = "default";
      this.remove.push(type);
    },
    onCategoryAdd() {
      let categoryData = new FormData();

      categoryData.append("categoryId", this.editedItem._id);
      categoryData.append(
        "categoryName",
        this.categoryName || this.editedItem.categoryName
      );
      categoryData.append(
        "nesting",
        this.type !== "search"
          ? +this.$route.params.nesting - 1
          : this.editedItem.nesting
      );
      categoryData.append("region", this.region);
      categoryData.append("remove", this.remove);

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
        url: `/categories/update/`,
        data: categoryData,
        method: "POST",
      })
        .then(async () => {
          this.$emit("refreshGoods");
          this.$toast.success("Категория успешно изменена!");
          this.$emit("toggleEdit", this.editedItem);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    onChange(e) {
      this[e.target.name] = e.target.value;
      this.tempViews = [];
    },
    deleteChip(index) {
      this.views.splice(index, 1);
    },
    downloadItem(url, filename) {
      axios
        .get(url, { responseType: "blob" })
        .then((response) => {
          const link = document.createElement("a");
          const blob = new Blob([response.data]);
          let urll = window.URL.createObjectURL(blob);
          link.href = urll;
          link.download = filename;
          link.click();
          setTimeout(() => {
            window.URL.revokeObjectURL(urll);
            document.body.removeChild(link);
          }, 0);
          URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
    },
  },
  data() {
    return {
      categoryName: "",
      categoryImage: "Выбрать файл",
      categoryImageUrl: "@/assets/icons/goods_default.svg",
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
      remove: [],
    };
  },
  created() {
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
      max-width: 200px;
      max-height: 140px;
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
      cursor: pointer;
      position: relative;

      label {
        width: 33px;
        height: 33px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: absolute;
        top: -2px;
        right: 0;
        bottom: 0;
        left: -2px;
        z-index: 100;
      }
    }
  }
  .group__left {
    margin-right: 10px;
  }

  .group__find {
    height: 40px;
    border-radius: $border-radius;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    padding: 10px;
    position: relative;
    margin-bottom: 10px;

    span {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
  }
  span[role="tooltip"] {
    &:after {
      background-color: $color-black;
      color: $color-white;
      border-radius: $border-radius;
    }

    & + * {
      margin-left: 20px;
    }
  }
}
</style>
