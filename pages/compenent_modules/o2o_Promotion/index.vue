<template>
  <div class="spec-box">
    <div class="spec-infor t-box">
      <p class="left-con">促销</p>
      <div class="t-box-flex3 mar-t4">
        <div class="shop-name">
          <span
            class="prom"
            :style="{'color':baseColor,'border-color':baseColor}"
          >{{firstProm.promotionName}}</span>
        </div>
      </div>
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
          <h3 class="t-box-flex1">促销信息：</h3>
          <div class="spec-close" @click="_close()">
            <i class="iconfont icon-guanbi"></i>
          </div>
        </div>
        <div class="no-prom" v-if="Promlist.length == 0 ">
          <!-- <img :src="nullPromImg" /> -->
          <p>{{noProm}}</p>
        </div>
        <ul class="prom-list" v-if="Promlist.length != 0 ">
          <li v-for="(item,index) in Promlist" :key="index">
            <p>{{item.promotionName}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { queryPromotionListByGoodsCode } from "@/api/interface.js";
import { log } from "util";
export default {
  props: ["skuList"],
  data() {
    return {
      userImgurl: require("../../../static/img/helpCenter/header.png"), //头像
      showhiden: false,
      bot: "-392px",
      baseColor: "",
      firstProm: {},
      noProm:"",
      Promlist:[],
    //   nullPromImg:this.$imgDomain +"/paas/shop-master/c-static/images/wxminiImg/noGoods.png",
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
  watch: {
    firstProm() {
      return this.Promlist[0];
    }
  },
  methods: {
    //选择营销
    changeSpec() {
      //   this.$emit("getPromlist");
      //获取促销列表
      // getPromlist() {
      if (this.skuList) {
        let _datas = {
          skuCode: this.skuList.skuCode,
          skuNo: this.skuList.skuNo,
          classtreeCode: this.skuList.classtreeCode,
          brandCode: this.skuList.brandCode,
          pntreeCode: this.skuList.skuNo,
          memberCode: this.skuList.memberCode
        };
        http.get(queryPromotionListByGoodsCode, _datas).then(res => {
          if (res.length > 0) {
            this.Promlist = res;
          } else {
            this.Promlist = res;
            this.noProm = "暂无促销活动";
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
      this.bot = "-392px";
    },
    //过滤数组
    filter_array(array) {
      return array.filter(item => item);
    },
    //加入购物车
    confirmBtn(i) {
      this._close();
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
    border-bottom: 1rpx solid #ededed;
    border-left: none;
    border-right: none;
    .left-con {
      width: 80rpx;
      height: 80rpx;
      line-height: 80rpx;
    }
    .prom {
      // display: inline-block;
      padding: 4rpx 12rpx;
      // border: 1rpx solid #000000;
      border-radius: 20rpx;
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
    bottom: -784rpx;
    left: 0;
    z-index: 100003;
    width: 100%;
    max-height: 784rpx;
    min-height: 600rpx;
    .spec-ptn {
      //   padding: 30rpx;
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
          height: 64rpx;
          line-height: 64rpx;
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

