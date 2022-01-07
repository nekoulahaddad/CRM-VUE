<template>
  <div class="list__info list-info">
    <div class="list-info__header">
      <div class="list-info__group group">
        <div class="group__title text--blue">
          {{ $t("pages.tasks.taskInfo") }}
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskName") }}
          </div>
          <div class="group__value">{{ task.title }}</div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskAuthor") }}
          </div>
          <div class="group__value">123</div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskDescription") }}
          </div>
          <div class="group__value">123</div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskDocs") }}
          </div>
          <div class="group__value">123</div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskRegion") }}
          </div>
          <div class="group__value">123</div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskStatus") }}
          </div>
          <div class="group__value">123</div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskMark") }}
          </div>
          <div class="group__value">123</div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskCreated") }}
          </div>
          <div class="group__value">123</div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskDeadline") }}
          </div>
          <div class="group__value">123</div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskComment") }}
          </div>
          <div class="group__value">123</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
    },
  },
};
</script>
