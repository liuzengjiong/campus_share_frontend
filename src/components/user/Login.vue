<template>
  <div :style="loginDivStyle">
    <div :style="titleDivStyle"> 欢迎使用校园互助平台 </div>
    <group title="用户登录">
      <x-input  :max="16" title='帐号' placeholder="请输入帐号" required v-model="userNo"></x-input>
      <x-input  :max="20" title='密码' type="password" placeholder="请输入密码" required v-model="userPassword"></x-input>
    </group>
    <div :style="errorStyle">{{errorMsg}}</div>
    <div style="padding:15px;">
     <x-button @click.native="doLogin" type="primary">登录</x-button>
   </div>
   <loading :show="showLoading" :text="loadingText"></loading>
  </div>
</template>

<script>
import { XInput, Group ,XButton,Loading} from 'vux'
import auth from '@/components/tool/Auth'
export default {
  components: {
    XInput,
    Group,
    XButton,
    Loading
  },
  data () {
    return {
      showLoading : false,
      loadingText : '加载中',
      userNo: '',
      userPassword: '',
      errorStyle:'color:red;font-size:0.6rem;margin-left:0.3rem',
      errorMsg:'',
      loginDivStyle: 'height:5rem;width:100%;position:absolute;top:50%;margin-top:-4rem',
      titleDivStyle: 'height:2rem;text-align:center;width:100%;position:relative;bottom :20%'
    }
  },
  methods: {
    change (val) {
      console.log('on change', val)
    },
    doLogin(){
       var info = {
         userNo: this.userNo,
         password: this.userPassword
       }
       auth.login(this,info);
    }
  }
}
</script>
