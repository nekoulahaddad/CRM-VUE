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
    <div
      class="list__column"
      v-html="task && task.status ? transformStatus(task.status) : task.status"
    />
    <div class="list__column">
      <div
        v-if="
          role === 'director' && task.status.value === 'completed' && !task.mark
        "
      ></div>
      <span>...</span>
    </div>
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
}
</style>
