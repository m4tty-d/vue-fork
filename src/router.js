import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/game/:roomId',
      name: 'game',
      component: () => import(/* webpackChunkName: "game" */ '@/views/Game.vue')
    },
    {
      path: '/watch-zone',
      name: 'watch',
      component: () => import(/* webpackChunkName: "watch" */ '@/views/Watch.vue')
    }
  ]
})
