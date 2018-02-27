<template>
  <div class="background-color:#FFF">
    <x-header>{{headerText}}</x-header>
    <group class='titleCss'>
      <x-input  :max="50" title='任务标题' placeholder="请起一个合适的标题" required v-model="title" placeholder-align='right'></x-input>
      <popup-radio :title="resourceTitle" :options="resourceData" v-model="resourceType" :placeholder="resourceTypeTip">
         <p slot="popup-header" class="vux-1px-b resource-slot">{{resourceTypeTip}}</p>
       </popup-radio>
       <cell :title="rewardTitle" :value="rewardDisplay" is-link @click.native='showRewardPanel'></cell>
    </group>
      <editor :content="content" :height="height" @change="updateData" :z-index="100" style="margin-bottom:1.5rem"></editor>
      <addEssayFooter @submit='submit' ref='addEssayFooter'></addEssayFooter>
      <loading :show="showLoading" :text="loadingText"></loading>
      <div v-transfer-dom>
        <popup v-model="showRewardPopup" :hide-on-blur="false">
          <div>
            <group>
              <x-switch :title="rewardTitle" v-model="needReward"></x-switch>
            </group>
            <div v-if="needReward">
              <group>
                <popup-radio title="报酬类型" :options="rewardData" v-model="rewardType" placeholder="请选择报酬类型">
                   <p slot="popup-header" class="vux-1px-b resource-slot">请选择报酬类型</p>
                 </popup-radio>
                <x-textarea title="报酬描述" v-model="rewardDetail" placeholder="请根据你的报酬类型进行具体描述" :max="100" autosize></x-textarea>
              </group>
              <group>
                <x-input  :max="20" title='联系电话' placeholder="让任务执行者快速找到你" required v-model="phoneNumber" placeholder-align='right'></x-input>
              </group>
              <group title="任务接受人数限制，0为不限">
                <x-number title="人数" v-model="maxReceiveNum" button-style="round" :min="0" :max="9999" fillable></x-number>
              </group>
          </div>
            <div style="padding:20px 15px;">
              <x-button type="primary" @click.native='ensureReward'>确定</x-button>
            </div>
          </div>
        </popup>
      </div>
    </div>
</template>
<script>
import VueHtml5Editor from 'vue-html5-editor'
import AddEssayFooter from '@/components/essay/AddEssayFooter'

import auth from '@/components/tool/Auth'
import constant_ from '@/components/tool/Constant'

import {XNumber,XTextarea,Group,XInput,XHeader,PopupRadio,Loading,Cell,TransferDom,Popup,XSwitch,XButton} from 'vux'

const uploadImageUrl = constant_.SERVER_PATH + "/upload/uploadImage";
const publishEssayUrl = constant_.SERVER_PATH + "essay/add";
const resourceTypeUrl = constant_.SERVER_PATH + "/config/resource-types";
const rewardTypeUrl = constant_.SERVER_PATH + "/config/reward-types";

const option = {
  // 自定义各个图标的class，默认使用的是font-awesome提供的图标
      // custom icon class of built-in modules,default using font-awesome
      icons: {
          text: "fa fa-pencil",
          color: "fa fa-paint-brush",
          font: "fa fa-font",
          align: "fa fa-align-justify",
          list: "fa fa-list",
          link: "fa fa-chain",
          unlink: "fa fa-chain-broken",
          tabulation: "fa fa-table",
          image: "fa fa-file-image-o",
          hr: "fa fa-minus",
          eraser: "fa fa-eraser",
          undo: "fa-undo fa",
          "full-screen": "fa fa-arrows-alt",
          info: "fa fa-info",
      },
      // 配置图片模块
      // config image module
      image: {
          // 文件最大体积，单位字节  max file size
          sizeLimit: 512 * 1024,
          // 上传参数,默认把图片转为base64而不上传
          // upload config,default null and convert image to base64
          upload: {
              url: uploadImageUrl,
              headers: {},
              params: {},
              fieldName: "file"
          },
          // 压缩参数,默认使用localResizeIMG进行压缩,设置为null禁止压缩
          // compression config,default resize image by localResizeIMG (https://github.com/think2011/localResizeIMG)
          // set null to disable compression
          compress: {
              width: 1600,
              height: 1600,
              quality: 80
          },
          // 响应数据处理,最终返回图片链接
          // handle response data，return image url
          uploadHandler(responseText){
              //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
              var json = JSON.parse(responseText)
              if (constant_.CODE.SUCCESS != json.code) {
                  this.showMsgMiddle(json.msg);
              } else {
                  return json.data;
              }
          }
      },
      // 语言，内建的有英文（en-us）和中文（zh-cn）
      //default en-us, en-us and zh-cn are built-in
      language: "zh-cn",
      // 自定义语言
      i18n: {
          //specify your language here
          "zh-cn": {
              "align": "对齐方式",
              "image": "图片",
              "list": "列表",
              "link": "链接",
              "unlink": "去除链接",
              "table": "表格",
              "font": "文字",
              "full screen": "全屏",
              "text": "排版",
              "eraser": "格式清除",
              "info": "关于",
              "color": "颜色",
              "please enter a url": "请输入地址",
              "create link": "创建链接",
              "bold": "加粗",
              "italic": "倾斜",
              "underline": "下划线",
              "strike through": "删除线",
              "subscript": "上标",
              "superscript": "下标",
              "heading": "标题",
              "font name": "字体",
              "font size": "文字大小",
              "left justify": "左对齐",
              "center justify": "居中",
              "right justify": "右对齐",
              "ordered list": "有序列表",
              "unordered list": "无序列表",
              "fore color": "前景色",
              "background color": "背景色",
              "row count": "行数",
              "column count": "列数",
              "save": "确定",
              "upload": "上传",
              "progress": "进度",
              "unknown": "未知",
              "please wait": "请稍等",
              "error": "错误",
              "abort": "中断",
              "reset": "重置"
          }
      },
      // 隐藏不想要显示出来的模块
      // the modules you don't want
      hiddenModules: [],
      // 自定义要显示的模块，并控制顺序
      // keep only the modules you want and customize the order.
      // can be used with hiddenModules together
      visibleModules: [
          "text",
          "color",
          /*"font",*/
          "align",
        /*  "list",*/
          "link",
          /*"unlink",*/
          "tabulation",
          "image",
          "hr",
          "eraser",
          "undo",
        /*  "full-screen",
          "info",*/
      ]
}

const editor = new VueHtml5Editor(option);
export default {
  directives: {
    TransferDom
  },
  components: {
    XNumber,
    XTextarea,
    XButton,
    XSwitch,
    Popup,
    Loading,
    PopupRadio,
    XHeader,
    Group,
    XInput,
    editor,
    Cell,
    AddEssayFooter
  },data(){
    var editorHeight = document.documentElement.clientHeight/2;
    return{
      height:editorHeight,
      content:'',
      headerText : '发布任务',
      title:'',
      essayType:'',
      resourceTitle: '资源类型',
      resourceData:[],
      resourceType: '',
      resourceTypeTip: '请选择资源类型',
      showLoading: false,
      loadingText: '加载中',
      rewardTitle: '报酬',
      rewardDisplay: '请选择',
      showRewardPopup: false,
      needReward: false,
      rewardDetail: '',
      rewardType: '',
      rewardData: [],
      maxReceiveNum: 0,
      phoneNumber:''
    }
  },methods:{
    updateData : function(data){
       this.content = data;
    },
    checkData(){
      if (this.trim(this.content) === '') {
        this.showMsgMiddle("请输入任务内容");
        return false;
      }
      if (this.trim(this.title) === ''){
        this.showMsgMiddle("请输入标题");
        return false;
      }
      if (this.trim(this.resourceType) === ''){
        this.showMsgMiddle("请选择资源类型");
        return false;
      }
      return true;
    },
    submit(){
        if (!this.checkData()) {
          return;
        } else {
          var authorId = '';
          var userLogin = auth.getLoginUser();
          console.log(userLogin);
          if(userLogin){
              authorId = userLogin.userId;
          }else{
              this.showMsgMiddle("未登录，无法发布任务");
              return;
          }
          const reqData = {
              authorId : authorId,
              title : this.title,
              essayType: this.essayType,
              resourceType:this.resourceType,
              content:this.content
          };
          const reward = {
             rewardTypeValue : this.rewardType,
             rewardDetail : this.rewardDetail,
             maxReceiveNum : this.maxReceiveNum,
             phoneNumber : this.phoneNumber
          }
          if(this.needReward){
              reqData.reward = reward;
          }
          this.loadingText = '发布中';
          this.showLoading = true;
          this.$http.post(publishEssayUrl,reqData).then((data) => {
              this.showLoading = false;
              if(data.body.code == constant_.CODE.SUCCESS){
                 this.showMsgMiddle("发布成功");
                 this.$router.go(-1);
              }else{
                 if(data.body.msg){
                    this.showMsgMiddle(data.body.msg);
                 }else{
                    this.showMsgMiddle("抱歉，发布异常");
                 }
              }
          });
        }
    },
    getResourceType(){
      this.loadingText = '加载中';
      this.showLoading = true;
      this.$http.get(resourceTypeUrl).then((data) => {
          console.log(data);
          this.showLoading = false;
          if(data.body.code == constant_.CODE.SUCCESS){
            this.resourceData = data.body.data;
          }else{
              this.$refs.addEssayFooter.disableSubmit();
              if(data.body.msg){
                  this.showMsgMiddle(data.body.msg);
              }else{
                  this.showMsgMiddle("抱歉，系统异常，请稍后再试");
              }
          }
      });
    },
    getRewardType(){
      if(this.rewardData.length > 0){
        return;
      }
      this.loadingText = '加载中';
      this.showLoading = true;
      this.$http.get(rewardTypeUrl).then((data) => {
          this.showLoading = false;
          if(data.body.code == constant_.CODE.SUCCESS){
            this.rewardData = data.body.data;
          }else{
              this.needReward = false;
              this.showMsgMiddle("抱歉，报酬加载失败，请稍后再试");
          }
      });
    },
    showRewardPanel(){
      this.showRewardPopup = true;
    },
    ensureReward(){
      if(this.needReward){
         if(!this.rewardType){
           this.showMsgMiddle('请选择报酬类型');
           return;
         }
         if(!this.phoneNumber){
           this.showMsgMiddle('请输入联系电话');
           return;
         }
      }
      this.showReward();
      this.showRewardPopup = false;
    },
    showReward(){
      if(!this.phoneNumber || this.phoneNumber.trim().length == 0){
        var userInfo = auth.getLoginUserInfo();
        if(userInfo && userInfo.phone){
            this.phoneNumber = userInfo.phone;
        }
      }
      const urlEssayType = this.$route.query.type;
      if(urlEssayType === 'share'){
         this.rewardTitle = '收取报酬';
         if(!this.needReward){
            this.rewardDisplay = '不收取报酬';
         }else{
            let personNum = '人数：' + (this.maxReceiveNum==0?'不限':this.maxReceiveNum);
            this.rewardDisplay = this.rewardType + " - " + personNum;
         }
      }else if(urlEssayType === 'ask'){
        this.rewardTitle = '提供报酬';
        if(!this.needReward){
             this.rewardDisplay = '不提供报酬';
        }else{
           let personNum = '人数：' + (this.maxReceiveNum==0?'不限':this.maxReceiveNum);
           this.rewardDisplay = this.rewardType + " - " + personNum;
        }
      }
    }
  },
  watch:{
     needReward : function(val){
        if(val){
           this.getRewardType();
        }
     }
  },
  created () {
      this.essayType = this.$route.query.type;
      if(this.essayType === 'share'){
         this.headerText = '发布共享';
         this.essayType = '共享';
         this.resourceTypeTip = '请选择你要共享的资源类型';
      }else if(this.essayType === 'ask'){
         this.headerText = '发布求助';
         this.essayType = '求助';
         this.resourceTypeTip = '请选择你需要的资源类型';
      }else{
         this.showMsgMiddle('抱歉，发布类型错误 ' + essayType);
         this.$router.go(-1);
      }
      this.showReward();
      this.getResourceType();
  }
}

</script>

<style>
  .content:empty:before{
    content: "请描述你的任务";
    color:#bbb;
  }
  .content:focus:before{
    content:none;
  }
</style>

<style scoped>
  .titleCss{
    margin-top:-1rem;
  }
  .resource-slot {
    text-align: center;
    padding: 8px 0;
    color: #888;
    font-size: 0.7rem;
  }
  .resource-radio{
     font-size: 0.8rem;
  }
</style>
