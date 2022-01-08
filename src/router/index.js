import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [
  {
    path: "/dashboard",
    name: "dashboard",
    redirect: {
      name: "monitor",
    },
    component: () => import("../views/Container.vue"),
    children: [
      {
        path: "buying/:page",
        name: "buying",
        component: () => import("../views/Purchase.vue"),
      },
      {
        path: "calendar",
        name: "calendar",
        component: () => import("../views/Calendar.vue"),
      },
      {
        path: "callbacks/:page",
        name: "callbacks",
        component: () => import("../views/CallCenter.vue"),
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
        path: "education/:page",
        name: "education",
        component: () => import("../views/Education"),
      },
      {
        path: "employee/:page",
        name: "employee",
        component: () => import("../views/Employee.vue"),
      },
      {
        path: "goods/:page",
        name: "goods",
        component: () => import("../views/Goods.vue"),
      },
      {
        path: "mail/:page",
        name: "mail",
        component: () => import("../views/Mail.vue"),
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
        component: () => import("../views/Reports"),
      },
      {
        path: "seo/:nesting/:type?/:parent_value?/:page?",
        name: "seo",
        component: () => import("../views/Seo.vue"),
      },
      {
        path: "storage/:nesting/:type?/:parent_value?/:page?",
        name: "storage",
        component: () => import("../views/Storage.vue"),
      },
      {
        path: "tasks/:page",
        name: "tasks",
        component: () => import("../views/Tasks"),
      },
    ],
  },
  {
    path: "/",
    name: "login",
    component: () => import("../views/Login.vue"),
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
