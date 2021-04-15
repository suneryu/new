<template>
  <div class="couponList">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="couponList-tit">
      <div
        v-for="(tit,index) in titList"
        :key="index"
        @click="titClick(index)"
        :style="{color:current===index?baseColor:''}"
      >
        {{tit.tit}}
        <i>({{tit.num}})</i>
        <span v-show="current===index" :style="{background:baseColor}"></span>
      </div>
    </div>
    <div class="list" v-if="items.length != 0">
      <div class="item" v-for="(item,index) in items" :key="index">
        <div class="con t-box">
          <div class="price c-theme" :style="{color:baseColor}">
            <div class="new" v-if="news">
              <div class="sanjiao"></div>
              <div class="cont">新</div>
            </div>
            <p>
              {{item.pbName}}
              <span>{{item.discAmount}}</span>
            </p>
          </div>
          <div class="info t-box-flex1">
            <p class="mar-b20">{{item.promotionName}}</p>
            <span>{{item.couponStart}}至{{item.couponEnd}}</span>
          </div>
          <div class="go"  v-if="headerIndex1==0">
            <span class="bg-theme" :style="{background:baseColor}">去使用</span>
          </div>
        </div>
        <div
          class="other-info"
          v-if="item.dataState == 0 && item.pbCode === '0004'"
        >使用规则：{{item.discName}}</div>
        <div class="already-use" v-if="item.dataState == 1"></div>
        <div class="overdue" v-if="item.dataState == 2"></div>
      </div>
    </div>
    <div class="couponList-nulls"  v-if="items.length == 0" >
       <img :src="nullImg"/>
     </div>
    <lastPageLine :lastPageLine="lastPageLine" />
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router } from "@/utils/prototype/vue.js";
import { coupon } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
import vueTabBar from "@/components/communal/vueTabBar";
import { formatDate } from "@/utils/prototype/date.js";
import lastPageLine from "@/components/communal/last-page-line";
export default {
  data() {
    return {
      title: "优惠券",
      leftIcon: true,
      rightIcon: false,
      baseColor: "",
      current: 0,
      total: 0,
      page: 1,
      rows: 10,
      titList: [
        { tit: "未使用", num: 0 },
        { tit: "已过期", num: 0 },
        { tit: "使用记录", num: 0 }
      ],
      headerIndex1:'0',
      items: [],
      dataState: 0,
      lastPageLine: false,
      userImgurl: require("../../../../../../static/img/mine/default_header.png"),
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/no_coupon.png"
    };
  },
  components: {
    commonHeader,
    lastPageLine
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    http
      .post(coupon.queryUsercouponNember, { channelCode: "channelCode" })
      .then(res => {
        if (res && res.dataMap) {
            this.titList[2].num = res.dataMap.expired;
          this.titList[0].num = res.dataMap.notused;
          this.titList[1].num = res.dataMap.alreadyused;
          
          this.commonMounted();
        }
      });
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();
  },
  filters: {
    fomat(val) {
      return formatDate(val);
    }
  },
  methods: {
      
    commonMounted() {
      http
        .post(coupon.couponList, {
          dataState: this.dataState,
          channelCode: 'channelCode'
        })
        .then(res => {
          if (res && res.rows) {
            this.items = res.rows;
            this.items.map(v => {
              v.couponStart = formatDate(v.couponStart).substring(0, 10);
              v.couponEnd = formatDate(v.couponEnd).substring(0, 10);
            });
          }
          if (this.items.length === 0) {
            this.lastPageLine = false;
          }
        });
    },
    titClick(index) {
      this.items = [];
      this.current = index;
      this.dataState = index;
      this.headerIndex1 = index;
      this.page = 1;
      this.rows = 10;
      this.commonMounted();
    },
    loadMore() {
      let num = Math.ceil(this.total / 10);
      this.page++;
      if (this.page <= num) {
        http.post(coupon.couponList, {
            page: this.page,
            rows: this.rows,
            dataState: this.dataState
          })
          .then(res => {
            let list = res.rows;
            list.map(v => {
              v.couponStart = formatDate(v.couponStart);
              v.couponEnd = formatDate(v.couponEnd);
            });

            this.items = [...this.items, ...list];
          });
      } else {
        this.lastPageLine = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../../../common/css/common.less";
.t-box {
  display: -moz-box;
  display: -webkit-box;
  display: box;
}

.t-box-flex1 {
  -webkit-box-flex: 1;
  box-flex: 1;
  width: 0;
}

.t-box-flex2 {
  -webkit-box-flex: 2;
  box-flex: 2;
  width: 0;
}

.t-box-flex3 {
  -webkit-box-flex: 3;
  box-flex: 3;
  width: 0;
}

.t-box-center {
  -webkit-box-align: center;
  box-align: center;
}
.couponList {
  width: 100%;
  height: 100%;
  background: @white-color;
  &-tit {
    margin-top: 90rpx;
    height: 92rpx;
    display: flex;
    border-bottom: 20rpx solid #fafafa;
    div {
      justify-content: center;
      position: relative;
      height: 92rpx;
      line-height: 92rpx;
      flex: 1;
      display: flex;
      align-items: center;
      span {
        height: 3rpx;
        width: 100%;
        background: #bfa676;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }
  .list {
    background-color: #fff;
    // margin-top: 20px;
    height: calc(100% - 100px - 90px - 20px);

    overflow: scroll;
    box-sizing: border-box;
    .item:first-child {
      margin-top: 30rpx;
    }
    .item {
      width: 685rpx;
      min-height: 140rpx;
      border-radius: 6rpx;
      margin: 0 auto;
      //   margin: 30px auto;
      margin-bottom: 30rpx;
      overflow: hidden;
      position: relative;
      background-color: #ffffff;
      box-shadow: 0rpx 0rpx 5rpx 5rpx rgba(121, 121, 121, 0.05);
      .con {
        padding: 36rpx 0 28rpx;
      }
      .other-info {
        font-size: 22rpx;
        line-height: 36rpx;
        padding: 20rpx 55rpx;
        position: relative;
        color: #999999;
        border-top: 1rpx dashed #eeeeee;
        &:before,
        &:after {
          content: "";
          width: 20rpx;
          height: 20rpx;
          border-radius: 50%;
          position: absolute;
          top: -20rpx;
          background-color: #f9f9f9;
        }
        &:before {
          content: "";
          left: -10rpx;
        }
        &:after {
          content: "";
          right: -10rpx;
        }
      }
      .price {
        font-size: 22rpx;
        width: 228rpx;
        text-align: center;
        // color: #b79f77;
        span {
          font-size: 50rpx;
          vertical-align: top;
        }
        .new {
          position: relative;
          .sanjiao {
            width: 0;
            height: 0;
            border-width: 60rpx 60rpx 0 0;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
            margin: 40rpx auto;
            position: relative;
            position: absolute;
            top: -80rpx;
          }
          .cont {
            position: absolute;
            color: #fff;
            top: -33rpx;
            left: 3rpx;
            transform: rotateZ(-45deg);
            font-size: 20rpx;
          }
        }
      }
      .info {
        p {
          font-size: 30rpx;
          font-weight: bold;
          color: #333333;
          .icon {
            width: 52rpx;
            height: 28rpx;
            border-radius: 14rpx;
            display: inline-block;
            font-size: 18rpx;
            line-height: 28rpx;
            text-align: center;
            font-weight: normal;
            vertical-align: middle;
            margin-right: 8rpx;
            background-color: #82a7ea;
            color: #ffffff;
          }
        }
        span {
          font-size: 20rpx;
          color: #999999;
        }
      }
      .go {
        span {
          display: inline-block;
        //   background-color: #b79f77;
          color: #fff;
          width: 122rpx;
          height: 50rpx;
          text-align: center;
          line-height: 50rpx;
          border-radius: 50rpx;
          margin-top: 20rpx;
          margin-right: 20rpx;
          font-size: 22rpx;
        }
      }
      .action {
        width: 160rpx;
        display: flex;
        align-items: center;
        a {
          width: 122rpx;
          height: 50rpx;
          border-radius: 25rpx;
          font-size: 24rpx;
          line-height: 50rpx;
          text-align: center;
          display: block;
          margin: 0 auto;
          background-color: #fe9a01;
          color: #ffffff;
        }
      }
    }
    .already-use,
    .overdue {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url("../../../../../../static/img/mine/already-used.png");
      background-repeat: no-repeat;
      background-position: 95% center;
      background-size: 103rpx 103rpx;
      box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(241, 206, 206, 0.15);
      background-color: rgba(255, 255, 255, 0.6);
    }
    .overdue {
      background-image: url("../../../../../../static/img/mine/overdue.png");
      box-shadow: 0rpx 0rpx 15rpx 0rpx rgba(241, 206, 206, 0.15);
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
  //   &-con{
  //     padding: 15rpx 30rpx 0;
  //     ul{
  //       li{
  //         padding: 38rpx 33rpx 30rpx;
  //         border-radius: 5rpx;
  //         box-shadow: 0rpx 0rpx 30rpx #eee;
  //         margin:30rpx 0 20rpx;
  //         div{
  //           display: flex;
  //           align-items: center;
  //           h1{
  //             color: #d66377;
  //             font-size: 22rpx;
  //             margin-right: 50rpx;
  //             width: 136rpx;
  //             text-align: center;
  //             display: flex;
  //             align-items: center;
  //             justify-content: center;
  //           i{
  //             font-size: 50rpx;
  //           }
  //         }
  //           h2{
  //             font-size: 22rpx;
  //             color: @color-999;
  //             width: 136rpx;
  //             text-align: center;
  //             margin-right: 50rpx;
  //           }
  //           h3{
  //             font-size: @top-title;
  //             color: @color-333;
  //           }
  //           h4{
  //             font-size: 20rpx;
  //             color: @color-999;
  //           }
  //         }

  //       }
  //     }
  //   }
  &-nulls {
    height: calc(100% - 202rpx);
    text-align: center;
    img {
      width: 395rpx;
      height: 330rpx;
      margin: 280rpx auto 0;
    }
  }
}
</style>




