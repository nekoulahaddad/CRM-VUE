<template>
  <div class="page goods-page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/goods_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("pages.goods.pageTitle") }}</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <v-filter
          type="goods"
          ref="filters"
          :isLoading="isLoading"
          @updatebyfilter="updateByFilter"
        />
      </div>
      <div class="page__right">
        <template v-if="isLoading && filtersOptions.region">
          <template
            v-if="
              filtersOptions.type === 'search'
                ? filtersOptions.type === 'search' && dataset.categories.length
                : filtersOptions.type !== 'brands' && filtersOptions.nesting < 3
            "
          >
            <div class="scroll-horizontal">
              <div class="list list-shadow">
                <div class="list__header">
                  <div class="list__title">
                    {{ $t("pages.goods.pageTitle") }}
                  </div>
                  <div class="list__columns">
                    <div
                      v-for="field in $t('pages.goods.fields')"
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
                    <v-category :item="item" :current="current" />
                  </Draggable>
                </Container>
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
import VFilter from "@/components/VFilter";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "@/api/getDataFromPage";
import { mapGetters } from "vuex";

export default {
  components: {
    VCategory,
    VFilter,
    VSpinner,
    VNotFoundQuery,
    Draggable,
    Container,
  },
  data() {
    return {
      isLoading: false,
      dataset: {
        products: [],
        categories: [],
      },
      current: [],
      filtersOptions: {
        region: this.region || null,
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
      addProductToGroup: false,
      downloadExcelGoods: false,
      excelImportForm: false,
      categoryExportForm: false,
    };
  },
  computed: {
    ...mapGetters({
      region: "region",
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
            await getDataFromPage(
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
    this.filtersOptions.region = this.region;
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
    //this.isLoading = true;
    next();
  },
  methods: {
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
              await getDataFromPage(
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
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.goods-page {
  .list__columns {
    grid-template-columns: 1fr 1fr;
  }

  .smooth-dnd-draggable-wrapper {
    display: grid;
    grid-template-rows: 1fr;
    border-radius: $border-radius;
    background-color: $color-white;
  }

  .list__column {
    &:first-child {
      text-align: left;
    }
  }
}
</style>
