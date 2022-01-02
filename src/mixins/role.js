import jwt from "jsonwebtoken";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getToken"]),
  },
  methods: {
    getUserRole() {
      let token = this.getToken;
      let decoded = jwt.decode(token, process.env.VUE_APP_SECRET_KEY);
      if (decoded) {
        return {
          _id: decoded.data._id,
          name: decoded.data.name,
          surname: decoded.data.surname,
          lastname: decoded.data.lastname,
          role: decoded.data.role,
          department: decoded.data.department,
          options: decoded.data.options,
        };
      }
    },
  },
};
