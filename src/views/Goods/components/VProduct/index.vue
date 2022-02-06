<template>
  <div
    class="list__columns list__columns-shadow list__columns-white goods-list-columns"
  >
    <div class="list__column">
      <input type="checkbox" @change="selectProducts($event, item)" />
    </div>
    <div class="list__column">{{ item.title }}</div>
    <div class="list__column">
      <span v-if="item.type !== 'group'">{{ item.article }}</span>
      <span v-else>Группа</span>
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <!-- Показать товары группы -->
          <template v-if="item.type === 'group'">
            <VueCustomTooltip
              v-if="groupItems._id !== item._id"
              label="Показать товары"
            >
              <img
                @click="$emit('toggleGroupProducts', item)"
                src="@/assets/icons/structure.svg"
                alt=""
              />
            </VueCustomTooltip>
            <img
              alt=""
              v-else
              @click="$emit('toggleGroupProducts', item)"
              src="@/assets/icons/arrow_top_icon.svg"
            />
          </template>

          <!-- Добавить товар в группу -->
          <template v-else>
            <VueCustomTooltip
              v-if="groupProductItem._id !== item._id"
              label="Добавить товар в группу"
            >
              <img
                @click="$emit('toggleProductToGroup', item)"
                src="@/assets/icons/add_to_group.svg"
                alt=""
              />
            </VueCustomTooltip>
            <img
              alt=""
              v-else
              @click="$emit('toggleProductToGroup', item)"
              src="@/assets/icons/arrow_top_icon.svg"
            />
          </template>
        </div>

        <!-- Перемещение товара -->
        <div class="table__icon" v-if="item.type !== 'group'">
          <VueCustomTooltip
            v-if="movedProduct._id !== item._id"
            label="Перемещение товара"
          >
            <img
              alt=""
              src="@/assets/icons/move_goods.svg"
              @click="$emit('toggleMoveProduct', item)"
            />
          </VueCustomTooltip>
          <img
            alt=""
            v-else
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleMoveProduct', item)"
          />
        </div>

        <div class="table__icon">
          <!-- Видимость товара -->
          <VueCustomTooltip
            v-if="item.type !== 'group'"
            label="Видимость товара"
          >
            <img
              alt=""
              :src="
                item.visible
                  ? require('@/assets/icons/eye_close.svg')
                  : require('@/assets/icons/eye.svg')
              "
              @click="changeProductVisibility(item._id, item.visible)"
            />
          </VueCustomTooltip>

          <!-- Видимость группы -->
          <VueCustomTooltip v-else label="Видимость группы">
            <img
              alt=""
              :src="
                item.visible
                  ? require('@/assets/icons/eye_close.svg')
                  : require('@/assets/icons/eye.svg')
              "
              @click="changeProductVisibility(item._id, item.visible)"
            />
          </VueCustomTooltip>
        </div>

        <div class="table__icon">
          <!-- Изменить товар -->
          <VueCustomTooltip v-if="item.type !== 'group'" label="Изменить товар">
            <img
              alt=""
              src="@/assets/icons/write_icon.svg"
              @click="$emit('toggleEditProduct', item)"
            />
          </VueCustomTooltip>

          <!-- Изменить группу -->
          <template v-else>
            <VueCustomTooltip
              v-if="editedGroupItem._id !== item._id"
              label="Изменить группу"
            >
              <img
                alt=""
                src="@/assets/icons/write_icon.svg"
                @click="$emit('toggleEditGroup', item)"
              />
            </VueCustomTooltip>
            <img
              alt=""
              v-else
              src="@/assets/icons/arrow_top_icon.svg"
              @click="$emit('toggleEditGroup', item)"
            />
          </template>
        </div>

        <!-- Удалить товар -->
        <div class="table__icon">
          <VueCustomTooltip v-if="item.type !== 'group'" label="Удалить товар">
            <img
              alt=""
              src="@/assets/icons/trash_icon.svg"
              @click="$emit('toggleDeleteProduct', item)"
            />
          </VueCustomTooltip>
          <VueCustomTooltip v-else label="Удалить группу">
            <img
              alt=""
              src="@/assets/icons/trash_icon.svg"
              @click="$emit('toggleDeleteGroup', item)"
            />
          </VueCustomTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    editedGroupItem: Object,
    groupProductItem: Object,
    groupItems: Object,
    movedProduct: Object,
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    selectProducts(event, item) {
      const value = event;
      if (value) {
        let dataset = this.$parent.selectedProducts;
        dataset.push(item);
        this.$parent.selectedProducts = dataset;
        this.cleared = false;
      } else {
        let dataset = this.$parent.selectedProducts;
        let index = dataset.findIndex((pr) => pr._id === item._id);
        dataset.splice(index, 1);
        this.$parent.selectedProducts = dataset;
      }
    },
    changeGroupVisibility(id, visible) {
      this.changeStatus(false);
      let groupData = {
        region: this.filtersOptions.region,
        groupId: id,
        visible: !visible,
      };
      axios({
        url: `/groups/edit/`,
        data: groupData,
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.$emit("refreshGoods");
          this.$toast.success(
            `Группа ${
              result.data.group.visible
                ? "будет отображаться"
                : "не будет отображаться"
            }`,
            "Успех!"
          );
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
    changeProductVisibility(id, visible) {
      this.changeStatus(false);
      let productData = {
        region: this.$parent.filtersOptions.region,
        productId: id,
        visible: !visible,
      };
      axios({
        url: `/products/updatevisibility/`,
        data: productData,
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.item.visible = result.data.product.visible;
          this.$emit("editProduct", result.data.product, this.item);
          this.$toast.success(
            `Товар ${
              result.data.product.visible
                ? "будет отображаться"
                : "не будет отображаться"
            }`
          );
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
    },
  },
};
</script>

<style lang="scss">
.goods-list-columns {
  grid-template-columns: 50px 750px 100px 1fr;

  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    min-width: 16px;
    height: 16px;
    background-color: #f5f5f5;
    border-radius: 2px;
    border: 1px solid #d9d9d9;
    cursor: pointer;
    margin-right: 10px;
    position: relative;

    &:checked:after {
      content: "";
      position: absolute;
      background: url("../../../../assets/icons/check.svg") no-repeat 1px 2px;
      border-radius: 2px;
      z-index: 100;
      width: 16px;
      height: 16px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  label {
    color: rgba(0, 0, 0, 0.3);
    display: flex;
  }
}
</style>
