<template>
  <div class="card card--white add-document-card card--small">
    <form @submit.prevent="onDocumentAdd">
      <div class="card__title card__title--small">
        Добавить документы:
        <img
          @click="$emit('close')"
          class="card__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
      <div class="card__group group">
        <div class="group__document" v-if="documents.length">
          {{ documents }}
        </div>
        <div class="group__content">
          <input
            hidden
            type="file"
            multiple
            id="document-file"
            :disabled="start"
            name="documents"
            @change="fileUpload($event)"
          />
          <label for="document-file"> Выбрать файл </label>
        </div>
      </div>
      <div class="group__actions">
        <v-button v-if="!start" red>Сохранить</v-button>
        <v-spinner small v-else />
      </div>
    </form>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import VSpinner from "@/components/VSpinner";
import { mapMutations } from "vuex";

export default {
  props: {
    education: {
      type: Object,
    },
  },
  components: { VButton, VSpinner },
  data() {
    return {
      start: false,
      documents: "Выбрать файл",
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
      this[e.target.name] = files;
    },
    onDocumentAdd() {
      this.changeStatus(false);
      let documentData = new FormData();
      documentData.append("educationId", this.education._id);
      //documentData.append("title", this.title);
      console.log(this.documents);
      if (this.documents.length) {
        for (let i = 0; i < this.documents.length; i++) {
          documentData.append("document", this.documents[i]);
        }
      } else {
        this.$toast.error("Необходимо добавить документ!");
        return;
      }

      this.start = true;

      axios({
        url: "/educations/upload/",
        data: documentData,
        method: "POST",
      })
        .then(() => {
          this.$emit("success");
          this.$toast.success("Документ успешно загружен!");
        })
        .catch((err) => {
          this.start = false;
          this.$toast.error(err.response.data.message);
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
  .group__document {
    margin-bottom: 10px;
  }
}
</style>
