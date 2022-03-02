<template>
  <div
    class="list__row list__row--shadow list__row--white list__row--opened add-callback"
  >
    <div class="list__columns list__columns--shadow list__columns--white">
      <div class="list__column list__column--title">
        Добавить обращение

        <img
          @click.prevent="
            $store.commit('toggleAction', {
              key: 'addPurchase',
            })
          "
          class="add-callback__close"
          src="/icons/close_icon.svg"
          alt=""
        />
      </div>
    </div>
    <div class="add-callback__inner">
      <form class="delivery-form" @submit.prevent="">
        <div class="add-callback__title text--blue">Информация о клиенте:</div>

        <div class="d-flex justify-content-between">
          <div class="flex-1" style="margin-right: 25px">
            <div class="group">
              <div class="group__title">Фамилия:</div>
              <div class="group__content"></div>
            </div>
            <div class="group">
              <div class="group__title">
                Имя: <span class="required">*</span>
              </div>
              <div class="group__content"></div>
            </div>
            <div class="group">
              <div class="group__title">Отчество:</div>
              <div class="group__content"></div>
            </div>
            <div class="group">
              <div class="group__title">Телефон:</div>
              <div class="group__content"></div>
            </div>
            <div class="group">
              <div class="group__title">Описание:</div>
              <div class="group__content"></div>
            </div>
          </div>
          <div>
            <div class="group">
              <div class="group__title">
                Регион: <span class="required">*</span>
              </div>
              <div class="group__content">
                <v-select
                  :class="{ 'form-control--error': $v.region.$error }"
                  :options="
                    regions.map((region) => ({
                      label: region.title,
                      value: region,
                    }))
                  "
                  :reduce="(item) => item.value"
                  v-model="$v.region.$model"
                />
              </div>
            </div>
          </div>
        </div>

        <v-button red>Создать</v-button>
      </form>
    </div>
  </div>
</template>

<script>
import { numeric, url, required, email } from "vuelidate/lib/validators";

export default {
  props: {
    regions: Array,
  },
  validations: {
    region: {
      required,
    },
  },
};
</script>

<style lang="scss">
.add-callback {
  &__title {
    position: relative;

    &.text--blue {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 10px;
    }
  }
  &__close {
    cursor: pointer;
    right: 10px;
    top: 13px;
    position: absolute;
  }

  &__inner {
    padding: 10px;
  }
  .list__columns {
    grid-template-columns: 1fr !important;
    .list__column {
      text-align: left !important;
      font-size: 16px;
    }
  }
  button {
    width: 230px;
  }
}
</style>
