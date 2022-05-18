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
        <div class="group__documents" v-if="documents.length">
          <div
            class="group__document"
            v-for="(document, index) in documents"
            :key="index"
          >
            <span>{{ document.name }}</span>
            <img
              alt=""
              src="@/assets/icons/trash_icon.svg"
              @click="deleteDocument(index)"
            />
          </div>
        </div>
        <div class="group__empty-documents" v-else>Документов нет</div>
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
          <label for="document-file">Выберите файлы</label>
        </div>
      </div>
      <div class="group__actions">
        <v-button v-if="!start" red>Сохранить</v-button>
        <div v-else class="d-flex align-items-center">
          <v-spinner small />
          <span class="upload-progress"> {{ uploadProgress }}% </span>
        </div>
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
      documents: [],
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      uploadProgress: 0,
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
    deleteDocument(index) {
      this.documents = Array.from(this.documents).filter((doc, i) => {
        if (i !== index) {
          return doc;
        }
      });
    },
    onDocumentAdd() {
      let documentData = new FormData();
      documentData.append("educationId", this.education._id);

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
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: (progressEvent) => {
          this.uploadProgress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        },
      })
        .then(() => {
          this.$emit("success");
          this.$toast.success("Документ успешно загружен!");
        })
        .catch((err) => {
          //this.start = false;
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
    margin-bottom: 5px;
  }

  .group {
    & + * {
      margin-top: 10px;
    }

    &__empty-documents {
      margin-bottom: 10px;
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
  .group__documents {
    display: flex;
    width: 850px;
    flex-wrap: wrap;
  }
  .group__document {
    width: 401px;
    display: flex;
    justify-content: space-between;
    height: 33px;
    box-shadow: 0 0 5px rgb(0 0 0 / 20%);
    border-radius: $border-radius;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 10px;
    margin-right: 10px;

    span {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding-right: 30px;
    }
  }
  .upload-progress {
    margin-left: 12px;
    color: #db1f35;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
