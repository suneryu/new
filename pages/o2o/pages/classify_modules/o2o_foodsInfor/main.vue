<template>
  <div class="goodsList" :style="{height:items.length===0?'100%':'auto'}">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="shopList-left" @click="goBack">
      <i class="iconfont">&#xe62d;</i>
    </div>
    <div class="content">
      <img class="goods-img" :src="doclistInfopicpathe" alt />
      <div class="introduce">
        <h3>{{doclistTitle}}</h3>
        <p class="reading-num">
          {{doclistTitle1}}
          <!-- 2134
          <span>人阅读</span>-->
        </p>
        <p class="introduce-infor">{{contents}}</p>
        <div class="foods-tip">
          <div class="t-box-flex1 difficult">
            <img class="foods-tip-img" src="/static/img/icons/menu_icon1.png" alt />
            {{levels}}
          </div>
          <div class="t-box-flex1 foods-time">
            <img class="foods-tip-img" src="/static/img/icons/menu_icon2.png" alt />
            {{planTime}}分钟
          </div>
          <div class="t-box-flex1 keep-time">
            <img class="foods-tip-img" src="/static/img/icons/menu_icon3.png" alt />
            {{cookingTime}}分钟
          </div>
        </div>
      </div>
      <!-- 主要食材 -->
      <div class="main-foods" v-if="goodsList.length != 0">
        <div class="main-foods-title">
          <img class="foods-tip-img" src="/static/img/icons/menu_icon3.png" alt />
          主要食材
          <i>/共{{goodsList.length}}件</i>
        </div>
        <div class="swiper-home">
          <scroll-view scroll-x="true" style="width: 100%">
            <view class="swiper-item" v-for="(item,index) in goodsList" :key="index">
              <img :src="item.dataPic" />
              <p class="foods-title">{{item.goodsName}}</p>
              <div class="foods-p">
                <div
                  class="t-box-flex1 selling-price"
                >{{unitPrice.obpay}}{{item.pricesetNprice}}{{unitPrice.mapay}}</div>

                <div
                  class="t-box-flex1 market-price"
                  v-if="item.pricesetMakeprice != 0 "
                >{{unitPrice.obpay}}{{item.pricesetMakeprice}}{{unitPrice.mapay}}</div>
                <div class="t-box-flex1 addcarbox">
                  <i
                    class="add-car iconfont"
                    @click.stop="addCart(item.skuId)"
                    :style="{background:baseColor}"
                  >&#xe6f3;</i>
                </div>
              </div>
            </view>
          </scroll-view>
        </div>
      </div>
      <!-- 主要步骤 -->
      <div class="main-foods step" v-if="stepList.length != 0">
        <div class="main-foods-title">
          <img class="foods-tip-img" src="/static/img/icons/menu_icon3.png" alt />
          主要步骤
          <i>/共{{stepList.length}}步</i>
        </div>
        <ul class="step-list">
          <li v-for="(item,index) in stepList" :key="index">
            <img class="step-imgs" :src="item.stepImg" alt />
            <div class="step-infor">
              <h4>步骤{{index + 1}}/{{stepList.length}}</h4>
              <p>{{item.stepDoclistContent}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import {
  article,
  getFoodsInfo,
  search,
  queryBrandPageForC,
  addShoppingGoods
} from "@/api/interface.js";
import lastPageLine from "@/components/communal/last-page-line";
import commonHeader from "@/components/communal/commonHeader";
export default {
  config: {
    enablePullDownRefresh: true
  },
  data() {
    return {
      title: "菜谱详情",
      leftIcon: false,
      rightIcon: false,
      baseColor: "",
      params: {},
      items: [],
      productList: [],
      doclistTitle: "", //菜名
      doclistTitle1: "",
      doclistInfopicpathe: "", // 图片
      goodsList: [],
      stepList: [],
      extendList: [],
      contents: "",
      levels: "", //等级
      planTime: "", //准备时间
      cookingTime: "", //做饭时间
      getUrl: ""
    };
  },
  components: { lastPageLine, commonHeader },
  onLoad(options) {
    Object.assign(this, this.$options.data());
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    if (options && options.json) {
      let dicCodeId = JSON.parse(options.json).dicCodeId;
      this.getUrl = JSON.parse(options.json).path;
      this.getDoclistForAts(dicCodeId);
    } else {
      this.getDoclistForAts(this.$root.$mp.query.dicCodeId);
    }

    this.baseColor = "#" + this.$state.baseColor;
    this.baseColor = "#07913B";
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return $storage.get("unitPrice");
    }
  },
  methods: {
    goBack() {
      let that = this;
      console.log(this.getUrl, "this.getUrl");
      if (that.getUrl == "home") {
        console.log("返回首页");
        let gobackHome = $storage.get("getTopPerMenuList");
        let goindex = $storage.get("getshopinfor") && JSON.parse($storage.get("getshopinfor")).gourl;
        gobackHome.map(v => {
          if (v.menuCode == "00000042") {
            that.$router.replace("web", {
              defaultUrl: "https://" + goindex + "/paas/shop" + v.menuAction
            });
          }
        });
        // this.$router.replace("web", {
        //   defaultUrl: $storage.get("pagesUrl")
        // });
      } else {
        this.$router.back();
      }
    },
    //添加购物车
    addCart(skuid) {
      http
        .get(addShoppingGoods, {
          skuId: skuid,
          goodsNum: 1
        })
        .then(res => {
          if (res.success) {
            $message.alert("购物车添加成功");
          } else {
            $message.alert(res.msg);
          }
        });
    },
    // 获取文章详情
    getDoclistForAts(code) {
      let parames = {
        doclistId: code
      };
      http.get(article.articleDetail, parames).then(res => {
        this.doclistTitle = res.doclistTitle;
        this.doclistTitle1 = res.doclistTitle1;
        if (res.doclistInfopicpathe) {
          if (!RegExp(/http/).test(res.doclistInfopicpathe)) {
            this.doclistInfopicpathe = this.$domain + res.doclistInfopicpathe;
          }
        }
        this.doclistContent = JSON.parse(res.doclistContent);
        this.contents = JSON.parse(res.doclistContent).contentInfor;
        let extList = JSON.parse(res.doclistContent).extendList;
        let srrlist = JSON.parse(JSON.stringify(extList));
        if (srrlist[0].levels == "low") {
          this.levels = "难度较低";
        } else if (srrlist[0].levels == "middle") {
          this.levels = "难度中等";
        } else {
          this.levels = "难度较高";
        }
        this.planTime = srrlist[1].planTime;
        this.cookingTime = srrlist[2].cookingTime;
        this.goodsList = JSON.parse(res.doclistContent).goodsList;
        this.stepList = JSON.parse(res.doclistContent).stepList;
        if (this.stepList.length > 0) {
          this.stepList.map(el => {
            if (!RegExp(/http/).test(el.stepImg)) {
              el.stepImg = this.$domain + el.stepImg;
            }
          });
        }
        if (this.goodsList.length > 0) {
          this.goodsList.map(el => {
            el.pricesetNprice = (el.pricesetNprice * 1).toFixed(2);
            if (!RegExp(/http/).test(el.dataPic)) {
              el.dataPic = this.$domain + el.dataPic;
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less">
page {
  background: #fff;
}
</style>
<style lang="less" scoped>
@import "../../../../../common/css/common.less";
.addcarbox {
  text-align: right;
}
.t-box-flex1 {
  flex: 1;
}
.add-car {
  display: inline-block;
  padding: 2rpx;
  width: 36rpx;
  height: 36rpx;
  text-align: center;
  line-height: 36rpx;
  border-radius: 36rpx;
  color: #fff;
  font-size: 24rpx;
  font-weight: bolder;
}
.shopList-left {
  position: fixed;
  z-index: 10000;
  height: 90rpx;
  width: 70rpx;
  line-height: 90rpx;
  text-align: left;
  left: 30rpx;
  top: 0;
}
.goodsList {
  width: 100%;
  background: @white-color;
  &-left {
    position: fixed;
    z-index: 9999;
    height: 90rpx;
    width: 70rpx;
    line-height: 90rpx;
    text-align: left;
    left: 30rpx;
    top: 0;
  }
  .content {
    margin-top: 96rpx;
    .goods-img {
      width: 100%;
    }
    .introduce {
      padding: 0 30rpx;
      border-bottom: 20rpx solid #fafafa;
      h3 {
        height: 72rpx;
        line-height: 72rpx;
        color: #333333;
        font-size: 34rpx;
      }
      .reading-num {
        color: #999999;
        font-size: 22rpx;
        margin-bottom: 40rpx;
      }
      .introduce-infor {
        font-size: 28rpx;
        line-height: 48rpx;
        color: #666666;
        margin-bottom: 20rpx;
      }
      .foods-tip {
        display: flex;
        height: 106rpx;
        line-height: 106rpx;
        border-top: 1rpx solid #eeeeee;
      }

      .difficult {
        img {
          width: 30rpx;
          height: 26rpx;
        }
      }
      .foods-time {
        text-align: center;
        img {
          width: 30rpx;
          height: 30rpx;
        }
      }
      .keep-time {
        text-align: right;
        img {
          width: 32rpx;
          height: 26rpx;
        }
      }
    }
    .main-foods {
      padding-left: 30rpx;
      padding-right: 30rpx;
      border-bottom: 20rpx solid #fafafa;
      background: @white-color;
      .main-foods-title {
        height: 100rpx;
        line-height: 100rpx;
        border-bottom: 1rpx solid #eeeeee;
        img {
          width: 38rpx;
          height: 34rpx;
          margin-right: 12rpx;
        }
        i {
          display: inline-block;
          color: #999999;
          font-size: 24rpx;
          margin-left: 22rpx;
        }
      }

      .swiper-home {
        width: 100%;
        min-height: 380rpx;
        box-sizing: border-box;
        display: flex;
        white-space: nowrap;
        .swiper-item {
          width: 200rpx;
          display: inline-block;
          margin-right: 16rpx;
          margin-top: 30rpx;
          height: 340rpx;
        }
        img {
          width: 200rpx;
          height: 200rpx;
          border-radius: 10rpx;
          overflow: hidden;
        }
        .foods-title {
          font-size: 26rpx;
          color: #333333;
          height: 50rpx;
          line-height: 50rpx;
          //   display: -webkit-box;
          //   -webkit-line-clamp: 1;
          //   -webkit-box-orient: vertical;
          //   word-break: break-all;
          //   overflow: hidden;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom: 10rpx;
        }
        .foods-p {
          display: flex;
          line-height: 46rpx;
          padding-right: 24rpx;
          align-items: center;
          .selling-price {
            color: #e30606;
            font-size: 26rpx;
          }
          .market-price {
            color: #999999;
            font-size: 20rpx;
            text-decoration: line-through;
            margin-top: 6rpx;
          }
          //   .add-cart {
          //     text-align: right;
          //     i {
          //       display: inline-block;
          //       padding: 2rpx;
          //       width: 36rpx;
          //       height: 36rpx;
          //       text-align: center;
          //       line-height: 36rpx;
          //       border-radius: 36rpx;
          //       color: #fff;
          //       font-size: 24rpx;
          //       font-weight: bolder;
          //       //   margin-top: 6rpx;
          //       //   display: inline-block;
          //       //   text-align: center;
          //       //   width: 30rpx;
          //       //   height: 30rpx;
          //       //   line-height: 30rpx;
          //       //   border-radius: 30rpx;
          //       //   overflow: hidden;
          //       //   background: #17903f;
          //       //   color: #ffffff;
          //       //   font-size: 18rpx !important;
          //     }
          //   }
        }
      }
    }
    .step {
      .step-list {
        li {
          display: flex;
          margin-top: 30rpx;
          .step-imgs {
            width: 150rpx;
            height: 150rpx;
            margin-right: 24rpx;
          }
          .step-infor {
            flex: 1;
            h4 {
              font-size: 28rpx;
              margin-bottom: 20rpx;
            }
            p {
              color: #666666;
              font-size: 24rpx;
              line-height: 48rpx;
            }
          }
        }
      }
    }
  }
}
</style>

