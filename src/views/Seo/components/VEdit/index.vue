<template>
  <div class="list__info list-info seo-list-info">
    <form @submit.prevent="">
      <div class="group__title text--blue">
        {{ $t("pages.seo.editCategory") }}
      </div>
      <div class="group">
        <div class="group__title">{{ $t("pageTitle") }}</div>
        <div class="group__content">
          <input
            type="text"
            class="form-control"
            :placeholder="$t('pageTitle')"
            v-model="title"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("keywords") }}</div>
        <div class="group__content">
          <textarea class="form-textarea" :placeholder="$t('keywords')" />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("pageDescription") }}</div>
        <div class="group__content">
          <vue-editor
            :placeholder="$t('pageDescription')"
            v-model="description"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("metaDescription") }}</div>
        <div class="group__content">
          <textarea
            class="form-textarea"
            :placeholder="$t('metaDescription')"
            v-model="metadescription"
          />
        </div>
      </div>
      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import { VueEditor } from "vue2-editor";

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  components: { VButton, VueEditor },
  computed: {
    title: {
      get: function () {
        return this.item.meta && this.item.meta.title
          ? this.item.meta.title
          : "";
      },
      set: function (title) {
        this.$refs.title.value = title;
        if (!this.item.meta) {
          this.item.meta = {};
        }
        this.item.meta.title = title;
      },
    },
    keywords: {
      get: function () {
        return this.item.meta && this.item.meta.keywords
          ? this.item.meta.keywords
          : "";
      },
      set: function (keywords) {
        this.$refs.keywords.value = keywords;
        if (!this.item.meta) {
          this.item.meta = {};
        }
        this.item.meta.keywords = keywords;
      },
    },
    description: {
      get: function () {
        return this.item && this.item.description ? this.item.description : "";
      },
      set: function (description) {
        this.$refs.description.value = description;
        this.item.description = description;
      },
    },
    metadescription: {
      get: function () {
        return this.item.meta && this.item.meta.description
          ? this.item.meta.description
          : "";
      },
      set: function (metadescription) {
        this.$refs.keywords.metadescription = metadescription;
        if (!this.item.meta) {
          this.item.meta = {};
        }
        this.item.meta.description = metadescription;
      },
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.seo-list-info {
  input,
  textarea {
    font-weight: normal;
  }
  .quillWrapper {
    border-radius: $border-radius;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);
  }
  .ql-container {
    border: 0 !important;
  }
  .ql-toolbar {
    background-color: $color-gray-secondary;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    border: 0 !important;
  }
}
</style>
