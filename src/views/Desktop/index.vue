<template>
  <div class="page desktop-page">
    <v-edit-task-modal :task="{}" />
    <div class="page__header">
      <div class="page__icon">
        <img :src="require('@/assets/icons/desktop_title.svg')" alt="" />
      </div>
      <h1 class="page__title">Рабочий стол</h1>
    </div>
    <div class="page__body d-flex">
      <div class="page__left">
        <div class="tasks">
          <div class="tasks__title">Доска задач</div>
          <div class="tasks__lists">
            <!-- К выполнению -->
            <div class="tasks__list list">
              <div class="list__title text--red text">К выполнению: 8</div>
              <vue-scroll>
                <div class="list__items">
                  <div class="list__item" v-for="i in 8">
                    <div class="list__content">
                      Необходимо обновить CRM систему, выполнив редизайн
                      системы.
                    </div>
                    <div class="list__actions">
                      <img
                        @click="editTask"
                        src="@/assets/icons/arrow_twin.svg"
                        alt=""
                      />
                      <img src="@/assets/icons/dots_icon.svg" alt="" />
                    </div>
                  </div>
                </div>
              </vue-scroll>
            </div>
            <!-- В работе -->
            <div class="tasks__list list">
              <div class="list__title text text--blue-delos">В работе: 8</div>
              <vue-scroll>
                <div class="list__items">
                  <div class="list__item" v-for="i in 8">
                    <div class="list__content">
                      Необходимо обновить CRM систему, выполнив редизайн
                      системы.
                    </div>
                    <div class="list__actions">
                      <img src="@/assets/icons/arrow_twin.svg" alt="" />
                      <img src="@/assets/icons/dots_icon.svg" alt="" />
                    </div>
                  </div>
                </div>
              </vue-scroll>
            </div>
            <!-- На проверке -->
            <div class="tasks__list list">
              <div class="list__title text text--green">На проверке: 8</div>
              <vue-scroll>
                <div class="list__items">
                  <div class="list__item" v-for="i in 8">
                    <div class="list__content">
                      Необходимо обновить CRM систему, выполнив редизайн
                      системы.
                    </div>
                    <div class="list__actions">
                      <img src="@/assets/icons/arrow_twin.svg" alt="" />
                      <img src="@/assets/icons/dots_icon.svg" alt="" />
                    </div>
                  </div>
                </div>
              </vue-scroll>
            </div>
            <!-- Выполнено -->
            <div class="tasks__list list">
              <div class="list__title text text--blue">Выполнено: 8</div>
              <vue-scroll>
                <div class="list__items">
                  <div class="list__item" v-for="i in 8">
                    <div class="list__content">
                      Необходимо обновить CRM систему, выполнив редизайн
                      системы.
                    </div>
                    <div class="list__actions">
                      <img src="@/assets/icons/arrow_twin.svg" alt="" />
                      <img src="@/assets/icons/dots_icon.svg" alt="" />
                    </div>
                  </div>
                </div>
              </vue-scroll>
            </div>
          </div>
        </div>
      </div>
      <div class="page__right">12</div>
    </div>
  </div>
</template>

<script>
import VEditTaskModal from "../../components/VModals/EditTaskModal";
import getDataFromPage from "../../api/getDataFromPage";

export default {
  components: {
    VEditTaskModal,
  },
  data() {
    return {
      dataset: [],
    };
  },
  methods: {
    async fetchData() {
      try {
        const { data } = await getDataFromPage(`/tasks/get`, {});

        this.dataset = data.tasks;
      } catch (e) {
      } finally {
      }
    },
    editTask() {
      this.$modal.show("editTask");
    },
  },
  mounted() {
    this.fetchData();

    const body = document.querySelector("body");
    const lists = document.querySelectorAll(".list__items");

    lists.forEach((list) => {
      list.onmouseover = function () {
        body.style.overflow = "hidden";
      };
    });

    lists.forEach((list) => {
      list.onmouseout = function () {
        body.style.overflow = "auto";
      };
    });
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.desktop-page {
  .page {
    &__left {
      flex: 1;
    }

    &__right {
      max-width: 300px;
      width: 100%;
    }
  }

  .tasks {
    background-color: $color-white;
    border-radius: $border-radius;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
    padding: 10px 10px 0;

    &__title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    &__lists {
      display: flex;
    }

    &__list {
      background-color: $color-gray-secondary;
      border-radius: $border-radius;
      padding: 10px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      width: 328px;

      & + * {
        margin-left: 10px;
      }
    }
  }

  .list {
    &__item {
      background-color: $color-white;
      border-radius: $border-radius;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.006), 0 4px 4px rgba(0, 0, 0, 0.08);
      width: 305px;
      padding: 10px;

      & + * {
        margin-top: 10px;
      }
    }

    &__title {
      height: auto;
      line-height: normal;
      margin-left: 0;
    }

    &__actions {
      align-items: center;
      display: flex;
      justify-content: end;

      img {
        cursor: pointer;
      }

      img + img {
        margin-left: 10px;
      }
    }
  }
}
</style>
