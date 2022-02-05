<template>
  <div class="list__info list-info category-list-info">
    <div class="group__title text--blue">Копировать категорию:</div>
    <form @submit.prevent="onCategoryCopy">
      <div class="group">
        <div class="group__title">Регион:</div>
        <div class="group__content">
          <select
            class="form-select"
            name="targetRegion"
            v-model="targetRegion"
          >
            <option disabled selected value="">Выбор региона</option>
            <option v-for="region in regions" :value="region._id">
              {{ region.title }}
            </option>
          </select>
        </div>
      </div>
      <v-button red>Копировать</v-button>
    </form>
  </div>
</template>

<script>
import axios from "@/api/axios";
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
  components: { VButton },
  data() {
    return {
      regions: [],
      targetRegion: "",
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onCategoryCopy() {
      this.changeStatus(false);
      let data = {
        region: this.region,
        categoryId: this.category._id,
        targetRegion: this.targetRegion,
      };
      console.log(data);
      axios({
        url: `/categories/copy/`,
        data: data,
        method: "POST",
      })
        .then(async (res) => {
          this.$toast.success("Категория скопирована!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
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
