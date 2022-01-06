<template>
  <div class="login-page">
    <div class="login-page__left">
      <img src="@/assets/icons/building.svg" alt="" />
    </div>
    <div class="login-page__right">
      <div class="login-page__panel panel">
        <div class="panel__header">
          <div class="panel__title">
            Работа в CRM системе ЦСК вам позволяет:
          </div>
        </div>
        <div class="panel__body">
          <div class="panel__left">
            <ul>
              <li>
                Позволяет эффективно работать с заказами / заявками клиентов
              </li>
              <li>
                Оперативно загружать и выгружать новый товар или редактировать
                уже имеющийся
              </li>
              <li>Отслеживать историю заказов клиента</li>
              <li>
                Назначать задачи сотрудникам, а так же отслеживать их выполнение
                Видеть аналитику компании
              </li>
              <li>
                Отслеживать и создавать мероприятия Управлять интернет -
                магазином
              </li>
              <li>
                Создавать обучение для сотрудников Размещать и управлять
                вакансиями
              </li>
              <li>
                Управлять оптимизацией для поисковых систем Yandex и Google
              </li>
              <li>А так же мы постоянно улучшаем наш продукт :)</li>
            </ul>
          </div>
          <div class="panel__right"></div>
        </div>
        <div class="panel__footer">
          © 2021 - 2022 Все права защищены ООО Торговый дом “ЦСК”
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
@import "@/styles/_variables";

body {
  background-color: #ecd9db;
}
.login-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &__panel {
    background-color: #e6eef8;
    border-radius: $border-radius;
    width: 791px;
    height: 631px;
  }
}

.panel {
  &__body {
    display: flex;
    justify-content: space-between;
  }

  &__footer {
    margin-top: 28px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 600;
  }

  &__left {
    margin-left: 27px;
    margin-right: 20px;

    ul {
      li {
        background: url("../assets/icons/success_red.svg") 0 4px no-repeat;
        padding-left: 23px;
        font-weight: 600;

        & + li {
          margin-top: 20px;
        }
      }
    }
  }

  &__right {
    min-width: 386px;
    height: 496px;
    background-color: $color-white;
    border-radius: $border-radius;
    margin-right: 10px;
  }

  &__title {
    font-size: 18px;
    color: $color-red;
    font-weight: 700;
    text-align: center;
    line-height: 21.94px;
    padding-top: 20px;
    padding-bottom: 28px;
  }
}
</style>
