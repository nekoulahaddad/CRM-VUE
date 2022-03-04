<template>
  <v-modal :adaptive="true" :minWidth="976" :minHeight="475" name="regionEdit">
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
      <div class="vm--modal__content d-flex justify-content-between">
        <div>
          <div class="group__title">Баннеры для десктоп версии:</div>
          <div class="group__content"></div>
        </div>
        <div>
          <div class="group__content"></div>
        </div>
      </div>
      <div class="vm--modal__buttons">
        <v-button @click="confirm" red>Да</v-button>
        <v-button @click="cancel" white>Нет</v-button>
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
    confirm() {},
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
.vm--modal {
  &__text {
    text-align: center;
    margin-bottom: 20px;
  }
  &__buttons {
    justify-content: center;
  }

  .region-edit {
    .form-select {
      width: 401px;
    }
  }
}
</style>
