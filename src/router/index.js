import Vue from "vue";
import VueRouter from "vue-router";
import DAO2022 from "../views/DAO2022.vue";
import DAO2023 from "../views/DAO2023.vue";
import Airdrop from "../views/Airdrop.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/home/Index.vue"),
    children: [
      {
        path: "",
        name: "Home",
        redirect: "/dao-2023",
        component: () => import("@/views/home/Index.vue")
      },
      {
        path: "/dao-2023",
        name: "DAO2023",
        component: DAO2023
      },
      {
        path: "/dao-2022",
        name: "DAO2022",
        component: DAO2022
      },
      {
        path: "/airdrop",
        name: "Airdrop",
        component: Airdrop
      },
      {
        path: "/404",
        component: () => import("@/views/404.vue")
      },
      {
        path: "*",
        redirect: "/404"
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash };
    if (savedPosition) return savedPosition;

    return { x: 0, y: 0 };
  },
  routes
});

export default router;
