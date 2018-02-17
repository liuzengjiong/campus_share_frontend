
import constant_ from '@/components/tool/Constant'

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
    getToken(){
        return 'Auth '+localStorage.getItem('token');
    },
    getLoginUser(){
      var userStr =  localStorage.getItem('userLogin');
      console.log(userStr);
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
