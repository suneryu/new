<template>
    <div class="news">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="news-list">
        <div class="news-item" v-for="(item,index) in newsList" :key="index" @click="itemClick(index)">
          <img v-bind:src=item.image alt="" style="width:70rpx;height:70rpx;margin-top:40rpx;margin-left:20rpx;">
          <div class="item-title">
            <div class="title1">{{item.title}}</div>
            <div class="title2">{{item.subTitle}}</div>
          </div>
          <div class="item-right">
            <!-- <div class="red-number">12</div> -->
            <i class="iconfont" style="margin-top:60rpx;position: absolute;right:20rpx">&#xe61d;</i>
          </div>
        </div>
      </div>
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router,$message} from '@/utils/prototype/vue.js'
import {addAddress} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
export default {
  data() {
    return {
      title:'消息',
      leftIcon:true,
      rightIcon:true,
      items:[],
      defaultIcon:false,
      baseColor:'',
      newsList:[{image:'/static/img/mine/news/notice@2x.png',title:'系统通知',subTitle:'升级礼包'},
      {image:'/static/img/mine/news/wuliu@2x.png',title:'物流助手',subTitle:'订单号1222222已发货'},
      {image:'/static/img/mine/news/fire@2x.png',title:'活动通知',subTitle:'[24小时超低价限时秒杀]'}]
    }
  },
  components:{
    commonHeader
  },
  onLoad() {
    Object.assign(this.$data,this.$options.data())//初始化数据
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set('prevpage',prevpage.route)
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#'+this.$state.baseColor
    })
  },
  mounted() {
    this.baseColor='#'+this.$state.baseColor
  },
  methods: {
    itemClick(index){
      if(index == 2){
        // 活动中心
        $router.push('o2o/pages/mine/o2oNews_modules/newsActivity')
      }else if(index == 1){
        // 物流助手
        $router.push('o2o/pages/mine/o2oNews_modules/newsLogistics')
      }else {
        // 系统通知
        $router.push('o2o/pages/mine/o2oNews_modules/newsNotice')
      }
    }
  },
}
</script>

<style  lang="less" scoped>
@import '../../../../../../common/css/common.less';
  .news{
    position: relative;
    padding-top: 90rpx;
    &-save{
      position: fixed;
      z-index: 99999;
      height: 90rpx;
      width: 70rpx;
      line-height: 90rpx;
      text-align: right;
      right: 30rpx;
      top: 0;
      font-size: @big-title;
    }
    &-item{
      border-bottom: 1rpx solid #f6f6f8;
      display: flex;
      flex-direction: row;
      height: 150rpx;
      .item-title{
        display: flex;
        flex-direction: column;
        margin-left: 20rpx;
        margin-top: 30rpx;
      }
      .title1{
        font-size: 34rpx;
      }
      .title2{
        font-size: 26rpx;
        color: rgb(164, 164, 164);
        margin-top: 6rpx;
      }
      .red-number{
        background-color: rgb(220, 48, 44);
        width: 40rpx;
        height: 40rpx;
        border-radius: 40rpx;
        text-align: center;
        line-height: 40rpx;
        position: absolute;
        color: white;
        right:60rpx;
        font-size: 24rpx;
        margin-top: 55rpx;
      }
    }
  }
</style>>

