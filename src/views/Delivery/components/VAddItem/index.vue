<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-delivery-row"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Добавить поставщика
        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addDelivery',
            })
          "
          class="add-delivery-row__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-delivery-row__inner">
      <form @submit.prevent="">
        <div class="add-delivery-row__title text--blue">
          Основная информация о поставщике:
        </div>
        <div class="group">
          <div class="group__title">Название компании:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите название о компании..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Сайт:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Вставьте ссылку на сайт..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">ИНН:</div>
          <div class="group__content">
            <input class="form-control" type="text" placeholder="Введите ИНН" />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Адрес офиса:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите адрес офиса..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Адрес склада:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите адрес склада..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Регион:</div>
          <div class="group__content">
            <select class="form-select">
              <option
                v-for="region in regions"
                :key="region._id"
                :value="region._id"
              >
                {{ region.title }}
              </option>
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Статус поставщика:</div>
          <div class="group__content">
            <select class="form-select">
              <option>Выберите статус</option>
            </select>
          </div>
        </div>
        <div class="group">
          <div class="group__title">Вариант поставки:</div>
          <div class="group__content">
            <select class="form-select">
              <option>Выберите вариант поставки</option>
            </select>
          </div>
        </div>
        <div class="add-delivery-row__title text--blue">Директор:</div>
        <div class="group">
          <div class="group__title">ФИО:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите ФИО..."
            />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Дата рождения:</div>
          <div class="group__content"></div>
        </div>
        <div class="group">
          <div class="group__title">Телефон:</div>
          <div class="group__content">
            <input class="form-control" type="text" placeholder="" />
          </div>
        </div>
        <div class="group">
          <div class="group__title">Email:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите email"
            />
          </div>
        </div>
        <div class="add-delivery-row__title text--blue">Мессенджеры:</div>
        <v-button red>Добавить</v-button>
        <div class="add-delivery-row__title text--blue">Категории:</div>
        <div class="group">
          <div class="group__title">Категории:</div>
          <div class="group__content">
            <input
              class="form-control"
              type="text"
              placeholder="Введите название категории..."
            />
          </div>
        </div>
        <v-button red>Сохранить</v-button>
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
@import "@/styles/_variables";

.add-delivery-row {
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
    position: relative;
    padding-top: 10px;

    & + * {
      margin-bottom: 15px;
    }

    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      display: block;
      height: 2px;
      border-radius: $border-radius;
      background-color: $color-gray-secondary;
    }
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
}
</style>
