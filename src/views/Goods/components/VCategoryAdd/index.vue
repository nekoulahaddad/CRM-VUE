<template>
  <div class="list__info list-info category-add-form">
    <form>
      <div class="category-add-form__title text--blue">Создать категорию:</div>

      <div class="group">
        <div class="group__title">Название категории:</div>
        <div class="group__content">
          <input
            required
            class="form-control"
            type="text"
            name="categoryName"
            placeholder="Введите название категории..."
            @input="onChange($event)"
          />
        </div>
      </div>

      <v-button red>Сохранить</v-button>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    onChange(e) {
      this[e.target.name] = e.target.value;
      this.tempViews = [];
    },
    fileUpload(e) {
      const files = e.target.files;
      this[e.target.name] = files[0];
      this[e.target.name + "Url"] = URL.createObjectURL(files[0]);
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.category-add-form {
  &__title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .form-control {
    width: 976px;
  }
  .group__flex {
    display: flex;
    margin-bottom: 10px;

    .group {
      margin-top: 0;

      &__image {
        max-width: 200px;
        min-width: 123px;
        border-radius: $border-radius;
      }
    }
    .group__content {
      width: 280px;
      display: flex;
    }
  }

  &__default-img {
    border: 2px solid rgba(0, 0, 0, 0.3);
    width: 200px;
    height: 140px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.3);
    cursor: pointer;

    img {
      margin-bottom: 10px;
    }
  }
  .actions {
    &__btn {
      width: 33px;
      height: 33px;
      border-radius: $border-radius;
      border: 2px solid rgba(0, 0, 0, 0.3);
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .group__left {
    margin-right: 10px;
  }

  .group__find {
    width: 976px;
    height: 40px;
    border-radius: $border-radius;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    padding: 10px;
    position: relative;

    span {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
    span[role="tooltip"] {
      &:after {
        background-color: $color-black;
        color: $color-white;
        border-radius: $border-radius;
      }
    }

    & + * {
      margin-top: 10px;
    }
  }
}
</style>
