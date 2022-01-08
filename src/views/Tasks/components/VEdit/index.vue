<template>
  <div class="list__edit edit">
    <div class="edit__inner">
      <div class="edit__title text--blue">{{ $t("pages.tasks.taskEdit") }}</div>
      <div class="group">
        <div class="group__title">Наименоване задачи:</div>
        <div class="group__content">
          <input
            class="form-control"
            type="text"
            v-model="task.title"
            placeholder="Введите название задачи..."
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Описание задачи:</div>
        <div class="group__content">
          <textarea
            type="text"
            class="form-textarea"
            v-model="task.description"
            placeholder="Введите описание задачи..."
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Комментарий:</div>
        <div class="group__content">
          <textarea
            type="text"
            class="form-textarea"
            v-model="task.initiator_comment"
            placeholder="Введите комментарий к задаче..."
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Документы</div>
        <div class="group__content">
          <div v-if="task.documents.length" class="list__documents documents">
            <div
              v-for="(photo, index) in task.documents"
              class="documents__item"
              @click.prevent="downloadItem(serverAddr + `${photo}`, photo)"
            >
              {{
                photo.name
                  ? photo.name.length > 30
                    ? photo.name.slice(0, -10) +
                      " ... ." +
                      photo.type.split("/")[1]
                    : photo.name
                  : `Документ ${index + 1}`
              }}
            </div>
          </div>
          <div v-else>Нет документов</div>
        </div>
      </div>
      <div class="group">
        <div class="group__footer">
          <v-button red>Отправить</v-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      date: new Date(),
      title: "",
      description: "",
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
      initiator_comment: "",
      documents: [],
    };
  },
  components: { VButton },
  methods: {
    downloadItem(url, filename) {
      axios
        .get(url, { responseType: "blob" })
        .then((response) => {
          const link = document.createElement("a");
          const blob = new Blob([response.data]);
          let urll = window.URL.createObjectURL(blob);
          link.href = urll;
          link.download = filename;
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

<style lang="scss">
.edit {
  &__inner {
    padding: 10px;
  }

  &__title {
    font-weight: 700;
    margin-bottom: 10px;
  }
  .group__title {
    font-size: 12px;
  }

  .form-control {
    font-weight: 500;

    &::placeholder {
      font-weight: 500;
    }
  }
}
</style>

<style lang="scss">
.list__edit {
  .form-textarea {
    font-weight: 500;
  }
  button {
    width: 230px;
    height: 37px;
  }
}
</style>
