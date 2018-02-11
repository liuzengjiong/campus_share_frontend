<template>

  <div >
  <div class="footer">
    <ul class="footer-cont">
        <li class="activeChange" @click="cancel">
            <div>取消</div>
        </li>
        <li class="activeChange" @click="submit">
            <div>提交</div>
        </li>
    </ul>
  </div>
  </div>
</template>


<script>
export default {

  methods:{
    submit(){
      alert("确定要提交吗？");
      this.$emit('submit');
    },
    cancel(){
      alert("确定要取消吗？");
    }
  }
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
    width: 50%;
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
