<template>
  <div class="group__documents education-documents">
    <div
      v-for="(document, index) in documents"
      :key="index"
      class="group__document"
    >
      <span>{{ document.title }}</span>
      <div class="table__actions">
        <div class="table__icon">
          <img
            alt=""
            @click="
              downloadItem(
                document.path + document.document,
                document.document,
                document.title
              )
            "
            class="download-icon"
            src="@/assets/icons/doc_download_icon.svg"
          />
        </div>
        <div class="table__icon">
          <img
            alt=""
            v-if="(role === 'superadmin' || role === 'director') && canChanges"
            src="@/assets/icons/trash_icon.svg"
            @click="$emit('deleteDocument', document)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  props: {
    documents: {
      type: Array,
      required: true,
    },
    infoItem: {
      type: Object,
      required: true,
    },
  },
  computed: {
    role: {
      get: function () {
        return this.getUserRole().role;
      },
    },
    userLastName: {
      get: function () {
        return this.getUserRole().surname;
      },
    },
    canChanges: {
      get: function () {
        return this.whoCanDoChanges.some(
          (v) => v === this.userLastName?.trim()
        );
      },
    },
  },
  data() {
    return {
      typeE: "crm",
      filtersOptions: {},
      activeIndex: -1,
      add: false,
      edit: false,
      deleteEducationForm: false,
      deleteDocument: false,
      upload: false,
      editedItem: {},
      deletedItem: {},
      educationsArr: [],
      uploadedItem: {},
      deletedDocument: {},
      whoCanDoChanges: ["Якубовский", "Евдокимова", "Аракелов", "Марценюк"],
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    downloadItem(url, filename, title) {
      axios
        .get(url, { responseType: "blob" })
        .then((response) => {
          const link = document.createElement("a");
          const blob = new Blob([response.data]);
          let splitedName = filename.split(".");
          let extension = splitedName[splitedName.length - 1];
          let urll = window.URL.createObjectURL(blob);
          link.href = urll;
          link.download = title + "." + extension;
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
};
</script>

<style lang="scss" scoped>
@import "@/styles/_variables";

.education-documents {
  .group__document {
    display: flex;
    justify-content: space-between;
    height: 48px;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);
    border-radius: $border-radius;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    background-color: $color-white;
    margin-bottom: 10px;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-weight: 700;
    }
  }
}
</style>
