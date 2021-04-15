<template>
  <div class="member" :style="{background:baseColor}">
    <div class="member-head">会员码</div>
    <div class="member-center">
      <div class="header">
        <img class="headerPic" :src="userInfo.avatarUrl" alt />
        <div class="header_right">
          <div class="right_top">
            <div class="title">{{userData.userPhone}}</div>
            <!-- <div class="title1">
              年消费金额:
              <i>¥10.00</i>
            </div>-->
          </div>
          <div class="right_bottom">
            <!-- <img src="/static/img/address/address_default@2x.png" alt /> -->
            <span :style="{'color':baseColor,'border-color':baseColor}">普通用户</span>
            <!-- <i>会员有效期至2020-11-10</i> -->
          </div>
        </div>
      </div>
      <div class="detail">
        <div class="detailBtn1">
          <i>{{couponNum}}</i>
          优惠券
        </div>
        <div class="detailBtn1">
          <h3>{{unitPrice.obpay}}{{moneyNum}}{{unitPrice.mapay}}</h3>电子购物卡
        </div>
        <div class="detailBtn1">
          <h4>{{integralNum}}</h4>积分
        </div>
      </div>
      <div class="code">
        <div class="number">Card No: {{userData.userInfoCode}}</div>
        <div class="codePic">
          <canvas style="width: 150px; height: 150px;" canvas-id="canvasId"></canvas>
        </div>
        <div class="subTitle">使用时请向收银员出示此二维码</div>
        <div class="bottom">
          <div class="btn1" @click="coup">
            <i class="iconfont icon-youhuiquan5" style="font-size:28rpx"></i>
            <i>优惠券</i>
          </div>
          <div class="btn1" @click="Sao">
            <i class="iconfont icon-tubiaolunkuo-" style="font-size:28rpx"></i>
            <i>扫一扫</i>
          </div>
        </div>
      </div>
    </div>
    <!-- <img class="member-temppic" src="./static/img/mine/carimg.png" alt /> -->
  </div>
</template>
<script>
import { $storage, $router } from "@/utils/prototype/vue.js";
import http from "@/api/http.js";
import QRCode from "@/utils/weapp-qrcode.js";
import {
  coupon,
  integral,
  updateUCode,
  queryAccountOuterByUser
} from "@/api/interface.js";
export default {
  data() {
    return {
      userData: {},
      userInfo: {},
      src: "",
      // 画布的宽高要和object里面的宽高保持一致
      object: {
        text: {}, // 二维码的内容
        width: 150, // 二维码的宽
        height: 150, // 二维码的高
        canvasId: "canvasId" //canvas的ID（唯一标识）
      },
      baseColor: null,
      couponNum: 0,
      moneyNum: 0,
      integralNum: 0
    };
  },
  onLoad() {
    this.userData = $storage.get("loginInfor");
    this.userInfo = $storage.get("userInfo");
    this.object.text =
      this.userData.userPhone + "," + this.userData.userInfoCode;
  },
  created() {},
  mounted() {
    this.baseColor = "#" + $storage.get("baseColor");
    this.getCouponList(); // 查询优惠券的
    this.getIntegral(); // 我的积分
    this.getAccount(); // 我的钱包
    this.getUcode();
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice") || {};
    }
  },
  methods: {
    getCouponList() {
      http
        .get(coupon.couponList, {
          channelCode: "channelCode",
          dataState: 0
        })
        .then(res => {
          this.couponNum = res.total || 0;
        });
    },
    getUcode() {
      http.get(updateUCode).then(res => {
        let text = {
          userinfoCode: $storage.get("loginInfor").userInfoCode,
          userCode: $storage.get("loginInfor").userCode,
          userinfoUcode: res.dataObj
        };
        this.getCode(text);
      });
    },
    getIntegral() {
      http.post(integral.getUpmupointsPageByPC).then(res => {
        if (res) {
          this.integralNum = res.upointsNum || 0;
        }
      });
    },
    getAccount() {
      http.get(queryAccountOuterByUser).then(res => {
        this.moneyNum = res.dataObj.faccountPortion || 0;
      });
    },
    getCode(object) {
      let that = this;
      console.log("开始生产二维码", object);
      // 调用生成二维码的函数
      // code(object, function(data) {
      //   console.log(data, "that.src = data;");
      //   that.src = data;
      // });
      //   }).then(data => {

      //   });
      // const W = wx.getSystemInfoSync().windowWidth;
      // const rate = 750.0 / W;
      // const qrcode_w = 300 / rate;
      new QRCode("canvasId", {
        text: JSON.stringify(object),
        width: 150,
        height: 150,
        padding: 6, // 生成二维码四周自动留边宽度，不传入默认为0
        correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
        callback: res => {
          console.log(res.path);
        }
      });
    },
    coup() {
      this.$router.push("o2o/pages/o2oPromotion_modules/coupon/couponList");
    },
    Sao() {
      wx.scanCode({
        success(res) {
          console.log(res);
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "../../../../common/css/common.less";
.member {
  // background-color: #208f43;
  height: 100%;
  &-head {
    color: white;
    text-align: center;
  }
  &-center {
    margin-top: 60rpx;
    width: 690rpx;
    height: 800rpx;
    background-color: white;
    margin-left: 30rpx;
    border-radius: 20rpx;
    margin: 0 auto;
    margin-top: 60rpx;
    padding-bottom: 60rpx;
    .header {
      display: flex;
      flex-direction: row;
      .headerPic {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50rpx;
        margin-top: 30rpx;
        margin-left: 20rpx;
      }
      .header_right {
        display: flex;
        flex-direction: column;
        margin-left: 20rpx;
        margin-top: 20rpx;
      }
      .right_top {
        display: flex;
        flex-direction: row;
        .title {
          font-size: 34rpx;
        }
        .title1 {
          display: flex;
          flex-direction: row;
          margin-left: 20rpx;
          margin-top: 10rpx;
          font-size: 22rpx;
          color: #666666;
          i {
            color: red;
            margin-left: 10rpx;
          }
        }
      }
      .right_bottom {
        span {
          display: inline-block;
          font-size: 20rpx;
          color: #208f43;
          border-radius: 40rpx;
          //   background: #208f43;
          border: 1rpx solid #208f43;
          //   height: 24rpx;
          //   line-height: 24rpx;
          padding: 0rpx 12rpx;
          letter-spacing: 2rpx;
          margin-top: 4rpx;
        }
        display: flex;
        flex-direction: row;
        margin-top: 10rpx;
        img {
          margin-top: 10rpx;
          width: 100rpx;
          height: 30rpx;
        }
        i {
          margin-top: 10rpx;
          margin-left: 30rpx;
          color: #999999;
          font-size: 20rpx;
        }
      }
    }
    .detail {
      display: flex;
      flex-direction: row;
      width: 660rpx;
      height: 120rpx;
      border-bottom: rgb(237, 238, 239) solid 1rpx;
      border-top: rgb(237, 238, 239) solid 1rpx;
      margin-left: 15rpx;
      margin-top: 20rpx;
      .detailBtn1 {
        -webkit-flex: 1; /* Chrome */
        -ms-flex: 1; /* IE 10 */
        flex: 1; /* NEW, Spec - Opera 12.1, Firefox 20+ */
        -webkit-box-flex: 1; /* OLD - iOS 6-, Safari 3.1-6 */
        -moz-box-flex: 1; /* OLD - Firefox 19- */
        flex: 1;
        margin-top: 20rpx;
        color: #666666;
        font-size: 22rpx;
        text-align: center;
        i {
          color: #208f43;
          font-size: 24rpx;
        }
        h3 {
          color: red;
          font-size: 24rpx;
        }
        h4 {
          color: #2f7dba;
          font-size: 24rpx;
        }
      }
    }
    .code {
      margin-top: 20rpx;
      text-align: center;
      .number {
        font-size: 24rpx;
        color: #666666;
      }
      .codePic {
        display: flex;
        justify-content: center;
        -webkit-justify-content: center;
        margin-top: 20rpx;
      }
      .subTitle {
        text-align: center;
        font-size: 20rpx;
        color: #666666;
        margin-top: 20rpx;
      }
      .bottom {
        display: flex;
        display: -webkit-flex;
        flex-direction: row;
        width: 80%;
        margin: 30rpx 10% 0;

        // justify-content: space-evenly;
        // -webkit-justify-content:space-evenly;
        .btn1 {
          -webkit-flex: 1; /* Chrome */
          -ms-flex: 1; /* IE 10 */
          flex: 1; /* NEW, Spec - Opera 12.1, Firefox 20+ */
          -webkit-box-flex: 1; /* OLD - iOS 6-, Safari 3.1-6 */
          -moz-box-flex: 1; /* OLD - Firefox 19- */
          flex: 1;
          text-align: center;
          img {
            width: 30rpx;
            height: 20rpx;
            background-color: #208f43;
          }
          i {
            text-align: center;
            font-size: 20rpx;
            color: #666666;
            // margin-top: 5rpx;
          }
        }
      }
    }
  }
  &-temppic {
    margin-left: 30rpx;
    width: 690rpx;
    height: 300rpx;
  }
}
</style>

