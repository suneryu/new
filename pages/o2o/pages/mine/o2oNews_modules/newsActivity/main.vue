<template>
    <div class="newsActivity">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="newsActivity-list">
        <div class="newsActivity-item" v-for="(item,index) in activityList" :key="index">
          <div class="timeTitle">2018.09.10 21:00</div>
          <div class="itemCenter">
            <div class="title">[24小时超低价秒杀开始]</div>
            <img src="/static/img/mine/news/temp.png" alt="" style="width:632rpx;height:290rpx;margin-left:39rpx;margin-top:20rpx">
            <div class="subTitle">超给力: 进口生鲜特价直降,空运直达,新鲜特合伙人哈哈合伙人和</div>
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
      title:'活动中心',
      leftIcon:true,
      rightIcon:true,
      items:[],
      defaultIcon:false,
      baseColor:'',
      activityList: [1,2,3]
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
    
  },
}
</script>

<style  lang="less" scoped>
@import '../../../../../../common/css/common.less';
  .newsActivity{
    position: relative;
    padding-top: 90rpx;
    background-color: rgb(237, 238, 239);
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
      .timeTitle{
        text-align: center;
        color: rgb(174, 174, 174);
        font-size: 24rpx;
        margin-top: 30rpx;
      }
      .itemCenter{
        background-color: white;
        margin-left: 20rpx;
        margin-top: 30rpx;
        width: 710rpx;
        height: 500rpx;
        border-radius: 20rpx;
        display: flex;
        flex-direction: column;
      }
      .title{
          margin-top: 30rpx;
          margin-left: 30rpx;
          font-size: 36rpx;
        }
        .subTitle{
          margin-left: 30rpx;
          margin-top: 20rpx;
          font-size: 32rpx;
          color: rgb(161, 161, 161);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis; 
        }
    }
  }
</style>>

