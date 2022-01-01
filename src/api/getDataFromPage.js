import axios from "./axios";

export default function getDataFromPage(url, options) {
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
    search: options.search || null,
    startDate: options.startDate || null,
    endDate: options.endDate || null,
    phone: options.phone || null,
    clubcard: options.clubcard || null,
  };

  return axios({
    url: `${process.env.VUE_APP_DEVELOP_URL}${url}/?page=1`,
    data: {
      options: getOptions,
    },
    method: "POST",
  });
}
