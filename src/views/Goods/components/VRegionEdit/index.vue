<template>
  <v-modal :adaptive="true" :minWidth="1070" :minHeight="800" name="regionEdit">
    <div class="vm--modal__title">
      Редактировать регион
      <img
        @click="cancel"
        class="close"
        src="@/assets/icons/close_icon.svg"
        alt=""
      />
    </div>
    <div class="vm--modal__inner region-edit">
      <div class="vm--modal__content d-flex justify-content-between">
        <div>
          <div class="group__title">Валюта:</div>
          <div class="group__content flex-column">
            <v-select
              :options="[
                { label: 'Рубль', value: '₽' },
                { label: 'Белорусский рубль', value: 'BYN' },
                { label: 'Тенге', value: '₸' },
                { label: 'Доллар', value: '$' },
                { label: 'Киргизский сом', value: 'с' },
              ]"
              :reduce="(item) => item.value"
              v-model="valute"
              name="valute"
            />
          </div>
        </div>
      </div>
      <div
        style="
          color: #003ad2;
          font-size: 16px;
          font-weight: 700;
          margin-top: 15px;
          border-top: 2px solid #f6f6f6;
          padding-top: 10px;
          margin-bottom: 10px;
        "
      >
        Акции региона:
      </div>
      <div
        v-if="region && region.sales && region.sales.length"
        style="font-size: 14px; font-weight: 700; margin-bottom: 10px"
      >
        Баннеры для десктоп версии:
      </div>
      <div
        class="vm--modal__content d-flex justify-content-between"
        style="flex-wrap: wrap; margin-top: 20px"
        v-if="region"
      >
        <div
          v-for="(item, index) in region.sales"
          :key="index"
          style="width: 50%; margin-bottom: 20px"
          class="group__wrap"
        >
          <div class="group__content flex-column">
            <div class="d-flex">
              <div style="margin-right: 10px">
                <img
                  alt=""
                  v-if="item.img"
                  class="big-photo"
                  :src="
                    region
                      ? `${
                          serverAddr +
                          region.path +
                          (item && item.img ? item.img : item)
                        }`
                      : false
                  "
                />
                <img src="@/assets/icons/no_photo.svg" v-else alt="" />
              </div>
              <div>
                <label class="" :for="`upload_photo${index}`">
                  <simple-svg
                    :src="require('@/assets/icons/upload_photo.svg')"
                  />
                  <input
                    type="file"
                    :name="`salesImage${index}`"
                    :id="`upload_photo${index}`"
                    hidden
                    @input="newfileUpload($event, 'sales', index)"
                  />
                </label>
                <label
                  v-if="item.img || item.href"
                  @click="deleteRegionSale('sales', index)"
                >
                  <simple-svg
                    :src="require('@/assets/icons/trash_icon_gray.svg')"
                  />
                </label>
              </div>
            </div>
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 10px">
              URL акции:
            </div>
            <input
              type="url"
              class="form-control"
              maxlength="200"
              placeholder="https://example.com"
              v-model="salesHref[index]"
            />
          </div>
        </div>
        <div>
          <div class="group__content flex-column"></div>
        </div>
      </div>
      <div class="vm--modal__buttons">
        <v-button @click="confirm" red>Сохранить</v-button>
      </div>
    </div>
  </v-modal>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    editedRegionId: String,
  },
  data() {
    return {
      region: {},
      images: ["Выберите файлы"],
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      salesHref: [],
      msalesHref: [],
      tempUrl: [],
      links: [],
      isLoading: false,
      valute: "₽",
      valutes: [
        {
          code: "643",
          icon: "₽",
        },
        {
          code: "933",
          icon: "BYN",
        },
        {
          code: "398",
          icon: "₸",
        },
        {
          code: "417",
          icon: "с",
        },
        {
          code: "840",
          icon: "$",
        },
      ],
    };
  },
  watch: {
    editedRegionId() {
      this.getRegion();
    },
  },
  methods: {
    async newfileUpload(e, type, index) {
      this.isLoading = true;
      let fileBuffer = [];
      Array.prototype.push.apply(fileBuffer, e.target.files); // <-- here
      const files = fileBuffer;
      this[e.target.name] = files;
      let regionData = new FormData();
      regionData.append("type", type);
      regionData.append("sale", this[type + "Image" + index][0]);
      regionData.append("index", index);
      regionData.append("region", this.editedRegionId);
      axios({
        url: `/regions/newimage/`,
        data: regionData,
        method: "POST",
      }).then(() => {
        this.getRegion();
      });
    },
    async deleteRegionSale(type, index) {
      axios({
        url: `/regions/deletesale/`,
        data: {
          index: index,
          type: type,
          region: this.region._id,
        },
        method: "POST",
      })
        .then(async () => {
          this.$toast.success("Акция успешно удалена!");
          await this.getRegion();
          this[type + "Href"][index] = null;
        })
        .catch((error) => {});
    },
    findDuplicates(array, type) {
      let devType = type === "sales" ? "десктоп" : "мобильных";
      let dupes = {};
      let error = false;
      array.forEach((item, index) => {
        if (item) {
          dupes[item] = dupes[item] || [];
          dupes[item].push(" " + (index + 1));
        }
      });
      for (const [key, value] of Object.entries(dupes)) {
        if (value.length > 1) {
          this.$toast.error(
            `Ссылки ${key} для ${devType} баннеров №:${[value]} совпадают!`
          );
          error = true;
        }
      }
      return error;
    },
    checkSales(type) {
      let error = false;
      let devType = type === "sales" ? "десктоп" : "мобильного";
      for (let i = 0; i < 4; i++) {
        let href = this[type + "Href"][i];
        let img = this.region[type][i].img;
        if (!href && !img) continue;
        else if (!href && img) {
          this.$toast.error(
            `Не указана ссылка для ${devType} баннера №${i + 1}!`
          );
          error = true;
        } else if (!img && href) {
          this.$toast.error(
            `Не загружено изображение ${devType} для баннера №${i + 1}!`
          );
          error = true;
        }
      }
      return error;
    },
    confirm() {
      let salesCheck = this.checkSales("sales");
      let msalesCheck = this.checkSales("msales");

      let salesDup = this.findDuplicates(this.salesHref, "sales");
      let msalesDup = this.findDuplicates(this.msalesHref, "msales");
      if (salesDup || msalesDup || salesCheck || msalesCheck) {
        return;
      }
      let regionData = {};
      regionData.regionId = this.region._id;

      let valute = this.valutes.find((valute) => valute.icon === this.valute);
      regionData.valute = valute;

      regionData.salesHref = this.salesHref;
      regionData.msalesHref = this.msalesHref;
      axios({
        url: `/regions/update/`,
        data: regionData,
        method: "POST",
      }).then(() => {
        this.$toast.success("Регион успешно обновлен!");
        this.cancel();
      });
    },
    cancel() {
      this.$modal.hide("regionEdit");
    },
    async getRegion() {
      axios({
        url: `/regions/getbyid/`,
        data: { regionId: this.editedRegionId },
        method: "POST",
      }).then(async (res) => {
        let region = await res.data.region;
        this.region = region;
        this.valute = region.valute.icon || "₽";
        this.salesHref = [];
        this.msalesHref = [];
        for (let h of region.sales) {
          this.salesHref.push(h.href);
        }
        for (let h of region.msales) {
          this.msalesHref.push(h.href);
        }
      });
    },
  },
  mounted() {
    this.getRegion();
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.vm--modal__title {
  position: relative;

  .close {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.region-edit {
  .vm--modal__buttons {
    position: absolute;
    left: 20px;
    bottom: 20px;
  }
  .group__wrap:nth-child(odd) {
    padding-right: 20px;
  }
  img {
    max-width: 230px;
    width: 100%;
    border-radius: 6px;
    margin-bottom: 10px;
  }
  .group__content {
    .big-photo {
      max-width: 230px;
      max-height: 156px;
    }

    label {
      width: 33px;
      height: 33px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(0, 0, 0, 0.3);
      border-radius: $border-radius;
      cursor: pointer;

      & + label {
        margin-top: 7px;
      }
    }
  }
}
</style>
