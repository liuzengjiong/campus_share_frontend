<template>

  <div >
  <div class="footer">
    <div class="btnDiv">
      <flexbox>
      <flexbox-item>
        <x-button class="buttonCss" plain @click.native="cancel">取消</x-button>
      </flexbox-item>
      <span class="divider-vertical"></span>
      <flexbox-item>
        <x-button class="buttonCss" plain @click.native="submit" :disabled="submitDis">提交</x-button>
      </flexbox-item>
      </flexbox>
    </div>
  </div>
  </div>
</template>


<script>
import {Flexbox,FlexboxItem,XButton} from 'vux'

export default {
  components:{
    Flexbox,
    FlexboxItem,
    XButton
  },
  data(){
    return {
       submitDis:false
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
      this.submitDis = true;
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
    background-color: #EEE;
  }
  .buttonCss{
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
</style>
