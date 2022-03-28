<template>
  <div class="page personal-page">
    <v-page-header
      :title="$t('personalArea')"
      icon="personal_title"
      :filterToggle="false"
    />
    <div class="page__body">
      <div class="personal-area">
        <img
          class="personal-area__bg"
          src="@/assets/icons/personal_man.svg"
          alt=""
        />
        <div class="personal-area__header">
          {{ transformFIO(user) }}, {{ $t("welcome") }}
        </div>
        <div class="personal-area__body">
          <div class="personal-area__column">
            <div class="personal-area__role">
              {{ $t("systemRole") }}
              <strong>{{ transformRole(user.role) }}</strong>
            </div>
            <form @submit.prevent class="personal-area__form">
              <div class="personal-area__col">
                <label>Старый пароль:</label>
                <input
                  type="text"
                  required
                  class="form-control"
                  placeholder="Введите старый пароль"
                  name="oldPassword"
                  v-model="oldPassword"
                />
              </div>
              <div class="personal-area__col">
                <label>Новый пароль:</label>
                <input
                  type="text"
                  required
                  class="form-control"
                  placeholder="Введите новый пароль"
                  name="newPassword"
                  v-model="newPassword"
                />
              </div>
              <div class="personal-area__buttons">
                <v-button @click="onPasswordRemind" red>Изменить</v-button>
                <a href="#" @click.prevent="logout" class="logout">Выйти</a>
              </div>
            </form>
          </div>
          <div class="personal-area__column">
            <div class="column__title">Иформация о ролях в системе:</div>
            <div class="list">
              <!-- 1. Суперадмин -->
              <div
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened': openedRoles.includes('superadmin'),
                }"
              >
                <div class="list__columns">
                  <div class="list__column">1. Суперадмин:</div>
                  <div class="list__column">
                    <div class="table__action">
                      <div class="table__icon">
                        <img
                          @click="toggleOpenedRole('superadmin')"
                          :src="
                            openedRoles.includes('superadmin')
                              ? require('@/assets/icons/arrow_top_icon.svg')
                              : require('@/assets/icons/arrow_down_icon.svg')
                          "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="list__info"
                  v-if="openedRoles.includes('superadmin')"
                >
                  <img src="@/assets/images/superadmin.jpeg" alt="" />
                </div>
              </div>

              <!-- 2. Директор -->
              <div
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened': openedRoles.includes('director'),
                }"
              >
                <div class="list__columns">
                  <div class="list__column">2. Директор:</div>
                  <div class="list__column">
                    <div class="table__action">
                      <div class="table__icon">
                        <img
                          @click="toggleOpenedRole('administrator')"
                          :src="
                            openedRoles.includes('administrator')
                              ? require('@/assets/icons/arrow_top_icon.svg')
                              : require('@/assets/icons/arrow_down_icon.svg')
                          "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="list__info"
                  v-if="openedRoles.includes('administrator')"
                >
                  <img src="@/assets/images/director.jpeg" alt="" />
                </div>
              </div>

              <!-- 3. Менеджер по продажам -->
              <div
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened': openedRoles.includes('manager'),
                }"
              >
                <div class="list__columns">
                  <div class="list__column">3. Менеджер по продажам:</div>
                  <div class="list__column">
                    <div class="table__action">
                      <div class="table__icon">
                        <img
                          @click="toggleOpenedRole('manager')"
                          :src="
                            openedRoles.includes('manager')
                              ? require('@/assets/icons/arrow_top_icon.svg')
                              : require('@/assets/icons/arrow_down_icon.svg')
                          "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="list__info" v-if="openedRoles.includes('manager')">
                  <img src="@/assets/images/manager.jpeg" alt="" />
                </div>
              </div>

              <!-- 4. Контент - менеджер -->
              <div
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened': openedRoles.includes('content'),
                }"
              >
                <div class="list__columns">
                  <div class="list__column">4. Контент - менеджер:</div>
                  <div class="list__column">
                    <div class="table__action">
                      <div class="table__icon">
                        <img
                          @click="toggleOpenedRole('content')"
                          :src="
                            openedRoles.includes('content')
                              ? require('@/assets/icons/arrow_top_icon.svg')
                              : require('@/assets/icons/arrow_down_icon.svg')
                          "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="list__info" v-if="openedRoles.includes('content')">
                  <img src="@/assets/images/content.jpeg" alt="" />
                </div>
              </div>

              <!-- 5. SEO -->
              <div
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened': openedRoles.includes('seo'),
                }"
              >
                <div class="list__columns">
                  <div class="list__column">5. SEO:</div>
                  <div class="list__column">
                    <div class="table__action">
                      <div class="table__icon">
                        <img
                          @click="toggleOpenedRole('seo')"
                          :src="
                            openedRoles.includes('seo')
                              ? require('@/assets/icons/arrow_top_icon.svg')
                              : require('@/assets/icons/arrow_down_icon.svg')
                          "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="list__info" v-if="openedRoles.includes('seo')">
                  <img src="@/assets/images/seo.jpeg" alt="" />
                </div>
              </div>

              <!-- 6. Call - центр -->
              <div
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened': openedRoles.includes('call'),
                }"
              >
                <div class="list__columns">
                  <div class="list__column">6. Call - центр:</div>
                  <div class="list__column">
                    <div class="table__action">
                      <div class="table__icon">
                        <img
                          @click="toggleOpenedRole('call')"
                          :src="
                            openedRoles.includes('call')
                              ? require('@/assets/icons/arrow_top_icon.svg')
                              : require('@/assets/icons/arrow_down_icon.svg')
                          "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="list__info" v-if="openedRoles.includes('call')">
                  <img src="@/assets/images/call.jpeg" alt="" />
                </div>
              </div>

              <!-- 7. Закупщик -->
              <div
                class="list__row list__row--shadow list__row--white"
                :class="{
                  'list__row--opened': openedRoles.includes('buyer'),
                }"
              >
                <div class="list__columns">
                  <div class="list__column">7. Закупщик:</div>
                  <div class="list__column">
                    <div class="table__action">
                      <div class="table__icon">
                        <img
                          @click="toggleOpenedRole('buyer')"
                          :src="
                            openedRoles.includes('buyer')
                              ? require('@/assets/icons/arrow_top_icon.svg')
                              : require('@/assets/icons/arrow_down_icon.svg')
                          "
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="list__info" v-if="openedRoles.includes('buyer')">
                  <img src="@/assets/images/buyer.jpeg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import VPageHeader from "@/components/VPageHeader";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: { VButton, VPageHeader },
  computed: {
    user: {
      get: function () {
        return this.getUserRole();
      },
    },
  },
  data() {
    return {
      openedRoles: [],
      oldPassword: "",
      newPassword: "",
      inner_number:
        this.$store.state && this.$store.state.inner_number
          ? this.$store.state.inner_number
          : "",
    };
  },
  methods: {
    ...mapMutations({
      changeStatus: "change_load_status",
    }),
    toggleOpenedRole(role) {
      if (this.openedRoles.includes(role)) {
        this.openedRoles = this.openedRoles.filter((item) => item !== role);
      } else {
        this.openedRoles.push(role);
      }
    },
    onPasswordRemind() {
      axios({
        url: `/user/remind/`,
        data: {
          userId: this.$store.state.id,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          inner_number: this.inner_number,
        },
        method: "POST",
      })
        .then(async () => {
          this.$toast.success("Пароль успешно изменен!");
          this.oldPassword = "";
          this.newPassword = "";
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
        });
    },
    resetInnerNumber() {
      axios({
        url: `/user/number/`,
        data: {
          userId: this.$store.state.id,
          inner_number: this.inner_number,
        },
        method: "POST",
      })
        .then(async () => {
          this.$toast.success("Внутрненний успешно изменен!");
          this.oldPassword = "";
          this.newPassword = "";
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
        });
    },
    logout() {
      if (
        this.role === "admin" ||
        this.role === "director" ||
        this.role === "manager"
      ) {
        this.$socket.client.emit("leftRoomOrders", {
          userId: this.$store.state.id,
        });
        this.$socket.client.emit("leftRoomCallbacks", {
          userId: this.$store.state.id,
        });
      }
      this.$store.dispatch("logout");
      location.href = "/";
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.personal-area {
  width: 1591px;
  position: relative;
  overflow: hidden;

  a.logout {
    width: 230px;
    height: 37px;
    color: #db1f35;
    border: 2px solid #db1f35;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 700;
    margin-left: 10px;
  }

  &__bg {
    position: absolute;
    bottom: -1px;
    right: -120px;
  }

  .column {
    &__title {
      font-size: 18px;
      font-weight: 600;
      margin-top: 30px;
      margin-bottom: 10px;
    }
  }

  .list {
    width: 740px;
    &__info {
      display: flex;
      flex-wrap: wrap;
      padding: 0;
      box-shadow: 0 0 5px rgb(0 0 0 / 20%);
    }
    &__item {
      width: 20%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      position: relative;

      &:before {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 7px;
        width: 2px;
        height: 24px;
        background-color: $color-red;
      }

      &:last-child:before,
      &:nth-child(5n):before {
        display: none;
      }

      img {
        margin-right: 10px;
        height: 24px;
      }
      span {
        font-size: 14px;
        font-weight: 600;
      }
    }
    &__columns {
      display: flex;
      justify-content: space-between;
    }
    &__column {
      padding-right: 5px;
      height: 42px;
      display: flex;
      align-items: center;

      &:first-child {
        text-align: left;
      }
    }
  }

  &__header {
    background-color: $color-gray-secondary;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    height: 56px;
    line-height: 56px;
    padding-left: 20px;
    padding-right: 20px;
    font-weight: 700;
    font-size: 18px;
  }

  &__body {
    background-color: $color-white;
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    padding: 20px;
  }

  &__role {
    font-size: 18px;
    margin-bottom: 10px;
  }

  &__form {
    width: 469px;

    label {
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 10px;
      display: block;
    }
  }

  &__col {
    margin-bottom: 10px;
  }

  &__buttons {
    display: flex;

    button {
      width: 230px;
      height: 37px;

      & + button {
        margin-left: 19px;
      }
    }
  }

  .settings {
    margin-top: 20px;
    width: 355px;

    &__title {
      font-size: 18px;
      font-weight: 700;
      padding-bottom: 10px;
      position: relative;

      &::after {
        content: "";
        display: block;
        border-radius: $border-radius;
        background-color: $color-gray-secondary;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 2px;
        position: absolute;
      }
    }
  }

  .settings-item {
    &__content {
      display: flex;
      justify-content: space-between;
      padding: 10px;
    }

    &__title {
      font-size: 16px;
      padding: 10px;
      position: relative;

      &::after {
        content: "";
        display: block;
        border-radius: $border-radius;
        background-color: $color-gray-secondary;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 2px;
        position: absolute;
      }
    }

    &__label {
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 16px;
    }

    &__radio {
      width: 24px;
      height: 24px;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      border: 2px solid #979797;
      border-radius: 50%;
      position: relative;
      margin-right: 10px;

      &:checked {
        border: 6px solid $color-red;
      }
    }
  }
}
</style>
