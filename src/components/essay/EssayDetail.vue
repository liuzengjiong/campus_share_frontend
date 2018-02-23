
<template>
  <div class="article">
    <x-header>任务详情</x-header>
    <div class="title">
      {{essay.title}}
    </div>
    <div class="author clearfix" v-if="essay.author">
      <img :src=getAvatar(essay.author.avatarPath) alt="头像">
      <span class="name">{{essay.author.nickname}}</span>
      <span class="star" @click="addCollect"></span>
    </div>
    <div class="clear" ></div>
    <div class="publish_time" v-if="essay.essayType">{{essay.essayType}}&nbsp;-&nbsp;{{essay.resourceType}}</div>
    <div class="publish_time" v-if="essay.createTime">发表于：{{getChineseDate(essay.createTime)}}</div>
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
    <div class="bottom">
      <group class="commentInput">
        <x-input  :max="500" title='' placeholder="有话想说吗？评论这个任务"  v-model="comment"></x-input>
      </group>
       <x-button @click.native="submit" type="primary" :mini="true" class="commentSubmit">提交</x-button>
     </div>
  <loading :show="showLoading" :text="loadingText"></loading>
  </div>

</template>

<script>

  import {Scroller ,Loading,XHeader,XInput, Group ,XButton} from 'vux'
  import constant_ from '@/components/tool/Constant'
  import auth from '@/components/tool/Auth'
  import util from '@/components/tool/Util'

  const topicId = window.location.hash.replace('#', '').replace(':', '').replace('/essay/', '')
  const essayDetailBaseUrl = constant_.SERVER_PATH + "/essay/";
  const commentAddUrl = constant_.SERVER_PATH + "/comment/add"
  const commentListUrl = constant_.SERVER_PATH + "/comment/list"
  export default {
    data () {
      return {
        essay: [],
        comment: '',
        showLoading : false,
        loadingText : "加载中"
      }
    },
    components: {
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
          }else{
              if(data.body.msg){
                  alert(data.body.msg);
              }else{
                  alert("抱歉，系统异常，请稍后再试");
              }
              if(data.body.code == constant_.CODE.ESSAY_NOT_EXIST){
                  this.$router.go(-1);
              }
          }
      });
    },
    mounted () {
      /*this.loginState = store.getters.getLoginState*/
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
            var userInfo = auth.getLoginUser();
            if(userInfo){
                authorId = userInfo.userId;
            }else{
                const _this = this;
                this.$vux.confirm.show({
                  title: '是否前往登录？',
                  content:'未登录无法评论',
                  onCancel () {
                    _this.showMsgMiddle("未登录，无法发布评论");
                  },
                  onConfirm (msg) {
                    _this.$router.push('/login');
                  }
                })
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
      addCollect (event) {
        event.target.className = 'star stared'
        this.axios.post('https://cnodejs.org/api/v1/topic_collect/collect', {
          accesstoken: this.loginState.accessToken,
          topic_id: topicId
        }).then((res) => {
          res = res.data
          if (!res.success) {
            event.target.className = 'star'
            this.cancelStar()
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      cancelStar () {
        this.axios.post('https://cnodejs.org/api/v1/topic_collect/de_collect', {
          accesstoken: this.loginState.accessToken,
          topic_id: topicId
        }).then((res) => {
          console.log(res.data)
        }).catch((err) => {
          console.log(err)
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
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
  }
  .bottom .commentInput{
    width : 80%;
  }
  .bottom .commentSubmit{
    width : 20%;
    height : 2rem;
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #35485d;
  }
</style>
