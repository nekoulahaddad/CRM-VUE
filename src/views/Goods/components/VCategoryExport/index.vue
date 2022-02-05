<template>
  <div class="list__info list-info category-list-info">
    <div class="group__title text--blue">Экспорт из категории:</div>
    <div class="group">
      <div class="group__title">Товары:</div>
      <div class="group__content">
        <v-button
          red
          v-if="!exportcategoryproducts"
          @click="exportProducts('exportcategoryproducts', 'xlsx', 'Товары')"
        >
          Экспортировать
        </v-button>
        <v-spinner v-else />
      </div>
    </div>
    <div class="group">
      <div class="group__title">Изображения:</div>
      <div class="group__content">
        <v-button
          red
          v-if="!exportproductsimages"
          @click="exportProducts('exportproductsimages', 'xlsx', 'Изображения')"
        >
          Экспортировать
        </v-button>
        <v-spinner v-else />
      </div>
    </div>
  </div>
</template>

<script>
import VSpinner from "@/components/VSpinner";
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  props: {
    category: {
      type: Object,
      default: () => "",
    },
    region: {
      type: String,
      default: () => "",
    },
  },
  data() {
    return {
      regions: [],
      targetRegion: "",
      exportcategoryproducts: false,
      exportproductsimages: false,
    };
  },
  components: { VButton, VSpinner },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    async exportProducts(route, type, prefix) {
      try {
        this[route] = true;
        await axios({
          url: `/excel/${route}`,
          data: {
            region: this.region,
            categoryId: [this.category._id],
            categoryName: this.category.categoryName,
          },
          method: "POST",
          responseType: "blob",
        })
          .then((response) => {
            const link = document.createElement("a");
            const blob = new Blob([response.data]);
            let urll = window.URL.createObjectURL(blob);
            link.href = urll;
            link.download = `${prefix}_${this.category.categoryName}.${type}`;
            link.click();
            window.URL.revokeObjectURL(urll);
            URL.revokeObjectURL(link.href);
            this.$emit("toggleOpen");
          })
          .catch(() => {});
      } catch (error) {
        this.$toast.error(error.response.data.message);
      } finally {
        this.changeStatus(true);
        this[route] = false;
      }
    },
  },
};
</script>
