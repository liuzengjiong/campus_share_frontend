// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'

import router from './router/index'

import 'font-awesome/css/font-awesome.css'

import constant_ from '@/components/tool/Constant'
import auth from '@/components/tool/Auth'

import VueResource from 'vue-resource'
import  { ConfirmPlugin,ToastPlugin } from 'vux'

Vue.use(ConfirmPlugin)
Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(ToastPlugin)

auth.checkAuth();
if(!auth.authenticated){
    router.push('/login');
}

Vue.http.interceptors.push(function(request,next){
    request.headers.set('Authorization', auth.getToken());
    next(function (response) {
      var resJson = JSON.parse(response.bodyText);
   　　if(constant_.CODE.UNLOGIN == resJson.code){
           var content = "登录异常，是否重新登录";
           if(resJson.msg){
             content = resJson.msg + "，是否重新登录";
           }
           var _this = this;
           this.$vux.confirm.show({
             title: '登录提醒',
             content:content,
             onCancel () {

             },
             onConfirm (msg) {
                _this.$router.push('/login');
             }
           })
      }
　　　　return response;

    })
});


Vue.prototype.trim = function(str){
    if(str){
      return str.replace(/^\s+|\s+$/gm,'');
    }
    return str;
}

Vue.prototype.showMsgMiddle = function(msg){
    if(msg){
      this.$vux.toast.text(msg,'middle');
    }
}

/*Vue.prototype.vuxComfirm = function(title,content,cbConfirm,cbCancel){
  this.$vux.confirm.show({
    title: title,
    content: content,
    onCancel () {
      cbCancel();
      return false;
    },
    onConfirm () {
      cbConfirm();
      return true;
    }
  })
}*/




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
}).$mount('#app-box');
