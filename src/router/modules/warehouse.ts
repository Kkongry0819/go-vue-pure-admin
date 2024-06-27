export default {
  path: "/warehouse",
  redirect: "/warehouse/index",
  meta: {
    icon: "majesticons:home-line",
    // showLink: false,
    title: "仓库信息",
    rank: 10
  },
  children: [
    {
      path: "/warehouse/index",
      name: "WAREHOUSE",
      component: () => import("@/views/warehouse/index.vue"),
      meta: {
        title: "仓库信息",
        roles: ['admin']
      }
    },
  ]
} satisfies RouteConfigsTable;
