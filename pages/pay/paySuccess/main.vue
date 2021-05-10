<template>
  <div class="paySuccess">
    <!-- <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" /> -->
    <div class="paySuccess-tit">
      <i :style="{'color':baseColor}" class="iconfont">&#xe69f;</i>
      <span :style="{'color':baseColor}">支付成功</span>
    </div>
    <div class="paySuccess-btn">
      <div :style="{'color':baseColor,'border-color':baseColor}" @click="backHome">回到首页</div>
      <div :style="{'background':baseColor,'border-color':baseColor}" @click="orderDetail">订单详情</div>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router } from "@/utils/prototype/vue.js";
import { addAddress } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
export default {
  data() {
    return {
      title: "支付成功",
      leftIcon: true,
      rightIcon: false,
      baseColor: "",
      userImgurl: require("../../../static/img/mine/default_header.png")
    };
  },
  components: {
    commonHeader
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    this.baseColor = "#" + this.$state.baseColor;
  },
  methods: {
    backHome() {
      // $router.replace('web',{defaultUrl:this.$businessDomain+'/paas/shop/'+this.$state.homeUrl})
      // $router.reOpen("mainindex");
	 $router.replace('homepage')
    },
    orderDetail() {
      console.log(this.$root.$mp.query, "this.$root.$mp.query");

      if ($storage.get("goodsType") && $storage.get("goodsType") == "24") {
        $router.push(
          "marketing_module/pages/groupBuy/grouporder_modules/infor",
          this.$root.$mp.query
        );
      } else if (
        $storage.get("goodsType") &&
        $storage.get("goodsType") == "25"
      ) {
        $router.push(
          "marketing_module/pages/assemble/assembleorder_modules/infor",
          this.$root.$mp.query
        );
      } else if (
        $storage.get("goodsType") &&
        $storage.get("goodsType") == "26"
      ) {
        $router.push(
          "marketing_module/pages/seckill/seckillorder_modules/infor",
          this.$root.$mp.query
        );
      } else {
        $router.push(
          "order_modules/order/infor",
          this.$root.$mp.query
        );
      }
      
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../common/css/common.less";
.paySuccess {
  width: 100%;
  height: 100%;
  background: @white-color;
  margin-top: 90rpx;
  &-tit {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 190rpx 0 138rpx;
    i {
      margin-right: 20rpx;
      color: #b79f77;
      font-size: 54rpx;
    }
    span {
      font-size: 36rpx;
      color: #b79f77;
    }
  }
  &-btn {
    display: flex;
    margin: 0 61rpx;
    div {
      width: 292rpx;
      height: 82rpx;
      line-height: 82rpx;
      text-align: center;
      color: #b79f77;
      border: 1rpx solid #b79f77;
      border-radius: 4rpx;
      font-size: @middle-title;
      &:last-child {
        background: #b79f77;
        color: @white-color;
        margin-left: 42rpx;
      }
    }
  }
}
</style>




