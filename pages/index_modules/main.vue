<template>
  <div class="index-wrap">
    <div class="po-fixed">
      <div class="share-infor t-box">
        <div class="share-left" v-if="showName">
          <img :src="nullImgs" />
          <h3>
            <span style="color:#666">{{groupName}}</span>
          </h3>
        </div>
        <div class="search-infor t-box-flex1">
          <input
            @confirm="onSubmit($event)"
            confirm-type="search"
            placeholder="请输入关键字搜索"
            placeholder-style="color:#999"
            type="text"
            v-model="inputValue"
          />
        </div>
        <div class="share-left"></div>
      </div>
      <div class="goods-nav">
        <ul>
          <li
            :key="index"
            @click="changeFirst(item.goodsClassCode,index)"
            v-for="(item,index) in firstClassList"
          >
            <a
              :class="current === index ? 'active' : ''"
              :style="{color:current === index ? baseColor : '',borderColor:current === index ? baseColor : ''}"
            >{{item.goodsClassName}}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="index-goodlist">
      <ul class="index-goodlist-box">
        <li :key="num" v-for="(items,num) in goodsList">
          <img :src="items.dataPic" @click="goodsDetail(items)" class="goods-img" />
          <div class="goodlist-infor">
            <h3 class="good-title">{{ items.goodsName }}</h3>
          </div>
          <div class="goods-bottom t-box">
            <div class="bottom-left t-box-flex1">
              <div class="goods-price">
                <p :style="{color:baseColor}" class="color-red">￥{{ items.pricesetNprice}}</p>
                <p
                  class="markpice"
                  v-if="items.pricesetMakeprice != 0"
                >￥{{ items.pricesetMakeprice}}</p>
              </div>
              <div class="goodsnum">
                已售
                <span :style="{color:baseColor}" class="red">{{items.goodsSalesvolume}}</span>份/剩余
                <span :style="{color:baseColor}" class="red">{{items.goodsNum}}</span>份
              </div>
            </div>
            <div class="bottom-right">
              <i
                :style="{ borderColor: baseColor,color: baseColor}"
                @click.stop="addCart(items.skuId)"
                class="addcart iconfont"
                v-if="items.goodsNum != 0"
              >&#xe6fb;</i>
              <i
                @click.stop="noaddCart()"
                class="addcart iconfont"
                v-if="items.goodsNum == 0"
              >&#xe6fb;</i>
            </div>
          </div>
        </li>
      </ul>
      <div class="noimg" v-if="goodsList.length == 0 && requestStatic">
        <img :src="nullImg" />
        <p>暂无此分类商品</p>
      </div>
    </div>
    <vueTabBar
      :baseColor="baseColor"
      :footerMenu="footerMenu"
      :selectNavIndex="selectNavIndex"
      @fetch-index="clickIndexNav"
    />
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import {
  queryGoodsClassTree,
  search,
  addShoppingGoods,
  getProappinfo,
  getTopPerMenuListFPc
} from "@/api/interface.js";
import vueTabBar from "@/components/communal/vueTabBar";

export default {
  components: { vueTabBar },
  data() {
    return {
      selectNavIndex: 0,
      footerMenu: [], // 底部菜单
      baseColor: "",
      total: 0,
      page: 1,
      rows: 10,
      goodsList: [],
      nullImgs: require("../../static/img/mine/default_header.png"),
      firstClassList: [],
      current: 0,
      inputValue: "",
      currentCode: "",
      requestStatic: false,
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noGoods.png",
      showName: false,
      groupName: null
    };
  },
  onShow() {
    this.footerMenu = $storage.get("footerMenu");
    this.groupName = $storage.get("groupName")
      ? $storage.get("groupName")
      : null;
    if (!this.groupName) {
      this.showName = false;
    } else {
      this.showName = true;
    }
  },
  onLoad() {
    let that = this;
    if ($storage.get("userInfo")) {
      that.msg = $storage.get("userInfo");
    }
    http.get(getTopPerMenuListFPc).then(res => {
      if (res) {
        $storage.set("getTopPerMenuList", res.menuList);
        $storage.set("footerMenu", res.menuList.filter(v => v.menuShow === 0));
        that.footerMenu = $storage.get("footerMenu");
      }
    });
    http.get(getProappinfo).then(res => {
      that.shopMessage = res.proappEnvName;
      that.$storage.set("proappEnvName", res.proappEnvName);
      that.$storage.set("baseColor", res.proappEnvTheme);
      that.$storage.set("unitPrice", JSON.parse(res.proappEnvOpenconf));
      that.$state.set("baseColor", res.proappEnvTheme);
      that.baseColor = "#" + res.proappEnvTheme;
      $storage.set("baseColor", res.proappEnvTheme);
      wx.setNavigationBarColor({
        frontColor: "#ffffff", // 必写项
        backgroundColor: that.baseColor // 必写项
      });
      that.$state.set("unitPrice", JSON.parse(res.proappEnvOpenconf));
    });
    // 获取一级分类
    that.getFirstlist();
    // this.searchGoodslist();
    that.params = {
      page: 1,
      rows: this.rows,
      goodsClassParentcode: ""
    };
  },
  onReachBottom() {
    this.loadMore(); // 到这底部在这里需要做什么事情
  },
  mounted() {
    // 登陆颜色 商城名字信息
    // wx.setNavigationBarColor({
    //   frontColor: '#ffffff', // 必写项
    //   backgroundColor: '#' + this.$state.baseColor || '#' + $storage.get('baseColor')
    // })
    this.baseColor =
      "#" + this.$state.baseColor || "#" + $storage.get("baseColor");
  },
  methods: {
    getFirstlist() {
      http
        .get(queryGoodsClassTree, {
          goodsClassParentcode: -1
        })
        .then(res => {
          let parobj = {
            goodsClassName: "全部",
            goodsClassCode: ""
          };
          this.firstClassList = res;
          this.firstClassList.unshift(parobj);
          this.searchGoodslist(this.firstClassList[0].goodsClassCode);
        });
    },
    // 选择一级分类
    changeFirst(code, index) {
      this.params.page = 1;
      this.currentCode = code;
      this.current = index;
      this.inputValue = "";
      this.searchGoodslist(code);
    },
    onSubmit(e) {
      this.inputValue = e.target.value;
      let query = {
        page: 1,
        rows: 10,
        searchParam: this.inputValue,
        goodsClassParentcode: this.currentCode
      };
      http.get(search, query).then(res => {
        this.goodsList = [];
        if (res.list.length > 0) {
          this.goodsList = res.list;
          this.goodsList.map(v => {
            v.pricesetNprice = (v.pricesetNprice * 1).toFixed(2);
            if (!RegExp(/http/).test(v.dataPic)) {
              v.dataPic = this.$domain + v.dataPic;
            }
          });
          this.total = res.total;
          this.requestStatic = true;
        }
      });
    },
    // 获取商品列表
    searchGoodslist(goodsClassCode) {
      this.goodsList = [];
      this.params.goodsClassParentcode = goodsClassCode;
      http.get(search, this.params).then(res => {
        if (res.list.length > 0) {
          this.goodsList = res.list;
          this.goodsList.map(v => {
            v.pricesetNprice = (v.pricesetNprice * 1).toFixed(2);
            if (!RegExp(/http/).test(v.dataPic)) {
              v.dataPic = this.$domain + v.dataPic;
            }
          });
          this.total = res.total;
          this.requestStatic = true;
        }
      });
    },
    // 下拉加载更多
    loadMore() {
      let num = Math.ceil(this.total / 10);
      this.page++;
      let params = Object.assign(this.params, {
        page: this.page
      });
      if (params.page <= num) {
        http.get(search, this.params).then(res => {
          let list = res.list;
          list.map(v => {
            v.pricesetNprice = (v.pricesetNprice * 1).toFixed(2);
            if (!RegExp(/http/).test(v.dataPic)) {
              v.dataPic = this.$domain + v.dataPic;
            }
          });

          this.goodsList = [...this.goodsList, ...list];
          this.requestStatic = true;
        });
      } else {
        this.lastPageLine = true;
      }
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
    // 跳转详情
    goodsDetail(item) {
      let json = {
        skuCode: item.skuCode
      };
      $router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail", json);
    },
    noaddCart() {
      $message.alert("商品库存不足");
    }
  }
};
</script>
<style lang="less">
page {
  //   background: #ffffff;
}
</style>
<style lang="less" scoped>
.active {
  //   color: #178d43;
  border-bottom: 2rpx solid #999999;
}

.red {
  color: #d66377;
}
.noimg {
  margin-top: 56%;
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
.t-box {
  display: flex;
}
.t-box-flex1 {
  flex: 1;
}
.index-wrap {
  .po-fixed {
    position: fixed;
    top: 0;
    left: 0;
    background: #ffffff;
    width: 100%;
  }
  .share-infor {
    padding: 0 30rpx;
    height: 80rpx;
    line-height: 80rpx;
    .share-left {
      img {
        display: inline-block;
        width: 50rpx;
        height: 50rpx;
        border-radius: 50rpx;
        // margin-top: -54rpx;
      }
      h3 {
        display: inline-block;
        margin-left: 10rpx;
        font-size: 26rpx;
        span {
          display: inline-block;
          //   width: 180rpx;
          height: 80rpx;
          //   text-overflow: ellipsis;
          //   overflow: hidden;
          //   white-space: nowrap;
        }
      }
    }
    .search-infor {
      margin-left: 20rpx;
      margin-top: 10rpx;
      input {
        height: 50rpx;
        margin-top: 10rpx;
        border-radius: 20rpx;
        border: 1rpx solid #eeeeee;
        font-size: 24rpx;
        padding: 0 20rpx;
      }
    }
  }
  .goods-nav {
    overflow: auto;
    padding: 0 30rpx;
    ul {
      width: 300%;
      height: 70rpx;
      line-height: 70rpx;
      font-size: 30rpx;
      background: #ffffff;
      li {
        float: left;
        padding-right: 30rpx;
      }
    }
  }
  .index-goodlist {
    margin-top: 178rpx;

    .index-goodlist-box {
      li {
        background: #ffffff;
        padding: 0 30rpx;
        margin-bottom: 40rpx;
        .goods-img {
          width: 100%;
        }
        .goodlist-infor {
          background: #ffffff;
          h3 {
            height: 70rpx;
            line-height: 70rpx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            font-weight: 400;
            font-size: 36rpx;
          }
        }
        .goods-bottom {
          padding-right: 30rpx;
          background: #ffffff;
          .bottom-left {
            .goods-price {
              p {
                display: inline-block;
                font-size: 26rpx;
              }
              .color-red {
                color: #d66377;
                font-size: 40rpx;
                font-weight: 400;
              }
              .markpice {
                color: #999999;
                text-decoration: line-through;
                margin-left: 20rpx;
              }
            }
            .goodsnum {
              margin-top: 10rpx;
              font-size: 24rpx;
              margin-bottom: 10rpx;
            }
          }
          .bottom-right {
            i {
              font-size: 46rpx;
              color: #999999;
              border: 1rpx solid #999999;
              width: 60rpx;
              height: 60rpx;
              text-align: center;
              line-height: 60rpx;
              border-radius: 60rpx;
            }
          }
        }
      }
    }
  }
}
</style>