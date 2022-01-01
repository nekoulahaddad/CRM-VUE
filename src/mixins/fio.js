export default {
  methods: {
    transformFIO(user) {
      if (user)
        return `${user.surname ? user.surname : ""} ${
          user.name ? user.name.charAt(0) + ". " : ""
        } ${user.lastname ? user.lastname.charAt(0) + "." : ""}`;
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
      if (child)
        return `${child.fio ? child.fio : ""} ${
          child.gender ? "(" + child.gender[0] + ")" : ""
        } `;
      return;
    },
  },
};
