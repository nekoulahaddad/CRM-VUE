<template>
  <div class="page">
    <div class="page__header">
      <div class="page__icon">
        <img src="/icons/goods_title.svg" alt="" />
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
      <div class="flex-1">
        <div v-if="!region">Выберите регион</div>
        <v-spinner v-else-if="isLoading" />
        <table class="table" v-else-if="dataset.categories.length">
          <thead class="thead">
            <tr class="thead__top">
              <td colspan="2">
                <div class="table__title">Категории</div>
              </td>
            </tr>
            <tr class="thead__bottom">
              <td>Название категории:</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in dataset.categories" :key="item.id">
              <td>{{ item.categoryName }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <v-not-found-query v-else />
      </div>
    </div>
  </div>
</template>

<script>
import VFilter from "@/components/VFilter";
import VSpinner from "@/components/VSpinner";
import VNotFoundQuery from "@/components/VNotFoundQuery";
import getDataFromPage from "../api/getDataFromPage";
import { mapGetters } from "vuex";

export default {
  components: { VFilter, VSpinner, VNotFoundQuery },
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
          this.updateGoods(
            await getDataFromPage(
              `/${this.$route.params.type || "categories"}/get`,
              this.filtersOptions
            )
          );
        } catch (e) {
        } finally {
          this.isLoading = true;
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
  },
};
</script>
