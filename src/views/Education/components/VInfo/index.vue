<template>
  <div class="list__info list-info education-list-info">
    <div class="group__title text--blue">123</div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">123</div>
        <div class="group__value">223</div>
      </div>
    </div>
    <v-button @click="addDocument = true" v-if="!addDocument" red>
      Добавить документ
    </v-button>
    <v-add-document @close="addDocument = false" v-if="addDocument" />
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import VAddDocument from "../VAddDocument";

export default {
  components: { VAddDocument, VButton },
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
