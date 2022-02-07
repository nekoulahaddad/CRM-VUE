<template>
  <div class="list__columns list__columns-shadow list__columns-white">
    <div class="list__column text--blue">
      {{
        `${employee.surname} ${employee.name.charAt(0)}.${
          employee.lastname ? employee.lastname.charAt(0) + "." : ""
        }`
      }}
    </div>
    <div class="list__column">
      {{
        employee.region.title.length > 15
          ? employee.region.title.slice(0, -14) + "..."
          : employee.region.title
      }}
    </div>
    <div class="list__column">
      <div class="bg bg--blue-light">{{ employee.position }}</div>
    </div>
    <div
      v-html="transformRating(employee.rating)"
      class="list__column text text--green"
    />
    <div class="list__column text--sapphire">
      {{ employee.tasks.length }}
    </div>
    <div class="list__column">
      <div class="bg bg--green-light">
        {{ employee.department.title }}
      </div>
    </div>
    <div class="list__column">
      <div class="table__actions">
        <div class="table__icon">
          <VueCustomTooltip
            v-if="employee._id !== infoItem._id"
            label="Просмотр"
          >
            <img
              alt=""
              src="@/assets/icons/info_icon.svg"
              @click="$emit('toggleInfo', employee)"
            />
          </VueCustomTooltip>
          <img
            alt=""
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleInfo', employee)"
            v-else
          />
        </div>
        <div class="table__icon">
          <template
            v-if="
              role === 'superadmin' || role === 'director' || options.userEditor
            "
          >
            <VueCustomTooltip
              v-if="employee._id !== editedItem._id"
              label="Изменить"
            >
              <img
                alt=""
                src="@/assets/icons/write_icon.svg"
                @click="$emit('toggleEdit', employee)"
              />
            </VueCustomTooltip>
            <img
              alt=""
              src="@/assets/icons/arrow_top_icon.svg"
              @click="$emit('toggleEdit', employee)"
              v-else
            />
          </template>
          <div class="table__hidden-icon" v-else></div>
        </div>
        <div class="table__icon">
          <VueCustomTooltip
            v-if="role === 'superadmin' || role === 'director'"
            label="Удалить"
          >
            <img
              alt=""
              src="@/assets/icons/trash_icon.svg"
              @click="$emit('toggleDelete', employee)"
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
    options: Object,
    infoItem: {
      type: Object,
    },
    editedItem: Object,
    employee: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
    },
    role: {
      type: String,
    },
  },
};
</script>
