export default {
  path: "/cargo",
  redirect: "/cargo/index",
  meta: {
    icon: "material-symbols-light:order-approve-outline",
    // showLink: false,
    title: "货物总表",
    rank: 15
  },
  children: [
    {
      path: "/cargo/index",
      name: "CARGO",
      component: () => import("@/views/cargo/index.vue"),
      meta: {
        title: "货物总表",
        roles: ['admin']
      }
    },
  ]
} satisfies RouteConfigsTable;
