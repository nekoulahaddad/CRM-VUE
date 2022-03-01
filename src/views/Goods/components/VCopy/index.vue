<template>
  <div class="list__info list-info category-list-info">
    <div class="group__title text--blue">Копировать категорию:</div>
    <form @submit.prevent="onCategoryCopy">
      <div class="group">
        <div class="group__title">Регион:</div>
        <div class="group__content">
          <v-select
            name="targetRegion"
            :options="
              regions.map((region) => ({
                label: region.title,
                value: region._id,
              }))
            "
            :reduce="(item) => item.value"
            v-model="targetRegion"
          />
        </div>
      </div>
      <v-button v-if="!start" :disabled="!targetRegion" red>
        Копировать
      </v-button>
      <v-spinner small v-else />
    </form>
  </div>
</template>

<script>
import axios from "@/api/axios";
import VSpinner from "@/components/VSpinner";
import VButton from "@/components/VButton";
import { mapMutations } from "vuex";

export default {
  props: {
    category: {
      type: Object,
      default: () => {},
    },
    region: {
      type: String,
      default: () => "",
    },
  },
  components: { VButton, VSpinner },
  data() {
    return {
      regions: [],
      targetRegion: "",
      start: false,
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onCategoryCopy() {
      this.start = true;
      this.changeStatus(false);
      let data = {
        region: this.region,
        categoryId: this.category._id,
        targetRegion: this.targetRegion,
      };
      axios({
        url: `/categories/copy/`,
        data: data,
        method: "POST",
      })
        .then(() => {
          this.$emit("refreshGoods");
          this.$emit("toggleCopy", this.category);
          this.$toast.success("Категория скопирована!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
          this.start = false;
        });
    },
  },
  created() {
    axios({
      url: "/regions/get",
    }).then(async (res) => {
      this.regions = res.data.regions;
    });
  },
};
</script>

<style lang="scss">
.category-list-info {
  .group__title {
    font-size: 16px;
  }
  .form-select {
    width: 401px;
  }
}
</style>
