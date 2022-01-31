<template>
  <div class="list__info list-info infoItem-list-info">
    <div class="group__title text--blue">Основная информация:</div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">Название:</div>
        <div class="group__value">{{ infoItem.title }}</div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">Руководитель:</div>
        <div class="group__value">
          {{ transformFullFIO(infoItem.leader) || "Не указан" }}
        </div>
      </div>
    </div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-700">Количество сотрудников:</div>
        <div class="group__value">{{ infoItem.count || 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      roles: {
        director: "Директор",
        admin: "Администратор",
        content: "Контент-менеджер",
        manager: "Менеджер по работе с клиентами",
        seo: "SEO-оптимизатор",
        call: "Сотрудник Call - центра",
        worker: "Сотрудник",
        buyer: "Закупщик",
      },
      date: new Date().toString(),
      employment_date: new Date().toString(),
      date_of_birth: new Date().toString(),
      users: [],
      regions: [],
      department: null,
      role: null,
      photoFull: false,
      education: null,
      specialty: null,
      zodiac_sign: null,
      element: null,
      chinese_year: null,
      departments: [],
      children: [],
      avatar: "Выбрать файл",
      passport_photo: ["Выбрать файлы"],
      url: "@/assets/icons/preview.svg",
      serverAddr: process.env.VUE_APP_DEVELOP_URL,
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.infoItem-list-info {
  .group__title {
    position: relative;

    &:not(:first-child) {
      padding-top: 10px;

      &::before {
        display: block;
        content: "";
        position: absolute;
        height: 2px;
        width: 100%;
        top: 0;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }
  }

  img {
    width: 123px;
    height: 123px;
    object-fit: contain;
    margin-left: 10px;
  }

  .d-flex {
    margin-bottom: 10px;
  }
}
</style>
