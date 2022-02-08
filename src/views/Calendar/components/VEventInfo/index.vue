<template>
  <div class="list__info event-info">
    <div class="event-info__title text--blue">Основная информация:</div>
    <div class="list-info__group group">
      <div class="group__content">
        <div class="group__item text--bold-600">Описание:</div>
        <div class="group__value">{{ infoItem.customData.description }}</div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-600">Создатель:</div>
        <div class="group__value">
          {{ transformFIO(infoItem.customData.initiator) }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-600">Участники:</div>
        <div class="group__value">
          <div v-for="participant in infoItem.customData.participants">
            {{ transformFIO(participant._id) }}
          </div>
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-600">Дата начала:</div>
        <div class="group__value">
          {{ transformTime(infoItem.customData.startDate) }}
        </div>
      </div>
      <div class="group__content">
        <div class="group__item text--bold-600">Дата окончания:</div>
        <div class="group__value">
          {{ transformTime(infoItem.customData.endDate) }}
        </div>
      </div>
    </div>
    <div class="event-info__title text--blue">
      Информация о задаче мероприятия:
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoItem: Object,
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.event-info {
  &__title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
    position: relative;

    &:not(:first-child) {
      padding-top: 10px;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: $color-gray-secondary;
        border-radius: $border-radius;
      }
    }
  }
}
</style>
