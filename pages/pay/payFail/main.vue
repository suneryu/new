<template>
    <div class="payFail">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="payFail-tit">
        <i :style="{'color':baseColor}" class="iconfont">&#xe68d;</i><span :style="{'color':baseColor}">支付失败</span>
      </div>
      <div class="payFail-btn">
        <div :style="{'color':baseColor,'border-color':baseColor}" @click="backHome">回到首页</div>
        <div :style="{'background':baseColor,'border-color':baseColor}" @click="orderDetail">订单详情</div>
      </div>
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router} from '@/utils/prototype/vue.js'
import {addAddress} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
import vueTabBar from '@/components/communal/vueTabBar'
export default {
  data() {
    return {
      title:'支付失败',
      leftIcon:true,
      rightIcon:false,
      userImgurl: require("../../../static/img/mine/default_header.png"), 
    }
  },
  components:{
    commonHeader,vueTabBar
  },
  methods: {
    backHome(orderDetail){
      
      // $router.replace('web',{defaultUrl:this.$domain+'/paas/shop/'+this.$state.homeUrl})
	  $router.reOpen("mainindex");
    },
    orderDetail(){
      // let params = {
      //   contractBillcode:order.contractBillcode
      // }
      // $router.push('orderDetail/orderDetail',params)
	  $router.push(
	    "order_modules/order/infor",
	    this.$root.$mp.query
	  );

    }
  },
}
</script>

<style lang="less" scoped>
@import '../../../common/css/common.less';
 .payFail{
   width: 100%;
   height: 100%;
   background: @white-color;
   margin-top: 90rpx;
   &-tit{
     display: flex;
     justify-content: center;
     align-items: center;
     padding: 190rpx 0 138rpx;
     i{
       margin-right: 20rpx;
       color: #b79f77;
       font-size: 54rpx;
     }
     span{
       font-size: 36rpx;
       color: #b79f77;
     }
   }
   &-btn{
     display: flex;
     margin: 0 61rpx;
     div{
       width: 292rpx;
       height: 82rpx;
       line-height: 82rpx;
       text-align: center;
       color:  #b79f77;
       border:1rpx solid #b79f77;
       border-radius: 4rpx;
       font-size: @middle-title;
      &:last-child{
        background: #b79f77;
        color: @white-color;
        margin-left: 42rpx;
      }
     }
   }
 }
</style>




