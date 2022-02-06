<template>
  <div class="page goods-page">
    <v-delete-category
      :deletedItem="deletedProduct"
      @deleteCategory="deleteCategory"
    />

    <v-delete-product
      :deletedItem="deletedProduct"
      @deleteProduct="deleteProduct"
      @clearSelectedProducts="clearSelectedProducts"
    />

    <v-page-header
      :title="$t('pages.goods.pageTitle')"
      icon="goods_title"
      @toggleFilter="toggleFilter"
      :showFilter="showFilter"
    />
    <div class="page__body d-flex">
      <div class="page__left" v-if="showFilter">
        <v-filter
          type="goods"
          ref="filters"
          :isLoading="isLoading"
          @updatebyfilter="updateByFilter"
        />
      </div>
      <div
        class="page__right"
        :class="{
          'page__right--fluid': sidebar && !showFilter,
          'page__right--middle': sidebar && showFilter,
          'page__right--full': !showFilter && !sidebar,
        }"
      >
        <template v-if="isLoading && filtersOptions.region">
          <template v-if="dataset.categories.length">
            <div class="scroll-horizontal">
              <div class="list list-shadow">
                <div class="list__header">
                  <v-search
                    @submit="getSearchData"
                    v-model="good"
                    placeholder="Поиск по категории, бренду, товару или артикулу"
                  />

                  <div class="list__title title">
                    <div class="title__item">
                      <router-link
                        :class="{ 'title__item--inactive': current.length }"
                        :to="`/dashboard/goods/1`"
                      >
                        Категории
                      </router-link>
                    </div>
                    <router-link
                      class="title__item"
                      v-for="(item, i) in current"
                      :key="item._id"
                      :class="{ 'title__item--inactive': current.length > i }"
                      :to="`/dashboard/goods/${
                        item.categoryName
                          ? +item.nesting + 2
                          : +$route.params.nesting + 1
                      }/categories/${
                        item.categoryName ? item._id : item._id
                      }/1`"
                    >
                      {{
                        item.categoryName
                          ? item.categoryName || ""
                          : item.name
                          ? item.name
                          : ""
                      }}
                    </router-link>
                  </div>
                  <div class="list__columns">
                    <div class="list__column">
                      <img
                        v-if="current.length"
                        src="@/assets/icons/back.svg"
                        alt=""
                        @click="$router.go(-1)"
                      />
                    </div>
                    <div
                      v-for="field in $t('pages.goods.fields.categories')"
                      class="list__column"
                    >
                      {{ field }}
                    </div>
                  </div>
                </div>

                <!-- Блок импорта -->
                <v-category-import
                  v-if="importGoods"
                  :region="filtersOptions.region"
                  :category="false"
                />

                <Container
                  @drop="onDrop"
                  drag-handle-selector=".handle"
                  lock-axis="y"
                >
                  <Draggable
                    :class="{
                      'smooth-dnd-draggable-wrapper--opened':
                        editedItem._id === item._id ||
                        copyItem._id === item._id ||
                        categoryImportItem._id === item._id ||
                        categoryExportItem._id === item._id,
                    }"
                    v-for="item in dataset.categories"
                    :key="item.id"
                  >
                    <v-category
                      @changeVisibility="changeCategoryVisibility"
                      :item="item"
                      :copyItem="copyItem"
                      :current="current"
                      :editedItem="editedItem"
                      :dropDown="dropDown"
                      :categoryExportItem="categoryExportItem"
                      :categoryImportItem="categoryImportItem"
                      @hideDetail="hideDetail"
                      @toggleCopy="toggleCopy"
                      @toggleDeleteCategory="toggleDeleteCategory"
                      @toggleDropDown="toggleDropDown"
                      @toggleEdit="toggleEdit"
                      @addToGoogleDoc="addToGoogleDoc"
                      @toggleCategoryExport="toggleCategoryExport"
                      @toggleCategoryImport="toggleCategoryImport"
                      :show="filtersOptions.nesting > 0 && googleDoc != null"
                      :opacity="
                        googleDoc &&
                        googleDoc.sheets.find((s) => s.categoryId == item._id)
                          ? false
                          : true
                      "
                    />

                    <v-copy
                      v-if="copyItem._id === item._id"
                      :category="copyItem"
                      :region="filtersOptions.region"
                    />

                    <v-edit-category
                      v-if="editedItem._id === item._id"
                      :editedItem="editedItem"
                      :region="filtersOptions.region"
                    />

                    <!-- Блок экспорта -->
                    <v-category-export
                      v-if="categoryExportItem._id === item._id"
                      :region="filtersOptions.region"
                      :category="category"
                    />

                    <!-- Блок импорта -->
                    <v-category-import
                      v-if="categoryImportItem._id === item._id"
                      :region="filtersOptions.region"
                      :category="category"
                    />
                  </Draggable>
                </Container>
              </div>
            </div>
          </template>
          <template v-if="dataset.products.length">
            <div class="scroll-horizontal">
              <div class="list list-shadow">
                <div class="list__header" v-if="!dataset.categories.length">
                  <div class="list__title">
                    {{ $t("goods") }}
                  </div>
                  <div class="list__columns">
                    <div
                      v-for="field in $t('pages.goods.fields.products')"
                      class="list__column"
                    >
                      {{ field }}
                    </div>
                  </div>
                </div>
                <div
                  class="list__row list__row--shadow list__row--transparent"
                  v-if="dataset.categories.length"
                >
                  <div
                    class="list__columns list__columns-shadow goods-list-columns"
                  >
                    <div class="list__column"></div>
                    <div class="list__column">Название товара:</div>
                    <div class="list__column">Артикул:</div>
                  </div>
                </div>
                <div
                  v-for="(item, index) in dataset.products"
                  :key="item._id"
                  class="list__row list__row--group list__row--shadow list__row--white"
                  :class="{
                    'list__row--opened':
                      groupProductItem._id === item._id ||
                      editedGroupItem._id === item._id,
                  }"
                >
                  <v-product
                    :item="item"
                    :editedGroupItem="editedGroupItem"
                    @editProduct="editProduct"
                    @toggleDeleteProduct="toggleDeleteProduct"
                    @toggleProductToGroup="toggleProductToGroup"
                    @toggleEditGroup="toggleEditGroup"
                  />

                  <v-add-product-to-group
                    v-if="groupProductItem._id === item._id"
                    :region="filtersOptions.region"
                    :product="groupProductItem"
                    @refreshGoods="refreshGoods"
                    @toggleMoveProduct="toggleMoveProduct"
                    @toggleProductToGroup="toggleProductToGroup"
                  />

                  <v-product-group-edit
                    v-if="editedGroupItem._id === item._id"
                  />
                </div>
              </div>
            </div>
          </template>
        </template>
        <div v-else-if="!filtersOptions.region">{{ $t("chooseRegion") }}</div>
        <v-spinner v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import VCategory from "./components/VCategory";
import VSearch from "@/components/VSearch";
import VDeleteCategory from "./components/VDeleteCategory";
import VEditCategory from "./components/VEditCategory";
import VProductGroupEdit from "./components/VProductGroupEdit";
import VDeleteProduct from "./components/VDeleteProduct";
import VAddProductToGroup from "./components/VAddProductToGroup";
import VProduct from "./components/VProduct";
import VCategoryExport from "./components/VCategoryExport";
import VCategoryImport from "./components/VCategoryImport";
import VCopy from "./components/VCopy";
import axios from "@/api/axios";
import dataMixins from "@/mixins/data";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import { mapGetters, mapMutations } from "vuex";
import { REGION_MOSCOW_ID } from "../../constants";

export default {
  mixins: [dataMixins],
  components: {
    VCategory,
    VProduct,
    VFilter,
    VSpinner,
    VSearch,
    VCopy,
    VProductGroupEdit,
    VCategoryExport,
    VNotFoundQuery,
    Draggable,
    VPageHeader,
    VEditCategory,
    Container,
    VCategoryImport,
    VDeleteProduct,
    VDeleteCategory,
    VAddProductToGroup,
  },
  data() {
    return {
      showFilter: false,
      isLoading: false,
      dataset: {
        products: [],
        categories: [],
      },
      current: [],
      filtersOptions: {
        region: REGION_MOSCOW_ID,
        nesting: +this.$route.params.nesting - 1 || null,
      },
      googleDoc: null,
      category: null,
      count: 0,
      addForm: false,
      addedItem: {},
      groupProductItem: {},
      editedGroupItem: {},
      deleteForm: false,
      deletedItem: {},
      editForm: false,
      editedItem: {},
      copyItem: {},
      addFormProduct: false,
      addedProduct: {},
      deleteFormProduct: false,
      deletedProduct: {},
      editFormProduct: false,
      editedProduct: {},
      setFormManager: false,
      managerItem: {},
      editRegion: false,
      movedItem: {},
      editSheets: false,
      good: "",
      moveProduct: false,
      movedProduct: {},
      changeOrder: false,
      savedCategories: [],
      copyForm: false,
      copiedCategory: {},
      downloadExcelFile: true,
      cleared: true,
      categoryExportItem: {},
      categoryImportItem: {},
      selectedProducts: [],
      groupAdd: false,
      groupIndex: -1,
      removeFromGroup: false,
      productId: "",
      groupId: "",
      group: {},
      removeGroup: false,
      editGroup: false,
      product: {},
      deletedCategory: {},
      dropDown: {},
      addProductToGroup: false,
      downloadExcelGoods: false,
      excelImportForm: false,
      categoryExportForm: false,
    };
  },
  computed: {
    ...mapGetters({
      region: "region",
      sidebar: "sidebar",
    }),
    importGoods() {
      return this.$store.state.actions.importGoods;
    },
  },
  watch: {
    $route: async function () {
      this.isLoading = false;
      this.filtersOptions.nesting = +this.$route.params.nesting - 1;
      this.filtersOptions.parent_value = this.$route.params.parent_value;
      this.filtersOptions.type = this.$route.params.type;
      this.changeOrder = false;
      this.downloadExcelFile = true;
      if (this.$route.params.type !== "search") {
        try {
          this.filtersOptions.page = this.$route.params.page;

          this.updateGoods(
            await this.getDataFromPage(
              `/${this.$route.params.type || "categories"}/get`,
              this.filtersOptions
            )
          );
        } catch (e) {
        } finally {
          this.isLoading = true;
          this.$scrollTo("body", 300, {});
        }
      }
    },
  },
  beforeMount() {
    this.filtersOptions.parent_value = this.$route.params.parent_value;
    this.filtersOptions.nesting = +this.$route.params.nesting - 1;
  },
  beforeRouteUpdate(to, from, next) {
    this.isLoading = false;
    if (parseInt(to.params.nesting) < parseInt(from.params.nesting)) {
      this.current.splice(to.params.nesting - 1, this.current.length);
    }
    if (parseInt(to.params.nesting) <= 1 || !to.params.nesting) {
      this.current.splice(0, this.current.length);
    }
    if (
      to.params.parent_value !== from.params.parent_value ||
      !to.params.parent_value
    ) {
      this.clearSelectedProducts();
      this.groupIndex = -1;
    }
    next();
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    getSearchData() {
      let search = this.good;

      if (!search.trim().length) {
        this.refreshGoods();
        return;
      }

      if (search.trim().length < 3) {
        this.$toast.error("Запрос слишком короткий!");
        return;
      }

      this.changeStatus(false);
      this.dataset = {
        categories: [],
        products: [],
      };

      //this.$router.push(`/dashboard/${this.$route.name}/1/search`)
      axios({
        url: `/categories/getfromsearch`,
        data: {
          search: search,
          region: this.filtersOptions.region,
        },
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          let dataset = {};
          dataset.categories = result.data.categories;
          dataset.products = result.data.products;
          this.dataset = dataset;
          if (result.data.categories.length || result.data.products.length) {
            this.$toast.success("Результаты запросов!");
          } else {
            this.$toast.error("Результаты не найдены!");
            this.good = "";
            //this.$router.push(`/dashboard/${this.$route.name}/1`)
          }
        })
        .finally(() => {
          this.isLoading = true;
          this.changeStatus(true);
        });
    },
    toggleEditGroup(item) {
      this.editedItem = {};
      this.categoryExportItem = {};
      this.categoryImportItem = {};

      if (this.editedGroupItem._id === item._id) {
        this.editedGroupItem = {};
      } else {
        this.editedGroupItem = item;
      }

      this.toggleDropDown(item);
    },
    toggleMoveProduct(item) {
      this.editedItem = {};
      this.categoryExportItem = {};
      this.categoryImportItem = {};

      if (this.movedProduct._id === item._id) {
        this.movedProduct = {};
      } else {
        this.movedProduct = item;
      }

      this.toggleDropDown(item);
    },
    deleteCategory(categoryId) {
      let index = this.dataset.categories.findIndex(
        (item) => item._id === categoryId
      );
      setTimeout(() => {
        let dataset = this.dataset.categories;
        dataset.splice(index, 1);
        this.dataset.categories = dataset;
        this.deletedItem = {};
      }, 500);
      this.changeStatus(true);
    },
    toggleDeleteCategory(deletedCategory) {
      this.deletedCategory = deletedCategory;
      this.$modal.show("deleteGoodsCategory");
    },
    toggleDeleteProduct(deletedProduct) {
      this.deletedProduct = deletedProduct;
      this.$modal.show("deleteProduct");
    },
    deleteProduct(product) {
      let index = this.dataset.products.findIndex(
        (item) => item._id === product._id
      );
      let dataset = this.dataset.products;
      dataset.splice(index, 1);
      this.dataset.products = dataset;
      this.deletedProduct = {};
      this.changeStatus(true);
    },
    addToGoogleDoc(item) {
      let status = this.googleDoc.sheets.find((s) => s.categoryId == item._id)
        ? "delete"
        : "add";
      let data = {
        region: this.region,
        categoryId: item._id,
        categoryName: item.categoryName,
      };
      this.isLoading = false;
      axios({
        url: `/googlesheets/${status}/`,
        data: data,
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.editProduct(result.data.product);
          this.$toast.success(result.data.message);
          this.changeStatus(true);
          this.isLoading = true;
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
          this.isLoading = true;
        });
    },
    hideDetail() {
      this.copyItem = {};
      this.editedItem = {};
      this.categoryExportItem = {};
      this.categoryImportItem = {};
    },
    editProduct(product, old) {
      let index = this.dataset.products.findIndex(
        (item) => item._id === product._id
      );
      let indexOld;
      if (old) {
        indexOld = this.dataset.products.findIndex((item) => item._id === old);
      }
      if (index === -1 && this.type !== "search") {
        let result = this.getDataFromPage(
          `/${this.$route.params.type || "categories"}/get`,
          this.filtersOptions
        );
        this.updateGoods(result);
        this.changeStatus(true);
        return;
      }
      if (this.type === "search" && indexOld) {
        this.dataset.splice(indexOld, 1);
      }
      let dataset = this.dataset.products;
      dataset[index] = product;
      this.dataset.products = dataset;
      this.editedProduct = {};
      this.changeStatus(true);
    },
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },
    toggleDropDown(dropDown) {
      if (this.dropDown._id === dropDown._id) {
        this.dropDown = {};
      } else {
        this.dropDown = dropDown;
      }
    },
    toggleCopy(item) {
      this.editedItem = {};
      this.categoryExportItem = {};
      this.categoryImportItem = {};

      if (this.copyItem._id === item._id) {
        this.copyItem = {};
      } else {
        this.copyItem = item;
      }

      this.toggleDropDown(item);
    },
    toggleCategoryImport(item) {
      this.copyItem = {};
      this.editedItem = {};
      this.categoryExportItem = {};

      if (this.categoryImportItem._id === item._id) {
        this.categoryImportItem = {};
      } else {
        this.categoryImportItem = item;
        this.category = item ? item : false;
      }

      this.toggleDropDown(item);
    },
    toggleCategoryExport(item) {
      this.copyItem = {};
      this.editedItem = {};
      this.categoryImportItem = {};

      if (this.categoryExportItem._id === item._id) {
        this.categoryExportItem = {};
      } else {
        this.categoryExportItem = item;
        this.category = item ? item : false;
      }

      this.toggleDropDown(item);
    },
    toggleProductToGroup(item) {
      this.copyItem = {};
      this.categoryExportItem = {};
      this.categoryImportItem = {};

      if (this.groupProductItem._id === item._id) {
        this.groupProductItem = {};
      } else {
        this.groupProductItem = item;
      }

      this.toggleDropDown(item);
    },
    toggleEdit(item) {
      this.copyItem = {};
      this.categoryExportItem = {};
      this.categoryImportItem = {};

      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }

      this.toggleDropDown(item);
    },
    async updateByFilter() {
      if (!this.isLoading) {
        this.filtersOptions.nesting = +this.$route.params.nesting - 1;
        this.filtersOptions.parent_value = this.$route.params.parent_value;
        this.filtersOptions.region = this.region;
        this.filtersOptions.type = this.$route.params.type || "categories";
        this.changeOrder = false;
        this.downloadExcelFile = true;
        if (this.$route.params.type !== "search") {
          try {
            this.updateGoods(
              await this.getDataFromPage(
                `/${this.$route.params.type || "categories"}/get`,
                this.filtersOptions
              )
            );
          } catch (e) {
          } finally {
            this.$scrollTo("body", 300, {});
            this.isLoading = true;
          }
        }
      }
    },
    clearSelectedProducts() {
      this.selectedProducts = [];
      this.cleared = true;
    },
    updateGoods(res) {
      this.dataset.categories = res.data.categories;
      this.dataset.products = res.data.products;
      this.googleDoc = res.data.googleDoc;
      this.count = res.data.count;
    },
    onDrop(dropResult) {
      this.changeOrder = true;
      this.savedCategories = this.dataset.categories;
      this.dataset.categories = this.applyDrag(
        this.dataset.categories,
        dropResult
      );
    },
    async refreshGoods() {
      let result = await this.getDataFromPage(
        `/categories/get`,
        this.filtersOptions
      );
      this.updateGoods(result);
      this.clearSelectedProducts();
    },
    async getGoodsFromRegion() {
      try {
        this.changeStatus(false);
        this.downloadExcelGoods = true;
        await axios({
          url: `/excel/getgoodsfromregion`,
          data: {
            region: this.filtersOptions.region,
          },
          method: "POST",
        });
        this.$toast.success("Начинаю генерировать Excel!");
      } catch (error) {
        this.$toast.error(error.response.data.message);
      } finally {
        setTimeout(() => (this.downloadExcelGoods = false), 5000);
      }
      this.changeStatus(true);
    },
    changeCategoryVisibility(id, visible) {
      this.changeStatus(false);
      let categoryData = {
        region: this.filtersOptions.region,
        categoryId: [id],
        visible: !visible,
      };
      axios({
        url: "/categories/updatevisibility/",
        data: categoryData,
        method: "POST",
      })
        .then(async (res) => {
          this.refreshGoods();
          this.$toast.success(
            `Категория ${
              res.data.visible ? "будет отображаться" : "не будет отображаться"
            }`
          );
          this.$forceUpdate();
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
  },
  async created() {
    try {
      this.updateGoods(
        await this.getDataFromPage(
          `/${this.$route.params.type || "categories"}/get`,
          this.filtersOptions
        )
      );
    } catch (e) {
    } finally {
      this.$scrollTo("body", 300, {});
      this.isLoading = true;
    }
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.goods-page {
  .list__header {
    .list__columns {
      grid-template-columns: 50px 750px 100px 1fr;
    }
  }

  .smooth-dnd-draggable-wrapper {
    display: grid;
    height: auto;
    grid-template-rows: 1fr;
    border-radius: $border-radius;
    background-color: $color-white;
    padding: 0 !important;

    .list__info {
      line-height: normal;
    }

    &--opened {
      .draggable-item {
        background-color: $color-gray-secondary;
        border-top-left-radius: $border-radius;
        border-top-right-radius: $border-radius;
      }
      .table__icon::before {
        background-color: $color-white;
      }
    }
  }

  .list__column {
    text-align: left !important;
    &:first-child {
      padding-left: 7px;
    }
  }
  .title {
    display: flex;

    &__item {
      color: rgba(0, 0, 0, 0.3);
      position: relative;
      margin-right: 10px;

      &.router-link-active {
        color: $color-black;
      }

      & + * {
        padding-left: 15px;

        &::before {
          content: "/";
          position: absolute;
          color: rgba(0, 0, 0, 0.3);
          left: 0;
          top: 0;
          bottom: 0;
        }
      }
    }
  }

  .title__item--inactive {
    color: rgba(0, 0, 0, 0.3);
  }

  .list__row--transparent {
    .list__columns {
      grid-template-columns: 50px 750px 100px;
    }
  }

  .page__right--middle {
    .list {
      width: 1421px;
    }
  }
}
</style>
