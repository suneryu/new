<template>
  <div class="orderList">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="orderList-save" @click="toSearch">
      <i class="iconfont">&#xe613;</i>
    </div>
    <div class="orderList-tit">
      <ul>
        <li v-for="(item,index) in items" :key="index" @click="orderTitle(item,index)">
          <a
            :class="current === index ? 'active' : ''"
            :style="{color:current === index ? baseColor : ''}"
          >
            {{item}}
            <span :style="{background:baseColor}"></span>
          </a>
        </li>
      </ul>
    </div>
    <div class="orderList-info" v-if="orderList.length>0">
      <ol>
        <li v-for="(order,index) in orderList" :key="index">
          <a>
            <div class="order-status">
              <div>
                订单编号：{{order.contractBillcode}}
                <span
                  v-if="order.goodsPbillno != null"
                  class="group-num"
                  :style="{borderColor:baseColor,color:baseColor}"
                >{{order.goodsPbillno}}人成团</span>
              </div>
              <div v-if="order.dataState==-1">已取消</div>
              <div v-else-if="order.dataState==1">待付款</div>
              <div v-else-if="order.dataState==2">待发货</div>
              <div v-else-if="order.dataState==3">待收货</div>
              <div v-else-if="order.dataState==4">完成</div>
              <div v-else-if="order.dataState==30">待成团</div>
            </div>
            <div
              class="order-msg"
              v-for="(goods,goodsIndex) in order.goodsList"
              :key="goodsIndex"
              @click="orderDetail(order)"
            >
              <img :src="goods.dataPic||userImgurl" />
              <div>
                <div>
                  <p class="currentP">{{goods.goodsName}}</p>
                  <h6>{{goods.skuName}}</h6>
                </div>
                <div style="text-align:right;">
                  <p
                    style="width:160rpx;"
                  >{{unitPrice.obpay}}{{goods.pricesetNprice}}{{unitPrice.mapay}}</p>
                  <h6>x{{goods.goodsNum}}</h6>
                </div>
              </div>
            </div>

            <div class="order-btn">
              <div>
                实付:
                <i
                  :style="{color:'#d66377'}"
                >{{unitPrice.obpay}}{{order.dataBmoney}}{{unitPrice.mapay}}</i>
              </div>
              <div v-if="order.dataState == 1">
                <span @click="cancelOrder(order)">取消订单</span>
                <span @click="pay(order)" :style="{borderColor:baseColor,color:baseColor}">去付款</span>
              </div>
              <div v-if="order.dataState == 30">
                <!-- <span @click="share(order)">去分享</span> -->
              </div>
              <div v-else-if="order.dataState == 2">
                <!-- <span @click="refundMoney(order)">申请退款</span> -->
                <!-- <span @click="addShoppingGoods(order)">再次购买</span> -->
              </div>
              <div v-else-if="order.dataState == 3">
                <span @click="queryExpressInfo(order)">查看物流</span>
                <span
                  @click="confirmReceive(order)"
                  :style="{borderColor:baseColor,color:baseColor}"
                >确认收货</span>
              </div>
              <div v-else-if="order.dataState == 4">
                <!-- <div v-if="order.contractAppraise ==1">
                <span>已评价</span>-->
                <!-- </div>
                <div v-else>
                  <span
                    @click="evaluate(order.goodsList)"
                    :style="{borderColor:baseColor,color:baseColor}"
                >去评价</span>-->
                <!-- </div> -->
              </div>
            </div>
          </a>
        </li>
      </ol>
    </div>
    <div class="orderList-nulls" v-if="orderList.length == 0 && requestStatic">
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
  queryContractPageBySpellGroup
} from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
import lastPageLine from "@/components/communal/last-page-line";
export default {
  data() {
    return {
      title: "拼团列表",
      leftIcon: true,
      rightIcon: false,
      //   取消  待付款--待成团--待发货---待收货  --完成
      items: ["全部", "待付款", "待成团", "待发货", "待收货"],
      orderList: [], //订单列表
      myOrder: [], //菜单--》订单搜索路径
      current: 0,
      baseColor: "", //颜色
      page: 1, //分页
      total: 0, //列表数据总数
      rows: 10,
      dataState: 1, //table切换接口标示
      lastPageLine: false, //底部提示
      requestStatic: false,
      //dataState//已取消（-1），初始化（0），待付款（1），待发货（2），待收货（3），成功（4）
      userImgurl:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/img_default.jpg",
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noOrder.png"
    };
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice");
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
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    let data = { dataState: "0" };
    console.log("走这里了吗");
    let params = {
      page: 1,
      rows: 10,
      childFlag: true
    };
    if (data.dataState == 0) {
      delete params.dataState;
    } else {
      this.dataState = data.dataState;
      params.dataState = this.dataState;
    }
    if (data.dataState == 4) {
      params.dataStateBuy = 1;
      params.contractAppraise = 0;
    } else {
      delete params.dataStateBuy;
      delete params.contractAppraise;
    }

    this.current = Number(data.dataState);
    console.log();
    http.get(queryContractPageBySpellGroup, params).then(res => {
      if (res && res.rows) {
        if (this.page === 1 && res.rows.length === 0) {
          this.orderList = [];
        } else {
          this.orderList = res.rows;
          this.requestStatic = true;
          this.orderList.map(v => {
            v.goodsList.map(val => {
              if (!RegExp(/http/).test(val.dataPic)) {
                val.dataPic = this.$domain + val.dataPic;
              }
            });
          });
        }

        this.total = res.total;
      }
    });
  },
  watch: {
    current(val) {
      this.lastPageLine = false;
      this.orderList = [];
    }
  },
  methods: {
    commonMounted(current) {
      console.log(current, "*******************");
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

      http.get(queryContractPageBySpellGroup, params).then(res => {
        if (res && res.rows) {
          if (this.page === 1 && res.rows.length === 0) {
            this.orderList = [];
          } else {
            let list = res.rows;
            list.map(v => {
              v.goodsList.map(val => {
                v.goodsList.map(val => {
                  if (!RegExp(/http/).test(val.dataPic)) {
                    val.dataPic = this.$domain + val.dataPic;
                  }
                });
              });
            });
            if (this.page === 1) {
              this.orderList = list;
              this.requestStatic = true;
            } else {
              this.orderList = [...this.orderList, ...list];
              this.requestStatic = true;
            }
          }

          this.total = res.total;
        }
      });
    },
    orderTitle(item, index) {
      this.requestStatic = false;
      this.current = index;
      if (index > 0) {
        if (index == 1) {
          this.dataState = "1";
        } else if (index == 2) {
          this.dataState = "30";
        } else if (index == 3) {
          this.dataState = "2";
        } else if (index == 4) {
          this.dataState = "3";
        }
      }
      this.page = 1;
      this.rows = 10;
      this.commonMounted(this.current);
    },
    pay(order) {
      this.$state.set("contractBillcode", order.contractBillcode);
      $router.push("pay/paySelect", {
        dataBmoney: order.dataBmoney,
        contractBillcode: order.contractBillcode
      });
    },
    evaluate(order) {
      this.$state.set("order", order);
      this.$state.orderMenu.map(v => {
        if (v.menuAction == "evaluate") {
          $router.push(v.menuJspath);
        }
      });
    },
    queryExpressInfo(order) {
      let params = {
        expressType: order.packageList[0].expressCode,
        expressNo: order.packageList[0].packageBillno,
        expressName: order.packageList[0].expressName,
        address: order.goodsReceiptArrdess,
        img: order.goodsList[0].dataPic,
        num: order.goodsList.length
      };
      $router.push("logistics_modules/infor", params);
      //   this.$state.orderMenu.map(v => {
      //     if (v.menuAction == "logisticsinfor") {
      //       $router.push(v.menuJspath, params);
      //     }
      //   });
    },
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
      console.log(order, "order---");
      let params = {};
      if (order.dataState == 3) {
        params = {
          contractBillcode: order.contractBillcode,
          expressType: order.packageList[0].expressCode,
          expressNo: order.packageList[0].packageBillno
        };
      } else {
        params = {
          contractBillcode: order.contractBillcode
        };
      }

      $router.push(
        "marketing_module/pages/groupBuy/grouporder_modules/infor",
        params
      );
      //   this.$state.orderMenu.map(v => {
      //     if (v.menuAction == "orderInfor") {
      //       $router.push(v.menuJspath, params);
      //     }
      //   });
    },
    toSearch() {
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
.orderList {
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
        &:first-child {
          border-top: 20rpx solid #fafafa;
        }
        &:last-child {
          border-bottom: 0;
        }
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
            .group-num {
              border: 1rpx solid #999999;
              padding: 2rpx 8rpx;
              margin-left: 30rpx;
              font-size: 22rpx;
              border-radius: 12rpx;
            }
          }
          .order-msg {
            padding: 15rpx 0 48rpx 0;
            border-bottom: 1rpx solid #f6f6f8;
            display: flex;
            justify-content: space-between;
            img {
              width: 130rpx;
              height: 130rpx;
              margin-right: @margin-right;
            }
            > div {
              display: flex;
              justify-content: space-between;
              p {
                font-size: @big-title;
                color: @color-333;
                margin: 12rpx 0 25rpx 0;
              }
              .currentP {
                width: 380rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              h6 {
                font-size: 24rpx;
                color: @color-999;
              }
            }
          }
          .order-btn {
            height: 88rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            div:first-child {
              display: flex;
              align-items: center;
              i {
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




