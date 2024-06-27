export default {
  path: "/vieworder",
  redirect: "/vieworder/index",
  meta: {
    icon: "ep:goods",
    // showLink: false,
    title: "订单查询",
    rank: 10
  },
  children: [
    {
      path: "/vieworder/index",
      name: "VIEWORDER",
      component: () => import("@/views/vieworder/index.vue"),
      meta: {
        title: "订单查询",
        roles: ['user']
      }
    },
  ]
} satisfies RouteConfigsTable;
