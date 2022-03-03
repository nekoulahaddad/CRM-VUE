<template>
  <div class="list__info list-info product-list-info">
    <div class="group__title text--blue">Добавить товар в группу:</div>
    <form @submit.prevent="onProductAddToGroup">
      <div class="group">
        <div class="group__title">Выберите группу:</div>
        <div class="group__content">
          <v-select
            :options="
              groups.map((item) => ({
                label: item.title,
                value: item._id,
              }))
            "
            name="role"
            v-model="groupSelected"
            :reduce="(item) => item.value"
          />
        </div>
      </div>
      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: { VButton },
  props: {
    region: {
      type: String,
    },
    product: {
      type: Object,
    },
  },
  data() {
    return {
      groups: [],
      groupSelected: null,
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onProductAddToGroup() {
      this.changeStatus(false);
      axios({
        url: `/groups/product`,
        data: {
          groupId: this.groupSelected,
          productId: this.product._id,
          region: this.region,
        },
        method: "POST",
      })
        .then(async () => {
          this.$emit("refreshGoods");
          this.$emit("toggleProductToGroup", this.product);
          this.$toast.success("Товар был внесен в группу!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
  },
  mounted() {
    axios({
      url: `/groups/get`,
      data: {
        categoryId: this.product.category_id,
        region: this.region,
      },
      method: "POST",
    })
      .then((res) => {
        this.groups = res.data.groups;
      })
      .catch((err) => {
        this.$toast.error(err.response.data.message);
      });
  },
};
</script>

<style lang="scss">
.product-list-info {
  .form-select {
    width: 401px;
  }
  .group__title {
    font-size: 16px;
  }
}
</style>
