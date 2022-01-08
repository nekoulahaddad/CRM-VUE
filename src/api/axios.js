import axios from "axios";

axios.defaults.baseURL = process.env.VUE_APP_DEVELOP_URL;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});

export default axios;
