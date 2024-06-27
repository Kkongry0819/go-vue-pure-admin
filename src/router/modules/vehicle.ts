export default {
  path: "/vehicle",
  redirect: "/vehicle/index",
  meta: {
    icon: "ph:car",
    // showLink: false,
    title: "车辆信息",
    rank: 10
  },
  children: [
    {
      path: "/vehicle/index",
      name: "VEHICLE",
      component: () => import("@/views/vehicle/index.vue"),
      meta: {
        title: "车辆信息",
        roles: ['admin']
      }
    },
  ]
} satisfies RouteConfigsTable;
