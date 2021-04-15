<template>
  <div class="orderLists">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <!-- <div class="orderLists-save" @click="toSearch">
      <i class="iconfont">&#xe613;</i>
    </div>-->
    <div class="orderLists-tit">
      <ul>
        <li v-for="(item,index) in items" :key="index" @click="orderTitle(item,index)">
          <a
            :class="current == index ? 'active' : ''"
            :style="{color:current == index ? baseColor : ''}"
          >
            {{item}}
            <span :style="{background:baseColor}"></span>
          </a>
        </li>
      </ul>
    </div>
    <div class="orderLists-info" v-if="orderList.length>0">
      <ol>
        <li v-for="(order,index) in orderList" :key="index">
          <a>
            <div class="order-status">
              <div class="order-title">
                <img class="shop-logo" :src="userImgurl" />
                <h3>
                  永辉生活 -
                  <span>{{order.channelName}}</span>
                </h3>
              </div>
              <div v-if="order.dataState==-1">已取消</div>
              <div v-else-if="order.dataState==1">待付款</div>
              <div v-else-if="order.dataState==2">待发货</div>
              <div v-else-if="order.dataState==3">待核销</div>
              <div v-else-if="order.dataState==4">已完成</div>
            </div>
            <ul class="bug-goodsimgs" @click="orderDetail(order)">
              <li v-for="(goods,goodsIndex) in order.goodsList" :key="goodsIndex">
                <img class="goods-imgslist" :src="goods.dataPic||userImgurl" />
              </li>
            </ul>
            <div class="order-btn">
              <div class="num-totalprice">
                共{{order.goodsList.length}}款商品, 实付:
                <i
                  :style="{color:'#E40506'}"
                >{{unitPrice.obpay}}{{order.dataBmoney}}{{unitPrice.mapay}}</i>
              </div>
              <!-- <div v-if="order.dataState == 3">
                <span @click="queryExpressInfo(order)">立即核销</span>
              </div>-->
            </div>
          </a>
        </li>
      </ol>
    </div>
    <div class="orderLists-nulls" v-if="orderList.length == 0 && requestStatic">
      <img :src="nullImg" />
    </div>
    <lastPageLine :lastPageLine="lastPageLine" />
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import {
  myOrder,
  refund,
  addShoppingGoods,
  addShoppingGoodsBySpec,
  queryContractPageForGroup
} from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
import lastPageLine from "@/components/communal/last-page-line";
export default {
  data() {
    return {
      title: "团长订单",
      leftIcon: true,
      rightIcon: false,
      items: ["全部", "待付款", "待配送", "待提货", "已完成"],
      orderList: [], //订单列表
      myOrder: [], //菜单--》订单搜索路径
      current: 0,
      baseColor: "", //颜色
      page: 1, //分页
      total: 0, //列表数据总数
      rows: 10,
      dataState: 0, //table切换接口标示
      lastPageLine: false, //底部提示
      //dataState//已取消（-1），初始化（0），待付款（1），待发货（2），待收货（3），成功（4）
      userImgurl:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/img_default.jpg",
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noOrder.png",
      requestStatic: false
    };
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice") || {};
    }
  },
  components: {
    commonHeader,
    lastPageLine
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();
  },
  destroyed() {
    this.page = 1;
  },
  onShow() {
    // let data = this.$root.$mp.query;
    let params = {
      page: 1,
      rows: 10,
      childFlag: true
    };
    // if (data.dataState == 0) {
    //   delete params.dataState;
    // } else {
    //   this.dataState = data.dataState;
    //   params.dataState = this.dataState;
    // }
    // if (data.dataState == 4) {
    //   params.dataStateBuy = 1;
    //   params.contractAppraise = 0;
    // } else {
    //   delete params.dataStateBuy;
    //   delete params.contractAppraise;
    // }

    // this.current = Number(data.dataState);

    http.get(queryContractPageForGroup, params).then(res => {
      console.log(res, "res");
      if (res && res.rows) {
        if (this.page === 1 && res.rows.length === 0) {
          this.orderList = [];
        } else {
          this.orderList = res.rows;
          this.orderList.map(v => {
            v.dataBmoney = (v.dataBmoney * 1).toFixed(2);
            v.goodsList &&
              v.goodsList.map(val => {
                if (!RegExp(/http/).test(val.dataPic)) {
                  val.dataPic = this.$domain + val.dataPic;
                }
              });
          });
          this.requestStatic = true;
        }

        this.total = res.total;
      }
    });
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
  },
  watch: {
    current(val) {
      this.lastPageLine = false;
      this.orderList = [];
    }
  },
  methods: {
    commonMounted(current) {
      console.log(current, "tablke");
      let params = {
        page: this.page,
        rows: this.rows,
        childFlag: true
      };

      if (current !== 0) {
        params.dataState = this.dataState;
      } else {
        delete params.dataState;
      }
      if (current == 4) {
        params.dataStateBuy = 1;
        params.contractAppraise = 0;
      } else {
        delete params.dataStateBuy;
        delete params.contractAppraise;
      }

      http.get(queryContractPageForGroup, params).then(res => {
        if (res && res.rows) {
          if (this.page === 1 && res.rows.length === 0) {
            this.orderList = [];
          } else {
            let list = res.rows;

            list.map(v => {
              v.goodsList.map(val => {
                v.dataBmoney = (v.dataBmoney * 1).toFixed(2);
                v.goodsList.map(val => {
                  if (!RegExp(/http/).test(val.dataPic)) {
                    val.dataPic = this.$domain + val.dataPic;
                  }
                });
              });
            });
            if (this.page === 1) {
              this.orderList = list;
            } else {
              this.orderList = [...this.orderList, ...list];
            }
            this.requestStatic = true;
          }

          this.total = res.total;
        }
      });
    },
    orderTitle(item, index) {
      console.log(index, "点击显示");
      this.requestStatic = false;
      this.current = index;

      if (index > 0) {
        this.dataState = index;
      }
      this.page = 1;
      this.rows = 10;
      this.commonMounted(this.current);
    },
    // pay(order) {
    //   this.$state.set("contractBillcode", order.contractBillcode);
    //   $router.push("pay/paySelect", {
    //     dataBmoney: order.dataBmoney,
    //     contractBillcode: order.contractBillcode
    //   });
    // },
    // evaluate(order) {
    //   console.log("评价");
    //   // $router.push('evaluate_modules/index')
    //   this.$state.set("order", order);
    //   this.$state.orderMenu.map(v => {
    //     if (v.menuAction == "evaluate") {
    //       $router.push(v.menuJspath);
    //     }
    //   });
    // },
    // queryExpressInfo(order) {
    //   let params = {
    //     expressType: order.packageList[0].expressCode,
    //     expressNo: order.packageList[0].packageBillno,
    //     expressName: order.packageList[0].expressName,
    //     address: order.goodsReceiptArrdess,
    //     img: order.goodsList[0].dataPic,
    //     num: order.goodsList.length
    //   };
    //   $router.push("o2o/pages/order_modules/o2o_order/closure", params);
    //   this.$state.orderMenu.map(v => {
    //     if (v.menuAction == "logisticsinfor") {
    //       $router.push(v.menuJspath, params);
    //     }
    //   });
    // },
    confirmReceive(order) {
      let that = this;
      wx.showModal({
        //title: '提示',
        content: "确认收货",
        success(res) {
          if (res.confirm) {
            http
              .post(myOrder.confirmReceive, {
                contractBillcode: order.contractBillcode
              })
              .then(res => {
                if (res && res.success) {
                  $message.success("确认收货成功");
                }
              })
              .then(() => {
                that.page = 1;
                that.commonMounted(that.current);
              });
          } else if (res.cancel) {
          }
        }
      });
    },
    cancelOrder(order) {
      let that = this;
      wx.showModal({
        //title: '提示',
        content: "取消订单",
        success(res) {
          if (res.confirm) {
            http
              .post(myOrder.cancelContractC, { contractId: order.contractId })
              .then(res => {
                if (res.success) {
                  $message.alert("取消成功!");
                }
              })
              .then(res => {
                that.page = 1;
                that.commonMounted(that.current);
              });
          } else if (res.cancel) {
          }
        }
      });
    },
    addShoppingGoods(order) {
      //该方法暂时不用
      let goodsCode = [];
      let specStr = [];
      order.goodsList.map(val => {
        goodsCode.push(val.goodsCode);
        specStr.push(val.skuName);
      });
      let params = {
        goodsCode: goodsCode.join(","),
        specStr: JSON.stringify(specStr)
      };

      http.post(addShoppingGoodsBySpec, params).then(res => {
        http
          .post(addShoppingGoods, { skuId: res.dataObj.skuId, goodsNum: 1 })
          .then(res => {
            if (res.success) {
              $router.push("shopcart");
            }
          });
      });
    },
    orderDetail(order) {
      console.log(order, "跳转", this.$state.orderMenu);
      let params = {
        contractBillcode: order.contractBillcode,
        expressType: order.packageList[0].expressCode,
        expressNo: order.packageList[0].packageBillno
      };
      // this.$state.orderMenu.map(v => {
      //   if (v.menuAction == "orderInfor") {
      //     $router.push(v.menuJspath, params);
      //     console.log("1233221")
      $router.push("o2o/pages/order_modules/o2o_order/inforGroupList", params);
      //   }
      // });
    },
    toSearch() {
      console.log(this.$state.orderSearch, "this.$state.orderSearch");
      $router.push(this.$state.orderSearch);
    },
    loadMore() {
      let num = Math.ceil(this.total / 10);
      this.page++;
      if (this.page <= num) {
        this.commonMounted(this.current);
      } else {
        this.lastPageLine = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../../../common/css/common.less";
.orderLists {
  width: 100%;
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
  &-tit {
    width: 100%;
    position: fixed;
    top: 90rpx;
    left: 0;
    z-index: 999;
    background: @white-color;
    padding-top: 10rpx;
    ul {
      display: flex;
      justify-content: space-between;
      padding: @padding-30;
      height: 90rpx;
      li {
        height: 90rpx;
        a {
          width: 100%;
          height: 100%;
          line-height: 90rpx;
          display: inline-block;
          position: relative;
          font-size: 28rpx;
          color: @color-333;
        }
        .active {
          color: #bfa676;
          span {
            position: absolute;
            height: 3rpx;
            width: 100%;
            background: #bfa676;
            bottom: 0;
            left: 0;
          }
        }
      }
    }
  }
  &-info {
    margin-top: 190rpx;
    ol {
      li {
        border-bottom: 20rpx solid #fafafa;
        padding: @padding-30;
        background: @white-color;
        a {
          .order-status {
            height: 79rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1rpx solid #f6f6f8;
            > div {
              font-size: @big-title;
            }
            .order-title {
              .shop-logo {
                width: 60rpx;
                height: 60rpx;
                border-radius: 10rpx;
                overflow: hidden;
              }
              h3 {
                display: inline-block;
                margin-left: 20rpx;
                font-size: 28rpx;
                font-weight: bold;
              }
            }
          }
          .bug-goodsimgs {
            overflow: hidden;
            padding: 15rpx 0 15rpx 0;
            justify-content: space-between;
            border-bottom: 1rpx solid #f6f6f8;
            li {
              width: 124rpx;
              height: 124rpx;
              float: left;
              border-top: 20rpx solid #fafafa;
              padding: 0 15rpx;
              img {
                display: block;
                width: 100%;
                height: 100%;
              }
            }
          }
          .order-btn {
            align-items: center;
            justify-content: space-between;
            white-space: nowrap;
            div {
              height: 80rpx;
              text-align: right;
            }
            .num-totalprice {
              height: 80rpx;
              line-height: 80rpx;
              .buy-nums {
                border: none;
              }
              i {
                display: inline;
                margin-left: 10rpx;
              }
            }
            span {
              display: inline-block;
              border: 1rpx solid #d4d4d4;
              line-height: 46rpx;
              border-radius: 26rpx;
              padding: 0 20rpx;
              font-size: 22rpx;
              color: @color-666;
              margin-right: @margin-right;
              &:last-child {
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
  &-nulls {
    height: calc(100% - 202rpx);
    text-align: center;
    img {
      width: 424rpx;
      height: 311rpx;
      margin: 380rpx auto 0;
    }
  }
}
</style>




