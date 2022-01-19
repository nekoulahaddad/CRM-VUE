<template>
  <div class="list__info list-info education-list-info">
    <div class="group">
      <div class="group__title">Описание:</div>
      <div class="group__content">
        {{ editedItem.description }}
      </div>
    </div>

    <v-documents
      :documents="editedItem.documents"
      v-if="editedItem.documents.length"
    />

    <v-button @click="addDocument = true" v-if="!addDocument" red>
      Добавить документ
    </v-button>
    <v-add-document @close="addDocument = false" v-if="addDocument" />
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import VAddDocument from "../VAddDocument";
import VDocuments from "../VDocuments";

export default {
  props: {
    editedItem: {
      type: Object,
      required: true,
    },
  },
  components: { VAddDocument, VButton, VDocuments },
  data() {
    return {
      addDocument: false,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.education-list-info {
  background-color: $color-gray-secondary;
}
</style>
