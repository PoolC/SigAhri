import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import admin from './admin.ts';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/page/about', component: Home },
  { path: '/login', component: () => import(/* webpackChunkName: "login" */'@/views/Login.vue') },
  { path: '/project', component: () => import(/* webpackChunkName: "projectBoard" */'@/views/ProjectBoard.vue') },
  { path: '/project/:id', component: () => import(/* webpackChunkName: "project" */'@/views/Project.vue') },
  { path: '/board', component: () => import(/* webpackChunkName: "board" */'@/views/Board.vue') },
  { path: '/board/:path', component: () => import(/* webpackChunkName: "board" */'@/views/Board.vue') },
  { path: '/posts/:id', component: () => import(/* webpackChunkName: "post" */'@/views/Post.vue') },
  { path: '/article/view', component: () => import(/* webpackChunkName: "post" */'@/views/Post.vue') },
  { path: '/register', component: () => import(/* webpackChunkName: "register" */'@/views/Register.vue') },
  { path: '/info', component: () => import(/* webpackChunkName: "info" */'@/views/Info.vue') },
  { path: '/accounts/password-reset', component: () => import(/* webpackChunkName: "password" */'@/views/PasswordReset.vue') },
  admin,
  { path: '*', component: () => import(/* webpackChunkName: "notfound" */'@/views/NotFound.vue') },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
