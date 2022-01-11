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
        component: () => import("../views/Purchase"),
      },
      {
        path: "calendar",
        name: "calendar",
        component: () => import("../views/Calendar"),
      },
      {
        path: "callbacks/:page",
        name: "callbacks",
        component: () => import("../views/CallCenter"),
      },
      {
        path: "clients/:page",
        name: "clients",
        component: () => import("../views/Clients"),
      },
      {
        path: "delivery/:page",
        name: "delivery",
        component: () => import("../views/Delivery"),
      },
      {
        path: "education/:page",
        name: "education",
        component: () => import("../views/Education"),
      },
      {
        path: "employee/:page",
        name: "employee",
        component: () => import("../views/Employee"),
      },
      {
        path: "goods/:nesting/:type?/:parent_value?/:page?",
        alias: "goods/:nesting/:type?/:parent_value?/:page?",
        name: "goods",
        component: () => import("../views/Goods"),
      },
      {
        path: "mail/:page",
        name: "mail",
        component: () => import("../views/Mail"),
      },
      {
        path: "mango/:page?",
        name: "mango",
        component: () => import("../views/Mango"),
      },
      {
        path: "monitor",
        name: "monitor",
        component: () => import("../views/Monitor"),
      },
      {
        path: "orders/:page",
        name: "orders",
        component: () => import("../views/Orders"),
      },
      {
        path: "reports/:page",
        name: "reports",
        component: () => import("../views/Reports"),
      },
      {
        path: "seo/:nesting/:type?/:parent_value?/:page?",
        name: "seo",
        component: () => import("../views/Seo"),
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
      {
        path: "personal",
        name: "personal",
        component: () => import("../views/Personal"),
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
