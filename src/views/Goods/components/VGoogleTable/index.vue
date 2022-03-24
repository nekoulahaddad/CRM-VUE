<template>
  <v-modal
    :adaptive="true"
    :minHeight="360"
    :minWidth="1017"
    name="googleTable"
    @before-close="beforeClose"
  >
    <div class="google-table">
      <div class="vm--modal__title">
        Google таблица региона
        <img
          alt=""
          @click="cancel"
          class="vm--modal__close"
          src="/icons/close_icon.svg"
        />
      </div>
      <div class="vm--modal__content">
        <div class="group">
          <div class="group__title">ID документа:</div>
          <div class="group__content">
            <input v-model="spreadsheetId" type="text" class="form-control" />
          </div>
          <div class="group__footer">
            <div
              v-if="googleDoc"
              style="
                background: #f8f9fe;
                padding: 10px;
                font-size: 15px;
                font-weight: 600;
                border-radius: 6px;
                width: 100%;
              "
            >
              <a :href="URL" target="_blank">
                {{ getUrl(googleDoc.spreadsheetId) }}
              </a>
            </div>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Тех. аккаунт:</div>
          <div class="group__content">
            server@fleet-impact-335212.iam.gserviceaccount.com
          </div>
        </div>
        <div class="group">
          <div class="group__title">Листов в таблице:</div>
          <div class="group__content">
            {{ categories.length }}
          </div>
        </div>
        <div class="group">
          <div class="group__content d-flex">
            <v-button @click="confirm" red>Сохранить</v-button>
            <div style="margin-left: 15px">
              <v-button @click="clear" redWhite>Обнулить таблицу</v-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-modal>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    region: String,
    googleDoc: Object,
  },
  methods: {
    cancel() {
      this.$modal.hide("googleTable");
    },
    confirm() {
      let data = {
        region: this.region,
        spreadsheetId: this.spreadsheetId,
      };
      axios({
        url: `/googlesheets/linksheet/`,
        data: data,
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.$toast.success(result.data.message);
          this.$emit("refreshGoods");
          this.cancel();
        })
        .catch(async (err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    clear() {
      let data = {
        region: this.region,
        spreadsheetId: this.spreadsheetId,
      };
      axios({
        url: p`/googlesheets/unlinksheet/`,
        data: data,
        method: "POST",
      })
        .then(async (res) => {
          let result = await res;
          this.$toast.success(result.data.message);
          this.$emit("refreshGoods");
        })
        .catch(async (err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    getUrl(id) {
      return `https://docs.google.com/spreadsheets/d/${id}`;
    },
    beforeClose() {
      this.$store.commit("toggleAction", {
        key: "googleTable",
      });
    },
  },
  data() {
    return {
      spreadsheetId: "",
      categories: [],
      URL: null,
    };
  },
  watch: {
    googleDoc: {
      handler(value) {
        if (value) {
          this.spreadsheetId = value.spreadsheetId;
          this.URL = `https://docs.google.com/spreadsheets/d/${value.spreadsheetId}/edit#gid=0`;
          for (let sheet of value.sheets) {
            this.categories.push(sheet.categoryName);
          }
        } else {
          this.categories = [];
          this.spreadsheetId = "";
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.google-table {
  .vm--modal__title {
    position: relative;
    img {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .vm--modal__content {
    padding: 20px;
  }
  button {
    width: 250px;
  }
}
</style>
