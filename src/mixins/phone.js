export default {
  methods: {
    transformPhone(phone) {
      if (phone) {
        let s = phone.split("");
        if (s.length === 12) {
          // +### ### ## ## ##
          return `+${s[0]}${s[1]}${s[2]} ${s[3]}${s[4]}${s[5]} ${s[6]}${s[7]} ${s[8]}${s[9]} ${s[10]}${s[11]}`;
        } else if (s.length === 11) {
          // +# ### ### ## ##
          return `+${s[0]} ${s[1]}${s[2]}${s[3]} ${s[4]}${s[5]}${s[6]} ${s[7]}${s[8]} ${s[9]}${s[10]}`;
        }
      }
      return "";
    },
  },
};
