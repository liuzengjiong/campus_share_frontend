<template>
  <div>
     <tab :line-width=2 active-color='#799dbe' v-model="index">
      <tab-item class="vux-center" v-for="(item, index) in list2" :key="index">{{item}}</tab-item>
    </tab>
    <swiper v-model="index" height="100px" :show-dots="false">
      <swiper-item v-for="(item, index) in list2" :key="index">
        <div class="tab-swiper vux-center">
          <div style="color:red">  {{item}} Container </div>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import { Tab, TabItem,Swiper, SwiperItem } from 'vux'
  const list = () => ['求助', '共享'];


  export default {
    components: {
      Tab,
      TabItem,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        list2: list(),
        index: 0
      }
    },
    mounted () {

    },
    methods: {

    }
  }
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/center.less';
.box {
  padding: 15px;
}
.active-6-1 {
  color: rgb(252, 55, 140) !important;
  border-color: rgb(252, 55, 140) !important;
}
.active-6-2 {
  color: #04be02 !important;
  border-color: #04be02 !important;
}
.active-6-3 {
  color: rgb(55, 174, 252) !important;
  border-color: rgb(55, 174, 252) !important;
}
.tab-swiper {
  background-color: #fff;
  height: 100px;
}
</style>

<!--此style用来设置vux组件的部分样式调整-->
<style>
/*  .tab-component .vux-tab-bar-inner {
    border-radius: 10px !important;
  }

  /*改变原来tabBox的flex布局*/
/*  .tab-component .vux-tab .vux-tab-item {
    display: inline-block;
    width: auto;
    height: 100%;
    padding: 0 10px;
    flex: none;
    background-color: #f2f4f5;
  }*/

  /*定义tab-item选中时的样式*/
/*  .tab-component .vux-tab .vux-tab-item.vux-tab-selected {
    font-size: 16px;
    color: #149c81;
    border-bottom: 3px solid #04BE02;
  }*/

/*  .box {
    padding: 15px;
  }*/
</style>
