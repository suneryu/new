<template>
  <div class="classify">
    <div class="headers">
      <div class="searchbox t-box-center">
        <div class="search">
          <i class="iconfont icon-sousuo1"></i>
          <a @click="goSearch" id="searchResult">
            <input placeholder="蔬菜" />
          </a>
        </div>
      </div>
    </div>
    <div class="classify-content">
      <div class="left-nav">
        <ul class="nav-list">
          <li v-for="(item, index) in classlist" :key="index" @click="changeFirst(index)">
            <a
              :style="{
                color: index == indexs ? baseColor : '',
                background: index == indexs ? '#ffffff' : '',
                'border-color': index == indexs ? baseColor : '#faf9f9'
              }"
            >{{ item.goodsClassName }}</a>
          </li>
        </ul>
      </div>
      <div v-if="showList" class="alltwoclass zhezhao"></div>
      <div v-if="showList" class="alltwoclass">
        <h3>
          全部分类
          <i class="list-icon icon iconfont icon-jiantou11 nav-icon" @click="closeAllclass"></i>
        </h3>
        <ul>
          <li
            v-for="(items, num) in twoClass"
            :key="num"
            @click="changeAllclass(num, items.classtreeCode)"
          >
            <a :style="{ color: num == nums ? baseColor : '' }">
              {{
              items.goodsClassName
              }}
            </a>
          </li>
        </ul>
      </div>
      <div class="right-content" :style="{ height: scroll_height + 'rpx' }">
        <div class="right-nav">
          <ul class="right-nav-title">
            <li
              v-for="(items, num) in twoClass"
              :key="num"
              @click="changeSec(num, items.classtreeCode)"
            >
              <a :style="{ color: num == nums ? baseColor : '' }">
                {{
                items.goodsClassName
                }}
              </a>
            </li>
          </ul>
          <i class="icon iconfont icon-jiantou12 nav-icon" @click="showAllclass"></i>
        </div>

        <div class="right-nav-two">
          <ul class="right-nav-two-title">
            <li
              v-for="(titles, titIndex) in checkList"
              :key="titIndex"
              @click="titleClick(titIndex)"
            >
              <a :style="{ color: current === titIndex ? baseColor : '' }">
                {{ titles.name }}
                <div v-show="titIndex === 2">
                  <div class="iconPosition">
                    <i
                      class="iconfont mt16"
                      :style="{
                        color:
                          iconColor || (iconColor == null && !iconColor)
                            ? '#666666'
                            : baseColor
                      }"
                    >&#xe78f;</i>
                    <i
                      class="iconfont mt0"
                      :style="{
                        color:
                          iconColor && iconColor == true ? baseColor : '#666666'
                      }"
                    >&#xe791;</i>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
        <div class="goods_list">
          <div class="noimg" v-if="productList.length == 0 && requestStatic">
            <img :src="nullImg" />
            <p>暂无此分类商品</p>
          </div>
          <div
            class="product_list"
            v-for="(item, index) in productList"
            :key="index"
            @click="goodsDetail(item)"
          >
            <div class="product_h">
              <img class="goods-img" :src="item.dataPic" alt style="width: 180rpx;height: 150rpx;" />
            </div>
            <div class="product_t">
              <div class="goods-name">{{ item.goodsName }}</div>
              <div class="t_subtitle">{{ item.goodsProperty }}</div>
              <!-- <p class="f_title" :style="{color:baseColor,borderColor:baseColor}">新鲜到货</p> -->
              <div class="t-box">
                <div class="t-box-flex3">
                  <div class="color-red">
                    {{ unitPrice.obpay }}{{ item.pricesetNprice
                    }}{{ unitPrice.mapay }}
                  </div>
                  <div class="market-price" v-if="item.pricesetMakeprice != 0">
                    {{ unitPrice.obpay }}{{ item.pricesetMakeprice
                    }}{{ unitPrice.mapay }}
                  </div>
                </div>
                <div class="t-box-flex1">
                  <i
                    class="add-car iconfont"
                    @click.stop="addCart(item.skuId)"
                    :style="{ background: baseColor }"
                  >&#xe6f3;</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <vueTabBar
      @fetch-index="clickIndexNav"
      :selectNavIndex="selectNavIndex"
      :baseColor="baseColor"
      :footerMenu="footerMenu"
    />
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import vueTabBar from "@/components/communal/vueTabBar";
import {
  queryGoodsClassTree,
  search,
  queryBrandPageForC,
  getTopPerMenuList,
  addShoppingGoods
} from "@/api/interface.js";

export default {
  config: {
    enablePullDownRefresh: true
  },
  data() {
    return {
      selectNavIndex: 1,
      title: "商品列表",
      leftIcon: false,
      rightIcon: false,
      // titleList: ['综合', '销量', '价格'],
      checkList: [
        {
          name: "综合"
          //   isOk: true,
          //   iconCheck: true
        },
        {
          name: "销量"
          //   isOk: false,
          //   icon: ''
        },
        {
          name: "价格"
          //   icon: 'icon-sanjiaoxing-up',
          //   icon1: 'icon-sanjiaoxing-down',
          //   isOk: false,
          //   iconCheck: false
        }
      ],
      baseColor: "",
      userImgurl:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/img_default.jpg",
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noGoods.png",
      params: {},
      items: [],
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
      iconColor: false,
      classtreeCode: "",
      productList: [],
      searchPath: "", // 搜索路径
      footerMenu: [], // 底部菜单
      allList: [], // 所有的分类列表
      classlist: [], // 第一级分类
      twoClass: [], // 第二级分类
      indexs: 0,
      nums: 0,
      showList: false,
      scroll_height: "200",
      listHeight: "",
      requestStatic: false
    };
  },
  onShow() {
    this.iconColor = null;
    this.footerMenu = $storage.get("footerMenu");
  },
  computed: {
    // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
    unitPrice() {
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
  },
  onLoad(options) {
    // 获取一级分类
    this.getFirstlist();
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

    var that = this;
    wx.getSystemInfo({
      // 微信自身api
      success: function(res) {
        // that.scroll_height = res.screenHeight * 2 + 98;
        // that.listHeight = res.screenHeight * 2 - 336;
      }
    });
  },
  components: {
    vueTabBar
  },
  onReachBottom() {
    this.loadMore(); // 到这底部在这里需要做什么事情
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    $storage.get("getTopPerMenuList").map(v => {
      if (v.menuAction == "search" && v.menuCode == "MP000002") {
        this.searchPath = v.menuJspath;
      }
    });
    this.params = {
      sortField: "",
      order: "desc",
      page: 1,
      rows: this.rows,
      memberCcode: $storage.get("shopinforCode"),
      //   searchParam:
      // this.$root.$mp.query.searchParam || $storage.get("searchParam"),
      classtreeCode: $storage.get("classcode")
    };

    // this.commonMounted();
    // http.get(queryBrandPageForC).then(res => {
    // 	this.screenList = res.rows;
    // })
  },
  onUnload() {
    this.page = 1;
  },
  methods: {
    getFirstlist() {
      http
        .get(queryGoodsClassTree, {
          goodsClassParentcode: -1
        })
        .then(res => {
          this.classlist = res;
          this.classlist[0].childList.map(v => {
            this.twoClass.push(v);
          });
          $storage.set("classcode", this.twoClass[0].classtreeCode);
          this.getgoodsList(this.twoClass[0].classtreeCode);
        });
    },

    // 点击一级分类获取二级分类
    getsecsList(code) {
      // 根据二级分类获取商品列表
      this.getgoodsList(code);
    },

    // 选择一级分类
    changeFirst(index) {
      this.indexs = index;
      this.nums = 0;
      this.twoClass = [];
      this.classlist[index].childList.map(v => {
        this.twoClass.push(v);
      });
      this.getsecsList(this.twoClass[0].classtreeCode); // 点击一级分类获取二级分类
    },

    // 根据二级分类获取商品列表
    getgoodsList(code) {
      $storage.set("classtreeCode", code);
      let parem = {
        order: "desc",
        page: 1,
        rows: this.rows,
        classtreeCode: code,
        memberCcode: $storage.get("shopinforCode")
      };
      http.get(search, parem).then(res => {
        this.productList = res.list;
        this.requestStatic = true;
        this.productList.map(v => {
          v.pricesetNprice = (v.pricesetNprice * 1).toFixed(2);
          if (!RegExp(/http/).test(v.dataPic)) {
            v.dataPic = this.$domain + v.dataPic;
          }
        });
      });
    },

    // 选择二级分类
    changeSec(index, code) {
      this.getgoodsList(code);
      this.current = 0;
      this.nums = index;
    },
    changeAllclass(index, code) {
      this.getgoodsList(code);
      this.nums = index;
      this.showList = false;
    },

    // 添加购物车
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

    showAllclass() {
      if (this.showList == false) {
        this.showList = true;
      } else {
        this.showList = false;
      }
    },

    closeAllclass() {
      this.showList = false;
    },

    goSearch() {
      $router.push(this.searchPath);
    },

    commonMounted() {
      console.log("第一次请求数据");
      this.lastPageLine = false;
      http.get(search, this.params).then(res => {
        this.productList = res.rows;
        this.productList.map(v => {
          v.pricesetNprice = (v.pricesetNprice * 1).toFixed(2);
          if (!RegExp(/http/).test(v.dataPic)) {
            v.dataPic = this.$domain + v.dataPic;
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
    titleClick(index, code) {
      this.page = 1;
      var that = this;
      this.current = index;
      this.params.page = 1;
      switch (index) {
        case 0:
          this.params.sortField = "";
          this.params.classtreeCode = this.twoClass[this.nums].classtreeCode;
          this.params.memberCcode = $storage.get("shopinforCode");
          this.commonMounted();
          break;
        case 1:
          this.params.classtreeCode = this.twoClass[this.nums].classtreeCode;
          this.params.memberCcode = $storage.get("shopinforCode");
          this.params.sortField = "goodsSalesvolume";
          this.commonMounted();
          break;
        case 2:
          if (that.iconColor === false) {
            that.iconColor = true;
            this.params.classtreeCode = this.twoClass[this.nums].classtreeCode;
            this.params.memberCcode = $storage.get("shopinforCode");
            this.params.order = "desc";
          } else {
            that.iconColor = false;
            this.params.classtreeCode = this.twoClass[this.nums].classtreeCode;
            this.params.memberCcode = $storage.get("shopinforCode");
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
      // if(index===2){
      //   this.screenShow = true;
      // }
    },

    loadMore() {
      if ($storage.get("classtreeCode")) {
        delete this.params.searchParam;
        this.params.classtreeCode = $storage.get("classtreeCode");
      }

      let num = Math.ceil(this.total / 10);

      this.page++;
      let params = Object.assign(this.params, {
        page: this.page
      });
      if (params.page <= num) {
        http.get(search, params).then(res => {
          let list = res.rows;
          list.map(v => {
            v.pricesetNprice = (v.pricesetNprice * 1).toFixed(2);
            if (!RegExp(/http/).test(v.dataPic)) {
              v.dataPic = this.$domain + v.dataPic;
            }
          });

          this.productList = [...this.productList, ...list];
        });
      } else {
        this.lastPageLine = true;
      }
    },
    // 跳转详情
    goodsDetail(item) {
      let json = {
        skuCode: item.skuCode
      };
      $router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail", json);
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
    }
  }
};
</script>
<style>
page {
  background: #fff;
}
</style>
<style lang="less" scoped>
@import "../../../../../common/css/common.less";
.mt16 {
  margin-top: 16rpx;
}
.mt0 {
  margin-top: 0;
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
.current {
  color: #168f3f;
  border-left: 2rpx solid #168f3f;
  background: @white-color;
}

.active {
  color: #168f3f !important;
}

.classify {
  .headers {
    position: fixed;
    top: 0;
    left: 0;
    width: 690rpx;
    z-index: 99999;
    background: @white-color;
    padding: 20rpx 30rpx;
    .searchbox {
      > span {
        text-align: center;
        display: inline-block;
        vertical-align: top;
        font-size: 22rpx;
        a {
          width: 100%;
          height: 100%;
          display: inline-block;
          font-size: 32rpx !important;
        }
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
            font-size: 24rpx;
          }
        }
      }
    }
  }
  .classify-content {
    margin-top: 86rpx;
    display: block;
    position: absolute;
    .left-nav {
      width: 164rpx;
      background: #fafafa;
      position: fixed;
      top: 86rpx;
      height: 100%;
      .nav-list {
        li {
          width: 100%;
          height: 72rpx;
          line-height: 72rpx;
          text-align: center;
          a {
            font-size: 24rpx;
            display: block;
            width: 100%;
            height: 100%;
            border-left: 4rpx solid #faf9f9;
            letter-spacing: 2rpx;
          }
        }
      }
    }
    .right-content {
      position: absolute;
      top: 0;
      left: 164rpx;
      width: 526rpx;
      padding: 0rpx 30rpx;
      background: @white-color;
      .right-nav {
        background: @white-color;
        height: 72rpx;
        line-height: 72rpx;
        width: 530rpx;
        overflow: hidden;
        position: fixed;
        // border-bottom: 1rpx solid #f2f2f2;
        z-index: 666;
        .right-nav-title {
          width: 1000rpx;
          overflow-x: auto;
          li {
            float: left;
            margin-right: 30rpx;
            a {
              font-size: 24rpx;
              color: #999999;
            }
          }
        }
        .nav-icon {
          position: absolute;
          top: 0;
          right: 0;
          display: inline-block;
          height: 72rpx;
          width: 50rpx;
          background: @white-color;
          color: #999999;
          font-size: 42rpx;
          text-align: center;
          font-weight: normal;
        }
      }
      .right-nav-two {
        position: fixed;
        top: 158rpx;
        height: 74rpx;
        // width: 530rpx;
        width: 490rpx;
        background: @white-color;
        border-top: 1rpx solid #f2f2f2;
        border-bottom: 1rpx solid #f2f2f2;
        z-index: 666;
        .right-nav-two-title {
          display: flex;
          align-items: center;
          //   justify-content: space-between;
          li:first-child {
            a {
              justify-content: flex-start;
              padding-left: none;
            }
          }

          li {
            flex: 1;
            height: 100%;
            height: 72rpx;
            width: 72rpx;
            background: @white-color;
            a {
              width: 100%;
              height: 100%;
              display: flex;
              position: relative;
              align-items: center;
              font-size: @big-title;
              justify-content: center;
              // padding-left: 20%;
              .iconPosition {
                display: flex;
                flex-direction: column;
                position: absolute;
                height: 74rpx;
                width: 40rpx;
                border-bottom: 1rpx solid #f2f2f2;
                border-top: 1rpx solid #f2f2f2;
                top: -1rpx;
                right: -38rpx;
                align-items: center;
                background: #ffffff;

                i {
                  font-size: 14rpx;
                }
              }
            }
          }
          li:last-child {
            a {
              justify-content: flex-end;
              padding-left: none;
            }
          }
        }
      }
      .goods_list {
        padding-top: 160rpx;
        padding-bottom: 92rpx;
        .noimg {
          margin-top: 20%;
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
        .product_list {
          width: 100%;
          height: 178rpx;
          padding: 16rpx 0;
          border-bottom: 1rpx solid #f2f2f2;
          //   margin-bottom: 20rpx;
          border-radius: 6rpx;
          .product_h {
            height: 158rpx;
            float: left;
            display: inline-block;
            .goods-img {
              width: 180rpx;
              height: 180rpx;
              margin-right: 15rpx;
              margin-top: 15rpx;
            }
          }
          .product_t {
            width: 56%;
            height: 158rpx;
            line-height: 50rpx;
            float: left;
            right: 0;
            .goods-name {
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              font-size: 26rpx;
            }
            .t-box {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }
            .t_subtitle {
              font-size: 22rpx;
              color: #c1c1c1;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              height: 20rpx;
            }
            .f_title {
              font-size: 20rpx;
              height: 26rpx;
              line-height: 26rpx;
              display: inline-block;
              border: 1px solid #333333;
              border-radius: 22rpx;
              padding: 4rpx 16rpx;
              margin-bottom: 30rpx;
            }
            .t-box-flex1 {
              width: 120rpx;
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
            }
            .t-box-flex3 {
              display: flex;
              flex-direction: row;
              .color-red {
                color: red;
                font-size: 26rpx;
              }
              .market-price {
                margin-left: 10rpx;
                color: #c1c1c1;
                font-size: 24rpx;
                text-decoration: line-through;
              }
            }
          }
        }
        .product_list:last-child {
          border-bottom: none;
        }
      }
    }
  }
  .alltwoclass {
    position: fixed;
    top: 80rpx;
    left: 164rpx;
    // height: 100rpx;
    // width: 530rpx;
    background: @white-color;
    z-index: 999;
    // -moz-box-shadow: 2px 2px 5px #333333;
    // -webkit-box-shadow: 2px 2px 5px #333333;
    // box-shadow: 2px 2px 5px #333333;
    display: block;
    width: 73%;
    padding: 10rpx 20rpx;
    h3 {
      font-size: 24rpx;
      height: 48rpx;
      line-height: 48rpx;
      position: relative;
      i {
        position: absolute;
        right: 0;
        top: 0;
        color: #999999;
      }
    }
    ul {
      overflow: hidden;
      li {
        float: left;
        height: 72rpx;
        line-height: 72rpx;
        margin-right: 20rpx;
        a {
          font-size: 24rpx;
        }
      }
    }
  }
  .zhezhao {
    display: block;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
