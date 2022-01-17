<template>
  <div class="page personal-page">
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/personal_title.svg')" alt="" />
      </div>
      <h1 class="page__title">{{ $t("personalArea") }}</h1>
    </div>
    <div class="page__body">
      <div class="personal-area">
        <div class="personal-area__header">
          {{ transformFIO(user) }}, {{ $t("welcome") }}
        </div>
        <div class="personal-area__body">
          <div class="personal-area__column">
            <div class="personal-area__role">
              {{ $t("systemRole") }}
              <strong>{{ transformRole(user.role) }}</strong>
            </div>
            <form action="" class="personal-area__form">
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
                <v-button red>Изменить</v-button>
                <v-button @click="logout" redWhite>Выйти</v-button>
              </div>
            </form>
          </div>
          <div class="personal-area__column">
            <div class="personal-area__settings settings">
              <div class="settings__title">{{ $t("customDesign") }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";
import axios from "@/api/axios";
import { mapMutations } from "vuex";

export default {
  components: { VButton },
  computed: {
    user: {
      get: function () {
        return this.getUserRole();
      },
    },
  },
  data() {
    return {
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
    onPasswordRemind() {
      this.changeStatus(false);
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
          this.changeStatus(true);
        })
        .catch((err) => {
          this.$toast.error(err.response.data.message);
          this.changeStatus(true);
        });
    },
    resetInnerNumber() {
      this.changeStatus(false);
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
      this.$toast.success(this.$t("goodbye"));
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.personal-area {
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
    width: 679px;

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
    position: relative;
    padding-bottom: 10px;

    &__title {
      font-size: 18px;
      font-weight: 700;
    }

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
</style>
