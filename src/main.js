// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import Home from './components/HelloFromVux'

import router from './router/index'

import 'font-awesome/css/font-awesome.css'

import constant_ from '@/components/tool/Constant'
import auth from '@/components/tool/Auth'

import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.use(VueRouter)

auth.checkAuth();
if(!auth.authenticated){
    router.push('/login');
}

Vue.http.interceptors.push((request, next) => {

  // modify request
  request.headers.set('Authorization', auth.getToken());
  // continue to next interceptor
　　next((response) => {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
       var resJson = JSON.parse(response.bodyText);
    　　if(constant_.CODE.UNLOGIN == resJson.code){
            if(resJson.msg){
                alert(resJson.msg);
            }else{
                alert("抱歉，登录异常，请重新登录");
            }
            router.push('/login');
       }
　　　　return response;

  });
});

/*const routes = [{
  path: '/',
  component: Home
}]*/

/*const router = new VueRouter({
  routes
})*/

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
