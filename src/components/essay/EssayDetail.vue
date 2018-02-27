
<template>
  <div class="article">
    <x-header>任务详情</x-header>
    <div class="title">
      {{essay.title}}
    </div>
    <div class="author clearfix" v-if="essay.author">
      <img :src=getAvatar(essay.author.avatarPath) alt="头像">
      <span class="name">{{essay.author.nickname}}</span>
      <!--<span class="star" @click="addCollect"></span>-->
    </div>
    <div class="clear" ></div>
    <div v-if="essay.essayStatus == 1" class='borderInfo'>任务已关闭</div>
    <div class="publish_time" v-if="essay.essayType">{{essay.essayType}}&nbsp;-&nbsp;{{essay.resourceType}}</div>
    <div class="publish_time" v-if="essay.reward">
      <span class="measure-icon"></span>
      <span>{{getRewardDesc(essay.reward)}}</span>
    </div>
    <div class="publish_time" v-if="essay.createTime">发表于：{{getChineseDate(essay.createTime)}}</div>
    <div class="flow_div" v-if="essay.flowNodes">
        <flow>
             <flow-state v-if='essay.flowNodes[0]' :title="getNodeTitle(essay.flowNodes[0])" :is-done='essay.flowNodes[0].actorNum>0'></flow-state>

             <flow-line  v-if='essay.flowNodes[1]' :is-done='essay.flowNodes[1].actorNum>0'></flow-line>
             <flow-state v-if='essay.flowNodes[1]' :title="getNodeTitle(essay.flowNodes[1])" :is-done='essay.flowNodes[1].actorNum>0'></flow-state>

             <flow-line  v-if='essay.flowNodes[2]' :is-done='essay.flowNodes[2].actorNum>0'></flow-line>
             <flow-state v-if='essay.flowNodes[2]' :title="getNodeTitle(essay.flowNodes[2])" :is-done='essay.flowNodes[2].actorNum>0'></flow-state>

             <flow-line  v-if='essay.flowNodes[3]' :is-done='essay.flowNodes[3].actorNum>0'></flow-line>
             <flow-state v-if='essay.flowNodes[3]' :title="getNodeTitle(essay.flowNodes[3])" :is-done='essay.flowNodes[3].actorNum>0'></flow-state>
        </flow>
    </div>
    <div class="essay" v-if="essay.content" v-html="essay.content"></div>
    <div>
      <ul v-if='essay.comments' class='commentsCss'>
        <div class="total">{{getCommit(essay.comments)}}</div>
        <li v-for='item in essay.comments'>
          <div class="author-msg clearfix">
            <img :src=getAvatar(item.author.avatarPath) alt="头像">
            <div class="reply_msg">
              <span class="author_name">{{item.author.nickname}}</span>
              <span class="show_time" v-if="item.createTime">{{getChineseDate(item.createTime)}}</span>
            </div>
          </div>
          <div class="clear" ></div>
          <div class="commentsCss-msg" v-text="item.content">
          </div>
        </li>
      </ul>
    </div>


       <div class="bottom" v-if="essay.essayId">

             <flexbox>
             <flexbox-item>
               <x-button class="buttonCss" plain @click.native="showCommentPopup = true">评论</x-button>
             </flexbox-item>
             <span class="divider-vertical"></span>
             <flexbox-item>
               <x-button class="buttonCss" v-if="isAuthor()" plain @click.native="changeStatus" :disabled="disableChangeStatus">{{changeStatusBtnText}}</x-button>
               <x-button class="buttonCss" v-else plain @click.native="operateTask" :disabled="disableOperate">{{operateBtnText}}</x-button>
             </flexbox-item>
           </flexbox>

        </div>

     <div v-transfer-dom>
       <popup v-model="showCommentPopup" :hide-on-blur="true">
         <div>
             <group>
               <x-textarea v-model="comment" placeholder="有话想说吗？评论这个任务" :max="500" autosize></x-textarea>
             </group>
           <div style="padding:20px 15px;">
             <x-button type="primary" @click.native='submit'>提交</x-button>
             <x-button type="warn" @click.native=' showCommentPopup=false '>取消</x-button>
           </div>
         </div>
       </popup>
     </div>

     <div v-transfer-dom>
       <popup v-model="showCompleteTaskPopup" :hide-on-blur="true">
         <div>
             <group>
               <x-textarea v-model="completeDescription" placeholder="请输入任务完成描述" :max="100" autosize></x-textarea>
             </group>
           <div style="padding:20px 15px;">
             <x-button type="primary" @click.native='submitComplete'>确定</x-button>
           </div>
         </div>
       </popup>
     </div>
  <loading :show="showLoading" :text="loadingText"></loading>
  </div>

</template>

<script>

  import {Flexbox,FlexboxItem,XTextarea,TransferDom,Popup,Scroller ,Loading,XHeader,XInput, Group ,XButton,Flow, FlowState, FlowLine} from 'vux'
  import constant_ from '@/components/tool/Constant'
  import auth from '@/components/tool/Auth'
  import util from '@/components/tool/Util'

  const topicId = window.location.hash.replace('#', '').replace(':', '').replace('/essay/', '')
  const essayDetailBaseUrl = constant_.SERVER_PATH + "/essay/";
  const commentAddUrl = constant_.SERVER_PATH + "/comment/add"
  const commentListUrl = constant_.SERVER_PATH + "/comment/list"
  const haveReveiveBaseUrl = constant_.SERVER_PATH + "/flow-node/have-received/{essayId}/{userId}";
  const changeStatusUrl = constant_.SERVER_PATH + "/essay/changeStatus/{essayId}/{currStatus}";
  const operateTaskBaseUrl = constant_.SERVER_PATH + "/essay/{essayId}/{operateType}";
  const flowNodesBaseUrl = constant_.SERVER_PATH + "/flow-node/essay/{essayId}";

  export default {
    directives: {
      TransferDom
    },
    data () {
      return {
        essay: [],
        comment: '',
        showLoading : false,
        loadingText : "加载中",
        showCommentPopup: false,
        disableOperate: false,
        disableChangeStatus: false,
        operateBtnText: '任务操作',
        changeStatusBtnText: '任务状态',
        receivedStatus: '0',
        showCompleteTaskPopup: false,
        completeDescription : ''
      }
    },
    components: {
      Flexbox,
      FlexboxItem,
      XTextarea,
      TransferDom,
      Popup,
      Flow,
      FlowState,
      FlowLine,
      Scroller ,
      Loading,
      XHeader,
      XInput,
      Group,
      XButton
    },
    created () {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      const essayDetailUrl = essayDetailBaseUrl + this.$route.params.id.substr(1);
      this.showLoading = true;
      this.$http.get(essayDetailUrl).then((data) => {
          console.log(data);
          this.showLoading = false;
          if(data.body.code == constant_.CODE.SUCCESS){
              this.essay = data.body.data;
              this.checkButton();
          }else{
              if(data.body.msg){
                  this.showMsgMiddle(data.body.msg);
              }else{
                  this.showMsgMiddle("抱歉，系统异常，请稍后再试");
              }
              if(data.body.code == constant_.CODE.ESSAY_NOT_EXIST){
                  this.$router.go(-1);
              }
          }
      });
    },
    mounted () {

    },
    methods: {
      getChineseDate (date) {
        var year = date.substr(0, 10)
        var time = date.substr(11, 8)
        return year + '   ' + time
      },
      getCommit (commit) {
        var length = commit.length
        if (length > 0) {
          return '共有' + length + '条评论.'
        } else {
          return '暂无评论'
        }
      },
      getAvatar(avatarPath){
         if(avatarPath){
           return avatarPath;
         }
         return '/static/img/defaultAvatar.png'
      },
      getComments(){
        const reqData = {
            params:{
              essayId :  this.$route.params.id.substr(1)
            }
        };
        this.$http.get(commentListUrl,reqData).then((data) => {
            if(data.body.code == constant_.CODE.SUCCESS){
               this.essay.comments = data.body.data;
            }else{
               if(data.body.msg){
                  this.showMsgMiddle(data.body.msg);
               }else{
                  this.showMsgMiddle("抱歉，获取最新评论异常");
               }
            }
        });
      },
      submit () {
          if (this.trim(this.comment) === '') {
            this.showMsgMiddle("请输入评论内容");
            /*this.$vux.toast.text('请输入评论内容');*/
          } else {
            var authorId = '';
            var userInfo = auth.needLoginUserInfo(this,"评论");
            if(userInfo){
                authorId = userInfo.userId;
            }else{
                return;
            }
            const reqData = {
                authorId : authorId,
                essayId :  this.$route.params.id.substr(1),
                content:this.comment
            };
            this.$http.post(commentAddUrl,reqData).then((data) => {
              console.log(data);
                if(data.body.code == constant_.CODE.SUCCESS){
                   this.showMsgMiddle("发布成功");
                   this.getComments();
                   this.comment = '';
                   this.showCommentPopup = false;
                }else{
                   if(data.body.msg){
                      this.showMsgMiddle(data.body.msg);
                   }else{
                      this.showMsgMiddle("抱歉，评论异常");
                   }
                }
            });
          }
      },
      changeStatus(){
        var userInfo = auth.needLoginUserInfo(this,this.changeStatusBtnText);
        if(!userInfo){
          return;
        }
        const realchangeStatusUrl =
        changeStatusUrl.replace('{currStatus}',this.essay.essayStatus)
        .replace('{essayId}',this.essay.essayId);
        this.loadingText = '正在' + this.changeStatusBtnText;
        this.showLoading = true;
        this.$http.post(realchangeStatusUrl).then((data) => {
            this.showLoading = false;
            if(data.body.code == constant_.CODE.SUCCESS){
               this.showMsgMiddle(this.changeStatusBtnText + "成功");
               this.essay.essayStatus = data.body.data;
               this.checkButton();
            }else{
               if(data.body.msg){
                  this.showMsgMiddle(data.body.msg);
               }else{
                  this.showMsgMiddle("抱歉，" + this.changeStatusBtnText + "异常");
               }
            }
        });
      },
      getNodeTitle(node){
         if(!node){
           return '';
         }
         if(node.actorNum == 0){
           return node.nodeValue;
         }
         var nodeTip = '';
         if(node.actorNum == 1){
           /*nodeTip = "(" + node.actor.nickname + ")";*/
         }else{
           nodeTip = "(" + node.actorNum + "人)";
         }
         return node.nodeValue + nodeTip;
      },
      getRewardDesc(reward){
         if(!reward){
           return '';
         }
         var detail;
         if(reward.rewardDetail){
            detail = " (" + reward.rewardDetail + ") ";
         }
         var desc = "报酬：" + reward.rewardTypeValue + detail;
        if(!this.essay.essayType){
            return desc;
        }
        if(this.essay.essayType == "求助"){
           return "提供" + desc;
        }
        if(this.essay.essayType == "共享"){
           return "收取" + desc;
        }
        return desc;
      },
      isAuthor(){

        var userInfo = auth.getLoginUser();
        if(!userInfo){
          return false;
        }
        return userInfo.userId == this.essay.authorId;

      },
      checkButton(){
        if(this.essay.essayStatus == 1){
          if(this.isAuthor()){
             this.changeStatusBtnText = '开启任务';
          }else{
             this.disableOperate = true;
             this.operateBtnText = '已关闭';
          }
        }else{
            if(this.isAuthor()){
              this.changeStatusBtnText = '关闭任务';
            }else{
              this.getReceivedStatus();
           }
        }
      },
      getFlowNodes(){
          const flowNodesUrl = flowNodesBaseUrl.replace("{essayId}",this.essay.essayId);
          this.$http.get(flowNodesUrl).then((data) => {
            if(data.body.code == constant_.CODE.SUCCESS){
              if(data.body.data && data.body.data.length){
                this.essay.flowNodes = data.body.data;
              }
            }
          });
      },
      getReceivedStatus(){
        const essayId = this.$route.params.id.substr(1);
        var userInfo = auth.getLoginUserInfo();
        if(!userInfo || !userInfo.userId){
            return;
        }
        var haveReceiveUrl = haveReveiveBaseUrl.replace('{essayId}',essayId).replace('{userId}',userInfo.userId);
        this.$http.get(haveReceiveUrl).then((data) => {
          console.log(data.body);
          if(data.body.code == constant_.CODE.SUCCESS){
            if(data.body.data && data.body.data.nodeKey){
              this.receivedStatus = data.body.data.nodeKey;
            }else{
              this.receivedStatus = '0';
            }
          }
          this.checkCanOperate();
        });
      },
      checkCanOperate(){
        if(this.receivedStatus == constant_.FLOW_NODE.IN_PROGRESS){
          this.operateBtnText = '完成任务';
          this.disableOperate = false;
          return;
        }
        if(this.receivedStatus == constant_.FLOW_NODE.WAIT_CONFIRM){
          this.operateBtnText = '待确认';
          this.disableOperate = true;
          return;
        }
        if(this.receivedStatus == constant_.FLOW_NODE.DONE){
          this.operateBtnText = '已完成';
          this.disableOperate = true;
          return;
        }
        if(!this.essay.reward){
            this.operateBtnText = '无报酬';
            this.disableOperate = true;
            return;
        }
        if(this.essay.reward.maxReceiveNum == 0){
          this.operateBtnText = '接受任务';
          this.disableOperate = false;
          return;
        }
        if(this.essay && this.essay.flowNodes && this.essay.flowNodes[1]){
           if(this.essay.flowNodes[1].actorNum >= this.essay.reward.maxReceiveNum){
             this.operateBtnText = '接受数已满';
             this.disableOperate = true;
             return;
           }else{
             this.operateBtnText = '接受任务';
             this.disableOperate = false;
             return;
           }
        }
        this.operateBtnText = '未开始流程';
        this.disableOperate = true;
      },
      operateTask(){
         if(this.receivedStatus == '0'){
             const reqData = {};
             this.submitOperate(constant_.FLOW_NODE.ACT_RECEIVE,reqData);
         }else if(this.receivedStatus == constant_.FLOW_NODE.IN_PROGRESS){
             this.showCompleteTaskPopup = true;
         }else{
             this.showMsgMiddle("未定义的操作");
             return;
         }


      },
      submitComplete(){
        this.showCompleteTaskPopup = false;
        if(!this.completeDescription.trim()){
           this.showMsgMiddle("任务完成描述不能为空");
           return;
        }
        const reqData = {
           description : this.completeDescription
        }
        this.submitOperate(constant_.FLOW_NODE.ACT_COMPLETE,reqData);
      },
      submitOperate(operateType,reqData){
        const operateTaskUrl = operateTaskBaseUrl.replace('{essayId}',this.essay.essayId)
                                 .replace('{operateType}',operateType);
        const _this = this;
        this.$vux.confirm.show({
          title: '确定要' + this.operateBtnText + '吗？',
          content:'此操作无法取消',
          onCancel () {

          },
          onConfirm (msg) {
            _this.loadingText = "正在" + _this.operateBtnText;
            _this.showLoading = true;
            _this.$http.post(operateTaskUrl,reqData).then((data) => {
              _this.showLoading = false;
              console.log(data);
                if(data.body.code == constant_.CODE.SUCCESS){
                   _this.showMsgMiddle(_this.operateBtnText + "成功");
                   _this.checkButton();
                   _this.disableOperate = true;
                   _this.getFlowNodes();
                }else{
                   if(data.body.msg){
                      _this.showMsgMiddle(data.body.msg);
                   }else{
                      _this.showMsgMiddle("抱歉，操作异常");
                   }
                }
            });
          }
        })
      }
    }
  }
</script>

<style>
  .clear{
    clear:both;
  }
  .article{
    /*padding: 60px 5px 20px;*/
    background-color: #f8f8f9;
    margin-bottom: 2rem;
    overflow-x: hidden;
  }
  .article img{
      max-width: 100%;
  }
  .article .title{
    text-align: center;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0 0.3rem;
  }
  .article .commentsCss{
    margin-top: 20px;
  }
  .article .commentsCss .total{
    height: 1rem;
    line-height: 1rem;
    font-size: 0.8rem;
    margin-left: 0.3rem;
  }
  .article .commentsCss li{
    background-color: #fff;
    padding-bottom: 5px;
  }
  .article .commentsCss li .author-msg{
    margin-bottom: 5px;
  }
  .article .commentsCss li .author-msg img{
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    float: left;
    margin-left: 0.3rem;
  }
  .article .commentsCss li .author-msg .reply_msg{
    float: left;
    margin-left: 0.3rem;
  }
  .article .commentsCss li .author-msg .reply_msg .author_name{
    display: block;
    line-height: 0.7rem;
    font-size: 0.7rem;
    margin: 0.2rem 0;
  }
  .article .commentsCss li .author-msg .reply_msg .show_time{
    display: block;
    line-height:0.7rem;
    color: #b9b9b9;
    font-size: 0.7rem;
    margin: 0.2rem 0;
  }
  .commentsCss-msg{
    font-size:0.8rem;
    margin-left : 0.3rem;
  }

  .author{
    margin: 0 0.5rem;
    float:left;
    width:100%;
  }
  .author img{
    float: left;
    margin: 0 5px;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
  }
  .author .name{
    display: block;
    float: left;
    /*margin: 10px 5px;*/
    color: #484848;
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }

  .author .star{
    display: block;
    float: right;
    width: 1.1rem;
    height: 1.1rem;
    background-size: 1.1rem;
  /*  background-position: 0.2rem 0.2rem;*/
    border-radius: 0.2rem;
    margin-right: 1rem;
    background-color: #5c7898;
    background-repeat: no-repeat;
    background-image: url(../../assets/no_collect.png);
  }
  .author .star .stared{
    background-image: url(../../assets/have_collect.png);
  }

  .publish_time{
    margin-bottom: 0.3rem;
    margin-top: 0.6rem;
    padding-left: 0.8rem;
    display: block;
    font-size:0.6rem;
    color: #333;
  }
  .essay{
    background-color: #fff;
    padding: 0.7rem 0.3rem;
    font-size:0.8rem;
  }
  .bottom{
    height: 1.3rem;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 2px solid #ccc;
    background-color: #EEE;
  }
  .bottom .buttonCss{
    border:0;
    margin:0;
    padding: 0;
  }
  .divider-vertical{
    padding:1rem 0.65rem 0.65rem 0;
    margin-left: 0.65rem;
    border-left: 1px solid #000;
    font-size: 0;
  }

  .flow_div{
    margin-top:-1rem !important;
  }
  .measure-icon{
    width: 1rem ;
    height: 1rem;
    background-size:1rem;
    margin: 0.1rem;
    background-repeat: no-repeat;
    float:left;
    background-image: url(../../assets/measure.png);
  }
  .borderInfo{
    font-size: 0.6rem;
    display: block;
    float: right;
    color: #e78170;
    border: 1px solid #e78170;
    padding: 2px;
    margin-right:0.5rem;
    margin-top: 0.2rem;
    border-radius: 3px;
  }
</style>
