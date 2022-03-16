<template>
  <v-modal
    :adaptive="true"
    :minHeight="360"
    :minWidth="1017"
    name="googleTable"
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
              {{ getUrl(googleDoc.spreadsheetId) }}
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
            <v-button red>Сохранить</v-button>
            <div style="margin-left: 15px">
              <v-button redWhite>Обнулить таблицу</v-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-modal>
</template>

<script>
export default {
  props: {
    region: String,
    googleDoc: Object,
  },
  methods: {
    cancel() {},
    confirm() {},
    getUrl(id) {
      return `https://docs.google.com/spreadsheets/d/${id}`;
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
    googleDoc(value) {
      if (value) {
        this.spreadsheetId = value.spreadsheetId;
        this.URL = `https://docs.google.com/spreadsheets/d/${value.spreadsheetId}/edit#gid=0`;
        for (let sheet of value.sheets) {
          this.categories.push(sheet.categoryName);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.google-table {
  .vm--modal__content {
    padding: 20px;
  }
  button {
    width: 250px;
  }
}
</style>
