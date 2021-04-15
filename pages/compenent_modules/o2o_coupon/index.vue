<template>
  <div class="spec-box">
    <div class="spec-infor">
      <p class="left-con">领券</p>
      <p class="right-con" @click="changeSpec">
        <i class="iconfont">&#xe61d;</i>
      </p>
    </div>
    <!--过渡层-->
    <div class="ceng" v-show="showhiden"></div>
    <!--选择规格-->
    <div class="spec-boxinfor" :style="{bottom:bot}">
      <div class="auto mar-t20 spec-ptn">
        <div class="t-box">
          <h3 class="t-box-flex1">优惠券列表</h3>
          <div class="spec-close" @click="_close()">
            <i class="iconfont icon-guanbi"></i>
          </div>
        </div>
        <ul class="prom-list" v-if="couponList.length != 0 ">
          <li class="t-box" v-for="(item,index) in couponList" :key="index">
            <div class="t-box-flex1 text-left">
              <p class="color-red fontw-400">{{item.pbName}}</p>
              <p class="mar-t6 color-999">{{item.discName}}</p>
            </div>
            <div class="t-box-flex2">
              <p>{{item.promotionName}}</p>
              <p class="mar-t6 color-999">{{item.receiveStart}}至{{item.receiveEnd}}</p>
            </div>
            <div class="t-box-flex1 text-right">
              <p
                class="mar-t6 get-btn"
                :style="{'background':item.styles}"
                @click="saveCoup(item.promotionCode,index,item.staute)"
              >
                <span>{{item.staute}}</span>
              </p>
            </div>
          </li>
        </ul>
        <div class="no-prom" v-if="couponList.length == 0 ">
          <img :src="nullImg" />
          <!-- <p>{{noCoupon}}</p> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { formatTimes } from "@/utils/prototype/date.js";
import { queryCouponListBySkuCode,saveUsercoupon } from "@/api/interface.js";
import { log } from "util";
export default {
  props: ["skuList", "nullImg"],
  data() {
    return {
      userImgurl: require("../../../static/img/helpCenter/header.png"), //头像
      showhiden: false,
      bot: "-500px",
      couponList: [],
      baseColor: "",
      getshow: false,
      noshow: true,
      indexs: null,
      getName: "领取",
    //   noCoupon:"",
      couponList:[],
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
      backgroundColor: "#" + this.$state.baseColor,
      backgroundColor: "#07913B"
    });
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    this.baseColor = "#07913B";
  },
  methods: {
    //选择优惠券
    changeSpec() {
        console.log("获取领券")
        console.log(this.skuList,"数据")
      //   this.$emit("getCouponList");
      // getCouponList() {
      if (this.skuList) {
        let _datas = {
          skuCode: this.skuList.skuCode,
          skuNo: this.skuList.skuNo,
          classtreeCode: this.skuList.classtreeCode,
          brandCode: this.skuList.brandCode,
          pntreeCode: this.skuList.skuNo,
          memberCode: this.skuList.memberCode
        };
        http.get(queryCouponListBySkuCode, _datas).then(res => {
          if (res.length > 0) {
            res.map(el => {
              el.receiveEnd = formatTimes(el.receiveEnd);
              el.receiveStart = formatTimes(el.receiveStart);
              (el.staute = "领取"), (el.styles = "#07913B");
            });
          }

          if (res.length > 0) {
            this.couponList = res;
          } else {
            // this.noCoupon = "暂无优惠券";
          }
        });
      }

      // },
      this.showhiden = true;
      this.bot = "0px";
    },
    // 关闭弹窗
    _close() {
      this.showhiden = false;
      this.bot = "-500px";
    },
    //过滤数组
    filter_array(array) {
      return array.filter(item => item);
    },
    //加入购物车
    confirmBtn(i) {
      this._close();
    },
    saveCoup(code, index, stu) {
      if (stu != "已领取") {
        let strs = {
          couponAmount: 1, //数量默认一张
          promotionCode: code
        };
        http.post(saveUsercoupon, strs).then(res => {
          if (res.success) {
            this.couponList[index].staute = "已领取";
            this.couponList[index].styles = "#999999";
            this.indexs = index;
          } else {
            $message.alert(res.msg);
          }
        });
      } else {
        $message.alert("不可重复领取优惠券！");
      }
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

.get-btn {
  display: inline-block;
  width: 120rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  background: #07913b;
  color: #ffffff;
  border-radius: 60rpx;
}
.red-btn {
  background: #999999;
}
.spec-box {
  background: @white-color;
  font-size: 24rpx;
  .spec-infor {
    height: 80rpx;
    line-height: 80rpx;
    margin: 0rpx 30rpx;
    display: flex;
    border-bottom: 1rpx solid #ededed;
    border-left: none;
    border-right: none;
    .left-con {
      flex: 5;
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
  .spec-boxinfor {
    background: @white-color;
    position: fixed;
    bottom: -1000rpx;
    left: 0;
    z-index: 100003;
    width: 100%;
    max-height: 1000rpx;
    min-height: 600rpx;
    .spec-ptn {
      padding: 30rpx 0;
      h3 {
        font-size: 32rpx;
      }
      .prom-list {
        font-size: 28rpx;
        margin-top: 20rpx;
        // max-height: 400rpx;
        overflow-y: auto;
        li {
          border: 1rpx solid #f8f8f8;
          font-size: 24rpx;
          padding: 16rpx 24rpx;
          margin-top: 20rpx;
        }
      }
      .no-prom {
        img {
          display: block;
          width: 359rpx;
          height: 276rpx;
          margin: 40rpx auto;
        }
        p {
          text-align: center;
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

