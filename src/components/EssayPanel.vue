<template>
  <div>
    <panel :header="header" :footer="footer" :list="list" :type="type"></panel>
    <homeFooter></homeFooter>
  </div>
</template>

<script>
import { Panel } from 'vux'
import homeFooter from '@/components/nav/footer.vue'
export default {
  components: {
    Panel,
    homeFooter
  },
  data () {
    return {
      header:'帖子列表',
      type: '4',
      list: [{
        fallbackSrc: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
        title: '求取快递',
        desc: '今晚7点前顺丰快递有吗',
        url: '/component/cell'
      }, {
        title: '求借正装',
        desc: '身高153',
        url: {
          path: '/component/radio',
          replace: false
        }
      }],
      footer: {
        title: "发布帖子",
        url: 'http://vux.li'
      }
    }
  }
}
</script>
