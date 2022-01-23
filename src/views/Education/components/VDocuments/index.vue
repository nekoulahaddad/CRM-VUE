<template>
  <div class="list">
    <div
      v-for="document in documents"
      class="list__row list__row--shadow list__row--white"
    >
      <div class="list__columns list__columns--shadow list__columns--white">
        <div class="list__column">{{ document.title }}</div>
        <div class="list__column">
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
                src="@/assets/icons/doc_download_icon.svg"
              />
            </div>
            <div class="table__icon">
              <img
                alt=""
                v-if="role === 'director' && canChanges"
                src="@/assets/icons/trash_icon.svg"
              />
            </div>
          </div>
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

.list {
  margin-top: 10px !important;

  &__columns {
    background-color: $color-white;
    border-radius: $border-radius;
  }
}
</style>
