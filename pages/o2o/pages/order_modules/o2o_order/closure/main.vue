<template>
  <div class="closure-box">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="orderList-save" @click="check">
      <i class="iconfont icon-tubiaolunkuo-"></i>
    </div>
    <div class="closure-main">
      <div class="tip">请输入提货码或点击右上方扫描二维码</div>

      <div class="closure-input">
        <input v-model="hxcode" type="text" placeholder="请输入提货码核销订单" />
        <button @click="hexiao" type="button" :style="{background:baseColor}">确认核销</button>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { refund, myOrder } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
// import picker from '@/components/communal/picker';
export default {
  data() {
    return {
      contractBillcode: "",
      title: "核销订单",
      leftIcon: true,
      rightIcon: false,
      baseColor: "#178d43",
      hxcode: ""
    };
  },
  components: {
    commonHeader
    // picker
  },
  onLoad(option) {
    console.log(option, "option");
    let that = this;
    that.contractBillcode = option.contractBillcode || "";
    $storage.set("contractBillcode", that.contractBillcode);
    console.log(option, that.contractBillcode, "option");
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    Object.assign(this, this.$options.data());
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice") || {};
    }
  },
  mounted() {
    // this.contractBillcode = this.$route.query.contractBillcode

    this.baseColor = this.$state.baseColor
      ? "#" + this.$state.baseColor
      : "#178d43";
  },
  methods: {
    check() {
      let that = this;
      wx.scanCode({
        success: res => {
          http
            .post(myOrder.updateContractDelcode, {
              // contractBillcode: order.contractBillcode
              contractDelcode: res,
              contractBillcode: that.contractBillcode
            })
            .then(el => {
              if (el.success) {
                $message.success("核销成功");
                $router.push("order_modules/order/index");
              } else {
                $message.alert("核销失败");
              }
            });
        }
      });
    },
    hexiao() {
      let that = this;
      if (that.hxcode) {
        http
          .post(myOrder.updateContractDelcode, {
            contractDelcode: that.hxcode,
            contractBillcode: $storage.get("contractBillcode")
          })
          .then(res => {
            if (res.success) {
              $message.success("核销成功");
              $storage.remove("contractBillcode");
              $router.push("order_modules/order/index");
            } else {
              $message.alert("核销失败");
            }
          });
      } else {
        $message.alert("请输入核销码");
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../../../common/css/common.less";

.closure-box {
  .tip {
    font-size: 21rpx;
    color: #ccc;
  }
  .orderList-save {
    position: fixed;
    z-index: 9999;
    height: 90rpx;
    width: 70rpx;
    line-height: 90rpx;
    text-align: right;
    right: 30rpx;
    top: 0;
    font-size: 26rpx;
  }
  .closure-main {
    padding: 260rpx 100rpx 30rpx;
    text-align: center;
    // background: #fff;
  }
  input {
    height: 78rpx;
    line-height: 78rpx;
    border: 1rpx solid #e0e0e0;
    border-radius: 78rpx;
    margin: 20rpx 0 20rpx;
    font-size: 26rpx;
  }
  button {
    height: 78rpx;
    line-height: 78rpx;
    color: #fff;
    border-radius: 78rpx;
    font-size: 28rpx;
  }
}
</style>




