<template>
  <div>
    <input v-on:focus="onSearch"/>

    <lastPageLine />
    <vueTabBar
    @fetch-index="clickIndexNav"
    :selectNavIndex="selectNavIndex"
     />
  </div>
</template>
<script>
import http from '@/api/http.js'
import {getProappinfo} from '@/api/interface.js'
import lastPageLine from '@/components/communal/last-page-line'
import {$storage,$router} from '@/utils/prototype/vue.js'
import vueTabBar from '@/components/communal/vueTabBar'
export default {
  components:{lastPageLine,vueTabBar},
  data() {
    return {
      selectNavIndex:0
    }
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: $storage.get('proappEnvName')
    })
  },
  methods:{
    clickIndexNav(val){
      this.selectNavIndex = val;
    },
    onSearch(){
      let url = "search"
      $router.push(url)
    }
  }
}
</script>


<style lang="less" scoped>

</style>

