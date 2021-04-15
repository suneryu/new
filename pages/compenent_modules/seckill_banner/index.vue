<template>
  <div class="banners-list">
    <swiper
      class="swiper"
      indicator-dots="true"
      indicator-color="#b9ddc5"
      indicator-active-color="#07913B"
      autoplay="true"
      interval="4000"
      duration="1000"
      circular="true"
      :style="{ height: Hei + 'px' }"
    >
      <block v-for="(item, index) in skuList.rsGoodsFileDomainList" :index="index" :key="index">
        <swiper-item>
          <image :src="item.goodsFileUrl" mode="aspectFit" class="slide-image" />
          <!-- <p>我是说</p> -->
        </swiper-item>
      </block>
    </swiper>
    <div class="goods-infor" @countDown="countDown">
      <div class="t-box group-infor">
        <div class="price t-box-flex3" v-if="price && price != 'NaN'">
          <div class="price-show">
            <span class="price-box">
              {{unitPrice.obpay}}
              <i class="price-num">{{ price }}</i>
              {{unitPrice.mapay}}
            </span>
          </div>
          <div class="sold">还剩{{skuList.shengyunum}}件</div>
        </div>
        <div class="t-box-flex2 count_down">
          <p>{{title}}</p>
          <ul class="count">
            <li class="border-style">{{data}}</li>
            <li>天</li>
            <li class="border-style">{{hours}}</li>
            <li>时</li>
            <li class="border-style">{{mins}}</li>
            <li>分</li>
            <li class="border-style">{{sec}}</li>
            <li>秒</li>
          </ul>
        </div>
      </div>
      <div class="title-box">
        <h3 class="goods-titles">{{ skuList.goodsName }}</h3>
        <p class="sub">{{skuList.goodsProperty}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { article, getPmPromotionInfo } from "@/api/interface.js";

export default {
  props: ["skuList", "promotionEndtime", "ginfoCode", "getgoodtypes"],
  data() {
    return {
      goodsinfor: "",
      rsSkuDomainList: [],
      Hei: 0,
      price: "",
      //   倒计时
      //   countDownList: "00天00时00分00秒",
      //   actEndTime: "2019-12-29 18:50:00",
      actEndTime: "",
      data: "",
      hours: "",
      mins: "",
      sec: "",
      load: true,
      couponOnceNums: "",
      goodsPbillno: "", //成团人数
      title: "距离结束仅剩",
      seet: null
    };
  },
  updated() {
    this.price = (this.skuList.pricesetNprice * 1).toFixed(2);
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
  },
  onUnload() {
    clearTimeout(this.seet);
  },
  filters: {
    numFilter(value) {
      let realVal = null;
      if (value) {
        // 截取当前数据到小数点后两位
        realVal = parseFloat(value).toFixed(2);
      } else {
        realVal = "--";
      }
      return realVal;
    }
  },
  onLoad(options) {
    Object.assign(this.$data, this.$options.data()); //初始化数据
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set("prevpage", prevpage.route);
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor,
      backgroundColor: "#07913B"
    });
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    if (this.skuList) {
      this.actEndTime = this.skuList.goodsOdate;
      if ($storage.get("state") == "0") {
        this.title = "活动已结束";
        this.data = "00";
        this.hours = "00";
        this.mins = "00";
        this.sec = "00";
      } else {
        this.settime();
      }
    }
  },
  methods: {
    timeFormat(param) {
      return param < 10 ? "0" + param : param;
    },
    settime() {
      let time = this.actEndTime - new Date().getTime();
      if (time <= 0) {
        this.title = "活动已结束";
        this.data = "00";
        this.hours = "00";
        this.mins = "00";
        this.sec = "00";
      } else if (time > 0) {
        time--;
        let lasttime = time / 1000;
        this.data = this.timeFormat(parseInt(lasttime / (60 * 60 * 24)));
        this.hours = this.timeFormat(
          parseInt((lasttime % (60 * 60 * 24)) / 3600)
        );
        this.mins = this.timeFormat(
          parseInt(((lasttime % (60 * 60 * 24)) % 3600) / 60)
        );
        this.sec = this.timeFormat(
          parseInt(((lasttime % (60 * 60 * 24)) % 3600) % 60)
        );
        this.title = "距离结束仅剩";
      }
      let that = this;
      let seet = setTimeout(function() {
        that.settime();
      }, 1000);
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../common/css/common.less";
page {
  background: @white-color;
}
.t-box {
  display: flex;
}
.t-box-flex2 {
  -webkit-flex: 2; /* Chrome */
  -ms-flex: 2; /* IE 10 */
  flex: 2; /* NEW, Spec - Opera 12.1, Firefox 20+ */
  -webkit-box-flex: 2; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 2; /* OLD - Firefox 19- */
  flex: 2;
}
.t-box-flex1 {
  -webkit-flex: 1; /* Chrome */
  -ms-flex: 1; /* IE 10 */
  flex: 1; /* NEW, Spec - Opera 12.1, Firefox 20+ */
  -webkit-box-flex: 1; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 1; /* OLD - Firefox 19- */
  flex: 1;
}
.t-box-flex3 {
  -webkit-flex: 3; /* Chrome */
  -ms-flex: 3; /* IE 10 */
  flex: 3; /* NEW, Spec - Opera 12.1, Firefox 20+ */
  -webkit-box-flex: 3; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 3; /* OLD - Firefox 19- */
  flex: 3;
}
.banners-list {
  background: @white-color;
  margin-top: 98rpx;
  .swiper {
    min-height: 400rpx;
    .slide-image {
      height: 100%;
      width: 100%;
    }
  }
  .goods-infor {
    // padding: 20rpx 30rpx;
    .group-infor {
      height: 132rpx;
    }
    .title-box {
      padding: 20rpx 30rpx;
      .goods-titles {
        font-size: 30rpx;
        font-weight: bold;
        color: #333333;
        margin-bottom: 20rpx;
      }
      .sub {
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
      }
    }
    h3 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .price {
      color: #ffffff;
      font-size: 36rpx;
      background: #f5181b;
      padding-left: 34rpx;
      .price-show {
        height: 70rpx;
        line-height: 80rpx;
        .people_num {
          margin-right: 22rpx;
          font-size: 28rpx;
        }
        .price-box {
          display: inline-block;
          .price-num {
            font-size: 36rpx;
            display: initial;
          }
        }
      }

      .sold {
        font-size: 26rpx;
      }
    }
    .count_down {
      background: #f8c245;
      font-size: 24rpx;
      font-weight: 600;
      p {
        height: 70rpx;
        line-height: 80rpx;
        text-align: center;
      }
      .count {
        overflow: hidden;
        display: inline-block;
        margin-left: 6%;
        font-weight: normal;
        li {
          float: left;
          margin-right: 4rpx;
          justify-content: center;
        }
        .border-style {
          border: 1px solid #ee9536;
          display: inline-block;
          height: 24rpx;
          line-height: 23rpx;
          width: 28rpx;
          text-align: center;
          padding: 1rpx;
          border-radius: 6rpx;
          background: #ee9536;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
