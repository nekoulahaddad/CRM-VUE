<template>
  <div class="page goods-page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/goods_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Товары</h1>
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
        <div v-if="!filtersOptions.region">Выберите регион</div>
        <v-spinner v-else-if="isLoading" />

        <template v-else-if="dataset.categories.length">
          <div class="scroll-horizontal">
            <div class="list list-shadow">
              <div class="list__header">
                <div class="list__title">
                  {{ $t("pages.seo.pageTitle") }}
                </div>
                <div class="list__columns">
                  <div
                    v-for="field in $t('pages.seo.fields')"
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
                  <div class="draggable-item">
                    <img
                      class="next handle left move"
                      src="@/assets/icons/move.svg"
                      alt=""
                    />
                    <div>
                      {{ item.categoryName }}
                    </div>
                  </div>
                </Draggable>
              </Container>
            </div>
          </div>
        </template>
        <v-not-found-query v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import VFilter from "@/components/VFilter";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "@/api/getDataFromPage";
import { mapGetters } from "vuex";

export default {
  components: { VFilter, VSpinner, VNotFoundQuery, Draggable, Container },
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
            this.isLoading = true;
            this.updateGoods(
              await getDataFromPage(
                `/${this.$route.params.type || "categories"}/get`,
                this.filtersOptions
              )
            );
          } catch (e) {
          } finally {
            this.isLoading = false;
          }
        }
      }
    },
    updateGoods(res) {
      this.isLoading = false;
      this.dataset.categories = res.data.categories;
      this.dataset.products = res.data.products;
      this.googleDoc = res.data.googleDoc;
      this.count = res.data.count;
      this.isLoading = true;
      if (+this.$route.params.page !== 1 && this.filtersOptions.nesting !== 3) {
        setTimeout(() => {
          this.$scrollTo("#pagionation", 500, {});
        });
      }
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
  .smooth-dnd-draggable-wrapper {
    display: grid;
    grid-template-rows: 1fr;
    border-radius: $border-radius;
    background-color: $color-white;
  }
}
</style>
