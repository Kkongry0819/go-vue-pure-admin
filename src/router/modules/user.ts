export default {
  path: "/user",
  redirect: "/user/index",
  meta: {
    icon: "arcticons:genshin-impact",
    // showLink: false,
    title: "用户管理",
    rank: 10
  },
  children: [
    {
      path: "/user/index",
      name: "USER",
      component: () => import("@/views/user/index.vue"),
      meta: {
        title: "用户管理",
        roles: ['admin']
      }
    },
  ]
} satisfies RouteConfigsTable;
