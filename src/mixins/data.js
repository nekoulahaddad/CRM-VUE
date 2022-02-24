import axios from "@/api/axios";

export default {
  data() {
    return {
      link: "",
      page: 1,
    };
  },
  mounted() {
    this.page = parseInt(this.$route?.params?.page) || 1;
    this.link = `${this.$route?.fullPath?.substring(
      0,
      this.$route?.fullPath?.lastIndexOf("/")
    )}/`;
  },
  methods: {
    getDataFromPage(url, options) {
      let getOptions = {
        nesting: options.nesting >= 0 ? options.nesting : null,
        parent_id: options.parent_id || null,
        parent_value: options.parent_value || null,
        type: options.type || null,
        department: options.department || null,
        status: options.status || null,
        region: options.region || null,
        executor: options.executor || null,
        initiator: options.initiator || null,
        creation_date: options.creation_date || null,
        deadline_date: options.deadline_date || null,
        created: options.created || null,
        buyed: options.buyed || null,
        deliver: options.deliver || null,
        number: options.number || null,
        dates: options.dates || null,
        manager: options.manager || null,
        startDate: options.startDate || null,
        endDate: options.endDate || null,
        phone: options.phone || null,
        clubcard: options.clubcard || null,
        updatedAt: options.updatedAt || null,
        statuses: options.statuses || null,
        skip: options.skip || null,
        limit: options.limit || null,
      };
      let urlStr;
      if (this.$route.params.page) {
        urlStr = `${url}/?page=${this.$route.params.page}`;
      } else {
        urlStr = `${url}/`;
      }
      let result = axios({
        url: urlStr,
        data: {
          options: getOptions,
        },
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        return result;
      });
      return result;
    },
    getData(url) {
      let result = axios({
        url: `${url}`,
        method: "GET",
      }).then(async (res) => {
        let result = await res;
        return result;
      });
      return result;
    },
    postData(url, data) {
      let result = axios({
        url: `${url}`,
        data: data,
        method: "POST",
      }).then(async (res) => {
        let result = await res;
        return result;
      });
      return result;
    },
  },
};
