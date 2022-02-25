<template>
  <div class="list__info list-info">
    <div class="group__title text--blue">
      {{ $t("pages.reports.reportInfo") }}
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportName") }}
        </div>
        <div class="group__value">{{ report.title }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportExecutor") }}
        </div>
        <div class="group__value">
          {{ report.executor.surname }} {{ report.executor.name }}
          {{ report.executor.lastname }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportDepartment") }}
        </div>
        <div class="group__value">
          {{ report.executor.department.title }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportDescription") }}
        </div>
        <div class="group__value">
          {{ report.description }}
        </div>
      </div>

      <div class="group">
        <div class="group__title">{{ $t("pages.reports.reportDocs") }}</div>
        <div class="group__content">
          <div v-if="documents.length" class="list__documents documents">
            <div
              v-for="(photo, index) in documents"
              class="documents__item"
              @click.prevent="downloadItem(serverAddr + `${photo}`, photo)"
            >
              {{
                photo.name
                  ? photo.name.length > 30
                    ? photo.name.slice(0, -10) +
                      " ... ." +
                      photo.type.split("/")[1]
                    : photo.name
                  : `Документ ${index + 1}`
              }}
            </div>
          </div>
          <div v-else>Нет документов</div>
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportRegion") }}
        </div>
        <div class="group__value">
          {{ report.executor.region.title }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportStatus") }}
        </div>
        <div v-html="transformStatus(report.status)" class="group__value" />
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportMark") }}
        </div>
        <div class="group__value" v-html="transformMark(report.mark)" />
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportCreated") }}
        </div>
        <div class="group__value">
          {{ transformDate(report.created) }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportAccepted") }}
        </div>
        <div class="group__value">
          {{ transformDate(report.closed) }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportDeadline") }}
        </div>
        <div class="group__value">
          {{ transformDate(report.deadline) }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-700">
          {{ $t("pages.reports.reportComment") }}
        </div>
        <div class="group__value">
          {{ transformDate(report.comment) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
    index: {
      type: Number,
    },
    infoItem: {
      type: Object,
    },
    report: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      documents: this.report.documents || [],
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
    };
  },
  methods: {
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
  },
  mounted() {
    console.log(this.report);
  },
};
</script>

<style lang="scss">
.documents__item {
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
