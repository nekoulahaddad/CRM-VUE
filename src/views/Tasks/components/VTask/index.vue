<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column list__column--number">
      {{ index + 1 + ($route.params.page - 1) * 15 }}
    </div>
    <div class="list__column text--blue">
      {{ transformFIO(task.initiator) }}
    </div>
    <div class="list__column">
      {{
        task && task.responsible && typeof task.responsible._id !== "undefined"
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
      v-html="task && task.status ? transformStatus(task.status) : task.status"
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
              @click="$emit('toggleInfo', task)"
            />
            <img
              alt=""
              v-else
              src="@/assets/icons/arrow_top_icon.svg"
              @click="$emit('toggleInfo', task)"
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
              @click="$emit('getSubTasks', task._id, index)"
            />
            <img
              alt=""
              v-else
              src="@/assets/icons/arrow_top_icon.svg"
              @click="$emit('getSubTasks', task._id, index)"
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
</template>

<script>
export default {
  props: {
    activeIndex: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    infoItem: {
      type: Object,
      required: true,
    },
    task: {
      type: Object,
      required: true,
    },
  },
};
</script>
