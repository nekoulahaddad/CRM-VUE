<template>
  <div
    class="list__columns site-list-columns list__columns--shadow set-list__columns"
  >
    <div class="list__column">{{ index + 1 }}</div>
    <div class="list__column bg bg--blue-light">
      {{ infoItem.categoryName }}
    </div>
    <div class="list__column">
      <a :href="infoItem.url" target="_blank">{{ infoItem.url }}</a>
    </div>
    <div class="list__column d-flex justify-center align-items-center">
      <div
        class="list__column-manager"
        v-if="infoItem.manager && infoItem.manager[0]"
      >
        <VueCustomTooltip
          :multiline="true"
          :label="getManagerInfo(infoItem.manager[0])"
        >
          {{
            Array.isArray(infoItem.manager) &&
            infoItem.manager[0] &&
            transformFIO(infoItem.manager[0])
          }}
        </VueCustomTooltip>
      </div>
      <div class="tooltip--black">
        <VueCustomTooltip label="Редактировать менеджера">
          <img
            alt=""
            src="@/assets/icons/manager.svg"
            @click="$emit('toggleManager', infoItem)"
          />
        </VueCustomTooltip>
      </div>
    </div>
    <div class="list__column text text--green">
      {{ transformTime(infoItem.updatedAt) }}
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip label="Экспорт Excel">
            <img
              alt=""
              @click="exportExcel(infoItem._id)"
              src="@/assets/icons/export.svg"
            />
          </VueCustomTooltip>
        </div>
        <div class="table__icon">
          <VueCustomTooltip
            v-if="excelImportForm._id !== infoItem._id"
            label="Импорт Excel"
          >
            <img
              @click="$emit('toggleImportExcel', infoItem)"
              src="@/assets/icons/import.svg"
              alt=""
            />
          </VueCustomTooltip>
          <img
            alt=""
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleImportExcel', infoItem)"
            v-else
          />
        </div>
        <div class="table__icon" v-if="false">
          <VueCustomTooltip label="Обновить">
            <img
              @click="$emit('updateSite', infoItem._id)"
              src="@/assets/icons/reload.svg"
              alt=""
            />
          </VueCustomTooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    role: String,
    index: Number,
    managerItem: {
      type: Object,
    },
    infoItem: {
      type: Object,
      required: true,
    },
    excelImportForm: {
      type: Object,
    },
  },
  data() {
    return {
      dataset: [],
      filtersOptions: {},
      isLoading: false,
      item: {},
      status: false,
    };
  },
  methods: {
    getManagerInfo(item) {
      return `ФИО: ${this.transformFullFIO(item)}\nТелефон: ${
        item.phone
      }\nEmail: ${item.email}`;
    },
    async exportExcel(id) {
      try {
        this.isLoading = false;
        this.downloadExcelGoods = true;
        const response = await axios({
          url: `/sites/exportexcel`,
          data: {
            id: id,
          },
          method: "POST",
          responseType: "blob",
        });

        const link = document.createElement("a");
        const blob = new Blob([response.data]);
        let urll = window.URL.createObjectURL(blob);
        link.href = urll;
        link.download = response.headers["content-disposition"]
          .split("filename=")[1]
          .replaceAll('"', "");
        link.click();
        window.URL.revokeObjectURL(urll);
        URL.revokeObjectURL(link.href);
        this.$toast.success("Начинаю генерировать Excel!");
      } catch (error) {
        this.$toast.error(error.response.data.message);
      } finally {
        setTimeout(() => (this.downloadExcelGoods = false), 1000);
      }
      this.isLoading = true;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.list__column-manager {
  margin-right: 10px;
  span {
    display: block;
    text-align: center;
  }
}
.tooltip--black {
  span[role="tooltip"] {
    &:after {
      background-color: $color-black;
      color: $color-white;
      border-radius: $border-radius;
    }

    & + * {
      margin-left: 20px;
    }
  }
}
</style>
