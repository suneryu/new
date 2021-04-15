<template>
  <div class="user users">
    <div  class="user-order">
      <div class="user-order-title">
        <span class="my-order">{{myWalletListName}}</span>
      </div>
      <div class="user-order-mywallet">
        <ul class="wallet-box" >
          <li v-for="(app,index) in moreWallet" :key="index">
            <a @click="applicationList(app,index)">
              <div>
                <i class="iconfont" :style="{ color:app.proappMenuIcon ?'#'+app.proappMenuIcon : ''}" :class="app.menuSelectClass ? app.menuSelectClass : 'icon-wodedingdan'"></i>
                <!-- <i  v-if="!app.menuSelectClass" class="wallet-num"  :style="{color:baseColor}">￥2000</i> -->
                <p class="wallet-name">{{app.menuName}}</p>
              </div> 
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {$storage,$router} from '@/utils/prototype/vue.js'
import http from '@/api/http.js'
import { clearTimeout, setTimeout } from 'timers';
export default {
  props:['baseColor','myWalletList','myWalletListName'],
  data(){
    return {

    }
  },
  onLoad() {},
  created() {},
  mounted() {},

  methods: {
    // 钱包跳转路由
    applicationList(app,index){
      console.log(app)
       $router.push(app.menuJspath);
    },
  },
  computed:{
    moreWallet(){ //实施更新数据
      return this.myWalletList
    }
   
  }
}
</script>
<style lang="less">
@import '../../../common/css/common.less';
.users{
  width: 688rpx;
  border-radius: 10rpx;
  margin: 0 auto;
  margin-bottom: 20rpx;
  &-order{
    background: @white-color;
    &-title{
      margin:@margin-lr;
      font-size: @big-title;
      padding:@padding-tb;
      display:flex;
      align-items: center;
      justify-content:space-between;
      a{
        display:flex;
        align-items: center;
        font-size: @middle-title;
        color: @color-999;
        i{
          font-size: 32rpx;
          color: #9d9d9d;
        }
      }
    }
    &-my{
      display: flex;
      padding: 0 20rpx 20rpx 20rpx;
      a{
        flex:1;
        text-align:@t-center;
        font-size: @middle-title;
        i{
          display: inline-block;
          font-size: 44rpx;
          text-align:@t-center;
          line-height: 72rpx;
          margin-bottom: 5rpx;

        }
      }
    }
  }
  .wallet-box {
    overflow: hidden;
    text-align: center;
    padding:@padding;
    padding-left: 0;
    padding-right: 0;
    li {
      float: left;
      width: 33.33%;
      margin-bottom: 54rpx;
      .iconfont  {
        font-size: 44rpx;
      }
      .wallet-name {
        margin-top: 18rpx;
        font-size: 24rpx;
      }
      .wallet-num {
        font-size: 32rpx;
        font-weight: bold;
      }
    }
  }
}
</style>

