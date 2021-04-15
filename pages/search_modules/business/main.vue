<template>
  <div class="goodsList" :style="{height:items.length===0?'100%':'auto'}">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="goodsList-left" @click="goBack">
      <i class="iconfont">&#xe62d;</i>
    </div>
    <div class="goodsList-save" @click="()=>{$router.replace(searchPath)}">
      <i class="iconfont">&#xe613;</i>
    </div>
    <div class="goodsList-title">
      <div class="goodsList-title-left">
        <ul>
          <li v-for="(titles,titIndex) in titleList" :key="titIndex" @click="titleClick(titIndex)">
            <a :style="{color:current===titIndex?baseColor:''}">
              {{titles}}
              <div v-show="titIndex===2">
                <div class="iconPosition">
                  <i
                    class="iconfont"
                    :style="{color:iconColor&&iconColor!==null?baseColor:''}"
                  >&#xe78f;</i>
                  <i
                    class="iconfont"
                    :style="{color:!iconColor&&iconColor!==null?baseColor:''}"
                  >&#xe791;</i>
                </div>
              </div>
              <i
                class="iconfont"
                v-show="titIndex===3"
                :style="{color:current===titIndex?baseColor:''}"
              >&#xe60b;</i>
              <i
                class="iconfont"
                :style="{color:current===titIndex?baseColor:''}"
                v-if="vertical&&titIndex===4"
                @click="verticalClick"
              >&#xe61c;</i>
              <i
                class="iconfont"
                :style="{color:current===titIndex?baseColor:''}"
                v-else-if="!vertical&&titIndex===4"
                @click="horizontalClick"
              >&#xe6d5;</i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="goodsList-list" v-if="items.length>0">
      <ul>
        <li v-for="(item,index) in items" :key="index" :class="{hor:!vertical,ver:vertical}">
          <a @click="goodsDetail(item.skuCode)">
            <img :src="item.dataPic||userImgurl" />
            <div class="list-box">
              <p>{{item.goodsName}}</p>
              <div v-if="vertical">
                <h3
                  :style="{color:'#d66377'}"
                >{{unitPrice.obpay}}{{item.pricesetNprice}}{{unitPrice.mapay}}</h3>
                <h3
                  :style="{textDecoration:'line-through',color:'#ccc',fontSize:'24rpx'}"
                  v-show="item.pricesetMakeprice"
                >{{unitPrice.obpay}}{{item.pricesetMakeprice}}{{unitPrice.mapay}}</h3>
                <h5 :style="{color:baseColor}">{{item.skuName}}</h5>
                <h4>{{item.skuNo}}</h4>
              </div>

              <div v-else>
                <div :class="{horflex:!vertical}">
                  <h5 :style="{color:baseColor,marginRight:'10rpx'}">{{item.skuName}}</h5>
                  <h4>{{item.skuNo}}</h4>
                </div>
                <h3
                  :style="{color:'#d66377'}"
                >{{unitPrice.obpay}}{{item.pricesetNprice}}{{unitPrice.mapay}}</h3>
                <h3
                  :style="{textDecoration:'line-through',color:'#ccc',fontSize:'24rpx'}"
                  v-show="item.pricesetMakeprice"
                >{{unitPrice.obpay}}{{item.pricesetMakeprice}}{{unitPrice.mapay}}</h3>
              </div>

              <div class="list-box-add">
                <div class="list-box-add-left">
                  <i
                    class="iconfont"
                    :style="{color:baseColor}"
                    @click.stop="subtract(item,index)"
                  >&#xe755;</i>
                  <span>{{item.nowGoodsNum}}</span>
                  <i
                    class="iconfont"
                    :style="{color:baseColor}"
                    @click.stop="add(item,index)"
                  >&#xe777;</i>
                  <div
                    class="list-box-right"
                    v-show="item.goodsMinnum>0&&!vertical"
                    :style="{paddingBottom:0,marginLeft:'10rpx'}"
                  >
                    起订量
                    <span :style="{color:baseColor}">{{item.goodsMinnum}}</span>
                    {{item.partsnameNumunit}}
                  </div>
                </div>
                <i class="iconfont" :style="{color:baseColor}" @click="toCar(item,index)">&#xe777;</i>
              </div>
              <div class="list-box-right" v-show="item.goodsMinnum>0&&vertical">
                起订量
                <span :style="{color:baseColor}">{{item.goodsMinnum}}</span>
                {{item.partsnameNumunit}}
              </div>
            </div>
          </a>
        </li>
        <!-- <li v-for="(item,index) in items" :key="index" class="ver">
          <a @click="goodsDetail(item.skuCode)">
            <img :src="item.dataPic||userImgurl"/>
            <div class="list-box">
              <p>{{item.goodsName}}</p>
              <h4 :style="{color:baseColor}">{{item.skuNo}}</h4>
              <h5>{{item.skuName}}</h5>
              <h3 :style="{color:'#d66377'}">{{unitPrice.obpay}}{{item.pricesetNprice}}{{unitPrice.mapay}}</h3>
              <h3 :style="{textDecoration:'line-through',color:'#ccc',fontSize:'24rpx'}" v-show="item.pricesetMakeprice">{{unitPrice.obpay}}{{item.pricesetMakeprice}}{{unitPrice.mapay}}</h3>
              <div class="list-box-add">
                <div class="list-box-add-left">
                  <i class="iconfont">&#xe755;</i>
                  <span >{{item.goodsMinnum>0?item.goodsMinnum:1}}</span>
                  <i class="iconfont">&#xe756;</i>
                </div>
                <div class="list-box-add-right" v-show="item.goodsMinnum>0"> 起订量{{item.goodsMinnum}}{{item.partsnameNumunit}}</div>
              </div>
            </div>
          </a>
        </li>-->
      </ul>
    </div>
    <div class="goodsList-nulls" v-else>
      <img :src="nullImg" />
    </div>
    <div class="goodsList-screenLeft" v-show="screenShow" @click="screenLeftClick"></div>
    <div class="goodsList-screen" v-show="screenShow">
      <div class="goodsList-screen-screens">
        <div class="contents">
          <div class="box">
            <div class="pinpai">品牌</div>
            <div
              class="leftBox"
              v-for="(list,listIndex) in screenList"
              :key="listIndex"
              @click="listClick(list,listIndex)"
            >
              <p :style="{color:colorCurrent===listIndex?baseColor:''}">{{list.brandName}}</p>
            </div>
            <div class="price-box">
              <p>价格区间</p>
              <div class="t-bob">
                <input type="text" placeholder="最低价" v-model="minPrice" />
                <span>-</span>
                <input type="text" placeholder="最高价" v-model="maxPrice" />
              </div>
            </div>
          </div>
          <div class="bottomBox">
            <p @click="reverseClick">重置</p>
            <p @click="saveClick">确定</p>
          </div>
        </div>
      </div>
    </div>
    <lastPageLine :lastPageLine="lastPageLine" />
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router } from "@/utils/prototype/vue.js";
import {
  getProappinfo,
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
      title: "商品列表",
      leftIcon: false,
      rightIcon: false,
      titleList: ["综合", "销量", "价格", "筛选", ""],
      baseColor: "",
      userImgurl:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/img_default.jpg",
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noSearchResult.png",
      params: {},
      items: [],
      vertical: true,
      total: 0,
      page: 1,
      rows: 10,
      current: 0,
      colorCurrent: null,
      moneys: false,
      lastPageLine: false,
      screenShow: false,
      screenList: [],
      brandCode: "",
      maxPrice: null,
      minPrice: null,
      iconColor: null,
      classtreeCode: "",
      searchPath: "" //搜索路径
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
    if (options.json) {
      console.log(options.json, "search");
      if (JSON.parse(options.json).classtreeCode) {
        this.classtreeCode = JSON.parse(options.json).classtreeCode;
        $storage.set("goodsListAfterRouter", "classify");
      }
      if (JSON.parse(options.json).searchParam) {
        $storage.set("searchParam", JSON.parse(options.json).searchParam);
        $storage.set("goodsListAfterRouter", "home");
      } else {
        $storage.set("goodsListAfterRouter", "home");
      }
    } else if (prevpage && prevpage.route) {
      $storage.get("getTopPerMenuList").map(v => {
        if (v.menuAction == "search") {
          if (prevpage.route == "pages/" + v.menuJspath + "/main") {
            $storage.set("goodsListAfterRouter", "search");
          } else {
            $storage.set("goodsListAfterRouter", "classify");
          }
        }
      });
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
    $storage.get("getTopPerMenuList").map(v => {
      if (v.menuAction == "search") {
        this.searchPath = v.menuJspath;
      }
    });
    this.params = {
      sortField: "",
      order: "desc",
      page: 1,
      rows: this.rows,
      searchParam:
        this.$root.$mp.query.searchParam || $storage.get("searchParam")
    };
    if (this.classtreeCode) {
      delete this.params.searchParam;
      this.params.classtreeCode = this.classtreeCode;
    }
    this.commonMounted();
    http.get(queryBrandPageForC).then(res => {
      this.screenList = res.rows;
    });
  },
  onUnload() {
    this.page = 1;
    $storage.set("searchParam", "");
  },
  methods: {
    commonMounted() {
      this.lastPageLine = false;
      http.get(search, this.params).then(res => {
        this.items = res.rows;
        this.items.map(v => {
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
    listClick(list, index) {
      this.colorCurrent = index;
      this.brandCode = list.brandCode;
    },
    reverseClick() {
      this.maxPrice = null;
      this.minPrice = null;
      this.colorCurrent = null;
    },
    saveClick() {
      this.screenShow = false;

      if (this.maxPrice !== null) {
        this.params.maxPrice = this.maxPrice;
      } else {
        delete this.params.maxPrice;
      }
      if (this.minPrice !== null) {
        this.params.minPrice = this.minPrice;
      } else {
        delete this.params.minPrice;
      }
      if (this.colorCurrent !== null) {
        this.params.brandCode = this.brandCode;
      } else {
        delete this.params.brandCode;
      }
      if (
        this.maxPrice == null &&
        this.minPrice == null &&
        this.colorCurrent == null
      ) {
        this.current = -1;
      }

      this.commonMounted();
    },
    screenLeftClick() {
      this.screenShow = false;
      if (
        this.maxPrice == null &&
        this.minPrice == null &&
        this.colorCurrent == null
      ) {
        this.current = -1;
      }
    },
    titleClick(index) {
      this.current = index;
      this.params.page = 1;
      switch (index) {
        case 0:
          this.params.sortField = "";
          this.commonMounted();
          break;
        case 1:
          this.params.sortField = "goodsSalesvolume";
          this.commonMounted();
          break;
        case 2:
          if (this.iconColor === true) {
            this.iconColor = false;
            this.params.order = "desc";
          } else {
            this.iconColor = true;
            this.params.order = "asc";
          }
          this.params.sortField = "pricesetNprice";
          this.commonMounted();
          break;
        default:
          break;
      }
      if (index !== 2) {
        this.iconColor = null;
      }
      if (index === 3) {
        this.screenShow = true;
      }
    },

    loadMore() {
      let num = Math.ceil(this.total / 10);
      this.page++;
      let params = Object.assign(this.params, { page: this.page });
      if (params.page <= num) {
        http.get(search, params).then(res => {
          let list = res.rows;
          list.map(v => {
            if (!RegExp(/http/).test(v.dataPic)) {
              v.dataPic = this.$domain + v.dataPic;
            }
          });

          this.items = [...this.items, ...list];
        });
      } else {
        this.lastPageLine = true;
      }
    },
    goodsDetail(skuCode) {
      let att =
        this.$businessDomain +
        "/paas/shop/" +
        $storage.get("hrefs") +
        skuCode +
        ".html";
      console.log(att);
      $router.replace("web", {
        defaultUrl:
          this.$businessDomain +
          "/paas/shop/" +
          $storage.get("hrefs") +
          skuCode +
          ".html",
        path: "goodsList"
      });
    },
    goBack() {
      switch ($storage.get("goodsListAfterRouter")) {
        case "search":
          $router.replace(this.searchPath);
          break;
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
    },
    verticalClick() {
      this.vertical = false;
    },
    horizontalClick() {
      this.vertical = true;
    },
    subtract(item, index) {
      console.log(item.nowGoodsNum);
      console.log(item.goodsMinnum);
      if (item.goodsMinnum > 0) {
        if (item.nowGoodsNum > item.goodsMinnum) {
          item.nowGoodsNum--;
          this.items.splice(index, 1, item);
        } else {
          this.$message.alert("不能低于起订量！");
        }
      } else {
        if (item.nowGoodsNum > 1) {
          item.nowGoodsNum--;
          this.items.splice(index, 1, item);
        }
      }
    },
    add(item, index) {
      item.nowGoodsNum++;
      this.items.splice(index, 1, item);
    },
    toCar(item, index) {
      http
        .post(addShoppingGoods, {
          skuId: item.skuId,
          goodsNum: item.nowGoodsNum
        })
        .then(res => {
          if (res && res.success) {
            this.$message.alert("加入购物车成功！");
          }
        });
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../common/css/common.less";
.goodsList {
  width: 100%;
  background: @white-color;
  &-save {
    position: fixed;
    z-index: 9999;
    height: 90rpx;
    width: 70rpx;
    line-height: 90rpx;
    text-align: right;
    right: 30rpx;
    top: 0;
    font-size: @big-title;
  }
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
  &-title {
    display: flex;
    position: fixed;
    top: 90rpx;
    left: 0;
    padding: @padding;
    z-index: 2;
    width: 690rpx;
    background: #fafafa;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #eee;
    &-left {
      flex: 1;
      -webkit-box-flex: 1;
      height: 100%;
      line-height: 58rpx;
      ul {
        // display: -moz-box;
        // display: -webkit-box;
        // display: box;
        display: flex;
        align-items: center;
        justify-content: space-between;

        li {
          // -webkit-box-flex: 1;
          // box-flex: 1;
          // width: 0;
          height: 100%;
          position: relative;
          a {
            width: 100%;
            height: 100%;
            display: flex;
            position: relative;
            align-items: center;
            font-size: @big-title;
            justify-content: center;
            .iconPosition {
              display: flex;
              flex-direction: column;
              position: absolute;
              top: -8rpx;
              right: -25rpx;
              i {
                font-size: 14rpx;
                margin-bottom: -40rpx;
              }
            }
            i {
              font-size: @big-title;
              margin-left: 12rpx;
              color: #434343;
            }
          }
        }
      }
    }
    // &-right{
    //   height: 58rpx;
    //   display:flex;
    //   align-items:center;
    //   span{
    //     &:first-child{
    //       margin-right:@margin-right;
    //     }
    //   }
    // }
  }
  &-list {
    width: 100%;
    margin-top: 188rpx;
    ul {
      width: 100%;
      overflow: hidden;
      zoom: 1;
      li {
        border-bottom: 2rpx solid #f5f5f5;
        a {
          width: 100%;
          height: 100%;
          font-size: @middle-title;
          .list-box {
            .horflex {
              display: flex;
              align-items: center;
              justify-content: flex-start;
            }
            h5 {
              padding: 5rpx 20rpx;
              background: #fef6eb;
              font-size: 22rpx;
              display: inline-block;
              border-radius: 20rpx;
              margin: 10rpx 0;
            }
            h4 {
              font-size: 22rpx;
              color: @color-999;
              padding: 10rpx 0;
            }
            h3 {
              font-size: 32rpx;
            }
            p {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              margin: 16rpx 0;
              height: 68rpx;
            }
            &-add {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 10rpx 0;
              i {
                font-size: 44rpx;
                color: #b79f77;
              }
              &-left {
                font-size: @middle-title;
                color: @color-333;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                span {
                  padding: 0 10rpx;
                }
              }
            }
            &-right {
              font-size: 22rpx;
              color: @color-999;
              padding-bottom: 20rpx;
            }
          }
        }
      }
      li.ver {
        width: calc(50% - 1rpx);
        float: left;
        border-right: 2rpx solid #f5f5f5;

        &:nth-child(2n) {
          border-right: 0;
        }
        a {
          display: inline-block;
          img {
            width: 374.5rpx;
            height: 374.5rpx;
          }
          .list-box {
            padding: 0 30rpx;
          }
        }
      }
      li.hor {
        height: 360rpx;
        padding: 0 30rpx;
        a {
          display: flex;
          justify-content: space-between;
          align-items: center;
          img {
            width: 290rpx;
            height: 290rpx;
          }
          .list-box {
            p {
              width: 364rpx;
            }
            h4,
            h3 {
              margin-right: 18rpx;
            }
          }
        }
      }
    }
  }
  &-screenLeft {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 9999;
  }
  &-screen {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    left: 20%;
    z-index: 10000;
    &-screens {
      position: fixed;
      right: 0;
      left: 20%;
      height: 100%;
      background-color: #fff;
      .contents {
        padding-top: 20rpx;
        overflow: scroll;
        height: 100%;
        .box {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          display: -webkit-flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
          padding-bottom: 164rpx;
          .pinpai {
            margin-left: 30rpx;
            width: 100%;
            padding-top: 46rpx;
          }
          .leftBox {
            margin: 20rpx 0 0 2.5%;
            width: 30%;
            height: 60rpx;
            line-height: 60rpx;
            text-align: center;
            background-color: #f5f5f5;
            border-radius: 4rpx;
            p {
              font-size: @middle-title;
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
          .price-box {
            padding: 50rpx 30rpx 34rpx;
            p {
              font-size: @big-title;
              color: @color-333;
              margin-bottom: 28rpx;
            }
            .t-bob {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              input {
                width: 200rpx;
                height: 60rpx;
                background-color: #f5f5f5;
                font-family: PingFangSC-Regular;
                font-size: @middle-title;
                text-align: center;
                border-radius: 50rpx;
              }
            }
          }
        }
        .bottomBox {
          background-color: #fff;
          position: fixed;
          width: 80%;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          bottom: 0;
          right: 0;
          height: 10.667vw;
          line-height: 10.667vw;
          text-align: center;
          display: -moz-box;
          display: -webkit-box;
          display: box;

          p {
            -webkit-box-flex: 1;
            box-flex: 1;
            width: 0;
            color: #fff;
            font-size: 28rpx;
            background-color: #333;
            &:first-child {
              background: #b79f77;
            }
          }
        }
      }
    }
  }
  &-nulls {
    width: 100%;
    margin-top: 400rpx;
    text-align: center;
    img {
      width: 402rpx;
      height: 337rpx;
      margin: 0 auto;
    }
  }
}
</style>

