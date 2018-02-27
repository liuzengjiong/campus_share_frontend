
import constant_ from '@/components/tool/Constant'
import router from '@/router/index'

const LOGIN_URL = constant_.SERVER_PATH +'/user/login'

export default{
    data:{
        authenticated:false
    },
    login(context,info){
        context.loadingText = "努力登录中";
        context.showLoading = true;
        context.$http.post(LOGIN_URL,info).then(function(data){
            context.showLoading = false;
            console.log(data.bodyText);
            var resJson = JSON.parse(data.bodyText);
            if(constant_.CODE.SUCCESS == resJson.code){
              localStorage.setItem('token',resJson.data.userLogin.token);
              localStorage.setItem('userLogin',JSON.stringify(resJson.data.userLogin));
              localStorage.setItem('userInfo',JSON.stringify(resJson.data.userInfo));
              this.authenticated = true
              //跳到home页
              this.$router.replace('/');
            }else{
                context.errorMsg = resJson.msg;
            }

        },function(err){
            console.log(err+","+err.body.message);
            context.errorMsg = err.body.message;
        })
    },
    logout(context){
      const _this = context;
      context.$vux.confirm.show({
        title: '确认退出登录吗？',
        onCancel () {

        },
        onConfirm (msg) {
          localStorage.removeItem('token');
          localStorage.removeItem('userLogin');
          localStorage.removeItem('userInfo');
          this.authenticated = false;
          _this.$router.replace('/login');
        }
      })
    },
    getToken(){
        return 'Auth '+localStorage.getItem('token');
    },
    getLoginUser(){
      var userStr =  localStorage.getItem('userLogin');
      if(userStr){
         return JSON.parse(userStr);
      }else{
        localStorage.setItem('token','');
        return userStr;
      }
    },
    getLoginUserInfo(){
      var userInfoStr =  localStorage.getItem('userInfo');
      if(userInfoStr){
         return JSON.parse(userInfoStr);
      }else{
        return userInfoStr;
      }
    },
    needLoginUserInfo(context,target){
      var userInfo = this.getLoginUserInfo();
      if(!userInfo){
        const _this = context;
        context.$vux.confirm.show({
          title: '是否前往登录？',
          content:'未登录无法' + target,
          onCancel () {
            _this.showMsgMiddle("未登录，无法" + target);
          },
          onConfirm (msg) {
            _this.$router.push('/login');
          }
        })
      }
      return userInfo;
    },
    checkAuth(){
        var token = localStorage.getItem('token');
        if(token){
            this.authenticated = true
        }else{
            this.authenticated = false
        }
    }
}
