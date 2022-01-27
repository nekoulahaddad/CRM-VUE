<template>
  <form
    @submit.prevent="$emit('submit')"
    enctype="multipart/form-data"
    accept="image/x-png,image/gif,image/jpeg"
  >
    <div class="group__title text--blue">
      {{ $t("pages.employee.employeeMainInfo") }}
    </div>
    <div class="group">
      <div class="group__title">{{ $t("lastName") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('lastName')"
          :value.trim="infoItem ? infoItem.surname : surname"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("firstName") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('firstName')"
          :value.trim="item ? item.name : name"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("middleName") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('middleName')"
          :value.trim="item ? item.lastname : lastname"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("mail") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('mail')"
          :value="item ? item.email : email"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("phone") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('phone')"
          :value="item ? item.phone : phone"
          v-maska="['+# ### ### ## ##', '+### ### ## ## ##', 'a*']"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group__title text--blue">
      {{ $t("pages.employee.employeeAddInfo") }}
    </div>
    <div class="group">
      <div class="group__title">{{ $t("department") }}</div>
      <div class="group__content">
        <select
          class="form-select"
          :value="item ? item.department.value : department"
          @change="onChange($event)"
        >
          <option
            v-for="(item, index) in departments"
            :selected="item ? item.value === item.department.value : false"
            :value="item.value"
          >
            {{ item.title }}
          </option>
        </select>
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("subDepartment") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('subDepartment')"
          :value="item ? item.sub_department : sub_department"
          @input="onChange($event)"
        />
      </div>
    </div>

    <div class="group">
      <div class="group__title">{{ $t("position") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('position')"
          :value="item ? item.position : position"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("employeeNumber") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('employeeNumber')"
          :value="item ? item.personal_number : personal_number"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("role") }}</div>
      <div class="group__content">
        <select
          class="form-select"
          :value="item ? item.role : role"
          @change="onChange($event)"
        >
          <option v-for="(role, index) in $t('roles')" :value="index">
            {{ role }}
          </option>
        </select>
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("education") }}</div>
      <div class="group__content">
        <select
          class="form-select"
          :value="item ? item.education : education"
          @change="onChange($event)"
        >
          <option v-for="education in $t('educations')" :value="education">
            {{ education }}
          </option>
        </select>
      </div>
    </div>

    <div class="group">
      <div class="group__title">{{ $t("speciality") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('speciality')"
          :value="item ? item.specialty : specialty"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("employmentDate") }}</div>
      <div class="group__content">
        <datetime
          v-model="employment_date"
          required
          input-class="forms__container--input"
          type="date"
          :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("region") }}</div>
      <div class="group__content">
        <select
          class="form-select"
          :value="item ? item.region.value : region"
          @change="onChange($event)"
        >
          <option v-for="(region, index) in regions" :value="region.value">
            {{ region.title }}
          </option>
        </select>
      </div>
    </div>

    <!-- Личные данные -->
    <div class="group__title text--blue">
      {{ $t("pages.employee.employeePersonalInfo") }}
    </div>
    <div class="group">
      <div class="group__title">{{ $t("birthday") }}</div>
      <div class="group__content">
        <datetime
          v-model="date_of_birth"
          required
          input-class="forms__container--input"
          type="date"
          :phrases="{ ok: $t('ready'), cancel: $t('cancel') }"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("zodiak") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('zodiak')"
          :value="item ? item.zodiac_sign : zodiac_sign"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("element") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('element')"
          :value="item ? item.element : element"
          @input="onChange($event)"
        />
      </div>
    </div>
    <div class="group">
      <div class="group__title">{{ $t("chineseYear") }}</div>
      <div class="group__content">
        <input
          type="text"
          class="form-control"
          :placeholder="$t('chineseYear')"
          :value="item ? item.chinese_year : chinese_year"
          @input="onChange($event)"
        />
      </div>
    </div>

    <!-- Дети -->
    <div class="group__title text--blue">
      {{ $t("childs") }}
    </div>
    <div class="group">
      <div class="group__footer">
        <v-button red>{{ $t("add") }}</v-button>
      </div>
    </div>

    <div class="group__title text--blue">
      {{ $t("another") }}
    </div>

    <v-button red>{{ $t("save") }}</v-button>
  </form>
</template>

<script>
import VButton from "@/components/VButton";

export default {
  components: { VButton },
  methods: {
    onChange(e) {
      this[e.target.name] = e.target.value;
    },
  },
};
</script>
