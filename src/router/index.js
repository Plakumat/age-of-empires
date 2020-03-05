import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/detail/:id?', name: "list", component: List }
  ],
  mode: 'history'
})

import Home from '../views/Home.vue'
import List from '../views/Detail.vue'

export default router
