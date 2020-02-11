import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import admin from './admin.ts';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: Home },
  { path: '/page/about', component: Home },
  { path: '/login', component: () => import(/* webpackChunkName: "login" */'@/views/account/Login.vue') },
  { path: '/project', component: () => import(/* webpackChunkName: "projectBoard" */'@/views/project/ProjectBoard.vue') },
  { path: '/project/:id', component: () => import(/* webpackChunkName: "project" */'@/views/project/Project.vue') },
  { path: '/board', component: () => import(/* webpackChunkName: "board" */'@/views/board/Board.vue') },
  { path: '/board/:path', component: () => import(/* webpackChunkName: "board" */'@/views/board/Board.vue') },
  {
    path: '/posts/new',
    name: 'newPost',
    component: () => import(/* webpackChunkName: "newPost" */'@/views/board/PostNewEdit.vue'),
    props: true,
  },
  { path: '/posts/:id', component: () => import(/* webpackChunkName: "post" */'@/views/board/Post.vue') },
  { path: '/article/view', component: () => import(/* webpackChunkName: "post" */'@/views/board/Post.vue') },
  { path: '/register', component: () => import(/* webpackChunkName: "register" */'@/views/account/Register.vue') },
  { path: '/info', component: () => import(/* webpackChunkName: "info" */'@/views/account/Info.vue') },
  { path: '/accounts/password-reset', component: () => import(/* webpackChunkName: "password" */'@/views/account/PasswordReset.vue') },
  admin,
  { path: '*', component: () => import(/* webpackChunkName: "notfound" */'@/views/NotFound.vue') },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
