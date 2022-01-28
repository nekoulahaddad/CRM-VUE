<template>
  <div
    class="list__columns list__columns--shadow list__columns--white education-list-columns"
  >
    <div
      class="list__column"
      @click="
        current[current.length - 1] !== item.categoryName
          ? current.push(item)
          : false
      "
    >
      <router-link
        :to="`/dashboard/storage/${+item.nesting + 2}/categories/${item._id}/1`"
      >
        {{ item.categoryName }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      dataset: {
        products: [],
        categories: [],
        brands: [],
      },
      type: "",
      current: [],
      filtersOptions: {},
      count: 0,
      editForm: false,
      editedItem: {},
      good: "",
    };
  },
  watch: {
    $route: function () {
      this.filtersOptions.nesting = +this.$route.params.nesting - 1;
      this.filtersOptions.parent_value = this.$route.params.parent_value;
      this.filtersOptions.type = this.$route.params.type;
      if (this.$route.params.type !== "search") {
        let result = this.getDataFromPage(
          `/${this.$route.params.type || "categories"}/get`,
          this.filtersOptions
        );
        this.updateGoods(result);
      }
    },
    filtersOptions: {
      handler: function () {
        if (this.$route.params.type !== "search") {
          let result = this.getDataFromPage(
            `/${this.$route.params.type || "categories"}/get`,
            this.filtersOptions
          );
          this.updateGoods(result);
        }
      },
      deep: true,
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.isLoading = false;
    if (parseInt(to.params.nesting) < parseInt(from.params.nesting)) {
      this.current.splice(to.params.nesting - 1, this.current.length);
    }
    if (parseInt(to.params.nesting) <= 1 || !to.params.nesting) {
      this.current.splice(0, this.current.length);
    }
    this.isLoading = true;
    next();
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
  },
};
</script>
<style lang="scss">
.storage-page {
  .list__column {
    &:first-child {
      text-align: left !important;
    }
  }
}
</style>
