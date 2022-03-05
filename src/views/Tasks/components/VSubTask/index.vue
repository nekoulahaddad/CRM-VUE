<template>
  <div class="list__columns list__columns--shadow list__columns--white">
    <div class="list__column list__column--number">
      {{ index + 1 }}
    </div>
    <div class="list__column text--blue">
      {{ transformFIO(task.initiator) }}
    </div>
    <div class="list__column">
      {{ transformFIO(task.executor) }}
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
    <div class="list__column">
      <v-select
        v-if="
          role === 'superadmin' ||
          (role === 'director' &&
            task.status.value === 'completed' &&
            !task.mark)
        "
        style="max-width: 100%"
        :options="[
          { label: 0, value: 0 },
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
          { label: 5, value: 5 },
        ]"
        :reduce="(item) => item.value"
        v-model="task.mark"
        @input="changeTaskMark($event, task._id)"
      />
      <span v-else>{{ task.mark }}</span>
    </div>
    <div
      class="list__column"
      v-html="task && task.status ? transformStatus(task.status) : task.status"
    />

    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip v-if="infoItem._id !== task._id" label="Просмотр">
            <img
              alt=""
              src="@/assets/icons/info_icon.svg"
              @click="$emit('toggleSubInfo', task)"
            />
          </VueCustomTooltip>
          <img
            alt=""
            src="@/assets/icons/arrow_top_icon.svg"
            v-else
            @click="$emit('toggleSubInfo', task)"
          />
        </div>
        <div class="table__icon">
          <VueCustomTooltip v-if="editedItem._id !== task._id" label="Изменить">
            <img
              style="width: 26px"
              @click="$emit('toggleEdit', task)"
              src="@/assets/icons/write_icon.svg"
              alt=""
            />
          </VueCustomTooltip>
          <img
            alt=""
            src="@/assets/icons/arrow_top_icon.svg"
            v-else
            @click="$emit('toggleEdit', task)"
          />
        </div>
        <div class="table__icon">
          <VueCustomTooltip v-if="id === task.initiator._id" label="Удалить">
            <img
              alt=""
              src="/icons/trash_icon.svg"
              @click="$emit('toggleSubDelete', task)"
            />
          </VueCustomTooltip>
          <div class="table__hidden-icon" v-else></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  props: {
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
    editedItem: {
      type: Object,
      required: true,
    },
  },
  computed: {
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
  },
  methods: {
    changeTaskMark(mark, id) {
      let taskData = new FormData();
      taskData.append("taskId", id);
      taskData.append("mark", mark);
      axios({
        url: `/tasks/update`,
        data: taskData,
        method: "POST",
      }).then(() => {
        this.$toast.success("Оценка изменена!");
      });
    },
  },
};
</script>

<style lang="scss">
.sub-tasks {
  font-size: 12px;

  &__title {
    font-weight: 700;
    font-size: 16px;
    padding: 10px;
  }

  .table__icon {
    width: 24px;
    height: 24px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .v-select * {
    width: 100%;
  }
  .vs__actions {
    display: none;
  }
  .vs__dropdown-toggle {
    border: none;
    height: 33px;
  }
  .vs__selected {
    display: flex;
    justify-content: center;
  }
}
</style>
