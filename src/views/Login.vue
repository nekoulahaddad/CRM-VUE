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
          <div class="panel__right panel-right">
            <div class="panel-right__logo">
              <img src="@/assets/icons/logo_big.svg" alt="" />
            </div>
            <div class="panel-right__slogan">
              Вместе мы сможем стать <span class="text--red">лучше!</span>
            </div>
            <form class="panel-right__form" @submit.prevent="onSubmit">
              <input
                type="text"
                name="login"
                v-model="login"
                @change="onChange($event)"
                v-maska="['+# ### ### ## ##', '+### ### ## ## ##', 'a*']"
                :disabled="isFetch"
                placeholder="Номер телефона"
              />
              <input
                type="text"
                name="password"
                v-model="password"
                @change="onChange($event)"
                :disabled="isFetch"
                placeholder="Пароль"
              />
              <v-button red>Войти</v-button>
            </form>
          </div>
        </div>
        <div class="panel__footer">
          © 2021 - 2022 Все права защищены ООО Торговый дом “ЦСК”
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  data() {
    return {
      login: "",
      password: "",
      forgotLogin: "",
      isForget: false,
      isFetch: false,
    };
  },
  components: { VButton },
  methods: {
    onSubmit(e) {
      this.isFetch = true;
      this.$store
        .dispatch("login", {
          login: this.login,
          password: this.password,
        })
        .then((res) => {
          if (res.status === 200) {
            this.$router.push({ name: "monitor" });
          }
        })
        .catch(() => {
          this.isFetch = false;
        });
    },
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
  },
};
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

    button {
      width: 230px;
      height: 37px;
      box-shadow: -4px -4px 12px rgba(253, 255, 255, 0.8),
        4px 4px 12px rgba(187, 195, 206, 0.6);
    }
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

.panel-right {
  &__logo {
    text-align: center;
    padding-top: 17px;
    padding-bottom: 10px;
  }

  &__slogan {
    letter-spacing: 1px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 29px;
  }

  &__form {
    padding-left: 7px;
    padding-right: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;

    input[type="text"] {
      background: linear-gradient(0deg, #e6eef8, #e6eef8), #cfd8dc;
      border-radius: $border-radius;
      border: none;
      box-shadow: none;
      height: 48px;
      color: #90a4ae;
      font-weight: 700;

      &::placeholder {
        color: #90a4ae;
        font-weight: 700;
      }

      & + input {
        margin-top: 8.52px;
      }
    }
  }
}
</style>
