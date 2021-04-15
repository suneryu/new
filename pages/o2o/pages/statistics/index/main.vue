<template>
  <div class="wallet-box">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <!-- header -->
    <div class="wallet-header">
      <div class="flex">
        <p class="flex-item1">
          我的佣金：
          <span>{{unitPrice.obpay}}500{{unitPrice.mapay}}</span>
        </p>
        <button type="button" class="wallet-header--btn">提现</button>
      </div>
      <div class="flex">
        <p class="flex-item1">可提现：200.00元</p>
        <p class="flex-item1">待入账：160.00元</p>
      </div>
    </div>
    <!-- tab -->
    <div class="wallet-tab">
      <ul class="flex tab-ul">
        <li
          :class="['flex-item1',active == index ? 'active' : '']"
          v-for="(item,index) in tabItem"
          :key="index"
          :style="{background:active ==index? baseColor : ''}"
          @click="tabHandler(index)"
        >{{item}}</li>
      </ul>
      <div class="tab-main">
        <ul>
          <li class="flex align--center">
            <div class="flex-item1 f-s24">
              <p>下单时间：</p>
              <p>订单编号：</p>
            </div>
            <h4 class="f-s30">
              +
              <span>{{unitPrice.obpay}}500{{unitPrice.mapay}}</span>
            </h4>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { refund } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
// import picker from '@/components/communal/picker';
export default {
  data() {
    return {
      title: "我的钱包",
      leftIcon: true,
      rightIcon: false,
      baseColor: "#178d43",
      tabItem: ["返佣记录", "提现记录"],
      active: 0
    };
  },
  components: {
    commonHeader
    // picker
  },
  onLoad() {
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
    this.baseColor = this.$state.baseColor
      ? "#" + this.$state.baseColor
      : "#178d43";
    console.log(this.baseColor, "this.baseColor");
  },
  methods: {
    tabHandler(index) {
      this.active = index;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../../common/css/common.less";
.wallet-box {
  background: #fff;
}
.wallet-header {
  background: #fff;
  padding: 110rpx 30rpx 30rpx;
  font-size: 26rpx;
  span {
    font-size: 40rpx;
    color: red;
  }
  &--btn {
    background: #fff;
    font-size: 26rpx;
    padding: 0rpx 28rpx;
  }
  .flex:first-child {
    margin-bottom: 20rpx;
  }
}
.wallet-tab {
  margin: 20rpx 30rpx 0;
  .tab-ul {
    height: 76rpx;
    line-height: 76rpx;
    border: 1rpx solid #e0e0e0;
    border-radius: 10rpx;
    text-align: center;
    font-size: 26rpx;
    li:first-child {
      border-right: 1rpx solid #e0e0e0;
      border-radius: 10rpx 0 0 10rpx;
    }
    li:last-child {
      border-radius: 0rpx 10rpx 10rpx 0rpx;
    }
    li.active {
      color: #fff;
      // background: #178d43;
    }
  }
}
.tab-main {
  ul {
    li {
      padding: 20rpx 0;
      p {
        line-height: 40rpx;
      }
      border-bottom: 1rpx solid #e0e0e0;
    }
  }
}
</style>




