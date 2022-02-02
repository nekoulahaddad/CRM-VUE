<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-task-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Поставить новую задачу
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addTask',
            })
          "
          class="add-task-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-task-row__inner">
      <form>
        <div class="add-task-row__title text--blue">Новая задача</div>
        <div class="group">
          <div class="group__title">Наименование задачи:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите название задачи"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">ФИО исполнителей:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите ФИО сотрудника"
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Отделы:</div>
          <div class="group__content">
            <select class="form-select">
              <option value="all">Все отделы</option>
              <option v-for="department in departments" value="">
                {{ department.title }}
              </option>
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Описание:</div>
          <div class="group__content">
            <textarea
              class="form-textarea"
              placeholder="Введите описание задачи..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Документы:</div>
          <div class="group__content">
            <input
              hidden
              type="file"
              id="document-file"
              multiple
              name="documents"
              @change="fileUpload($event)"
            />
            <label for="document-file"> Загрузить </label>
          </div>
        </div>
        <v-button red>Отправить</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";

export default {
  components: {
    VButton,
  },
  data() {
    return {
      departments: [],
    };
  },
  methods: {
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files;
    },
  },
  mounted() {
    axios({
      url: "/user/getdepartments",
    }).then((res) => {
      this.departments = res.data.departments;
    });
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.add-task-row {
  .list__columns {
    grid-template-columns: 1fr !important;
    .list__column {
      text-align: left;
      font-size: 16px;
    }
  }

  .list__column--title {
    position: relative;
  }

  &__title {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 10px;
  }

  button {
    width: 230px;
    height: 37px;
  }

  &__inner {
    padding: 10px;
  }
  .form-control {
    width: 689px;
  }
  .form-textarea {
    width: 976px;
  }
  &__close {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
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
    cursor: pointer;
    font-weight: bold;
  }
  .form-select {
    width: 401px;
  }
}
</style>
