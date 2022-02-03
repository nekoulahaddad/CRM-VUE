<template>
  <div class="page goods-page">
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
                <Container
                  @drop="onDrop"
                  drag-handle-selector=".handle"
                  lock-axis="y"
                >
                  <Draggable v-for="item in dataset.categories" :key="item.id">
                    <v-category
                      @changeVisibility="changeCategoryVisibility"
                      :item="item"
                      :current="current"
                      :dropDown="dropDown"
                      @toggleDropDown="toggleDropDown"
                      @toggleEdit="toggleEdit"
                      @addToGoogleDoc="addToGoogleDoc"
                      :show="filtersOptions.nesting > 0 && googleDoc != null"
                      :opacity="
                        googleDoc &&
                        googleDoc.sheets.find((s) => s.categoryId == item._id)
                          ? false
                          : true
                      "
                    />

                    <v-edit-category
                      v-if="editedItem._id === item._id"
                      :editedItem="editedItem"
                    />
                  </Draggable>
                </Container>
              </div>
            </div>
          </template>
          <template v-if="dataset.products.length">
            <div class="scroll-horizontal">
              <div class="list">
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
                  v-for="(item, index) in dataset.products"
                  :key="item._id"
                  class="list__row list__row--shadow list__row--white"
                >
                  <v-product :item="item" @editProduct="editProduct" />
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
import VEditCategory from "./components/VEditCategory";
import VProduct from "./components/VProduct";
import axios from "@/api/axios";
import VFilter from "@/components/VFilter";
import VPageHeader from "@/components/VPageHeader";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import { mapGetters, mapMutations } from "vuex";
import { REGION_MOSCOW_ID } from "../../constants";

export default {
  components: {
    VCategory,
    VProduct,
    VFilter,
    VSpinner,
    VNotFoundQuery,
    Draggable,
    VPageHeader,
    VEditCategory,
    Container,
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
      deleteForm: false,
      deletedItem: {},
      editForm: false,
      editedItem: {},
      addFormProduct: false,
      addedProduct: {},
      deleteFormProduct: false,
      deletedProduct: {},
      editFormProduct: false,
      editedProduct: {},
      setFormManager: false,
      managerItem: {},
      editRegion: false,
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
    toggleEdit(item) {
      if (this.editedItem._id === item._id) {
        this.editedItem = {};
      } else {
        this.editedItem = item;
      }
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
      grid-template-columns: 50px 1fr 1fr;
    }
  }

  .smooth-dnd-draggable-wrapper {
    display: grid;
    grid-template-rows: 1fr;
    border-radius: $border-radius;
    background-color: $color-white;
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
}
</style>
