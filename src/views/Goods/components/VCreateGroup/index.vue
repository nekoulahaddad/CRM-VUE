<template>
  <v-modal
    :adaptive="true"
    :minHeight="600"
    :minWidth="976"
    name="createGroup"
    @before-close="$store.commit('setCreateGroup', false)"
  >
    <div class="create-group-modal">
      <div class="vm--modal__title">
        Создать группу
        <img
          @click="cancel"
          class="close"
          src="@/assets/icons/close_icon.svg"
          alt=""
        />
      </div>
      <div class="vm--modal__inner">
        <form>
          <div class="group">
            <div class="group__title">Заголовок группы:</div>
            <div>
              <input
                type="text"
                class="form-control"
                maxlength="100"
                v-model="title"
                placeholder="Введите заголовок группы..."
              />
            </div>
          </div>
          <div class="group">
            <div class="group__title">Выбранные категории:</div>
            <div class="group__products" :style="{ height: height }">
              <vue-scroll>
                <div
                  class="group__product"
                  v-if="items.length"
                  v-for="(product, index) in items"
                >
                  <span>{{ product.title }}</span>
                  <div>
                    <img
                      @click="deleteChip(index)"
                      src="@/assets/icons/trash_icon.svg"
                      alt=""
                    />
                  </div>
                </div>
              </vue-scroll>
            </div>
          </div>
          <div class="group">
            <div class="group__title">Свойство группы:</div>
            <div>
              <v-select
                :options="
                  getOptions().map((product) => ({
                    label: product,
                    value: product,
                  }))
                "
                :reduce="(item) => item.value"
                v-model="groupProperties"
              />
            </div>
          </div>
        </form>
        <div class="vm--modal__buttons">
          <v-button @click="confirm" red>Создать</v-button>
        </div>
      </div>
    </div>
  </v-modal>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    items: Array,
    region: String,
    category_id: String,
  },
  data() {
    return {
      title: "",
      groupProperties: "",
    };
  },
  computed: {
    height() {
      if (this.items.length < 3) {
        return `${this.items.length * 44}px`;
      }
      return "129px";
    },
  },
  methods: {
    cancel() {
      this.$modal.hide("createGroup");
    },
    deleteChip(index) {
      this.items.splice(index, 1);
    },
    confirm() {
      if (!this.title || !this.items.length) {
        this.$toast.error("Категории или заголовок не заполнены!");
        return;
      }

      if (!this.groupProperties) {
        this.$toast.error("Свойство группы не заполнено!");
        return;
      }

      let products = this.items.map((item) => item._id);

      axios({
        url: `/groups/post`,
        data: {
          title: this.title,
          products,
          region: this.region,
          category_id: this.category_id || this.items[0].category_id,
          groupProperties: this.groupProperties,
        },
        method: "POST",
      })
        .then(async () => {
          this.$emit("refreshGoods");
          this.$toast.success("Товары успешно добавлены в группу!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    getOptions() {
      let arr = [];
      this.items.map((i) => {
        i.options.map((option) => {
          arr.push(Object.keys(option) + "");
        });
      });
      arr.push("Размер");
      return Array.from(new Set(arr));
    },
  },
};
</script>

<style lang="scss">
.create-group-modal {
  position: relative;
  height: 100%;

  .close {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15px;
  }
  .group__product {
    display: flex;
    justify-content: space-between;
    height: 33px;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);
    border-radius: 5px;
    align-items: center;
    padding-left: 4px;
    padding-right: 10px;
    width: 917px;
    margin: 5px 4px 10px;
  }
  .vm--modal__buttons {
    position: absolute;
    bottom: 15px;
    left: 20px;
  }
}
</style>
