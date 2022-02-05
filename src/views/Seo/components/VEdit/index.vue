<template>
  <div class="list__info list-info seo-list-info">
    <form @submit.prevent="onItemEdit">
      <div class="group__title text--blue">
        {{ $t("pages.seo.editCategory") }}
      </div>
      <div class="group">
        <div class="group__title">{{ $t("pageTitle") }}</div>
        <div class="group__content">
          <input
            required
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
          <textarea
            required
            class="form-textarea"
            v-model="keywords"
            :placeholder="$t('keywords')"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("pageDescription") }}</div>
        <div class="group__content">
          <vue-editor
            required
            placeholder="Введите описание страницы..."
            v-model="description"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">{{ $t("metaDescription") }}</div>
        <div class="group__content">
          <textarea
            required
            class="form-textarea"
            placeholder="Введите мета описание страницы..."
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
import { mapMutations } from "vuex";
import axios from "@/api/axios";

export default {
  props: {
    type: {
      type: String,
      default: () => "",
    },
    item: {
      type: Object,
      required: true,
    },
    region: {
      type: String,
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
        this.item.description = description;
      },
    },
    metadescription: {
      get: function () {
        return this.item.meta && this.item.meta.description
          ? this.item.meta.description
          : "";
      },
      set: function (value) {
        if (!this.item.meta) {
          this.item.meta = {};
        }
        this.item.meta.description = value;
      },
    },
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    onItemEdit() {
      this.changeStatus(false);

      let infoData = {};
      infoData.id = this.item._id;
      infoData.type = this.type;
      infoData.region = this.region;

      if (this.item.meta.title || this.item.meta.title === "") {
        infoData.title = this.item.meta.title;
      }
      if (this.item.description || this.item.description === "") {
        infoData.description = this.item.description.replace(/$nbsp;/g, " ");
      }
      if (this.item.meta.keywords || this.item.meta.keywords === "") {
        infoData.keywords = this.item.meta.keywords;
      }
      if (this.item.meta.description || this.item.meta.description === "") {
        infoData.metadescription = this.item.meta.description;
      }

      axios
        .post("/seo/update/", infoData)
        .then(() => {
          this.$emit("toggleEdit", this.type, this.item);
          this.$toast.success("Элемент успешно изменен!");
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        })
        .finally(() => {
          this.changeStatus(true);
        });
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
  .ql-editor {
    font-size: 14px !important;
  }
  .quillWrapper,
  .form-textarea,
  .form-control {
    width: 967px;
  }
  .ql-editor,
  .ql-container {
    height: auto !important;
  }
}
</style>
