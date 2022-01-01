export default {
  methods: {
    transformDate(date) {
      let stringDate = this.$moment(new Date(date));
      if (isNaN(stringDate)) {
        return "";
      }
      let day =
        stringDate.get("date") < 10
          ? `0${stringDate.get("date")}`
          : stringDate.get("date");
      let month =
        stringDate.get("month") + 1 < 10
          ? `0${stringDate.get("month") + 1}`
          : stringDate.get("month") + 1;
      let year = stringDate.get("year");

      return `${day}.${month}.${year}`;
    },
    transformTime(date) {
      let stringDate = this.$moment(new Date(date));
      if (isNaN(stringDate)) {
        return "";
      }
      let day =
        stringDate.get("date") < 10
          ? `0${stringDate.get("date")}`
          : stringDate.get("date");
      let month =
        stringDate.get("month") + 1 < 10
          ? `0${stringDate.get("month") + 1}`
          : stringDate.get("month") + 1;
      let year = stringDate.get("year");
      let hours =
        stringDate.get("hours") < 10
          ? `0${stringDate.get("hours")}`
          : stringDate.get("hours");
      let minutes =
        stringDate.get("minutes") < 10
          ? `0${stringDate.get("minutes")}`
          : stringDate.get("minutes");
      return `${hours}:${minutes} - ${day}.${month}.${year}`;
    },
  },
};
