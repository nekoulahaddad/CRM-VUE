export default {
  methods: {
    transformName(user) {
      console.log(user);
      return `${user && user.surname ? user.surname + " " : ""} ${
        user.name ? user.name : ""
      } ${user && user.lastname ? user.lastname + " " : ""}`;
    },
  },
};
