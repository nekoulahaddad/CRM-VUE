<template>
  <section class="mail-by-month">
    <v-spinner v-if="false" />
    <div class="mail-by-month__header">
      <div class="mail-by-month__title">{{ $t("mailByMonth") }}</div>
    </div>

    <div class="mail-by-month__body">
      <div class="mail-by-month__managers mail-by-month__column managers">
        <div class="managers__inner">
          <div class="managers__title">
            {{ $t("managers") }}
          </div>
          <select
            class="managers__select form-select"
            @change="onChange($event)"
          >
            <option selected value="all">{{ $t("allManagers") }}</option>
            <option v-for="item in managers" :value="item._id">
              {{ transformFIO(item) }}
            </option>
          </select>
        </div>
      </div>
      <div class="mail-by-month__column info-column" v-for="(item, i) of info">
        <div class="info-column__icon">
          <img :src="icons[i]" alt="" />
        </div>
        <div class="info-column__content">
          <div class="info-column__title">{{ item.title }}</div>
          <div class="info-column__count">{{ item.count }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "@/api/axios";
import VSpinner from "@/components/VSpinner";

export default {
  components: {
    VSpinner,
  },
  data() {
    return {
      title: "Заявки:",
      text: this.$parent.startDate ? "за период" : "за текущий месяц",
      callbacks: {
        all: 0,
        completed: 0,
        declained: 0,
      },
      info: [
        {
          title: "Всего",
          count: 0,
        },
        {
          title: "Обработано",
          count: 0,
        },
        {
          title: "Не обработано",
          count: 0,
        },
      ],
      icons: [
        require("@/assets/icons/info_all.svg"),
        require("@/assets/icons/info_processed.svg"),
        require("@/assets/icons/info_not_processed.svg"),
      ],
      managers: [],
    };
  },
  methods: {
    onChange(e) {
      axios({
        url: process.env.VUE_APP_DEVELOP_URL + `/stats/getcallbacks/`,
        data: {
          startDate: this.startDate,
          endDate: this.endDate,
          managerId: e.target.value,
        },
        method: "POST",
      }).then(this.updateCallbacks);
    },
    updateCallbacks(res) {
      let result = res.data;
      this.info[0].count = result.callbacks.all;
      this.info[1].count = result.callbacks.completed;
      this.info[2].count = result.callbacks.declained;
      this.managers = result.managers;
    },
  },
  mounted() {
    axios({
      url: "/stats/getcallbacks/",
      data: {
        startDate: this.startDate,
        endDate: this.endDate,
      },
      method: "POST",
    }).then(async (res) => {
      this.updateCallbacks(res);
    });
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.mail-by-month {
  margin-top: 8px;
  position: relative;
  width: 807px;

  &--loading {
    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 3px;
      left: 0;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: $border-radius;
      z-index: 99;
    }
  }

  .spinner {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    width: 100%;
    height: 100%;
  }

  &__title {
    width: 807px;
    height: 54px;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    background-color: $color-white;
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
    position: relative;
    z-index: 10;
  }

  &__column {
    width: 216px;
    background-color: $color-white;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
    margin-bottom: 3px;

    & + * {
      margin-left: 10px;
    }
  }

  &__body {
    height: 113px;
    display: flex;
  }

  .managers {
    background-color: $color-white;
    display: flex;
    align-items: center;
    width: 250px;

    &__inner {
      padding: 10px;
      flex: 1;
    }

    &__title {
      font-weight: 700;
      margin-bottom: 10px;
    }
  }

  .info-column {
    display: flex;
    padding-left: 12px;
    justify-content: center;
    padding-right: 12px;
    flex-direction: column;

    &__content {
      display: flex;
      margin-top: 10px;
    }

    &__title {
      font-weight: 700;
      margin-right: 10px;
    }

    &__count {
      font-weight: 700;
      color: $color-red;
    }
  }
}
</style>
