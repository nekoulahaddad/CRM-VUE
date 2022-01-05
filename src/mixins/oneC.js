export default {
  methods: {
    getOneCStatus(state) {
      return !state.requested && !state.accepted
        ? "Не отправлен"
        : state.requested && !state.accepted
        ? "Отправлен"
        : state.requested && state.accepted
        ? "Получен"
        : "Нет данных";
    },
  },
};
