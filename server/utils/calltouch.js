const axios = require('axios').default;

const calltouchData = {
  crm: 'csk',
  orders: [],
};

const axiosOptions = (data) => ({
  headers: {
    'Access-Token': `${process.env.CALLTOUCH_ACCESS_TOKEN}`,
    SiteId: `${process.env.CALLTOUCH_SITEID}`,
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  },
  method: 'post',
  data: JSON.stringify(data),
  url: 'https://api.calltouch.ru/lead-service/v1/api/client-order/create',
});

const createDateString = (dateIn) => {
  let date = new Date(dateIn);
  let day = date.getDate().toString();
  let month = (date.getMonth() + 1).toString();
  let year = date.getFullYear().toString();
  let hoars = date.getHours().toString();
  let minutes = date.getMinutes().toString();
  let seconds = date.getSeconds().toString();

  if (day.length !== 2) {
    day = '0' + day;
  }
  if (month.length !== 2) {
    month = '0' + month;
  }
  if (hoars.length !== 2) {
    hoars = '0' + hoars;
  }
  if (minutes.length !== 2) {
    minutes = '0' + minutes;
  }
  if (seconds.length !== 2) {
    seconds = '0' + seconds;
  }

  return `${day}-${month}-${year} ${hoars}:${minutes}:${seconds}`;
};

const sendData = (options) => {
  axios(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error.response.data.data.validationErrorData);
    });
};

module.exports.sendNewOrder = async (order) => {
  
};

module.exports.sendAllOrders = async (orders) => {
  calltouchData.orders = orders.map((item) => {
    return {
      matching: [{ type: 'withoutSource' }],
      orderNumber: item.number,
      funnel: '?',
      status: item.status.value,
      statusDate: createDateString(item.updatedAt),
      orderDate: createDateString(item.created),
      currency: `rub`,
      revenue: item.sum,
      margin: 0,
      manager: item.manager[0]?.surname + ' ' + item.manager[0]?.name + ' ' + item.manager[0]?.lastname,
      comment: { text: item.comment || 'без комментария' },
      products: item.products.map((p) => ({ name: p.title, price: p.cost, quantity: p.quantity })),
    };
  });
  sendData(axiosOptions(calltouchData))
};

// const calltouchOrder = {
//   matching: [{ type: 'withoutSource' }],
//   orderNumber: null,
//   funnel: '',
//   status: '',
//   statusDate: '',
//   orderDate: '',
//   currency: '',
//   revenue: '',
//   margin: '',
//   orderLink: '',
//   orderName: '',
//   manager: '',
//   comment: { text: '' },
//   addTags: [],
//   addTagsToLead: [],
//   customFields: [],
//   products: [],
// };
// const calltouchProduct = {
//   name: '',
//   price: null,
//   brand: '',
//   category: '',
//   variant: '',
//   quantity: null,
// };
