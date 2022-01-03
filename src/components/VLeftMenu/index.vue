<template>
  <nav class="sidebar__menu menu">
    <ul class="menu__list">
      <li class="menu__item" v-for="(item, index) in navigation" :key="index">
        <router-link
          active-class="menu__link--active"
          :to="item.link"
          class="menu__link"
          @click.native="toggleActive(item.name)"
          :class="{ 'menu__link--active': item.name === activeElement }"
        >
          <div class="menu__icon">
            <img :src="item.icon" alt="" />
          </div>
          <div class="menu__title">{{ item.title }}</div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      name: this.$route.name,
      navigation: [
        {
          id: 1,
          icon: require("@/assets/icons/monitor.svg"),
          link: "/dashboard/monitor",
          title: "Дашборд",
          blackList: [],
          name: "monitor",
        },
        {
          id: 2,
          icon: require("@/assets/icons/education.svg"),
          link: "/dashboard/education/1",
          title: "Обучение",
          blackList: [],
          name: "education",
        },
        {
          id: 3,
          icon: require("@/assets/icons/employees.svg"),
          link: "/dashboard/employee/1",
          title: "Сотрудники",
          blackList: [],
          name: "employee",
        },
        {
          id: 6,
          icon: require("@/assets/icons/calendar.svg"),
          link: "/dashboard/calendar",
          title: "Календарь",
          blackList: [],
          name: "calendar",
        },
        {
          id: 7,
          icon: require("@/assets/icons/tasks.svg"),
          link: "/dashboard/tasks/1",
          title: "Задачи",
          blackList: [],
          name: "tasks",
        },
        {
          id: 8,
          icon: require("@/assets/icons/reports.svg"),
          link: "/dashboard/reports/1",
          title: "Отчеты",
          blackList: ["worker", "content", "manager", "admin", "call", "buyer"],
          name: "reports",
        },
        {
          id: 5,
          icon: require("@/assets/icons/clients.svg"),
          link: "/dashboard/clients/1",
          title: "Клиенты",
          blackList: ["worker"],
          name: "clients",
        },
        {
          id: 4,
          icon: require("@/assets/icons/orders.svg"),
          link: "/dashboard/orders/1",
          title: "Заказы",
          blackList: ["worker"],
          name: "orders",
        },
        {
          id: 12,
          icon: require("@/assets/icons/call-back.svg"),
          link: "/dashboard/mail/1",
          title: "Заявки",
          blackList: ["worker", "content"],
          name: "mail",
        },
        {
          id: 0,
          icon: require("@/assets/icons/goods.svg"),
          link: "/dashboard/goods/1",
          title: "Товары",
          blackList: ["worker", "seo", "manager", "call", "buyer"],
          name: "goods",
        },
        {
          id: 10,
          icon: require("@/assets/icons/seo.svg"),
          link: "/dashboard/seo/1",
          title: "SEO",
          blackList: ["manager", "worker", "call", "buyer"],
          name: "seo",
        },
        {
          id: 11,
          icon: require("@/assets/icons/mango.svg"),
          link: "/dashboard/mango/1",
          title: "Mango",
          blackList: ["manager", "worker", "buyer", "call"],
          name: "mango",
        },
        {
          id: 13,
          icon: require("@/assets/icons/storage.svg"),
          link: "/dashboard/storage/1",
          title: "Снабженец",
          blackList: ["worker", "seo", "call", "manager", "buyer"],
          name: "storage",
        },
        {
          id: 14,
          icon: require("@/assets/icons/delivery.svg"),
          link: "/dashboard/delivery/1",
          title: "Поставщики",
          blackList: ["worker", "seo", "call", "manager", "buyer"],
          name: "delivery",
        },
        {
          id: 15,
          icon: require("@/assets/icons/call-back.svg"),
          link: "/dashboard/callbacks/1",
          title: "Обращения",
          blackList: ["worker", "seo", "content", "buyer"],
          name: "callbacks",
        },
        {
          id: 16,
          icon: require("@/assets/icons/buying.svg"),
          link: "/dashboard/buying/1",
          title: "Закупка",
          blackList: ["worker", "seo", "content", "call"],
          name: "buying",
        },
      ],
    };
  },
  computed: {
    activeElement: {
      get: function () {
        return this.name;
      },
      set: function (name) {
        this.name = name;
        return this.name;
      },
    },
  },
  methods: {
    toggleActive(name) {
      this.activeElement = name;
    },
  },
};
</script>
