<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-order-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Добавить новый заказ
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addOrder',
            })
          "
          class="add-order-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-order-row__inner">
      <form @submit.prevent="">
        <div class="add-order-row__title text--blue">Заказ:</div>
        <div class="group">
          <div class="group__title">Лицо заказа:</div>
          <div class="group__content">
            <select class="form-select">
              <option value="physical">Физическое лицо</option>
              <option value="legal">Юридическое лицо</option>
            </select>
          </div>
        </div>
        <div class="add-order-row__title text--blue">Профиль:</div>
        <div class="group">
          <div class="group__title">Фамилия:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите фамилию..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Имя:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите имя..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Отчество:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите отчество..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Почта:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите почту..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Телефон:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите телефон..."
            />
          </div>
        </div>
        <div class="add-order-row__title text--blue">Основная информация:</div>
        <div class="group">
          <div class="group__title">Способ оплаты:</div>
          <div class="group__content">
            <select class="form-select">
              <option value="">Выберите способ оплаты</option>
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Способ доставки:</div>
          <div class="group__content">
            <select class="form-select">
              <option value="">Выберите способ доставки</option>
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Регион:</div>
          <div class="group__content">
            <select class="form-select">
              <option value=""></option>
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Адрес доставки:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите город..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите улицу..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите дом..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите здание..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите квартиру..."
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
.add-order-row {
  .list__columns {
    grid-template-columns: 1fr !important;

    .list__column {
      text-align: left !important;
      padding-left: 0 !important;
      position: relative;
    }
  }

  .list__column--title {
    font-size: 16px;
  }

  &__inner {
    padding: 10px;
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

  &__close {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  &__inner {
    padding: 10px;
  }
  .form-control {
    width: 976px;
  }
  .form-select {
    width: 401px;
  }
}
</style>
