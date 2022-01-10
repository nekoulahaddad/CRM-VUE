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
          <div class="personal-area__role">
            {{ $t("systemRole") }}
            <strong>{{ transformRole(user.role) }}</strong>
          </div>
          <form action="" class="personal-area__form">
            <div class="personal-area__col">
              <label>Старый пароль:</label>
              <input
                type="text"
                class="form-control"
                placeholder="Введите старый пароль"
              />
            </div>
            <div class="personal-area__col">
              <label>Новый пароль:</label>
              <input
                type="text"
                class="form-control"
                placeholder="Введите новый пароль"
              />
            </div>
            <div class="personal-area__buttons">
              <v-button red>Изменить</v-button>
              <v-button redWhite>Выйти</v-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  components: { VButton },
  computed: {
    user: {
      get: function () {
        return this.getUserRole();
      },
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
}
</style>
