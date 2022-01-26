<template>
  <v-modal :adaptive="true" :minHeight="727" :minWidth="1130" name="addTask">
    <div class="vm--modal__title">
      Поставить задачу
      <img
        @click="$modal.hide('addTask')"
        class="vm--modal__close"
        src="/icons/close_icon.svg"
        alt=""
      />
    </div>
    <div class="vm--modal__inner">
      <div class="vm--modal__subtitle">Новая задача:</div>
      <div class="group">
        <div class="group__title">Наименоване задачи:</div>
        <div class="group__content">
          <input
            class="form-control"
            type="text"
            placeholder="Введите название задачи"
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Введите ФИО сотрудника</div>
        <div class="group__content">
          <input
            class="form-control"
            type="text"
            placeholder="Введите название задачи..."
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Отдел:</div>
        <div class="group__content">
          <select class="form-select" name="department">
            <option v-for="department in departments" :value="department.value">
              {{ department.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="group">
        <div class="group__title">Описание:</div>
        <div class="group__content">
          <textarea
            type="text"
            class="form-textarea"
            placeholder="Введите описание задачи..."
          />
        </div>
      </div>
      <div class="group">
        <div class="group__title">Документы:</div>
        <div class="group__content">
          <div class="group__content">
            <input type="file" id="documents" hidden name="documents" />
            <label for="documents">Загрузить</label>
          </div>
        </div>
      </div>
      <div class="group">
        <div class="group__title">Дедлайн:</div>
        <div class="group__content">
          <datetime
            v-model="date"
            required
            input-class="forms__container--input"
            type="date"
            :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
          />
        </div>
      </div>

      <v-button red>Отправить</v-button>
    </div>
  </v-modal>
</template>

<script>
import VButton from "@/components/VButton";
import { Datetime } from "vue-datetime";

export default {
  props: {
    departments: Array,
  },
  components: {
    VButton,
    datetime: Datetime,
  },
  data() {
    return {
      date: new Date().toISOString(),
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.vm--modal {
  &__subtitle {
    font-weight: 700;
    margin-bottom: 10px;
  }

  &__inner {
    padding-top: 10px;
    padding-bottom: 14px;
  }

  .form-control {
    width: 689px;
  }
  .form-textarea {
    width: 976px;
    min-height: 199px;
  }
  .form-select {
    width: 401px;
  }

  .group {
    &__title {
      font-size: 12px;
    }
  }

  &__close {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  button {
    width: 230px;
  }

  .vdatetime-input {
    width: 330px;
  }

  label[for="documents"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 236px;
    height: 33px;
    font-size: 12px;
    font-weight: 700;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(0, 0, 0, 0.3);
    background-color: $color-white;
    border-radius: $border-radius;
    cursor: pointer;
  }
}
</style>
