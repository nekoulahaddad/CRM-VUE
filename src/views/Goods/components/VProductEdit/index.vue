<template>
  <div class="list__info list-info product-edit-form">
    <form @submit.prevent="">
      <div class="product-edit-form__title text--blue">
        Редактировать товар:
      </div>
      <div class="group">
        <div class="group__title">Название товара:</div>
        <div class="group__content">
          <input
            class="form-control"
            type="text"
            placeholder="Введите название товара"
            maxlength="100"
            name="title"
            :value="title"
            @input="onChange($event)"
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
        <div class="group__title">Цена:</div>
        <div class="group__content">
          <input
            class="form-control"
            type="number"
            placeholder="0.00"
            min="0"
            required
            name="cost"
            step="0.01"
            :value="cost"
            @input="onChange($event)"
          />
        </div>
      </div>

      <div class="group d-flex">
        <div class="group__title">Оптовая цена:</div>
        <div class="group__content" style="margin-left: 10px">
          <toggle-button color="#db1f35" />
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
          <toggle-button color="#db1f35" />
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
        <div class="group__title">Единица измерения:</div>
        <div class="group__content">
          <input
            class="form-control"
            type="text"
            placeholder="за м2"
            maxlength="50"
            ame="unit"
            :value="unit"
            @input="onChange($event)"
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
            <img src="@/assets/icons/trash_icon.svg" alt="" />
          </div>
        </div>
        <div class="group__footer">
          <v-button red>Добавить свойство</v-button>
        </div>
      </div>

      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    region: {
      type: String,
      default: () => "",
    },
    editedProduct: {
      type: Object,
      default: () => false,
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
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      tempUrl: [],
      isLoading: false,
      length: 0,
      discount: this.editedProduct.discount
        ? this.editedProduct.discount
        : false,
      wholesale: this.editedProduct.wholesale
        ? this.editedProduct.wholesale
        : false,
      discount_price: this.editedProduct.discount_price
        ? this.editedProduct.discount_price
        : 0,
      unit: this.editedProduct ? this.editedProduct.unit : "",
      description: this.editedProduct ? this.editedProduct.description : "",
      recomends: this.editedProduct.recomended
        ? this.editedProduct.recomended
        : [],
      buyed: this.editedProduct.buyed ? this.editedProduct.buyed : [],
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
    async fileUpload(e, clear) {
      this.isLoading = true;
      let fileBuffer = [];
      Array.prototype.push.apply(fileBuffer, e.target.files); // <-- here
      fileBuffer.reverse();
      console.log(fileBuffer);
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
      if (e.target.name == "discount_percent") {
        this.discount_price = Number.parseFloat(this.cost);
        let delta = this.cost * (this.discount_percent / 100);
        this.discount_price -= delta;
      }
      if (e.target.name == "discount_price") {
        this.discount_percent = 100;
        this.discount_percent =
          this.discount_percent -
          ((this.discount_price / this.cost) * 100).toFixed(0);
      }
      if (e.target.name == "margin") {
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
      this.changeStatus(false);
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
          this.changeStatus(true);
          return;
        }
      }
      if (this.wholesale) {
        productData.append(
          "wholesale",
          this.wholesale !== null
            ? this.wholesale
            : this.editedProduct.wholesale
        );
      }
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
          url: process.env.VUE_APP_DEVELOP_URL + `/products/update/`,
          data: productData,
          method: "POST",
        })
          .then(async (res) => {
            let result = await res;
            this.$emit(
              "editProduct",
              result.data.product,
              result.data.changeTitle ? result.data.old : false
            );
            this.$toast.success("Товар успешно обновлен!");
            this.$emit("toggleOpen");
            this.changeStatus(true);
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
            this.changeStatus(true);
          });
      } else {
        axios({
          url: process.env.VUE_APP_DEVELOP_URL + `/products/post/`,
          data: productData,
          method: "POST",
        })
          .then(async (res) => {
            let result = await res;
            if (result.data.exist) {
              this.$toast.success("Товар уже существует!");
              this.changeStatus(true);
            } else {
              this.$emit("addProduct", result.data.product);
              this.$toast.success("Товар успешно добавлен!");
              this.$emit("toggleOpen");
              this.changeStatus(true);
            }
          })
          .catch((err) => {
            this.$toast.error(err.response.data.message);
            this.changeStatus(true);
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
      which == 8 &&
        this.currentInputRecomend === "" &&
        this.recomends.splice(this.recomends.length - 1);
    },
    async downloadImgs() {
      if (this.editedProduct.images.length != 0) {
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
          console.log(a);
        }
      }
    },
    setChip(chipObj) {
      let { chip, type } = chipObj;
      let exist = this[type].some((r) => r.product_id == chip._id);
      let msg =
        type == "recomends" ? "рекомендуемых" : '"С этим товаром покупают"';
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
      this.$toast.success(`Товар успешно добавлен в ${msg}!`);
    },
    findChips(type) {
      this.tempChips = [];
      let search = "";
      if (type == "recomends") {
        search = this.currentInputRecomend;
        this.currentInputBuyed = "";
      } else {
        search = this.currentInputBuyed;
        this.currentInputRecomend = "";
      }
      axios({
        url: process.env.VUE_APP_DEVELOP_URL + `/products/getproductbysearch/`,
        data: {
          search: search,
          region: this.region,
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        let products = result.data.products;
        if (!products.length) {
          this.$toast.error("Товар не найден", "Ошибка");
          return;
        }
        this.tempChips.push(...products);
      });
    },
    deleteChipBuyed(index) {
      this.buyed.splice(index, 1);
    },
    backspaceDeleteBuyed({ which }) {
      which == 8 &&
        this.currentInputBuyed === "" &&
        this.buyed.splice(this.buyed.length - 1);
    },
  },
};
</script>

<style lang="scss">
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
      margin-right: 10px;
      margin-bottom: 10px;
    }

    input {
      width: 401px;
    }
  }
}
</style>
