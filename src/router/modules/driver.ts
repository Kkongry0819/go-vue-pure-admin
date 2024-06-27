export default {
  path: "/driver",
  redirect: "/driver/index",
  meta: {
    icon: "healthicons:truck-driver-outline",
    // showLink: false,
    title: "司机信息",
    rank: 5
  },
  children: [
    {
      path: "/driver/index",
      name: "DRIVER",
      component: () => import("@/views/driver/index.vue"),
      meta: {
        title: "司机信息",
        roles: ['admin']
      }
    },
  ]
} satisfies RouteConfigsTable;
