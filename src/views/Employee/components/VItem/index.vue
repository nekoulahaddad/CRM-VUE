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
    <div v-html="transformRating(employee.rating)" class="list__column" />
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
          <img
            alt=""
            src="@/assets/icons/info_icon.svg"
            v-if="employee._id !== infoItem._id"
            @click="$emit('toggleInfo', employee)"
          />
          <img
            alt=""
            src="@/assets/icons/arrow_top_icon.svg"
            @click="$emit('toggleInfo', employee)"
            v-else
          />
        </div>
        <div class="table__icon">
          <template v-if="role === 'director' || options.userEditor">
            <img
              alt=""
              v-if="employee._id !== editedItem._id"
              src="@/assets/icons/write_icon.svg"
              @click="$emit('toggleEdit', employee)"
            />
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
          <img
            alt=""
            v-if="role === 'director'"
            src="@/assets/icons/trash_icon.svg"
            @click="$emit('toggleDelete', employee)"
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
