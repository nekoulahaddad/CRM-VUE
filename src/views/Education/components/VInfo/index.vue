<template>
  <div class="list__info list-info education-list-info">
    <div class="group">
      <div class="group__title">Описание:</div>
      <div class="group__content">
        <span class="word-break">{{ infoItem.description }}</span>
      </div>
    </div>

    <div class="group">
      <div class="group__title">Документы:</div>
      <v-documents
        :documents="infoItem.documents"
        v-if="infoItem.documents.length"
        :infoItem="infoItem"
        @deleteDocument="deleteDocument"
      />
      <div v-else>Документов нет</div>
    </div>

    <v-button
      @click="addDocument = true"
      v-if="!addDocument && canChanges && role === 'superadmin'"
      red
    >
      Добавить документ
    </v-button>
    <v-add-document
      :education="infoItem"
      @close="addDocument = false"
      v-if="addDocument"
      @success="successUpload"
    />
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import VAddDocument from "../VAddDocument";
import VDocuments from "../VDocuments";

export default {
  props: {
    infoItem: {
      type: Object,
      required: true,
    },
  },
  components: { VAddDocument, VButton, VDocuments },
  data() {
    return {
      addDocument: false,
      typeE: "crm",
      filtersOptions: {},
      activeIndex: -1,
      add: false,
      edit: false,
      deleteEducationForm: false,
      upload: false,
      deletedItem: {},
      educationsArr: [],
      uploadedItem: {},
      deletedDocument: {},
      whoCanDoChanges: ["Якубовский", "Евдокимова", "Аракелов", "Марценюк"],
    };
  },
  computed: {
    canChanges: {
      get: function () {
        return this.whoCanDoChanges.some((v) => v === this.userLastName.trim());
      },
    },
    userLastName: {
      get: function () {
        return this.getUserRole().surname;
      },
    },
  },
  methods: {
    deleteDocument(document) {
      this.$emit("toggleDeleteDocument", document);
    },
    successUpload() {
      this.addDocument = false;
      this.$emit("refreshEducations");
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.education-list-info {
  background-color: $color-gray-secondary;
}
</style>
