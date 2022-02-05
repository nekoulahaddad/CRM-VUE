import Vue from "vue";
import Vuex from "vuex";
import axios from "@/api/axios";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sidebar: !!Cookies.get("sidebar"),
    filter: !!Cookies.get("filter"),
    status: {
      reg: "",
      auth: "",
    },
    id: localStorage.getItem("id") || null,
    number: localStorage.getItem("number") || null,
    inner_number: localStorage.getItem("inner_number") || null,
    token: localStorage.getItem("token") || null,
    refresh: localStorage.getItem("refresh") || null,
    orders: [],
    ordersCount: 0,
    totalCost: 0,
    totalProfit: 0,
    totalShippedSum: 0,
    totalDelivery: 0,
    callbacks: [],
    callbacksCount: 0,
    loaded: true,
    region: localStorage.getItem("region") || null,
    filterRegion: null,
    filterOptions: {},
    file: {},
    actions: {
      addDelivery: false,
      addDepartment: false,
      addOrder: false,
      addTask: false,
      addVacancy: false,
      addEmployee: false,
      createEducationSection: false,
      firedUsers: false,
      importGoods: false,
    },
  },
  mutations: {
    toggleAction(state, payload) {
      state.actions[payload.key] = !state.actions[payload.key];
    },
    toggleSidebar(state) {
      state.sidebar = !state.sidebar;
      state.sidebar
        ? Cookies.set("sidebar", !state.sidebar)
        : Cookies.remove("sidebar");
    },
    setFilterOptions(state, payload) {
      state.filterOptions = payload;
    },
    setFilterRegion(state, payload) {
      state.filterRegion = payload;
    },
    toggleFilter(state) {
      state.filter = !state.filter;
      state.filter
        ? Cookies.set("filter", !state.filter)
        : Cookies.remove("filter");
    },
    auth_request(state) {
      state.status.auth = "loading";
    },
    auth_success(state, data) {
      state.status.auth = "success";
      state.token = data.token;
      state.refresh = data.refresh;
      state.number = data.number;
      if (typeof data.inner_number !== "undefined") {
        state.inner_number = data.inner_number;
      }
    },
    auth_error(state, error) {
      state.status.auth = "error";
      Vue.$toast.error(error, "Ошибка");
    },
    logout(state) {
      state.status.auth = "";
      state.status.reg = "";
      state.token = "";
      state.refresh = "";
      state.orders = [];
      state.ordersCount = 0;
    },
    success_update_orders(state, payload) {
      state.orders = payload.orders;
      state.ordersCount = payload.count;
      state.totalCost = payload.totalCost;
      (state.totalProfit = payload.totalProfit),
        (state.totalShippedSum = payload.totalShippedSum);
      state.totalDelivery = payload.totalDelivery;
    },
    success_update_callbacks(state, payload) {
      state.callbacks = payload.callbacks;
      state.callbacksCount = payload.count;
    },
    SOCKET_ORDERSCHANGES(state, order) {
      let exist = false;
      if (state.orders.length < 15) {
        for (let i = 0; i < state.orders.length; i++) {
          if (state.orders[i]._id === order._id) {
            exist = true;
          }
        }
      }
      if (!exist) {
        state.orders.push(order);
        state.ordersCount += 1;
        Vue.$toast.success(`Получен новый заказ №${order.number}`);
      }
    },
    SOCKET_ORDERUPDATE(state, order) {
      console.log("Updated order");
      console.log(order);
      let index = state.orders.findIndex((item) => item._id === order._id);
      if (!order.updated) {
        order.updated = true;
        if (index > -1) {
          console.log(index);
          Vue.set(state.orders, index, order);
          if (state.id === order.manager[0]._id.toString()) {
            Vue.$toast.success(`Ваш заказ №${order.number} обновлен`);
            return;
          } else {
            Vue.$toast.success(`Заказ №${order.number} обновлен`);
            return;
          }
        } else {
          console.log(index);
          if (state.id === order.manager[0]._id) {
            Vue.$toast.success(`Ваш заказ №${order.number} обновлен`);
            state.orders.push(order);
            return;
          } else {
            Vue.$toast.success(`Заказ №${order.number} обновлен`);
            return;
          }
        }
      }
    },
    SOCKET_CALLBACKSCHANGES(state, callback) {
      callback.new = true;
      Vue.$toast.success(`Получена новая заявка №${callback.number}`);
      if (state.callbacks.length < 15) {
        state.callbacks.push(callback);
      }
      state.callbacksCount += 1;
      return;
    },
    SOCKET_CALLBACKUPDATE(state, callback) {
      let index = state.callbacks.findIndex(
        (item) => item._id === callback._id
      );

      if (index > -1) {
        callback.updated = true;
        Vue.set(state.callbacks, index, callback);
        Vue.$toast.success(`Заявка №${callback.number} обновлена`);
      } else {
        if (state.id === callback.manager[0]._id) {
          Vue.$toast.success(`Вам добавлена заявка №${callback.number}`);
          state.callbacks.push(callback);
        } else {
          Vue.$toast.success(`Заявка №${callback.number} обновлена`);
        }
      }
    },
    SOCKET_DOWNLOADEXEL(state, file) {
      state.file = file;
      console.log(file);
      Vue.$toast.success(`Начинаю скачивать Excel файл!`);
      state.loaded = true;
    },
    change_load_status(state, payload) {
      state.loaded = payload;
    },
    reset_updated_orders(state) {
      state.editedOrders = [];
    },
    set_region(state, region) {
      console.log(region);
      state.region = region;
    },
    reset_region(state) {
      state.region = null;
    },
  },
  actions: {
    toggleSidebar({ commit }) {
      commit("toggleSidebar");
    },
    toggleFilter({ commit }) {
      commit("toggleFilter");
    },
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "/user/login",
          data: user,
          method: "POST",
        })
          .then((res) => {
            const token = res.data.token;
            const refresh = res.data.refresh;
            const decoded = jwt.decode(res.data.token);
            const role = decoded.data.role;
            const department = decoded.data.department;
            const number = decoded.data.number;

            let inner_number;
            if (typeof decoded.data.inner_number !== "undefined") {
              localStorage.setItem("inner_number", decoded.data.inner_number);
              inner_number = decoded.data.inner_number;
            }
            localStorage.setItem("id", decoded.data._id);
            localStorage.setItem("token", token);
            localStorage.setItem("refresh", refresh);
            localStorage.setItem("number", number);

            axios.defaults.headers.common["Authorization"] = token;
            commit("auth_success", {
              token,
              refresh,
              role,
              department,
              number,
              inner_number,
            });
            resolve(res);
          })
          .catch((err) => {
            let res = err.response.data.message;
            commit("auth_error", res);
            return reject();
          });
      });
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        axios({
          url: process.env.VUE_APP_DEVELOP_URL + "/user/post",
          data: user,
          method: "POST",
        })
          .then((res) => {
            commit("reg_success");
            resolve(res);
          })
          .catch((err) => {
            localStorage.removeItem("id");
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            localStorage.removeItem("number");
            console.log(err);
            reject(err);
          });
      });
    },
    refresh({ commit }) {
      return new Promise((resolve) => {
        axios({
          url: process.env.VUE_APP_DEVELOP_URL + "/user/refresh",
          data: {
            userId: localStorage.getItem("id"),
            refresh: localStorage.getItem("refresh"),
          },
          method: "POST",
        })
          .then((res) => {
            const token = res.data.token;
            const refresh = res.data.refresh;
            const decoded = jwt.decode(res.data.token);
            const number = decoded.data.number;
            if (res.data.token) {
              console.log("token exist");
              localStorage.setItem("id", decoded.data._id);
              localStorage.setItem("token", token);
              localStorage.setItem("refresh", refresh);
              localStorage.setItem("number", number);
              axios.defaults.headers.common["Authorization"] = token;
              commit("auth_success", {
                token,
                refresh,
                number,
              });
            } else {
              commit("logout");
              setTimeout(() => {
                resolve();
              });
            }
          })
          .catch((err) => {
            commit("logout");
            localStorage.clear();
            console.log("errrrrrrrrrrrrrrrr");
            console.log(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("logout");
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
    getOrdersFromPage({ commit }, { page, filtersOptions }) {
      return new Promise((resolve) => {
        axios({
          url: `/orders/get/?page=${+page}`,
          data: {
            options: filtersOptions,
          },
          method: "POST",
        })
          .then((res) => {
            const orders = res.data.orders;
            const count = res.data.count;
            const totalCost = res.data.total;
            const totalProfit = res.data.profit;
            const totalShippedSum = res.data.shippedSum;
            const totalDelivery = res.data.delivery;
            localStorage.setItem("orders", orders);
            localStorage.setItem("ordersCount", +count);
            localStorage.setItem("totalCpst", +totalCost);
            localStorage.setItem("totalProfit", +totalProfit);
            localStorage.setItem("totalProfit", +totalShippedSum);
            localStorage.setItem("totalDelivery", +totalDelivery);
            commit("success_update_orders", {
              orders,
              count,
              totalCost,
              totalProfit,
              totalShippedSum,
              totalDelivery,
            });
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    socket_ordersChanges({ commit }, change) {
      return new Promise((resolve) => {
        commit("SOCKET_ORDERSCHANGES", change);
        resolve();
      });
    },
    socket_orderUpdate({ commit }, change) {
      return new Promise((resolve) => {
        commit("SOCKET_ORDERUPDATE", change);
        resolve();
      });
    },
    socket_downloadExcel({ commit }, file) {
      console.log("commit");
      return new Promise((resolve) => {
        commit("SOCKET_DOWNLOADEXEL", file);
        resolve();
      });
    },
    getCallbacksFromPage({ commit }, { page, filtersOptions }) {
      return new Promise((resolve) => {
        axios({
          url:
            process.env.VUE_APP_DEVELOP_URL + `/callbacks/get/?page=${+page}`,
          data: {
            options: filtersOptions,
          },
          method: "POST",
        })
          .then((res) => {
            const callbacks = res.data.callbacks;
            const count = res.data.count;
            localStorage.setItem("callbacks", callbacks);
            localStorage.setItem("callbaksCount", +count);
            commit("success_update_callbacks", {
              callbacks,
              count,
            });
            resolve(res);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    socket_callbacksChanges({ commit }, change) {
      return new Promise((resolve) => {
        commit("SOCKET_CALLBACKSCHANGES", change);
        resolve();
      });
    },
    socket_callbackUpdate({ commit }, change) {
      return new Promise((resolve) => {
        commit("SOCKET_CALLBACKUPDATE", change);
        resolve();
      });
    },
    reset_region({ commit }) {
      return new Promise((resolve) => {
        commit("RESET_REGION");
        resolve();
      });
    },
    set_region({ commit }, region) {
      return new Promise((resolve) => {
        localStorage.setItem("region", region);
        commit("SET_REGION", region);
        resolve();
      });
    },
  },
  getters: {
    file: (state) => state.file,
    sidebar: (state) => state.sidebar,
    filter: (state) => state.filter,
    isLoggedIn: (state) => !!state.token,
    loaded: (state) => state.loaded,
    authStatus: (state) => state.status.auth,
    getToken: (state) => state.token,
    getOrders: (state) => state.orders,
    getOrdersCount: (state) => state.ordersCount,
    getTotalCost: (state) => state.totalCost,
    getTotalProfit: (state) => state.totalProfit,
    getTotalShippedSum: (state) => state.totalShippedSum,
    getTotalDelivery: (state) => state.totalDelivery,
    getCallbacks: (state) => state.callbacks,
    getCallbacksCount: (state) => state.callbacksCount,
    region: (state) => state.region,
    filterRegion: (state) => state.filterRegion,
    getFilterOptions: (state) => state.filterOptions,
  },
});
