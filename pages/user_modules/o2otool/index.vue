<template>
  <div class="user users">
    <div  class="user-order">
      <div class="user-order-title">
        <span class="my-order">{{moreToolListName}}</span>
      </div>
      <div class="user-order-mywallet">
        <ul class="wallet-box" >
          <li v-for="(app,index) in moreToolList" :key="index">
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
  props:['baseColor','moreToolList','moreToolListName'],
  data(){
    return {
      application:[],//应用'
    }
  },
  onLoad() {},
  created(){},
  methods: {
    //点击每一个工具进行跳转
    applicationList(app,index){
      console.log(app,"工具跳转路由")
      // $router.push("o2o/pages/address_modules/address_manager")  //地址
      // $router.push("o2o/pages/helpCenter_modules/o2o_helpCenter")  //帮助中心
      // $router.push("user_modules/feedback/o2o_index")  //意见反馈
      // $router.push("o2o/pages/mine/o2oNews_modules/news") //我的消息 mine/o2oNews_modules/news/index
       $router.push(app.menuJspath);
    }
  },
}
</script>
<style lang="less" scoped>
@import '../../../common/css/common.less';
.users{
  width: 688rpx;
  border-radius: 10rpx;
  margin: 0 auto;
  margin-bottom: 20rpx;
  .user-order-mywallet li {
    width: 25% !important;
  }
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
}
</style>

