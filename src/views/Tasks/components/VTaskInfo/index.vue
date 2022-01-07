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
          <div class="group__value">
            {{ task.initiator.surname }} {{ task.initiator.name }}
            {{ task.initiator.lastname }}
          </div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskDescription") }}
          </div>
          <div class="group__value">{{ task.description }}</div>
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
          <div class="group__value">{{ task.executor.region.title }}</div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskStatus") }}
          </div>
          <div v-html="transformStatus(task.status)" class="group__value"></div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskMark") }}
          </div>
          <div class="group__value">
            {{ task.mark ? task.mark : "..." }}
          </div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskCreated") }}
          </div>
          <div class="group__value">
            {{ transformDate(task.creation_date) }}
          </div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskDeadline") }}
          </div>
          <div class="group__value">
            {{ transformDate(task.deadline_date) }}
          </div>
        </div>
        <div class="group__content">
          <div class="group__item text--bold-700">
            {{ $t("pages.tasks.taskComment") }}
          </div>
          <div class="group__value">{{ task.initiator_comment }}</div>
        </div>
        <div class="group__footer">
          <v-button
            v-if="
              task.initiator &&
              userId === task.initiator._id &&
              task.executors >= 1
            "
            red
          >
            Выполнена
          </v-button>
          <v-button
            v-if="
              task.executor &&
              (userId === task.executor._id ||
                userId === task.executor._id[0]) &&
              task.status.value === 'assigned'
            "
            red
          >
            Принять
          </v-button>
          <v-button
            v-if="
              task.executor &&
              (userId === task.executor._id ||
                userId === task.executor._id[0]) &&
              task.status.value === 'assigned'
            "
          >
            Отказаться
          </v-button>

          <v-button
            v-if="
              task.executor &&
              (userId === task.executor._id ||
                userId === task.executor._id[0]) &&
              task.status.value === 'accepted'
            "
          >
            На проверку
          </v-button>
          <v-button
            v-if="
              task.initiator &&
              userId === task.initiator._id &&
              task.status.value === 'tested'
            "
          >
            Выполнена
          </v-button>
          <v-button
            v-if="
              task.initiator &&
              userId === task.initiator._id &&
              task.status.value === 'tested'
            "
          >
            На доработку
          </v-button>
          <v-button
            v-if="
              task.executor &&
              (userId === task.executor._id ||
                userId === task.executor._id[0]) &&
              task.status.value === 'under revision'
            "
          >
            На проверку
          </v-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  props: {
    task: {
      type: Object,
    },
  },
  computed: {
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
    userId: {
      get: function () {
        let role = this.getUserRole();
        return role._id;
      },
    },
  },
  components: { VButton },
};
</script>

<style lang="scss">
button {
}
</style>
