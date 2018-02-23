
import constant_ from '@/components/tool/Constant'
import router from '@/router/index'

const LOGIN_URL = constant_.SERVER_PATH +'/user/login'

export default{
    data:{
        authenticated:false
    },
    login(context,info){
        context.$http.post(LOGIN_URL,info).then(function(data){
            console.log(data.bodyText);
            var resJson = JSON.parse(data.bodyText);
            if(constant_.CODE.SUCCESS == resJson.code){
              localStorage.setItem('token',resJson.data.token);
              localStorage.setItem('userLogin',JSON.stringify(resJson.data));
              this.authenticated = true
              //跳到home页
              this.$router.push('/');
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
    checkAuth(){
        var token = localStorage.getItem('token');
        if(token){
            this.authenticated = true
        }else{
            this.authenticated = false
        }
    }
}
