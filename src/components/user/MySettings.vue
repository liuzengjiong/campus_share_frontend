<template>
  <div>
    <div>
      <img class="img_1" src="../../assets/bg_cir.png">
      <div class="news-wrap">
        <cell title="我的任务" is-link>

        </cell>
        <cell title="我的消息" is-link>

        </cell>
        <cell title="我的收藏"  is-link>

        </cell>

          <cell title="正在进行" is-link  @click.native="goEssayTab()">

          </cell>


      </div>

      <x-button @click.native="doLogout" type="warn">注销</x-button>
    </div>
    <homeFooter></homeFooter>
    </div>
  </div>

</template>
<style>
.img_1{
  width: 100%;
}


</style>
<script>
  import { Group, Cell,XButton} from 'vux'
  import auth from '@/components/tool/Auth'
  import homeFooter from '@/components/nav/footer.vue'

  export default{
    name:'MySettings',
    components:{
      homeFooter,
      XButton,
      Group,
      Cell
    },
    methods: {
      doLogout(){
         auth.logout(this);
      },
      goEssayTab(){
        this.$router.push('/essayTab');
      }
    }

  }


</script>
