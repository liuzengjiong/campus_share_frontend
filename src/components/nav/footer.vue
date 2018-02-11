<template>

  <div>
    <div>
        <actionsheet v-model="showModel" :menus="addItems" show-cancel :close-on-clicking-mask="closeOnClickMask" @on-click-menu="clickItem">
           <p slot="header" v-html="headerContent"></p>
        </actionsheet>
    </div>
  <div class="footer">
    <ul class="footer-cont">
        <li class="activeChange">
          <router-link to="/essayList">
            <div>任务</div>
          </router-link>
        </li>
        <li style='width: 20%;'>
        <!--  <router-link to="/helloWord">-->
            <img src="@/assets/add.png" @click="addFunction()" style="width:1.8rem;height:1.8rem;display:block;position:absolute;bottom:0;left:50%;margin-left:-0.9rem;">
          <!--</router-link>-->
        </li>
        <li class="activeChange">
          <router-link to="/">
            <div>我</div>
          </router-link>
        </li>
    </ul>
  </div>
  </div>
</template>


<script>
import {Actionsheet } from 'vux'

const haveSelectOption = false;

export default {
  components: {
    Actionsheet
  },
  data () {
    return{
      headerContent:"<font size='0.8rem' color='#799dbe'>请选择要发布的帖子类型</font>",
      showModel: false,
      closeOnClickMask:false,
      addItems: [{
        code:'askHelp',
        label:'求助<br /><span style="color:#666;font-size:0.5rem;">向其他人寻求资源或帮助</span>'
      },{
        code:'share',
        label:'共享<br /><span style="color:#666;font-size:0.5rem;">提供你的闲置资源</span>'
      }]
    }
  },
  methods:{
    addFunction(){
      this.showModel = true;
        /*this.$refs.selectOk.show();
        this.option5=null;*/
      /*  this.$emit('showSelect');*/
    },
    clickItem(key,item){
      if(!item){
        console.log("item:",item);
        return;
      }
      var code = item.code;
      if('askHelp' === code){
        alert("假装去了求助页面");
      }else if('share' === code){
        this.$router.push("/addEssay");
      }
    }
  },
  directives:{

  },
  haveSelectOption
}
</script>



<style lang="css">
  .footer {
    height: 1.3rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 2px solid #ccc;
    background-color: #fff;
  }
  .footer-cont li {
    float: left;
    width: 40%;
    height: 1.3rem;
    line-height: 1.3rem;
    font-size: 1.0rem;
    color: #ff8000;
    text-align: center;
  }
  .footer-cont .activeChange:active {
    background-color: #ccc;
  }
  .footer-cont:after {
    content: '';
    display: block;
    clear: both;
    width: 0;
    height: 0;
  }
</style>
