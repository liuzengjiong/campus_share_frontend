<template>

  <div>
    <div>
      <group >
        <popup-radio title="slot:each-item" :options="options3" v-model="option5" ref="selectOk" v-show="false" @on-hide='gotoAddPage()'>
          <template slot-scope="props" slot="each-item"><!-- use scope="props" when vue < 2.5.0 -->
            <p>
               {{ props.label }}
                <br>
                <span style="color:#666;font-size:0.8rem">{{options3Mean[props.index]}}</span>
            </p>
          </template>
        </popup-radio>
      </group>
    </div>
  <div class="footer">
    <ul class="footer-cont">
        <li>
          <router-link to="/essayList">
            <div>任务</div>
          </router-link>
        </li>
        <li style='width: 34%;' @click="addFunction()">
        <!--  <router-link to="/helloWord">-->
            <img src="@/assets/add.png" style="width:1.8rem;height:1.8rem;display:block;position:absolute;bottom:0;left:50%;margin-left:-0.9rem;">
          <!--</router-link>-->
        </li>
        <li>
          <router-link to="/">
            <div>我</div>
          </router-link>
        </li>
    </ul>
  </div>
  </div>
</template>


<script>
import {Group,PopupRadio } from 'vux'

const haveSelectOption = false;

export default {
  components: {
    Group,
    PopupRadio
  },
  data () {
    return {
      option1: 'A',
      options1: ['A', 'B', 'C'],
      option2: '',
      options2: [{
        key: 'A',
        value: 'label A'
      }, {
        key: 'B',
        value: 'label B'
      }],
      option3: 'C',
      options3: ['求助', '共享'],
      options3Mean:['向其他人寻求资源或帮助','提供你的闲置资源'],
      option4: 'B',
      option5: null
    }
  },
  methods:{
    addFunction(){
        this.$refs.selectOk.show();
        this.option5=null;
      /*  this.$emit('showSelect');*/
    },
    gotoAddPage(){

      if(this.haveSelectOption && this.option5 == null){
        //防止初始化后被隐藏
        this.$refs.selectOk.show();
      }
      var result = this.option5;
      if(result == null){
         this.haveSelectOption = false;
      }else{
         this.haveSelectOption = true;
      }
      console.log("选择结果：" + result);
      if(this.haveSelectOption){
         this.$router.push({path:'/helloWord'})
      }
    }
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
    width: 33%;
    height: 1.3rem;
    line-height: 1.3rem;
    font-size: 1.0rem;
    color: #ff8000;
    text-align: center;
  }
  .footer-cont li:active {
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
