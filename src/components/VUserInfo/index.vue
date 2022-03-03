<template>
  <router-link
    active-class="user-info--active"
    :to="{ name: 'personal' }"
    class="user-info"
  >
    <div class="user-info__icon">
      <img src="@/assets/icons/user.svg" alt="" />
    </div>
    <div class="user-info__name">{{ transformFIO(user) }}</div>
  </router-link>
</template>

<script>
export default {
  computed: {
    user: {
      get: function () {
        return this.getUserRole();
      },
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/_variables";

.user-info {
  display: flex;
  align-items: center;
  border-radius: $border-radius;
  height: 44px;
  padding: 7px 9px;
  border: 1px solid transparent;
  margin-right: 69px;
  min-width: 150px;

  &__name {
    margin-left: 5px;
    font-size: 12px;
    font-weight: 600;
  }

  &--active {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(50, 50, 71, 0.006);
    border: 1px solid #f2f2f7;
  }
}
</style>
