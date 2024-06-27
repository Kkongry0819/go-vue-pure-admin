export default {
  path: "/taskedit",
  redirect: "/taskedit/index",
  meta: {
    icon: "ph:user-list-light",
    // showLink: false,
    title: "运输任务",
    rank: 5
  },
  children: [
    {
      path: "/taskedit/index",
      name: "TASKEDIT",
      component: () => import("@/views/taskedit/index.vue"),
      meta: {
        title: "运输任务",
        roles: ['admin']
      }
    },
  ]
} satisfies RouteConfigsTable;
