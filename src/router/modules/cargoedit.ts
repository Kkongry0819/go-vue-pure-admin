export default {
  path: "/cargoedit",
  redirect: "/cargoedit/index",
  meta: {
    icon: "system-uicons:create",
    // showLink: false,
    title: "订单管理",
    rank: 5
  },
  children: [
    {
      path: "/cargoedit/index",
      name: "EDIT",
      component: () => import("@/views/cargoedit/index.vue"),
      meta: {
        title: "订单管理",
        roles: ['admin']
      }
    },
    
  ]
} satisfies RouteConfigsTable;

