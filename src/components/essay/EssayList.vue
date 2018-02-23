<template lang="html">

  <div>
    <x-header>任务列表</x-header>
    <div>
       <tab :line-width=2 active-color='#799dbe' v-model="tabIndex">
        <tab-item class="vux-center" v-for="(tabItem, tabIndex) in tabList" :key="tabIndex">{{tabItem}}</tab-item>
      </tab>
      <swiper v-model="tabIndex" :show-dots="false">
        <swiper-item v-for="(tabItem, tabIndex) in tabList" :key="tabIndex">
          <div>

          </div>
        </swiper-item>
      </swiper>
    </div>
    <scroller use-pullup :pullup-config="pullupDefaultConfig" @on-pullup-loading="loadMore"
          use-pulldown :pulldown-config="pulldownDefaultConfig" @on-pulldown-loading="refresh"
          lock-x ref="scrollerBottom" height="-48" style='font-size:0.6rem;'>
      <div>
      <ul  v-for='item in list' :key="item.id">
        <li class="essayItem">
        <hr />
        <router-link tag='li' :to="'/essay/:'+item.essayId">
                 <div class="title clearfix">
                   <img :src=getAvatar(item.author.avatarPath) alt="头像">
                 </div>
                 <div class="titleText">
                    {{item.title}}
                 </div>
                 <div class="summary">
                   {{item.summary}}
                 </div>
                 <div class="operate clearfix">

                   <span class="icon view-icon"></span><span class="icon_text">{{item.readNum}}</span>
                   <span class="icon reply-icon"></span><span class="icon_text">{{item.commentNum}}</span>
                  <span class="publishInfo">{{item.author.nickname}} 发布于 {{getRecentTime(item.createTime)}}</span>
                 </div>
        </router-link>
      </li>
      </ul>
     <div class="tip" v-show="showTip">
        <span style="white-space:pre">   </span><span class="line"></span>
        <span style="white-space:pre">   </span><span class="txt">暂无更多数据</span>
        <span style="white-space:pre">   </span><span class="line"></span>
     </div>
   </div>
  </scroller>
     <loading :show="showLoading" :text="loadingText"></loading>
    <homeFooter></homeFooter>
  </div>

</template>

<script>
 import Util from '@/components/tool/Util'

 import {Scroller ,Loading,XHeader,Tab, TabItem,Swiper, SwiperItem } from 'vux'
 import homeFooter from '@/components/nav/footer.vue'
 import constant_ from '@/components/tool/Constant'
 import loadPlugin from '@/components/tool/LoadPlugin'

 const essayListBaseUrl = constant_.SERVER_PATH + "/essay/list/";

 const tabList = () => ['求助', '共享'];

 const pulldownDefaultConfig = {
    content: '下拉刷新',
    height: 40,
    autoRefresh: false,
    downContent: '下拉刷新',
    upContent: '释放后刷新',
    loadingContent: '正在刷新...',
    clsPrefix: 'xs-plugin-pulldown-'
  }

  const pullupDefaultConfig = {
    content: '上拉加载更多',
    pullUpHeight: 60,
    height: 40,
    autoRefresh: false,
    downContent: '释放后加载',
    upContent: '上拉加载更多',
    loadingContent: '加载中...',
    clsPrefix: 'xs-plugin-pullup-'
  }

export default {
  components:{
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Scroller,
    Loading,
    XHeader,
    homeFooter
  },
  data () {
      return {
          pullupDefaultConfig: pullupDefaultConfig,
          pulldownDefaultConfig: pulldownDefaultConfig,
          list: [],
          pageNo : 1,
          rows : 10,
          showTip : false,
          showLoading : false,
          loadingText : "加载中",
          tabList: tabList(),
          tabIndex: 0
      }
  },
  mounted () {
      this.refresh();
  },
  methods: {
      fetchData(cb) {
        const essayListUrl = essayListBaseUrl + "/" + this.pageNo + "/" + this.rows;
        this.showLoading = true;
        const _this = this;
        this.$http.get(essayListUrl).then((data) => {
          this.$nextTick(() => {
            this.$refs.scrollerBottom.reset()
          })
          this.showLoading = false;
          if(data.body.code == constant_.CODE.SUCCESS){
            const gotList = data.body.data.list;

            if(data.body.data.pages <= this.pageNo){
                this.$refs.scrollerBottom.disablePullup()
                this.showTip = true;
            }else{
                this.$refs.scrollerBottom.enablePullup();
                this.showTip = false;
            }
            cb(gotList);
          }else{
            if(data.body.msg){
               alert(data.body.msg);
            }else{
               alert("抱歉，系统异常，请稍后再试");
            }
          }

        })
      },
      refresh() {
        this.pageNo  = 1;
        this.fetchData(gotList => {
          this.list = gotList;
          this.$refs.scrollerBottom.donePulldown();
        })
      },
      loadMore() {
        this.pageNo ++ ;
        this.fetchData(gotList => {
          this.list = this.list.concat(gotList)
          this.$refs.scrollerBottom.donePullup()
        })
      },
      getRecentTime (date) {
        return Util.getIntervalTime(date)
      },
      getAvatar(avatarPath){
         if(avatarPath){
           return avatarPath;
         }
         return '/static/img/defaultAvatar.png'
      }
    }
}
</script>

<style>

  .tip {
   height: 0.8rem;
   line-height: 0.8rem;
   text-align: center;
   margin-top : 0.8rem;
  }
  .tip .line {
   display: inline-block;
   width: 2rem;
   border-top: 1px solid #ccc ;
  }
  .tip .txt {
   color: #686868;
   vertical-align: middle;
   font-size:0.7rem;
  }

  .essayItem{
     font-size: 0.8rem;
     width: 100%;
     box-sizing: border-box;
     padding: 0 10px;
     color:#333;
  }
  .essayItem .title img{
    font-size:0.5rem;
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.3rem;
    border-radius: 50%;
    float: left;
  }

  .titleText{
      margin-left: 1.5rem;
  }

  .publishInfo{
    font-size: 0.6rem;
    display: block;
    margin: 0 1px;
    color: #969696;
  }
  .summary{
    display: block;
    font-size: 0.6rem;
    color: #666;
    margin-left: 1.5rem;
  }
  .operate{
    margin-left: 1.5rem;
  }
  .operate span{
    display: inline-block;
    color: #bfbfbf;
  }
  .icon{
    width: 0.8rem;
    height: 0.8rem;
    background-size:0.8rem;
    background-repeat: no-repeat;
    margin: -4px 1px;
  }
  .view-icon{
    background-image: url(../../assets/view.png);
  }
  .icon_text{
    margin: 0 10px;
  }
  .reply-icon{
    background-image: url(../../assets/reply.png);
  }
  hr{
    margin-bottom:0.5rem;
    opacity:0.3;
  }

</style>

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
  height: 100%;
}
</style>
