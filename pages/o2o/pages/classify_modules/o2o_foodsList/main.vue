<template>
  <div class="goodsList">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="goodsList-left" @click="go">
      <i class="iconfont">&#xe62d;</i>
    </div>

    <div class="goodsList-list">
      <div class="goods_list">
        <div
          class="product_list"
          v-for="(item,index) in foodsList"
          :key="index"
          @click="goInfor(item.doclistId)"
        >
          <div class="product_h">
            <img class="goods-img" :src="item.doclistInfopicpathe" alt />
          </div>
          <div class="product_t">
            <div class="goods-name">{{item.doclistTitle}}</div>
            <div class="t_subtitle">{{item.doclistTitle4}}</div>
            <!-- <div class="t-box">
              <div class="t-box-flex3">
                <div class="reading-num">{{item.doclistNum}}<span>人阅读</span></div>
              </div>
            </div>-->
          </div>
        </div>
      </div>
      <div class="noimg" v-if="foodsList.length == 0 && requestStatic">
        <img :src="nullImg" />
        <p>暂无列表...</p>
      </div>
    </div>
    <lastPageLine :lastPageLine="lastPageLine" />
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router } from "@/utils/prototype/vue.js";
import { article } from "@/api/interface.js";
import lastPageLine from "@/components/communal/last-page-line";
import commonHeader from "@/components/communal/commonHeader";
export default {
  config: {
    enablePullDownRefresh: true
  },
  data() {
    return {
      title: "上蔬家常菜",
      leftIcon: false,
      rightIcon: false,
      baseColor: "",
      params: {},
      total: 0,
      page: 1,
      rows: 10,
      current: 0,
      lastPageLine: false,
      foodsList: [],
      pars: "", //接受参数
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noGoods.png",
      requestStatic: false
    };
  },
  components: { lastPageLine, commonHeader },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();
  },
  onLoad(options) {
    Object.assign(this, this.$options.data());
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    console.log(JSON.parse(options.json), "接受参数");
    this.pars = JSON.parse(options.json);
    if (this.pars.menuList == "menu") {
      this.title = "列表";
    } else if (this.pars.menuList == "video") {
      this.title = "列表";
    } else if (this.pars.menuList == "food") {
      this.title = "列表";
    }
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    this.params = {
      sortField: "",
      order: "desc",
      page: 1,
      rows: this.rows,
      searchParam:
        this.$root.$mp.query.searchParam || $storage.get("searchParam")
    };
    this.commonMounted();
    this.queryLists();
  },
  onUnload() {
    this.page = 1;
    $storage.set("searchParam", "");
  },
  methods: {
    go() {
      if (this.pars.path == "home") {
        $router.replace("web", {
          defaultUrl: this.$businessDomain + "/paas/shop/" + this.$state.homeUrl
        });
      } else if (this.pars.path == "find") {
        $router.replace("web", {
          defaultUrl: this.$businessDomain + "/paas/shop/" + this.$state.findUrl
        });
      }
    },
    queryLists() {
      http
        .get(article.articleList, {
          //   tginfoMenuCode: this.pars.menuList,
          tginfoMenuCode: "menu",
          page: this.page,
          rows: this.rows
        })
        .then(res => {
          this.foodsList = res.list;
          this.requestStatic = true;
          this.total = res.total;
          this.foodsList.map(v => {
            if (!RegExp(/http/).test(v.doclistInfopicpathe)) {
              v.doclistInfopicpathe = this.$domain + v.doclistInfopicpathe;
            }
          });
        });
    },
    commonMounted() {
      this.lastPageLine = false;
    },
    goInfor(codeid) {
      $router.push("o2o/pages/classify_modules/o2o_foodsInfor", {
        dicCodeId: codeid
      });
    },
    loadMore() {
      let num = Math.ceil(this.total / 10);
      this.page++;
      let params = { page: this.page, rows: this.rows };
      if (this.page <= num) {
        http.get(article.articleList, params).then(res => {
          let list = res.rows;
          list.map(v => {
            if (!RegExp(/http/).test(v.dataPic)) {
              v.dataPic = this.$domain + v.dataPic;
            }
          });
          this.foodsList = [...this.foodsList, ...list];
          this.requestStatic = true;
        });
      } else {
        this.lastPageLine = true;
      }
    },
    goBack() {
      switch ($storage.get("goodsListAfterRouter")) {
        case "home":
          $router.replace("web", {
            defaultUrl:
              this.$businessDomain + "/paas/shop/" + this.$state.homeUrl
          });
          break;
        case "classify":
          $router.replace("web", {
            defaultUrl:
              this.$businessDomain + "/paas/shop/" + this.$state.classifyUrl
          });
          break;
      }
    }
  }
};
</script>
<style lang="less">
page {
  background: #ffffff;
}
</style>

<style lang="less" scoped>
@import "../../../../../common/css/common.less";
.noimg {
  margin-top: 280rpx;
  img {
    display: block;
    width: 359rpx;
    height: 276rpx;
    margin: 0 auto;
  }
  p {
    margin-top: 40rpx;
    height: 72rpx;
    line-height: 72rpx;
    text-align: center;
    color: #999999;
    font-size: 24rpx;
  }
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
  .goodsList-list {
    margin-top: 96rpx;
    .goods_list {
      .product_list {
        background: #ffffff;
        width: 100%;
        height: 188rpx;
        padding: 20rpx 30rpx;
        margin-bottom: 20rpx;
        border-radius: 6rpx;
        .product_h {
          height: 174rpx;
          float: left;
          display: inline-block;
          .goods-img {
            width: 234rpx;
            height: 174rpx;
            border-radius: 6rpx;
            margin-right: 15rpx;
            margin-top: 15rpx;
          }
        }
        .product_t {
          width: 60%;
          height: 158rpx;
          line-height: 50rpx;
          float: left;
          right: 0;
          .goods-name {
            font-size: 26rpx;
            height: 100rpx;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .t-box {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }
          .t_subtitle {
            font-size: 24rpx;
            color: #828384;
            margin-top: 50rpx;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-wrap: break-word;
            white-space: normal !important;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            // line-height: 42rpx;
            height: 42rpx;
          }
          .f_title {
            display: inline-block;
            border: 1px solid #333333;
            border-radius: 22rpx;
            padding: 0 22rpx;
            margin-bottom: 30rpx;
          }
          .t-box-flex1 {
            width: 120rpx;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
          }
          .t-box-flex3 {
            display: flex;
            flex-direction: row;
            .color-red {
              color: red;
              font-size: 36rpx;
            }
            .reading-num {
              margin-top: 46rpx;
              margin-left: 10rpx;
              color: #c1c1c1;
              font-size: 28rpx;
            }
          }
        }
      }
    }
  }
}
</style>

