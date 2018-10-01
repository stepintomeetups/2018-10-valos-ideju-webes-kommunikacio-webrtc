import Vue from 'vue'
import Router from 'vue-router'
import UserList from '@/components/UserList'
import OutgoingCall from '@/components/OutgoingCall'
import Login from '@/components/Login'
import store from '@/store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (store.state.name.length > 3) {
          next({name: 'UserList'})
        }
        next()
      }
    },
    {
      path: '/list',
      name: 'UserList',
      component: UserList
    },
    {
      path: '/outgoing',
      name: 'OutgoingCall',
      component: OutgoingCall
    }
  ]
})
