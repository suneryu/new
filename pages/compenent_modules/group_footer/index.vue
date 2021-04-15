<template>
  <div class="footer-box">
    <div class="footer t-box">
      <div class="left-cont t-box-flex3">
        <div class="t-box mar-t6">
          <!-- <div class="t-box-flex1 text-center font-12" @click="goCart">
            <i class="iconfont">&#xe623;</i>
            <p>购物车</p>
          </div>-->
          <div class="t-box-flex1 text-center font-12" @click="collectGoods">
            <i class="iconfont" :style="{'color':( indexs=='0'?baseColor:'')}">&#xe667;</i>
            <p>收藏</p>
          </div>
          <div class="t-box-flex1 text-center font-12" @click="Service">
            <i class="iconfont">&#xe6b3;</i>
            <p>客服</p>
          </div>
        </div>
      </div>
      <div v-if="buttonshow =='1'" class="addcar t-box-flex3" :style="{backgroundColor: baseColor}" @click="addCart">立即抢购</div>
      <div v-if="buttonshow == '0'" class="addcar t-box-flex3" style="background:#99999999">已结束</div>
      <div v-if="buttonshow == '3'" class="addcar t-box-flex3" style="background:#99999999">此团已满</div>
    </div>
    <!--过渡层-->
    <div class="ceng" v-show="showhiden"></div>
    <!-- 客服 -->
    <div class="customer-service" :style="{bottom:botser}">
      <ul v-for="(item,index) in sevTelList" :key="index">
        <li class="tel">
          <p>
            {{item.ocsOcserviceReDomain.ocserviceName}}:
            <span>{{item.ocsOcserviceReDomain.ocserviceRemark}}</span>
          </p>
        </li>
        <li @click="close">取消</li>
      </ul>
    </div>
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import {
  addShoppingGoods,
  addShoppingGoodsBySpec,
  queryOcsconfigList
} from "@/api/interface.js";
export default {
  props: ["specList", "skuList", "getspecs", "indexs", "couponOnceNumd"],
  data() {
    return {
      userImgurl: require("../../../static/img/helpCenter/header.png"),
      index1: "",
      baseColor: "",
      showhiden: false,
      botser: "-70px",
      goodsnum: 1,
      sevTelList: [],
      spec: [],
      specShowed: true,
      noAddcat: true,
      goodsPrice: "",
      skuId: "",
      buttonshow: "1",
      actEndTimes: "",
      load: true,
      nums: "",
      seet:null,
    };
  },
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
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
  },
  updated() {},
  onUnload() {
    clearTimeout(this.seet);
  },
  watch: {
    couponOnceNumd(newVal, old) {
      if (newVal == 0 || newVal) {
        if (this.skuList) {
          this.actEndTimes = this.skuList.goodsOdate;
          if ($storage.get("state") == "2") {
            this.buttonshow = "0";
          } else if (this.couponOnceNumd == this.skuList.goodsProperty3) {
            this.buttonshow = "3";
            return;
          } else {
            this.settimes();
          }
        }
      }
    }
  },
  //   watch: {
  //     skuList(newVal, old) {
  //       let that = this;
  //       if (this.load && newVal) {
  //         if (newVal.goodsOdate != old.goodsOdate) {
  //           that.actEndTimes = newVal.goodsOdate;
  //           that.settimes();
  //         }
  //       }
  //     }
  //   },
  mounted() {},
  methods: {
    settimes() {
      let that = this;
      let time = that.actEndTimes - new Date().getTime();
      if (time <= 0) {
        that.buttonshow = "0";
        return;
      } else if (time > 0) {
        that.buttonshow = "1";
      }
      this.seet = setTimeout(function() {
        that.settimes();
      }, 1000);
    },
    //客服
    Service() {
      http.get(queryOcsconfigList).then(res => {
        if (res.length > 0) {
          this.showhiden = true;
          this.botser = "50px";
          this.sevTelList = res;
        }
      });
    },
    //关闭客服
    close() {
      this.showhiden = false;
      this.botser = "-100px";
    },
    addCart() {
      this.$emit("showSpec", "24");
    },
    // 跳转购物车
    goCart() {
      $storage.get("getTopPerMenuList").map(v => {
        if (v.menuAction == "car") {
          $router.push(v.menuJspath);
        }
      });
    },

    //添加收藏
    collectGoods() {
      this.$emit("addcollectGoods");
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
.t-box-flex3 {
  flex: 3;
}
.mar-r20 {
  margin-right: 20rpx;
}
.mar-t6 {
  margin-top: 8rpx;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.text-center {
  text-align: center;
}
.font-12 {
  font-size: 24rpx;
}
.color-999 {
  color: #999999;
}
.footer-box {
  position: fixed;
  bottom: 0rpx;
  height: 98rpx;
  left: 0rpx;
  width: 100%;
  z-index: 100001;
  background: @white-color;
  .footer {
    .addcar {
      background: #07913b;
      text-align: center;
      color: @white-color;
      font-size: 32rpx;
      line-height: 98rpx;
    }
  }
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
.customer-service {
  position: fixed;
  left: 7.5%;
  width: 85%;
  z-index: 100001;
  margin: 0 auto;
  ul {
    height: 140rpx;
    li {
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 8rpx;
      margin-bottom: 8rpx;
      background: @white-color;
    }
    li:first-child {
    }
  }
}
</style>

