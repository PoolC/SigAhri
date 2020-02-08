export default {
  path: '/admin',
  component: () => import(/* webpackChunkName: "adminMain" */'@/views/admin/Main.vue'),
};
