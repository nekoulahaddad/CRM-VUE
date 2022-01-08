export default {
  methods: {
    transformProfile(payment) {
      return payment && payment === "bankTransfer"
        ? "Юридическое лицо"
        : "Физическое лицо";
    },
  },
};
