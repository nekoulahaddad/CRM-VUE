<template>
  <v-modal :adaptive="true" :minWidth="1070" :minHeight="800" name="regionEdit">
    <div class="vm--modal__title">
      Редактировать регион
      <img @click="cancel" src="@/assets/icons/close_icon.svg" alt="" />
    </div>
    <div class="vm--modal__inner region-edit">
      <div class="vm--modal__content d-flex justify-content-between">
        <div>
          <div class="group__title">Валюта:</div>
          <div class="group__content">
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
        class="vm--modal__content d-flex justify-content-between"
        style="flex-wrap: wrap; margin-top: 20px"
      >
        <div
          v-for="(item, index) in region.sales"
          :key="index"
          style="width: 50%; margin-bottom: 20px"
        >
          <div class="group__content">
            <img
              v-if="item.img"
              :src="
                region
                  ? `${
                      serverAddr +
                      region.path +
                      (item && item.img ? item.img : item)
                    }`
                  : false
              "
              alt=""
            />
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
          <div class="group__content"></div>
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
  mounted() {
    this.getRegion();
  },
  methods: {
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
};
</script>

<style lang="scss">
.region-edit {
  .vm--modal__buttons {
    position: absolute;
    left: 20px;
    bottom: 20px;
  }
}
</style>
