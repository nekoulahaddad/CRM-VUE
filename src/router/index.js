import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "desktop",
    component: () => import("../views/Desktop.vue"),
  },
  {
    path: "/buying/:page",
    name: "buying",
    component: () => import("../views/Buying.vue"),
  },
  {
    path: "/calendar/:page",
    name: "calendar",
    component: () => import("../views/Calendar.vue"),
  },
  {
    path: "/callbacks/:page",
    name: "callbacks",
    component: () => import("../views/Callbacks.vue"),
  },
  {
    path: "/clients/:page",
    name: "clients",
    component: () => import("../views/Clients.vue"),
  },
  {
    path: "/delivery/:page",
    name: "delivery",
    component: () => import("../views/Delivery.vue"),
  },
  {
    path: "/education/:page",
    name: "education",
    component: () => import("../views/Education.vue"),
  },
  {
    path: "/employees/:page",
    name: "employees",
    component: () => import("../views/Employees.vue"),
  },
  {
    path: "/goods/:page",
    name: "goods",
    component: () => import("../views/Goods.vue"),
  },
  {
    path: "/mails/:page",
    name: "mails",
    component: () => import("../views/Mails.vue"),
  },
  {
    path: "/mango/:page",
    name: "mango",
    component: () => import("../views/Mango.vue"),
  },
  {
    path: "/monitor",
    name: "monitor",
    component: () => import("../views/Monitor.vue"),
  },
  {
    path: "/orders/:page",
    name: "orders",
    component: () => import("../views/Orders.vue"),
  },
  {
    path: "/reports/:page",
    name: "reports",
    component: () => import("../views/Reports.vue"),
  },
  {
    path: "/seo/:page",
    name: "seo",
    component: () => import("../views/Seo.vue"),
  },
  {
    path: "/storage/:page",
    name: "storage",
    component: () => import("../views/Storage.vue"),
  },
  {
    path: "/tasks/:page",
    name: "tasks",
    component: () => import("../views/Tasks.vue"),
  },
];

const router = new Router({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = "Система управления взаимоотношениями с клиентами";
  next();
});

export default router;
