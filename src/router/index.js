import Vue from 'vue'
import Router from 'vue-router'
import AddEssay from '@/components/essay/AddEssay'
import Login from '@/components/user/Login'
import Essay from '@/components/essay/EssayList'
import EssayDetail from '@/components/essay/EssayDetail'
import MySettings from '@/components/user/MySettings'
import EssayTab from '@/components/essay/EssayTab'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/essay'
    },
    {
      path: '/essay',
      component: Essay
    },
    {
      path: '/addEssay',
      name: 'AddEssay',
      component: AddEssay
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/essay/:id',
      component: EssayDetail
    },{
      path: '/me',
      component: MySettings
    },
    {
      path: '/essayTab',
      component: EssayTab
    }
  ]
})
