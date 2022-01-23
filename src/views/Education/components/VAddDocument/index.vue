<template>
  <div class="card card--white add-document-card card--small">
    <form @submit.prevent="onDocumentAdd">
      <div class="card__title card__title--small">
        Добавить документ
        <img
          @click="$emit('close')"
          class="card__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
      <div class="card__group group">
        <div class="group__title">Название документа:</div>
        <div class="group__content">
          <input
            class="form-control"
            type="text"
            placeholder="Введите название..."
            name="title"
            @input="onChange($event)"
          />
        </div>
      </div>
      <div class="card__group group">
        <div class="group__title">Загрузить документ:</div>
        <div class="group__content">
          <input
            type="file"
            id="document-file"
            hidden
            name="document"
            @change="fileUpload($event)"
          />
          <label for="document-file">
            {{ document.name ? document.name : document }}
          </label>
        </div>
      </div>
      <div class="group__actions">
        <v-button red>Сохранить</v-button>
      </div>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  props: {
    education: {
      type: Object,
    },
  },
  components: { VButton },
  data() {
    return {
      document: "Выбрать файл",
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files[0];
      this[e.target.name + "Url"] = URL.createObjectURL(files[0]);
    },
    onDocumentAdd() {
      this.changeStatus(false);
      let documentData = new FormData();
      documentData.append("educationId", this.education._id);
      documentData.append("title", this.title);
      if (this.document !== "Выбрать файл") {
        documentData.append("document", this.document);
      } else {
        this.$toast.error("Необходимо добавить документ!");
        this.changeStatus(true);
        return;
      }

      axios({
        url: "/educations/upload/",
        data: documentData,
        method: "POST",
      })
        .then(() => {
          this.$emit("success");
          this.$toast.success("Документ успешно загружен!");
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
        });
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.card {
  padding-top: 10px;
  padding-bottom: 15px;

  &__close {
    position: absolute;
    right: 0;
    top: 6px;
    cursor: pointer;
  }

  &__title {
    position: relative;
    padding-bottom: 0;
  }

  .group {
    & + * {
      margin-top: 10px;
    }
  }

  .group__actions {
    margin-top: 10px;

    .btn {
      width: 230px;
      font-size: 16px;
      height: 37px;
    }
  }

  .group__title {
    font-weight: 600;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 230px;
    height: 37px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(0, 0, 0, 0.3);
    background-color: $color-white;
    border-radius: $border-radius;
    color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
}
</style>
