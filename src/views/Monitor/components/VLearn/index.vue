<template>
  <div class="learn">
    <div class="learn__inner">
      <div class="learn__title">Обучение:</div>
      <vue-scroll>
        <div class="list">
          <div
            v-for="item in educations"
            class="list__row list__row--shadow list__row--white"
          >
            <div class="list__columns">
              <div class="list__column">
                <router-link to="/dashboard/education/1">
                  {{ item.title }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
import axios from "@/api/axios";

export default {
  data() {
    return {
      typeE: "crm",
      educations: [],
    };
  },
  mounted() {
    const body = document.querySelector("body");
    const learn = document.querySelector(".learn");

    learn.onmouseover = function () {
      body.style.overflow = "hidden";
    };

    learn.onmouseout = function () {
      body.style.overflow = "auto";
    };
  },
  beforeMount() {
    this.fetchData();
  },
  computed: {
    role: {
      get: function () {
        let role = this.getUserRole();
        return role.role;
      },
    },
    department: {
      get: function () {
        let role = this.getUserRole();
        return role.department;
      },
    },
  },
  methods: {
    async fetchData() {
      let data = {
        type: this.typeE,
      };

      data.role = this.role;
      data.department = this.department;

      if (this.typeE === "employee") {
        data.department = this.department;
      }

      this.isLoading = false;

      try {
        const response = await axios({
          url: `/educations/get/?page=1`,
          params: data,
          method: "GET",
        });

        this.educations = response.data.educations;
      } catch (e) {
      } finally {
        this.isLoading = true;
      }
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.learn {
  background-color: $color-white;
  border-radius: $border-radius;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
  margin-top: 10px;
  margin-left: 10px;
  margin-bottom: 5px;
  width: 805px;

  &__inner {
    padding: 16px 10px 16px;
  }

  &__title {
    font-weight: 700;
    margin-bottom: 16px;
  }

  .list {
    height: 144px;
    margin-left: 2px;
    margin-top: 3px;
    margin-right: 15px;
    max-width: 768px;
    padding-bottom: 30px;
  }
  .list__row,
  .list__columns {
    height: 40px;

    .list__column {
      text-align: left;
      font-weight: 600;
    }
  }
}
</style>
