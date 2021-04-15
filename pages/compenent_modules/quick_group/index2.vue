<template>
  <div class="quick-wrap">
    <div class="quick-box">
      <div class="h1">直接参与快速成团</div>
      <swiper
        class="swiper"
        autoplay="true"
        interval="4000"
        duration="1000"
        vertical="true"
        circular="true"
        display-multiple-items="1"
        :style="{ height:'60px' }"
      >
        <block v-for="(item, index) in listp" :index="index" :key="index">
          <swiper-item class="s-items">
            <div class="quick-people">
              <div class="inforlist t-box">
                <div class="left-box t-box-flex1 t-box">
                  <img class="people-img" :src="item.imgurl || userImgurl" />
                  <p>{{item.promotionActname}}</p>
                </div>
                <div class="right-box t-box-flex1 t-box">
                  <div class="right-infor">
                    <div class="top-infor">
                      还差
                      <span class="color-red">{{item.chapeople}}人</span>
                      成团
                    </div>
                    <div
                      class="times"
                    >距结束{{item.data}}:{{item.hour}}:{{item.minute}}:{{item.second}}</div>
                  </div>
                  <div class="button">
                    <span @click="goPin(item.promotionCode)">去拼单</span>
                  </div>
                </div>
              </div>
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
  </div>
</template>
<script>
import http from "@/api/http.js";
import { queryPromotionPageAssembleForPc } from "@/api/interface.js";
import { formatTimes, formatPhone } from "@/utils/prototype/date.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
export default {
  props: ["listPro", "ginfoCode", "listp"],
  data() {
    indicatorDots: true;
    return {
      listPro: [],
      timesList: [],
      timesobj: {},
      userImgurl: require("../../../static/img/mine/default_header.png"),
      load: true,
      code: "",
      listProList: [],
      setIntFortime: null,
    };
  },
  created() {},
  onLoad(options) {
    Object.assign(this.$data, this.$options.data()); //初始化数据
  },
  onUnload() {
    clearInterval(this.setIntFortime);
  },

  updated() {},
  watch: {},
  mounted() {
    clearInterval(this.setIntFortime);
    if (this.listp) {
      for (let i = 0; i < this.listp.length; i++) {
        this.listp[i].memberName = formatPhone(this.listp[i].memberName);
        this.listp[i].chapeople =
          this.listp[i].couponOnceNums - this.listp[i].couponOnceNumd;
        this.listp[i].data = "";
        this.listp[i].hour = "";
        this.listp[i].minute = "";
        this.listp[i].second = "";
      }
      this.settimes();
    }
  },
  methods: {
    settimes() {
      let that = this;
      this.setIntFortime = setInterval(() => {
        for (let i = 0; i < this.listp.length; i++) {
          let times = new Date().getTime();
          let lastTime = this.listp[i].promotionEndtime - times; //倒计时剩余时间
          let zhuatime = lastTime / 1000;
          if (lastTime > 0) {
            this.listp[i].data =
              Math.floor(zhuatime / (60 * 60 * 24)) > 9
                ? Math.floor(zhuatime / (60 * 60 * 24))
                : Math.floor(zhuatime / (60 * 60 * 24));
            this.listp[i].hour =
              Math.floor(lastTime / 1000 / 60 / 60) > 9
                ? Math.floor(lastTime / 1000 / 60 / 60)
                : "0" + Math.floor(lastTime / 1000 / 60 / 60);
            this.listp[i].minute =
              Math.floor((lastTime / 1000 / 60) % 60) > 9
                ? Math.floor((lastTime / 1000 / 60) % 60)
                : "0" + Math.floor((lastTime / 1000 / 60) % 60);
            this.listp[i].second =
              Math.floor((lastTime / 1000) % 60) > 9
                ? Math.floor((lastTime / 1000) % 60)
                : "0" + Math.floor((lastTime / 1000) % 60);
          } else {
            this.listp[i].data = "00";
            this.listp[i].hour = "00";
            this.listp[i].minute = "00";
            this.listp[i].second = "00";
          }
          let lists = this.listp;
          this.listp = this.listp.splice(0, this.listp.length, ...lists);
        }
      }, 1000);
    },

    goPin(procode) {
      $storage.set("promotionCode", procode);
      $storage.set("contractTypepro", "0");
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
.color-red {
  color: #f5181b;
}
.t-box-flex1 {
  -webkit-flex: 1; /* Chrome */
  -ms-flex: 1; /* IE 10 */
  flex: 1; /* NEW, Spec - Opera 12.1, Firefox 20+ */
  -webkit-box-flex: 1; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 1; /* OLD - Firefox 19- */
  flex: 1;
}
.quick-wrap {
  background: #ffffff;
  margin-top: 20rpx;
  font-size: 24rpx;
  .quick-box {
    margin: 0 30rpx;
    .h1 {
      height: 80rpx;
      line-height: 80rpx;
      border-bottom: 1rpx solid #ededed;
    }
    .quick-people {
      margin-top: 20rpx;
      .left-box {
        img {
          height: 60rpx;
          width: 60rpx;
          border-radius: 60rpx;
        }
        p {
          margin-left: 16rpx;
          line-height: 60rpx;
        }
      }
      .right-box {
        justify-content: flex-end;
        align-items: center;

        .right-infor {
          text-align: right;
          margin-right: 20rpx;
          .top-infor {
          }
          .times {
            color: #999999;
            margin-top: 6rpx;
          }
        }
        .button {
          width: 110rpx;
          span {
            display: inline-block;
            padding: 2rpx 16rpx;
            border-radius: 8rpx;
            background: #f5181b;
            color: #ffffff;
            margin-top: 6rpx;
          }
        }
      }
    }
  }
}
</style>