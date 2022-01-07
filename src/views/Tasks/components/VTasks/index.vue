<template>
  <div>
    <div
      v-for="(task, index) in tasks"
      :key="task.id"
      class="list__row list__row--shadow list__row--white"
      :class="{
        'list__row--opened': infoItem._id === task._id || index === activeIndex,
      }"
    >
      <div class="list__columns list__columns--shadow list__columns--white">
        <div class="list__column list__column--number">
          {{ index + 1 + ($route.params.page - 1) * 15 }}
        </div>
        <div class="list__column text--blue">
          {{ transformFIO(task.initiator) }}
        </div>
        <div class="list__column">
          {{
            task &&
            task.responsible &&
            typeof task.responsible._id !== "undefined"
              ? `Ответственный - ${transformFIO(task.responsible)}`
              : task && task.executor && !Array.isArray(task.executor._id)
              ? transformFIO(task.executor)
              : task && task.executor && task.executor._id[0]
              ? transformFIO({
                  name: task.executor.name[0],
                  surname: task.executor.surname[0],
                  lastname: task.executor.lastname[0],
                })
              : transformFIO(userData)
          }}
        </div>
        <div class="list__column">
          <div class="bg bg--blue-light">
            {{ task.title }}
          </div>
        </div>
        <div class="list__column text--green">
          {{ transformDate(task.creation_date) }}
        </div>
        <div class="list__column text--sapphire">
          {{ transformDate(task.deadline_date) }}
        </div>
        <div
          class="list__column"
          v-html="
            task && task.status ? transformStatus(task.status) : task.status
          "
        ></div>
        <div class="list__column">
          <div class="table__actions">
            <div class="table__icon">
              <template
                v-if="
                  id === task.initiator._id ||
                  id === task.responsible._id ||
                  (task && id === task.executor._id) ||
                  task.executor._id[0]
                "
              >
                <img
                  alt=""
                  src="@/assets/icons/info_icon.svg"
                  v-if="infoItem._id !== task._id"
                  @click="toggleInfo(task)"
                />
                <img
                  alt=""
                  v-else
                  src="@/assets/icons/arrow_top_icon.svg"
                  @click="toggleInfo(task)"
                />
              </template>
              <div class="table__hidden-icon" v-else></div>
            </div>
            <div class="table__icon">
              <template
                v-if="id === task.initiator._id || id === task.responsible._id"
              >
                <img
                  alt=""
                  v-if="index !== activeIndex"
                  src="@/assets/icons/document_icon.svg"
                  @click="getSubTasks(task._id, index)"
                />
                <img
                  alt=""
                  v-else
                  src="@/assets/icons/arrow_top_icon.svg"
                  @click="getSubTasks(task._id, index)"
                />
              </template>
              <div class="table__hidden-icon" v-else></div>
            </div>
            <div class="table__icon">
              <img
                v-if="id === task.initiator._id"
                src="/icons/trash_icon.svg"
                alt=""
              />
              <div class="table__hidden-icon" v-else></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Блок с детальной информацией о задаче -->
      <v-task-info v-if="infoItem._id === task._id" :task="task" />
      <!-- Блок с подзадачами -->
      <v-sub-tasks v-if="index === activeIndex" />
    </div>
  </div>
</template>

<script>
import VTaskInfo from "../VTaskInfo";
import VSubTasks from "../VSubTasks";

export default {
  props: {
    activeIndex: {
      type: Number,
      required: true,
    },
    infoItem: {
      type: Object,
      required: true,
    },
    tasks: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      id: this.$parent.id,
      getSubTasks: this.$parent.getSubTasks,
      toggleInfo: this.$parent.toggleInfo,
    };
  },
  components: {
    VTaskInfo,
    VSubTasks,
  },
};
</script>

<style lang="scss">
.list__columns {
  grid-template-columns: 50px 140px 140px 450px 120px 120px 120px 1fr;
}
.list__header {
  .list__column {
    &:first-child {
      text-align: left;
    }
  }
}
</style>
