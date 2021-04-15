<template>
  <div class="spec-box">
    <div class="spec-infor t-box">
      <p class="left-con">配送</p>
      <!-- <p class="t-box-flex3 mar-t4">上蔬永辉—<span class="shop-name">虹漕路店</span>为您配送现货，19:00前下单最快60分送达</p> -->
      <p class="t-box-flex3 mar-t4">
        <span class="shop-name">{{shopName}}</span>自提
      </p>
    </div>
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { formatTimes } from "@/utils/prototype/date.js";
import { getStoreInfo } from "@/api/interface.js";
import { log } from "util";
export default {
  data() {
    return {
      shopName: ""
    };
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data()); //初始化数据
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set("prevpage", prevpage.route);
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    //获取店铺信息
    this.getShopNmame();
    // this.shopName = JSON.parse($storage.get("getshopinfor")).tginfoName
  },

  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
  },
  methods: {
    getShopNmame() {
      http
        .get(getStoreInfo, { userinfoCode: $storage.get("shopinforCode") })
        .then(el => {
          this.shopName = el.userinfoCompname;
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../common/css/common.less";
.t-box {
  display: flex;
}
.t-box-flex1 {
  flex: 1;
}
.t-box-flex2 {
  flex: 2;
}
.mar-r20 {
  margin-right: 20rpx;
}
.mar-t6 {
  margin-top: 20rpx;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.color-red {
  color: #e40506;
}
.fontw-400 {
  font-weight: 600;
}
.color-999 {
  color: #999999;
}
.mar-t4 {
  //   margin-top: 8rpx;
}
.spec-box {
  background: @white-color;
  font-size: 24rpx;
  .spec-infor {
    min-height: 80rpx;
    line-height: 80rpx;
    margin: 0px 30rpx;
    display: flex;
    border-left: none;
    border-right: none;
    .left-con {
      width: 80rpx;
      height: 80rpx;
      line-height: 80rpx;
    }
  }
}
</style>

