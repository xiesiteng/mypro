import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import Rigester from '@/components/Rigester'
import Mine from '@/components/Mine'
import Detail from '@/components/Detail'
import Manage from '@/components/Manage'
import Forget from '@/components/Forget'

Vue.use(Router)

export default new Router({
  mode: 'history', // 去掉url地址中的#
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      redirect: '/login'
    },
    {
      path: '/index',
      name: 'Index',
      component: Index
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/rigester',
      name: 'Rigester',
      component: Rigester
    },
    {
      path: '/mine',
      name: 'Mine',
      component: Mine
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage
    },
    {
      path: '/forget',
      name: 'Forget',
      component: Forget
    }
  ]
})
