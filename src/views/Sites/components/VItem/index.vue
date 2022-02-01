<template>
  <div
    class="list__columns list__columns--shadow set-list__columns list__columns--white"
  >
    <div class="list__column">{{ index + 1 }}</div>
    <div class="list__column bg bg--blue-light">
      {{ infoItem.categoryName }}
    </div>
    <div class="list__column">
      <a :href="infoItem.url" target="_blank">{{ infoItem.url }}</a>
    </div>
    <div class="list__column text text--green">
      {{ transformTime(infoItem.updatedAt) }}
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip label="Экспорт Excel">
            <img
              @click="exportExcel(infoItem._id)"
              src="@/assets/icons/export.svg"
              alt=""
            />
          </VueCustomTooltip>
        </div>
        <div class="table__icon">
          <VueCustomTooltip label="Импорт Excel">
            <img
              @click="toggleImportExcel(infoItem)"
              src="@/assets/icons/import.svg"
              alt=""
            />
          </VueCustomTooltip>
        </div>
        <div class="table__icon">
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
    index: Number,
    infoItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dataset: [],
      filtersOptions: {},
      isLoading: false,
      item: {},
      status: false,
      excelImportForm: false,
    };
  },
  computed: {
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
  },
  methods: {
    async exportExcel(id) {
      try {
        this.isLoading = false;
        this.downloadExcelGoods = true;
        await axios({
          url: `/sites/exportexcel`,
          data: {
            id: id,
          },
          method: "POST",
        });
        this.$toast.success("Начинаю генерировать Excel!");
      } catch (error) {
        this.$toast.error(error.response.data.message);
      } finally {
        setTimeout(() => (this.downloadExcelGoods = false), 1000);
      }
      this.isLoading = true;
    },
    toggleImportExcel(item) {
      this.excelImportForm = !this.excelImportForm;
      if (this.excelImportForm) {
        this.item = item ? item : false;
      } else {
        this.item = null;
      }
    },
  },
};
</script>
