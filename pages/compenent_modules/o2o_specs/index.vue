<template>
  <div class="spec-box">
    <div class="spec-infor t-box">
      <p class="left-con">规格</p>
      <p class="t-box-flex3 mar-t4">
        <span class="shop-name">{{JSON.stringify(specsStrList).replace(/\["|"]/g,'')}}</span>
      </p>
      <p class="right-con" @click="changeSpec">
        <i class="iconfont">&#xe61d;</i>
      </p>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { addShoppingGoods, addShoppingGoodsBySpec } from "@/api/interface.js";
import { log } from "util";
export default {
  props: ["specsStrList",],
  data() {
    return {
      userImgurl: require("../../../static/img/helpCenter/header.png"), //头像
      showhiden: false,
      bot: "-450px",
      baseColor: "",
      specsStr: [],
      goodsnum: 1,
      specShowed: true,
      goodsPrice: "",
      noAddcat: true,
      getSkuname: "",
      skuId: ""
    };
  },
  components: {},
  onLoad() {
    Object.assign(this.$data, this.$options.data()); //初始化数据
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set("prevpage", prevpage.route);
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + $storage.get("baseColor")
    });
    this.baseColor = "#" + $storage.get("baseColor");
  },
  mounted() {},

  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
  },
  methods: {
    changeSpec() {
      this.$emit("showSpec");
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
.t-box-flex3 {
  flex: 3;
}
.mar-r20 {
  margin-right: 20rpx;
}
.spec-box {
  background: @white-color;
  font-size: 24rpx;
  .spec-infor {
    height: 80rpx;
    line-height: 80rpx;
    margin: 0rpx 30rpx;
    display: flex;
    border: 1rpx solid #ededed;
    border-left: none;
    border-right: none;
    .left-con {
      width: 80rpx;
      height: 80rpx;
      line-height: 80rpx;
    }
    // .left-con {
    //   flex: 5;
    //   span {
    //     display: inline-block;
    //     width: 120rpx;
    //   }
    //   .mar-l10 {
    //     margin-left: 10rpx;
    //     display: inline-block;
    //   }
    // }
  }
  .ceng {
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 100001;
  }
  .spec-boxinfor {
    background: @white-color;
    position: fixed;
    left: 0;
    z-index: 100022;
    width: 100%;
    max-height: 784rpx;
    height: auto;
    .spec-ptn {
      padding: 30rpx;
      .spec-header {
        .spec-img {
          width: 160rpx;
          height: 160rpx;
          overflow: hidden;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
        h3 {
          margin-top: 80rpx;
          margin-bottom: 12rpx;
          color: #e40506;
        }
      }
      .spec-main {
        margin-top: 40rpx;
        .spec-list {
          h3 {
            height: 108rpx;
            line-height: 108rpx;
          }
          ul {
            overflow: hidden;
            li {
              float: left;
              margin: 20rpx 20rpx 0 0;
              height: 54rpx;
              line-height: 54rpx;
              min-width: 70rpx;
              padding: 0 10rpx;
              text-align: center;
              border: 1rpx solid #eeeeee;
              border-radius: 8rpx;
            }
            .active {
              color: #fff;
              background: #07913b;
              border-color: #07913b;
            }
          }
        }
      }
      .sel-goods-num {
        height: 108rpx;
        line-height: 108rpx;
        .sel-goods-num-btn {
          margin-top: 20rpx;
          width: 228rpx;
          height: 56rpx;
          line-height: 56rpx;
          border-radius: 0px;
          color: #9b9b9b;
          font-size: 36rpx;
          button {
            font-size: 48rpx;
            width: 64rpx;
            height: inherit;
            background: #f5f5f5;
            color: #999;
            line-height: 52rpx;
            border-radius: 0rpx;
          }
          p {
            font-size: 32rpx;
            text-align: center;
          }
        }
      }
    }
    .surebtn {
      height: 90rpx;
      line-height: 90rpx;
      text-align: center;
      color: #fff;
      background: #07913b;
      font-size: 32rpx;
    }
  }
}
</style>

