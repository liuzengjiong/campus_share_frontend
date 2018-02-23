<template>

  <div >
  <div class="footer">
    <ul class="footer-cont">
        <li class="activeChange" @click="cancel">
            <div>取消</div>
        </li>
        <li class="activeChange" @click="submit" v-bind:class="submitDis">
            <div>提交</div>
        </li>
    </ul>
  </div>
  </div>
</template>


<script>
export default {
  data(){
    return {
       submitDis:''
    }
  },
  methods:{
    submit(){
      const _this = this;
      this.$vux.confirm.show({
        title: '确定要提交吗？',
        content:'任务将发布',
        onCancel () {

        },
        onConfirm (msg) {
          _this.$emit('submit');
        }
      })
    },
    cancel(){
      const _this = this;
      this.$vux.confirm.show({
        title: '确认取消发布吗？',
        content:'将返回上一页',
        onCancel () {

        },
        onConfirm (msg) {
          _this.$router.go(-1);
        }
      })
    },
    disableSubmit(){
      this.submitDis = 'disabled';
    }
  }
}
</script>



<style lang="css" scoped>
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
    width: 50%;
    height: 1.3rem;
    line-height: 1.3rem;
    font-size: 1.0rem;
    color: #799dbe;
    text-align: center;
    background-color: #35485d;
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
  .disabled{
    pointer-events:none;
    color: #999;
  }
</style>
