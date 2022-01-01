import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
  {
    path: "/",
    component: () => import("../views/Dashboard.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Container.vue"),
    children: [
      {
        path: "buying/:page",
        name: "buying",
        component: () => import("../views/Buying.vue"),
      },
      {
        path: "calendar",
        name: "calendar",
        component: () => import("../views/Calendar.vue"),
      },
      {
        path: "callbacks/:page",
        name: "callbacks",
        component: () => import("../views/Callbacks.vue"),
      },
      {
        path: "clients/:page",
        name: "clients",
        component: () => import("../views/Clients.vue"),
      },
      {
        path: "delivery/:page",
        name: "delivery",
        component: () => import("../views/Delivery.vue"),
      },
      {
        path: "education/1",
        name: "education",
        component: () => import("../views/Education.vue"),
      },
      {
        path: "employees/:page",
        name: "employees",
        component: () => import("../views/Employees.vue"),
      },
      {
        path: "goods/:page",
        name: "goods",
        component: () => import("../views/Goods.vue"),
      },
      {
        path: "mail/:page",
        name: "mail",
        component: () => import("../views/Mails.vue"),
      },
      {
        path: "mango/:page?",
        name: "mango",
        component: () => import("../views/Mango.vue"),
      },
      {
        path: "monitor",
        name: "monitor",
        component: () => import("../views/Monitor.vue"),
      },
      {
        path: "orders/:page",
        name: "orders",
        component: () => import("../views/Orders.vue"),
      },
      {
        path: "reports/:page",
        name: "reports",
        component: () => import("../views/Reports.vue"),
      },
      {
        path: "seo/:page",
        name: "seo",
        component: () => import("../views/Seo.vue"),
      },
      {
        path: "storage/:page",
        name: "storage",
        component: () => import("../views/Storage.vue"),
      },
      {
        path: "tasks/:page",
        name: "tasks",
        component: () => import("../views/Tasks.vue"),
      },
    ],
  },
];

const router = new Router({
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = "Система управления взаимоотношениями с клиентами";
  next();
});

export default router;
