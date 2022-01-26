<template>
  <div class="login-wrapper">
    <div class="login-page">
      <div class="login-page__left">
        <img src="@/assets/icons/building.svg" alt="" />
      </div>
      <div class="login-page__right">
        <div v-if="!isForget" class="login-page__panel panel">
          <div class="panel__inner">
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
                    Оперативно загружать и выгружать новый товар или
                    редактировать уже имеющийся
                  </li>

                  <li>Отслеживать историю заказов клиента</li>

                  <li>
                    Назначать задачи сотрудникам, а так же отслеживать их
                    выполнение
                  </li>

                  <li>Видеть аналитику компании</li>

                  <li>Отслеживать и создавать мероприятия</li>

                  <li>Управлять интернет - магазином</li>

                  <li>Создавать обучение для сотрудников</li>

                  <li>Размещать и управлять вакансиями</li>

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
                  <div class="panel-right__col">
                    <phone-mask-input
                      inputClass="input-login"
                      v-model="login"
                      placeholder="Номер телефона"
                    />
                    <img src="@/assets/icons/phone.svg" alt="" />
                  </div>
                  <div class="panel-right__col">
                    <input
                      type="password"
                      name="password"
                      v-model="password"
                      @change="onChange($event)"
                      :disabled="isFetch"
                      class="input-password"
                      placeholder="Пароль"
                    />
                  </div>
                  <div class="policy">
                    <input type="checkbox" v-model="isPolicy" />
                    <label>
                      Я даю своё согласие на обработку персональных даннных в
                      соответсвиии с политикой конфиденциальности и условиями
                      пользования
                    </label>
                  </div>
                  <v-button :disabled="isFetch" red>Войти</v-button>
                  <span
                    @click="isForget = true"
                    class="panel-right__forgot-password"
                  >
                    Забыли пароль?
                  </span>
                </form>
              </div>
            </div>
            <div class="panel__footer">
              © 2021 - 2022 Все права защищены ООО Торговый дом “ЦСК”
            </div>
          </div>
        </div>

        <!-- Забыли пароль -->
        <div v-else class="panel__right panel-right panel-right--forgot">
          <div class="panel-right__inner">
            <div class="panel-right__logo">
              <img src="@/assets/icons/logo_big.svg" alt="" />
            </div>
            <div class="panel-right__slogan">Отправим пароль по смс!</div>
            <div class="panel-right__slogan-secondary">
              Для получения инструкций по востановлению пароля, введите номер
              телефона, указанный при регистрации
            </div>
            <form class="panel-right__form" @submit.prevent="onSubmitForget">
              <div class="panel-right__col">
                <phone-mask-input
                  inputClass="input-login"
                  v-model="forgotLogin"
                  placeholder="Номер телефона"
                />
                <img src="@/assets/icons/phone.svg" alt="" />
              </div>
              <div class="policy">
                <input type="checkbox" v-model="isPolicy" />
                <label>
                  Я даю своё согласие на обработку персональных даннных в
                  соответсвиии с политикой конфиденциальности и условиями
                  пользования
                </label>
              </div>
              <v-button :disabled="isFetch" red>Отправить</v-button>
              <span
                class="panel-right__forgot-password"
                @click="isForget = false"
              >
                Войти
              </span>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import PhoneMaskInput from "vue-phone-mask-input";

export default {
  data() {
    return {
      login: "",
      password: "",
      forgotLogin: "",
      isForget: false,
      isPolicy: false,
      isFetch: false,
    };
  },
  watch: {
    isForget() {
      this.isPolicy = false;
    },
  },
  components: { VButton, PhoneMaskInput },
  methods: {
    onSubmit() {
      if (!this.isPolicy) {
        this.$toast.error(
          "Вы не дали согласие на обработку персональных данных"
        );
      } else {
        this.isFetch = true;
        this.$store
          .dispatch("login", {
            login: this.getPhoneNumberFormat(this.login),
            password: this.password,
          })
          .then((res) => {
            if (res.status === 200) {
              this.$router.push({ name: "desktop" });
            }
          })
          .catch(() => {
            this.isFetch = false;
          });
      }
    },
    onSubmitForget() {
      if (!this.isPolicy) {
        this.$toast.error(
          "Вы не дали согласие на обработку персональных данных"
        );
      } else {
        this.isFetch = true;
        axios
          .post("/user/resetpass", {
            login: this.getPhoneNumberFormat(this.forgotLogin),
          })
          .then(() => {
            this.$toast.success("Новый пароль отправлен Вам по смс!");
            this.isForget = false;
            this.login = this.forgotLogin;
            this.password = "";
          })
          .catch((err) => {
            if (err.response.status === 404) {
              this.$toast.error("Пользователь не найден!");
            }
          })
          .finally(() => {
            this.isFetch = false;
          });
      }
    },
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
    getPhoneNumberFormat(str) {
      if (!str.length) {
        return null;
      }
      let cleaned = ("" + str).replace(/\D/g, "");

      //Check if the input is of correct length
      let match = cleaned.match(/^(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/);

      if (match) {
        return (
          "+" +
          match[1] +
          " " +
          match[2] +
          " " +
          match[3] +
          " " +
          match[4] +
          " " +
          match[5]
        );
      }

      return null;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

body {
  background-color: #ecd9db;
}

.login-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  background-color: #ecd9db;
  width: 1920px;
  margin: auto;
}

.login-page {
  display: flex;
  align-items: center;
  justify-content: center;

  &__left {
    width: 1020px;
  }

  &__panel {
    width: 791px;
    height: 631px;
  }

  &__right {
    position: relative;
  }
}

.panel {
  &__body {
    display: flex;
    justify-content: space-between;
  }

  &__inner {
    background-color: #e6eef8;
    border-radius: $border-radius;
    padding-right: 10px;
    padding-bottom: 10px;
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
    flex: 1;

    ul {
      li {
        background: url("../../assets/icons/success_red.svg") 0 4px no-repeat;
        padding-left: 23px;
        font-weight: 600;

        & + li {
          margin-top: 20px;
        }
      }
    }
  }

  &__right {
    width: 386px !important;
    height: 496px;
    background-color: $color-white;
    border-radius: $border-radius;

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

  &__forgot-password {
    color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    font-size: 12px;
    text-decoration: underline;
    margin-top: 10px;
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

    input[type="password"],
    input[type="tel"] {
      width: 100%;
      background: linear-gradient(0deg, #e6eef8, #e6eef8), #cfd8dc;
      border-radius: $border-radius;
      border: none;
      box-shadow: none;
      height: 48px;
      color: #90a4ae;
      font-weight: 700;
      padding: 8px 10px;
      outline: none;

      &::placeholder {
        color: #90a4ae;
        font-weight: 700;
      }

      & + input {
        margin-top: 8.52px;
      }
    }

    .policy {
      font-size: 12px;
      font-weight: 600;
      margin-top: 20px;
      margin-bottom: 38px;
      display: flex;

      input[type="checkbox"] {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        min-width: 16px;
        height: 16px;
        background-color: #f5f5f5;
        border-radius: 2px;
        border: 1px solid #d9d9d9;
        cursor: pointer;
        margin-right: 10px;
        position: relative;

        &:checked:after {
          content: "";
          position: absolute;
          background: url("../../assets/icons/check.svg") no-repeat 1px 2px;
          border-radius: 2px;
          z-index: 100;
          width: 16px;
          height: 16px;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }

      label {
        color: rgba(0, 0, 0, 0.3);
        display: flex;
      }
    }
  }

  input[type="text"]:disabled,
  input[type="password"]:disabled {
    opacity: 0.5;
  }

  &__col {
    width: 100%;
    position: relative;

    & + div {
      margin-top: 8.52px;
    }

    img {
      position: absolute;
      right: 9.94px;
      top: 4.94px;
      z-index: 1000;
    }
  }

  &--forgot {
    width: 464px;
    padding: 37.78px 20px 40px 20px;
    background-color: #e6eef8;
    height: 100%;

    .panel-right__inner {
      background-color: $color-white;
      border-radius: $border-radius;
      padding-bottom: 40px;
      padding-left: 21px;
      padding-right: 20px;

      .panel-right__slogan {
        margin-bottom: 10.74px;
      }

      .panel-right__slogan-secondary {
        color: rgba(0, 0, 0, 0.3);
        font-weight: 600;
        margin-bottom: 20.26px;
        line-height: 17px;
      }

      form {
        padding: 0;
      }
    }
  }
}
</style>
