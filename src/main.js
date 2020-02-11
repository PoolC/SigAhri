import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import './assets/css/index.css';

Vue.config.productionTip = false;
Vue.component('Editor', () => import(/* webpackChunkName: "editor" */ '@toast-ui/vue-editor/src/Editor'));
Vue.component('Viewer', () => import(/* webpackChunkName: "viewer" */ '@toast-ui/vue-editor/src/Viewer'));

Vue.use({
  install(V) {
    console.log(localStorage.getItem('accessToken'));

    // eslint-disable-next-line no-param-reassign
    V.prototype.$api = axios.create({
      baseURL: 'https://api.poolc.org/graphql',
      method: 'POST',
      timeout: 3000,
      headers: {
        'Content-Type': 'application/graphql',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  },
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
