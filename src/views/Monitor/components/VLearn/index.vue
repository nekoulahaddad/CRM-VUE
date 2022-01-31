<template>
  <div class="learn">
    <div class="learn__inner">
      <div class="learn__title">Обучение:</div>
      <vue-scroll>
        <div class="list">
          <div
            v-for="i in 10"
            class="list__row list__row--shadow list__row--white"
          >
            <div class="list__columns">
              <div class="list__column">
                <div>Обучение для менеджера по онлайн продажам</div>
              </div>
            </div>
          </div>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
export default {
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
    height: 137px;
    margin-left: 2px;
    margin-top: 3px;
    margin-right: 15px;
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
