<template>
  <div class="list__info list-info product-edit-form">
    <form @submit.prevent="onProductAdd">
      <div class="d-flex justify-content-between">
        <div style="margin-right: 12px" class="flex-1">
          <div class="group">
            <div class="group__title">
              Название товара: <span class="required">*</span>
            </div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите название товара"
                maxlength="100"
                name="title"
                @input="onChange($event)"
                v-model.trim="$v.title.$model"
                :class="{
                  'form-control--error': $v.title.$error,
                }"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">Артикул поставщика:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="Введите артикул поставщика..."
                maxlength="50"
                name="supplier_article"
                :value="supplier_article"
                @input="onChange($event)"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">
              Цена: <span class="required">*</span>
            </div>
            <div class="group__content">
              <input
                class="form-control"
                type="number"
                placeholder="0.00"
                min="0"
                required
                name="cost"
                step="0.01"
                v-model="$v.cost.$model"
                :class="{
                  'form-control--error': $v.cost.$error,
                }"
                @input="onChange($event)"
              />
            </div>
          </div>

          <div class="group d-flex">
            <div class="group__title">Оптовая цена:</div>
            <div class="group__content" style="margin-left: 10px">
              <toggle-button
                color="#db1f35"
                :value="wholesale"
                :sync="true"
                @change="wholesale = !wholesale"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">Клубная цена:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="number"
                placeholder="Введите клубную цену..."
                min="0"
                name="club_cost"
                step="0.01"
                :value="club_cost"
                @input="onChange($event)"
              />
            </div>
          </div>

          <div class="group d-flex">
            <div class="group__title">Скидка:</div>
            <div class="group__content" style="margin-left: 10px">
              <toggle-button
                color="#db1f35"
                :value="discount"
                :sync="true"
                @change="discount = !discount"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">Цена со скидкой:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                name="discount_price"
                :value="discount_price"
                @input="onChange($event)"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">Описание:</div>
            <div class="group__content">
              <textarea
                class="form-textarea"
                maxlength="3000"
                placeholder="Введите описание товара..."
                name="description"
                :value="description"
                @input="onChange($event)"
              />
            </div>
          </div>

          <div class="group" style="margin-top: 10px">
            <div class="group__title">Фотографии товара:</div>
            <div class="group__content photo-wrapper">
              <template v-if="images.length > 0">
                <div class="product-photo" v-for="(item, index) in tempUrl">
                  <img
                    alt=""
                    class="product-photo__img"
                    :src="item.url"
                    :title="item.name"
                    @click.prevent="downloadItem(item.url, item.name)"
                    :key="index"
                  />
                  <img
                    alt=""
                    class="product-photo__delete-icon"
                    src="@/assets/icons/trash_icon.svg"
                    @click="deleteImage(item)"
                  />
                </div>
              </template>

              <label
                v-if="images.length < 3"
                class="add-product-photo"
                for="product-photo"
              >
                <input
                  type="file"
                  hidden
                  id="product-photo"
                  multiple
                  name="imagesTemp"
                  @change="fileUpload($event, false)"
                />
                <img src="@/assets/icons/add_photo.svg" alt="" />
                <span>Нажмите чтобы выбрать</span>
              </label>
            </div>
          </div>
        </div>
        <div style="margin-left: 12px" class="flex-1">
          <div class="group">
            <div class="group__title">РРЦ:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="number"
                placeholder="Введите РРЦ..."
                min="0"
                name="rrp"
                step="0.01"
                :value="rrp"
                @input="onChange($event)"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">Цена закупки:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="number"
                placeholder="Введите цену закупки"
                min="0"
                name="purchase_cost"
                step="0.01"
                :value="purchase_cost"
                @input="onChange($event)"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">Наценка (%):</div>
            <div class="group__content">
              <input
                class="form-control"
                type="number"
                placeholder="Введите наценку..."
                min="0"
                name="margin"
                step="0.01"
                :value="margin"
                @input="onChange($event)"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">Стоп цена:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="number"
                placeholder="Введите цену..."
                min="0"
                name="stop_cost"
                step="0.01"
                :value="stop_cost"
                @input="onChange($event)"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">
              Единица измерения: <span class="required">*</span>
            </div>
            <div class="group__content">
              <input
                class="form-control"
                type="text"
                placeholder="за м2"
                maxlength="50"
                name="unit"
                @input="onChange($event)"
                v-model="$v.unit.$model"
                :class="{
                  'form-control--error': $v.unit.$error,
                }"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">Кол-во в упаковке:</div>
            <div class="group__content">
              <input
                class="form-control"
                type="number"
                placeholder="Введите кол-во в упаковке..."
                min="0"
                step="0.01"
                name="coef"
                :value="coef"
                @input="onChange($event)"
              />
            </div>
          </div>

          <div class="group">
            <div class="group__title">Свойства товара:</div>
            <div class="group__content flex-column">
              <div
                v-if="length"
                v-for="index of length"
                :key="index"
                class="d-flex property"
              >
                <input
                  type="text"
                  placeholder="Свойство"
                  required
                  :name="'option' + index"
                  :value="
                    getKeyByIndex(index) !== 'new' ? getKeyByIndex(index) : ''
                  "
                  @change="
                    getKeyByIndex(index) !== 'new'
                      ? onUpdate($event, index)
                      : onChange($event, index)
                  "
                />
                <input
                  type="text"
                  placeholder="Значение"
                  required
                  :name="'param' + index"
                  :value="getValueByIndex(index) || ''"
                  @change="onChange($event, index)"
                />
                <VueCustomTooltip label="Удалить">
                  <img
                    @click="deleteOption(index)"
                    src="@/assets/icons/trash_icon.svg"
                    alt=""
                  />
                </VueCustomTooltip>
              </div>
            </div>
            <div class="group__footer">
              <span class="btn" @click="addOption">Добавить свойство</span>
            </div>
          </div>
        </div>
      </div>

      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import axios from "@/api/axios";
import { required } from "vuelidate/lib/validators";

export default {
  props: {
    region: {
      type: String,
      default: () => "",
    },
    editedProduct: {
      type: Object,
      required: false,
      default: null,
    },
  },
  validations: {
    cost: {
      required,
    },
    title: {
      required,
    },
    unit: {
      required,
    },
  },
  data() {
    return {
      title: this.editedProduct ? this.editedProduct.title : "",
      cost: this.editedProduct ? this.editedProduct.cost : "",
      club_cost: this.editedProduct ? this.editedProduct.club_cost : "",
      coef: this.editedProduct ? this.editedProduct.coef : "",
      images: [],
      imagesTemp: [],
      deletedImgs: [],
      options: new Map(),
      serverAddr: "https://xn--j1ano.com/",
      tempUrl: [],
      isLoading: false,
      length: 0,
      discount:
        this.editedProduct && this.editedProduct.discount
          ? this.editedProduct.discount
          : false,
      wholesale:
        this.editedProduct && this.editedProduct.wholesale
          ? this.editedProduct.wholesale
          : false,
      discount_price:
        this.editedProduct && this.editedProduct.discount_price
          ? this.editedProduct.discount_price
          : 0,
      unit: this.editedProduct ? this.editedProduct.unit : "",
      description: this.editedProduct ? this.editedProduct.description : "",
      recomends:
        this.editedProduct && this.editedProduct.recomended
          ? this.editedProduct.recomended
          : [],
      buyed:
        this.editedProduct && this.editedProduct.buyed
          ? this.editedProduct.buyed
          : [],
      tempChips: [],
      currentInputRecomend: "",
      currentInputBuyed: "",
      moveProduct: false,
      titleName: this.editedProduct ? "Редактировать товар" : "Создать товар",
      supplier_article:
        this.editedProduct && this.editedProduct.supplier_article
          ? this.editedProduct.supplier_article
          : null,
      rrp:
        this.editedProduct && this.editedProduct.rrp
          ? this.editedProduct.rrp
          : null,
      purchase_cost:
        this.editedProduct && this.editedProduct.purchase_cost
          ? this.editedProduct.purchase_cost
          : null,
      margin:
        this.editedProduct && this.editedProduct.margin
          ? this.editedProduct.margin
          : null,
      discount_percent:
        this.editedProduct && this.editedProduct.discount_percent
          ? this.editedProduct.discount_percent
          : null,
      stop_cost:
        this.editedProduct && this.editedProduct.stop_cost
          ? this.editedProduct.stop_cost
          : null,
    };
  },
  async mounted() {
    await this.downloadImgs();
    if (this.editedProduct) {
      this.isLoading = false;
      if (!this.editedProduct.discount) {
        this.discount_percent = 0;
        this.discount_price = this.cost;
      }
      if (!this.editedProduct.purchase_cost) {
        this.margin = 0;
        this.purchase_cost = this.cost;
      }
      this.getOptionsMap(this.editedProduct.options);
    }
  },
  methods: {
    getResult(result) {
      return "";
    },
    async fileUpload(e, clear) {
      this.isLoading = true;
      let fileBuffer = [];
      Array.prototype.push.apply(fileBuffer, e.target.files); // <-- here
      fileBuffer.reverse();
      const files = fileBuffer;
      files.sort();
      this[e.target.name] = files;
      this.images = clear ? [] : this.images;
      this.tempUrl = clear ? [] : this.tempUrl;
      for (let img of this.imagesTemp) {
        this.images.push(img);
      }
      for (let i = 0; i < this[e.target.name].length; i++) {
        this.tempUrl.push({
          name: files[i].name,
          url: URL.createObjectURL(files[i]),
        });
      }
      this.isLoading = false;
    },
    deleteImage(image) {
      this.images = this.images.filter((file) => file.name != image.name);
      this.tempUrl = this.tempUrl.filter((obj) => obj.name != image.name);
    },
    downloadItem(url, filename) {
      axios
        .get(url, { responseType: "blob" })
        .then((response) => {
          const link = document.createElement("a");
          const blob = new Blob([response.data]);
          let urll = window.URL.createObjectURL(blob);
          link.href = urll;
          link.download = filename;
          link.click();
          setTimeout(() => {
            window.URL.revokeObjectURL(urll);
            document.body.removeChild(link);
          }, 0);
          URL.revokeObjectURL(link.href);
        })
        .catch(console.error);
    },
    onChange(e, index) {
      this[e.target.name] = e.target.value;
      let keyOld;
      let indexCurrent = 0;
      for (let key of this.options.keys()) {
        if (indexCurrent === index - 1) {
          if (key !== this[e.target.name].replace(/\./g, "##")) keyOld = key;
          break;
        }
        indexCurrent++;
      }
      if (e.target.name === "discount_percent") {
        this.discount_price = Number.parseFloat(this.cost);
        let delta = this.cost * (this.discount_percent / 100);
        this.discount_price -= delta;
      }
      if (e.target.name === "discount_price") {
        this.discount_percent = 100;
        this.discount_percent =
          this.discount_percent -
          ((this.discount_price / this.cost) * 100).toFixed(0);
      }
      if (e.target.name === "margin") {
        this.cost = Number.parseFloat(this.purchase_cost);
        let delta = this.purchase_cost * (this.margin / 100);
        this.cost += +delta;
      }
      if (e.target.name.includes("option")) {
        if (keyOld) {
          this.options.set(
            this[e.target.name].replace(/\./g, "##"),
            this.options.get(keyOld)
          );
          this.options.delete(keyOld);
        } else {
          this.options.set(this[e.target.name].replace(/\./g, "##"), "");
        }
      } else if (e.target.name.includes("param")) {
        let indexCurrent = 0;
        for (let key of this.options.keys()) {
          if (indexCurrent === index - 1) {
            this.options.set(key, this[e.target.name]);
            break;
          }
          indexCurrent++;
        }
      }

      this.options.delete("new");
      this.$forceUpdate();
    },
    onUpdate(e, index) {
      this[e.target.name] = e.target.value;
      if (e.target.name.includes("option")) {
        let indexCurrent = 0;
        let optionKey;
        for (let key of this.options.keys()) {
          if (indexCurrent === index - 1) {
            optionKey = key;
          }
          indexCurrent++;
        }
        this.options.set(
          [this[e.target.name].replace(/\./g, "##")],
          this.options.get(optionKey)
        );
        this.options.delete(optionKey);
      }
      this.options.delete("new");

      this.$forceUpdate();
    },
    deleteOption(index) {
      let indexCurrent = 0;
      for (let key of this.options.keys()) {
        if (indexCurrent === index - 1) {
          let options = this.options;
          let newKey = Array.isArray(key)
            ? key[0].replace(/\./, "##")
            : key.replace(/\./, "##");
          options.delete(newKey);
          options.delete(key);
          options.delete(key[0].replace(/\./, "##"));
          this.options = options;
          this.length = this.options.size;
          break;
        }
        indexCurrent++;
      }
    },
    onProductAdd() {
      let productData = new FormData();
      if (this.editedProduct) {
        productData.append("productId", this.editedProduct._id);
      }
      productData.append(
        "title",
        this.title !== null ? this.title : this.editedProduct.title
      );
      if (this.description || this.description === "") {
        productData.append(
          "description",
          this.description !== null || this.description === ""
            ? this.description
            : this.editedProduct.description
        );
      }
      productData.append(
        "cost",
        this.cost !== null ? this.cost : this.editedProduct.cost
      );
      if (this.club_cost) {
        productData.append(
          "club_cost",
          this.club_cost !== null
            ? this.club_cost
            : this.editedProduct.club_cost
        );
      }
      if (this.supplier_article) {
        productData.append(
          "supplier_article",
          this.supplier_article !== null
            ? this.supplier_article
            : this.editedProduct.supplier_article
        );
      }
      if (this.rrp) {
        productData.append(
          "rrp",
          this.rrp !== null ? this.rrp : this.editedProduct.rrp
        );
      }
      if (this.purchase_cost) {
        productData.append(
          "purchase_cost",
          this.purchase_cost !== null
            ? this.purchase_cost
            : this.editedProduct.purchase_cost
        );
      }
      if (this.margin) {
        productData.append(
          "margin",
          this.margin !== null ? this.margin : this.editedProduct.margin
        );
      }
      if (this.discount_percent) {
        productData.append(
          "discount_percent",
          this.discount_percent !== null
            ? this.discount_percent
            : this.editedProduct.discount_percent
        );
      }
      if (this.stop_cost) {
        productData.append(
          "stop_cost",
          this.stop_cost !== null
            ? this.stop_cost
            : this.editedProduct.stop_cost
        );
      }
      if (this.discount) {
        productData.append(
          "discount",
          this.discount !== null ? this.discount : this.editedProduct.discount
        );
        productData.append(
          "discount_price",
          this.discount_price !== null
            ? this.discount_price
            : this.editedProduct.discount_price
        );
        if (this.discount_price < this.price) {
          this.$toast.success("Скидка не может быть меньше цены!");
          return;
        }
      }
      productData.append("wholesale", this.wholesale);
      if (this.coef) {
        productData.append(
          "coef",
          this.coef !== null ? this.coef : this.editedProduct.coef
        );
      }
      productData.append(
        "unit",
        this.unit !== null ? this.unit : this.editedProduct.unit
      );
      productData.append("parent_value", this.$route.params.parent_value);
      productData.append("region", this.region);
      productData.append("type", this.$route.params.type);
      if (this.images) {
        for (let i = 0; i < this.images.length; i++) {
          productData.append("images", this.images[i]);
        }
      }
      if (this.options) {
        this.options.forEach((value, key) => {
          productData.append(`options[${key}]`, value);
        });
      }
      if (this.recomends) {
        if (this.recomends.length > 0) {
          this.recomends.forEach((item) => {
            productData.append(`recomendsProductsIds[]`, item.product_id);
            productData.append(`recomendsProductsTitles[]`, item.title);
          });
        } else {
          productData.append("recomends", []);
        }
      }
      if (this.buyed) {
        if (this.buyed.length > 0) {
          this.buyed.forEach((item) => {
            productData.append(`buyedProductsIds[]`, item.product_id);
            productData.append(`buyedProductsTitles[]`, item.title);
          });
        } else {
          productData.append("buyed", []);
        }
      }

      if (this.editedProduct) {
        axios({
          url: `/products/update/`,
          data: productData,
          method: "POST",
        })
          .then(() => {
            this.$emit("refreshGoods");
            this.$toast.success("Товар успешно изменен!");
            this.$emit("toggleEdit", this.editedProduct);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
          });
      }
    },
    addOption() {
      if (this.options.has("new")) {
        this.$toast.error("Заполните предыдущее поле!");
        return;
      }
      this.options.set("new", "");
      this.length += 1;
    },
    getOptionsMap(arr) {
      this.options = new Map();
      for (let i = 0; i < arr.length; i++) {
        for (let key in arr[i]) {
          if (key !== "Артикул") this.options.set([key], arr[i][key]);
        }
      }
      this.length = this.options.size;
    },
    getKeyByIndex(index) {
      let indexCurrent = 0;
      for (let key of this.options.keys()) {
        if (indexCurrent === index - 1) {
          if (key !== "new") {
            let newKey = Array.isArray(key)
              ? key[0].replace(/##/g, ".")
              : key.replace(/##/g, ".");
            return newKey;
          }
          return key;
        }
        indexCurrent++;
      }
    },
    getValueByIndex(index) {
      let indexCurrent = 0;
      for (let key of this.options.keys()) {
        if (indexCurrent === index - 1) {
          return this.options.get(key);
        }
        indexCurrent++;
      }
    },
    deleteChip(index) {
      this.recomends.splice(index, 1);
    },
    backspaceDelete({ which }) {
      which === 8 &&
        this.currentInputRecomend === "" &&
        this.recomends.splice(this.recomends.length - 1);
    },
    async downloadImgs() {
      if (this.editedProduct && this.editedProduct.images.length) {
        let a = 0;
        for (let imgName of this.editedProduct.images) {
          let url = this.serverAddr + this.editedProduct.path + imgName;
          await axios
            .get(url, { responseType: "blob" })
            .then((response) => {
              let blob = new Blob([response.data]);
              let image = new File(
                [blob],
                imgName,
                { type: "image/jpg" },
                new Date()
              );
              this.images.push(image);
              this.tempUrl.push({
                name: imgName,
                url: URL.createObjectURL(image),
              });
              a++;
            })
            .catch(console.error);
        }
      }
    },
    setChip(chipObj) {
      let { chip, type } = chipObj;
      let exist = this[type].some((r) => r.product_id === chip._id);
      let msg =
        type === "recomends" ? "рекомендуемых" : '"С этим товаром покупают"';
      if (exist) {
        this.$toast.error(`Товар уже в ${msg}`, "Ошибка");
        return;
      }
      if (chip._id === this.editedProduct._id) {
        this.$toast.error(`Нельзя добавить редактируемый товар!`, "Ошибка");
        return;
      }
      this[type].push({
        title: chip.title,
        product_id: chip._id,
      });
      this.tempChips = [];
      this.currentInputRecomend = "";
      this.currentInputBuyed = "";
    },
    findChips(search) {
      if (search.trim().length < 1) {
        return [];
      }

      return new Promise((resolve) => {
        axios({
          url: `/products/getproductbysearch/`,
          data: {
            search,
            region: this.region,
          },
          method: "POST",
        }).then((result) => {
          resolve(result.data.products);
        });
      });
    },
    deleteChipBuyed(index) {
      this.buyed.splice(index, 1);
    },
    backspaceDeleteBuyed({ which }) {
      which === 8 &&
        this.currentInputBuyed === "" &&
        this.buyed.splice(this.buyed.length - 1);
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.product-edit-form {
  &__title {
    &.text--blue {
      font-weight: 700;
      font-size: 16px;
      margin-bottom: 10px;
    }
  }
  .property {
    align-items: center;

    & * {
      margin-bottom: 20px;
      margin-right: 10px;
    }

    span {
      position: relative;
      top: 10px;
      left: 5px;
    }

    input {
      min-width: 200px;
      & + input {
        margin-left: 10px;
      }
    }
  }
  span[role="tooltip"] {
    height: 24px;

    &:after {
      background-color: $color-black;
      color: $color-white;
      border-radius: $border-radius;
    }

    & + * {
      margin-left: 20px;
    }
  }
  .product-photo {
    width: 132px;
    height: 132px;
    position: relative;

    img.product-photo__img {
      width: 132px;
      height: 132px;
    }
    &__delete-icon {
      position: absolute;
      right: 10px;
      top: 10px;
      background-color: #fff;
      border-radius: $border-radius;
      padding: 2px;
    }
  }
  .add-product-photo {
    width: 132px;
    height: 132px;
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    cursor: pointer;
    flex-direction: column;
    text-align: center;

    input {
      position: absolute;
    }

    span {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.3);
      margin-top: 10px;
      font-weight: 700;
    }
  }
  .photo-wrapper {
    flex-wrap: wrap;

    & > * {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .group__recomend {
    height: 40px;
    border-radius: $border-radius;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    overflow-x: hidden;
    margin-top: 10px;
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 10px;
    }
  }
  span.btn {
    width: 230px;
    height: 37px;
    background-color: $color-red;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 700;
    color: $color-white;
    cursor: pointer;
  }
}
</style>
