<template>
  <div class="orderLists">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <!-- <div class="orderLists-save" @click="toSearch">
      <i class="iconfont">&#xe613;</i>
    </div>-->
    <div class="orderLists-tit">
      <ul>
        <li v-for="(item,index) in items" :key="index" @click="orderTitle(item)">
          <a
            :class="dataState === item.dataState ? 'active' : ''"
            :style="{color:dataState === item.dataState ? baseColor : ''}"
          >
            {{item.label}}
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
                <span>配货单号：{{order.contractBillcode}}</span>
              </div>
              <div v-if="order.dataState==2">待配送</div>
              <div v-if="order.dataState==3">配送中</div>
              <div v-if="order.dataState==4">已送达</div>
              <div v-if="order.dataState==0">已拒收</div>
            </div>
            <ul class="bug-goodsimgs" @click="orderDetail(order)">
              <li class="flex">配送时间：{{order.dateCreate}}</li>
              <li class="flex">预计送达时间：{{order.dateModified}}</li>
              <li class="flex">商品数量：{{order.goodsNum}}</li>
              <li class="flex">订单数量：{{order.goodsNum}}</li>
            </ul>
            <div class="order-btn flex">
              <div
                class="flex-item1"
              >司机姓名：{{order.goodsSupplierName ? order.goodsSupplierName : '未分配'}}</div>
              <div class="flex-item1">司机电话：{{order.goodsSupplierCode ? order.goodsSupplierCode: '未分配'}}</div>
            </div>
          </a>
        </li>
      </ol>
    </div>
    <div class="orderLists-nulls" v-if="orderList.length == 0 && requestStatic">
      <p class="flex justify--center" style="padding:260rpx 0;color:#999">暂无数据</p>
    </div>
    <lastPageLine :lastPageLine="lastPageLine" />
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { formatDate } from "@/utils/prototype/date.js";
import {
  myOrder,
  refund,
  addShoppingGoods,
  addShoppingGoodsBySpec
} from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
import lastPageLine from "@/components/communal/last-page-line";
export default {
  data() {
    return {
      title: "我的订单",
      formatDate,
      leftIcon: true,
      rightIcon: false,
      items: [
        {
          label: "全部",
          dataState: null
        },
        {
          label: "待配送",
          dataState: 2
        },
        {
          label: "配送中",
          dataState: 3
        },
        {
          label: "已送达",
          dataState: 4
        },
        {
          label: "已拒收",
          dataState: 5
        }
      ], //"全部", "待配送", "配送中", "已送达", "已拒收"
      orderList: [], //订单列表
      myOrder: [], //菜单--》订单搜索路径
      current: 0,
      baseColor: "", //颜色
      page: 1, //分页
      total: 0, //列表数据总数
      rows: 10,
      dataState: null, //table切换接口标示
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
    let data = this.$root.$mp.query;
    this.commonMounted();
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
    commonMounted() {
      let params = {
        page: 1,
        rows: 10,
        childFlag: true
      };
      console.log(this.dataState, "this.dataState");
      if (this.dataState) {
        if (this.dataState == 5 || this.dataState == 4) {
          params.dataState = 4;
          params.contractAppraise = this.dataState - 4;
        } else {
          delete params.contractAppraise;
          params.dataState = this.dataState;
        }
      }
      http.get(myOrder.queryContractPage, params).then(res => {
        console.log(res, "res");
        if (res && res.rows) {
          if (this.page === 1 && res.rows.length === 0) {
            this.orderList = [];
          } else {
            this.orderList = res.rows;
            this.orderList.map(v => {
              v.dataBmoney = (v.dataBmoney * 1).toFixed(2);
              v.goodsList.map(val => {
                if (!RegExp(/http/).test(val.dataPic)) {
                  val.dataPic = this.$domain + val.dataPic;
                }
              });
              v.dateCreate = formatDate(v.gmtCreate);
              v.dateModified = formatDate(v.gmtModified);
            });
          }
          this.requestStatic = true;
          this.total = res.total;
        }
      });
    },
    orderTitle(item, index) {
      this.requestStatic = false;
      this.dataState = item.dataState;
      this.page = 1;
      this.rows = 10;
      this.commonMounted(item.dataState);
    },
    pay(order) {
      this.$state.set("contractBillcode", order.contractBillcode);
      $router.push("pay/paySelect", {
        dataBmoney: order.dataBmoney,
        contractBillcode: order.contractBillcode
      });
    },
    evaluate(order) {
      console.log("评价");
      // $router.push('evaluate_modules/index')
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
      $router.push("o2o/pages/order_modules/o2o_order/infor", params);
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
            background: #fff;
            border-bottom: 1rpx solid #e0e0e0;
            li {
              border-bottom: 0;
              font-size: 28rpx;
              padding: 10rpx 0;
            }
          }
          .order-btn {
            align-items: center;
            justify-content: space-between;
            white-space: nowrap;
            div {
              height: 80rpx;
              line-height: 80rpx;
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




