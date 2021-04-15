<template>
    <div class="Logistics">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
    
    <div class="Logistics-list">
      <div class="Logistics-item" v-for="(item,index) in LogisticsList" :key="index">
        <div class="timeTitle">2018.09.10 21:00</div>
        <div class="itemCenter">
          <div class="title">您的订单12288282772883已发货</div>
          <div class="detailCenter">
            <img src="/static/img/mine/news/temp1.png" alt="" style="width:140rpx;height:140rpx;margin-left:10rpx;margin-top:10rpx">
            <div class="subDetail">
              <div class="subTitle">新西兰阳光金奇异果300g</div>
              <div class="subTitle1">共10件商品</div>
            </div>
            <div class="otherTitle">
              其他
            </div>
          </div>
          
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
      title:'物流助手',
      leftIcon:true,
      rightIcon:true,
      items:[],
      defaultIcon:false,
      baseColor:'',
      LogisticsList:[1,2,2]
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
  .Logistics{
    position: relative;
    padding-top: 90rpx;
    height: 100%;
    background-color: rgb(237, 238, 239);
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
        height: 260rpx;
        border-radius: 20rpx;
        display: flex;
        flex-direction: column;
      }
      .detailCenter{
        display: flex;
        flex-direction: row;
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
          // overflow: hidden;
          // white-space: nowrap;
          // text-overflow: ellipsis; 
        }
        .subTitle1{
          margin-left: 30rpx;
          margin-top: 20rpx;
          font-size: 28rpx;
          color: rgb(174, 174, 174);
        }
        .otherTitle{
          margin-top:60rpx;
          position: absolute;
          right:60rpx;
          color: rgb(162, 162, 162);
          font-size: 28rpx;
        }
    }
  }
</style>>

