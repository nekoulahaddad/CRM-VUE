<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-department-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Добавить отдел
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addVacancy',
            })
          "
          class="add-department-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-department-row__inner">
      <form @submit.prevent="">
        <div class="add-department-row__title text--blue">
          Основная информация:
        </div>
        <div class="card__group group">
          <div class="group__title">Название:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите название отдела..."
            />
          </div>
        </div>
        <div class="card__group group">
          <div class="group__title">Руководитель:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введи имя руководителя..."
            />
          </div>
        </div>
        <v-button red>Сохранить</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import VEmployeeForm from "../VEmployeeForm";
import VButton from "@/components/VButton";

export default {
  components: { VEmployeeForm, VButton },
};
</script>

<style lang="scss">
.add-department-row {
  .list__columns {
    grid-template-columns: 1fr !important;

    .list__column {
      text-align: left !important;
      padding-left: 0 !important;
      position: relative;
    }
  }

  .list__column--title {
    font-size: 16px !important;
  }

  &__inner {
    padding: 10px;
  }

  &__close {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  &__title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 10px;
  }

  button {
    width: 230px;
    height: 37px;
  }
  .form-select {
    width: 401px;
  }

  .form-textarea,
  .form-control {
    width: 689px;
  }
}
</style>
