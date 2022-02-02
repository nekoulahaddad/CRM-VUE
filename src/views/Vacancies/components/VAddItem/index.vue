<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-vacancy-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Новая вакансия
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addVacancy',
            })
          "
          class="add-vacancy-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-vacancy-row__inner">
      <form @submit.prevent="">
        <div class="add-vacancy-row__title text--blue">
          Основная информация:
        </div>
        <div class="group">
          <div class="group__title">Должность:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите должность..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Требования:</div>
          <div class="group__content">
            <textarea
              class="form-textarea"
              placeholder="Введите требования для кандидата..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Обязаности:</div>
          <div class="group__content">
            <textarea
              class="form-textarea"
              placeholder="Введите обязаности кандидата..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Условия:</div>
          <div class="group__content">
            <textarea
              class="form-textarea"
              placeholder="Опишите условия работы..."
            />
          </div>
        </div>
        <v-button red>Создать</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  components: { VButton },
};
</script>

<style lang="scss">
.add-vacancy-row {
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
}
</style>
