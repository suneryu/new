<template>
  <div class="search">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="goods_list" v-if="productList.length > 0">
      <div
        class="product_list"
        v-for="(item,index) in productList"
        :key="index"
        @click="goodsDetail(item.skuCode,item.goodsType,item.noYes)"
      >
        <div class="product_h">
          <img class="imgs" :src="item.dataPic" alt />
        </div>
        <div class="product_t">
          <div class="goods-name">{{item.goodsName}}</div>
          <div class="t_subtitle">还剩{{item.shengj}}件</div>
          <div class="t-box">
            <div class="t-box-flex3">
              <div class="color-red">
                <!-- <i class="fs">秒杀价</i> -->
                {{unitPrice.obpay}}{{item.pricesetNprice}}{{unitPrice.mapay}}
              </div>
              <div
                class="market-price"
                v-if="item.pricesetMakeprice != 0 "
              >{{unitPrice.obpay}}{{item.pricesetMakeprice}}{{unitPrice.mapay}}</div>
            </div>
            <div class="t-box-flex1">
              <i
                v-if="item.noYes == '0'"
                class="add-car iconfont soldout"
                @click.stop="goodsDetail(item.skuCode,item.goodsType,item.noYes)"
              >已售罄</i>
              <i
                v-if="item.noYes == '2'"
                class="add-car iconfont soldout"
                @click.stop="goodsDetail(item.skuCode,item.goodsType,item.noYes)"
              >已结束</i>
              <i
                v-if="item.noYes == '1'"
                class="add-car iconfont"
                @click.stop="goodsDetail(item.skuCode,item.goodsType,item.noYes)"
                :style="{background:baseColor}"
              >立即抢购{{noYes}}</i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="noimg" v-if="productList.length == 0 && requestStatic">
      <img :src="nullImg" />
      <p>暂无商品...</p>
    </div>
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import commonHeader from "@/components/communal/commonHeader";
import lastPageLine from "@/components/communal/last-page-line";
import {
  getProappinfo,
  search,
  addShoppingGoods,
  queryContractPageByABulk
} from "@/api/interface.js";
export default {
  data() {
    return {
      title: "秒杀列表",
      leftIcon: true,
      rightIcon: false,
      items: [],
      baseColor: "#0f0000",
      inputValue: "",
      inputArray: [],
      productList: [],
      total: 0,
      page: 1,
      rows: 10,
      searchPath: "", //搜索路径
      requestStatic: false,
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noGoods.png",
    };
  },
  components: {
    commonHeader,
    lastPageLine
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
    // this.baseColor = "#" + this.$state.baseColor;
    this.baseColor = "#0f0000";
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    // if(prevpage&&prevpage.route){
    //   $storage.set('searchAfterRouter',prevpage.route)
    // }
    this.inputValue = "26";
    if (options && options.json) {
      switch (JSON.parse(options.json).path) {
        case "home":
          $storage.set("searchAfterRouter", "home");
          break;
        case "classify":
          $storage.set("searchAfterRouter", "classify");
          break;
      }
    }
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
  },
  mounted() {
    if ($storage.get("searchHistory")) {
      this.items = $storage.get("searchHistory");
    }
    this.baseColor = "#" + this.$state.baseColor;
    this.params = {
      //   sortField: "",
      //   order: "desc",
      page: 1,
      rows: this.rows,
      goodsType: "26"
    };
    this.commonMounted();
    $storage.get("getTopPerMenuList").map(v => {
      if (v.menuAction == "search" && v.menuCode == "MP000002") {
        this.searchPath = v.menuJspath;
      }
    });
  },
  methods: {
    //下拉加载更多
    loadMore() {
      let num = Math.ceil(this.total / 10);
      this.page++;
      let params = Object.assign(this.params, { page: this.page });
      if (params.page <= num) {
        http.get(search, params).then(res => {
          let list = res.rows;
          list.map(v => {
            v.noYes = "1";
            if (!RegExp(/http/).test(v.dataPic)) {
              v.dataPic = this.$domain + v.dataPic;
            }
            if (new Date(v.goodsOdate).getTime() - new Date().getTime() <= 0) {
              v.noYes = "0";
            }
          });
          this.productList = [...this.productList, ...list];
          this.requestStatic = true;
          this.productList.map(el => {
            el.pricesetNprice = el.pricesetNprice
              ? Number(el.pricesetNprice).toFixed(2)
              : 0;
            el.pricesetMakeprice = el.pricesetMakeprice
              ? Number(el.pricesetMakeprice).toFixed(2)
              : 0;
            if (el.goodsNum - el.goodsSalesvolume > 0) {
              el.shengj = el.goodsNum - el.goodsSalesvolume;
              el.noYes = "1";
            } else {
              el.shengj = "0";
              el.noYes = "0";
            }
            if (new Date(el.goodsOdate).getTime() - new Date().getTime() <= 0) {
              el.noYes = "2";
            }
          });
        });
      } else {
        this.lastPageLine = true;
      }
    },
    //跳转详情
    goodsDetail(skuCode, type, state) {
      $storage.set("state", state);
      // let jsons = {
      //   skuCode: skuCode,
      //   goodsType: type
      // };
      // $router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail", {
      //   json: JSON.stringify(jsons)
      // });
	  let att = this.$businessDomain + '/paas/shop/' + $storage.get('hrefs') + skuCode + '.html';
	  console.log(att);
	  $router.push('web', {
	  	defaultUrl: att
	  });
    },

    goSearch() {
      $router.push(this.searchPath);
    },

    commonMounted() {
      this.lastPageLine = false;
      http.get(search, this.params).then(res => {
        this.productList = res.rows;
        this.productList.map(el => {
          el.pricesetNprice = el.pricesetNprice.toFixed(2);
          el.pricesetMakeprice = el.pricesetMakeprice.toFixed(2);
          if (el.goodsNum - el.goodsSalesvolume > 0) {
            el.noYes = "1";
            el.shengj = el.goodsNum - el.goodsSalesvolume;
          } else {
            el.shengj = "0";
            el.noYes = "0";
          }
          if (new Date(el.goodsOdate).getTime() - new Date().getTime() <= 0) {
            el.noYes = "2";
          }
        });
        this.requestStatic = true;
        this.productList.map(v => {
          if (!RegExp(/http/).test(v.dataPic)) {
            v.dataPic = this.$domain + v.dataPic;
          }
          v.nowGoodsNum = v.goodsMinnum;
          if (v.goodsMinnum <= 0) {
            v.nowGoodsNum = 1;
          }
        });
        this.total = res.total;
      });
    },
    searchBtn() {
      this.commonHistory();
    },
    commonHistory() {
      if (this.inputValue) {
        if ($storage.get("searchHistory")) {
          let attr = $storage.get("searchHistory");
          attr.unshift(this.inputValue);
          $storage.set("searchHistory", attr);
        } else {
          this.inputArray.unshift(this.inputValue);
          $storage.set("searchHistory", this.inputArray);
        }
      }

      let query = {
        // sortField: "",
        // order: "desc",
        page: 1,
        rows: 10,
        goodsType: this.inputValue
      };
      $storage.set("goodsType", this.inputValue);
      this.inputValue = "";
    },
    clearHistory() {
      this.items = [];
      this.inputArray = [];
      $storage.remove("searchHistory");
    },
    onSubmit(e) {
      $router.push("o2oSearch_modules/searching");
      this.inputValue = "26";
      this.commonHistory();
    },
    goBack() {
      let that = this;
      let gobackHome = $storage.get("getTopPerMenuList");
      let goindex = JSON.parse($storage.get("getshopinfor")).gourl;
      gobackHome.map(v => {
        if (v.menuCode == "00000042") {
          that.$router.replace("web", {
            defaultUrl: "https://" + goindex + "/paas/shop" + v.menuAction
          });
        }
      });
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../../../common/css/common.less";
.fs {
  font-size: 22rpx;
  display: inline;
}
.noimg {
  margin-top: 36%;
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
.add-car {
  display: inline-block;
  width: 130rpx;
  height: 36rpx;
  text-align: center;
  line-height: 36rpx;
  border-radius: 36rpx;
  color: #fff;
  font-size: 22rpx;
  background: #178d43;
}

.soldout {
  background: #999999;
}
.search {
  width: 100%;
  height: 100%;
  background: @white-color;
  &-cart {
    background-color: rgba(197, 191, 191, 0.8);
    width: 100rpx;
    height: 100rpx;
    border-radius: 50rpx;
    display: flex;
    flex-direction: row;
    position: fixed;
    bottom: 80rpx;
    left: 80rpx;
  }
  &-top {
    padding: 20rpx 20rpx 10rpx 30rpx;
    display: flex;
    justify-content: space-between;
    height: 68rpx;
    align-items: center;
    border-bottom: 1rpx solid #ececec;
    &-back {
      a {
        width: 36rpx;
        height: 60rpx;
        display: inline-block;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &-input {
      position: relative;
      width: calc(100% - 64rpx);
      background-color: #eeeeee;
      border-radius: 68rpx;
      margin-left: 30rpx;
      i {
        width: 36rpx;
        height: 68rpx;
        line-height: 68rpx;
        display: inline-block;
        position: absolute;
        left: 0rpx;
        top: 0;
        color: @color-999;
      }
      .search {
        position: relative;
        > i {
          color: #999;
          position: absolute;
          height: 60rpx;
          line-height: 60rpx;
          top: 0;
          left: 30rpx;
          font-size: 28rpx;
        }
        > a {
          > input {
            background: #eeeeee;
            border-radius: 30rpx;
            height: 58rpx;
            color: #999999;
            padding-left: 10%;
          }
        }
      }
    }
    &-btn {
      width: 88rpx;
      height: 68rpx;
      line-height: 68rpx;
      text-align: center;
      font-size: 28rpx;
    }
  }
  .goods_list {
    margin-top: 98rpx;
    .product_list {
      margin-left: 30rpx;
      margin-right: 30rpx;
      height: 220rpx;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f2f2f2;
      //   margin-bottom: 20rpx;
      border-radius: 6rpx;

      .product_h {
        width: 30%;
        height: 158rpx;
        float: left;
        display: inline-block;
        position: relative;
        img {
          display: inline-block;
          width: 188rpx;
          height: 188rpx;
          margin-top: 8rpx;
          margin-right: 26rpx;
        }
      }
      .product_t {
        width: 65%;
        height: 100rpx;
        line-height: 50rpx;
        float: left;
        right: 0;
        .goods-name {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          word-break: break-all;
          overflow: hidden;
          font-size: 26rpx;
          height: 44rpx;
          //   margin-bottom: 42rpx;
        }
        .t-box {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        .t_subtitle {
          font-size: 24rpx;
          margin-top: 10rpx;
          color: #c1c1c1;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-bottom: 26rpx;
        }
        .f_titlebox {
          height: 48rpx;
        }
        .f_title {
          font-size: 24rpx;
          margin-top: 6rpx;
          display: inline-block;
          border-radius: 22rpx;
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
          }
          .market-price {
            margin-left: 10rpx;
            color: #c1c1c1;
            font-size: 26rpx;
            text-decoration: line-through;
          }
        }
      }
    }
  }
}
</style>

