export default {
  methods: {
    transformFIO(user) {
      if (user)
        return `${user.surname ? user.surname : ""} ${
          user.name ? user.name[0] + "." : ""
        } ${user.lastname ? user.lastname[0] + "." : ""}`;
      return "";
    },
    transformFullFIO(user) {
      if (user)
        return `${user.surname ? user.surname : ""} ${
          user.name ? user.name : ""
        } ${user.lastname ? user.lastname : ""}`;
      return "";
    },
    transformChildInfo(child) {
      console.log(child);
      return child?.fio;
    },
  },
};
