<template>
  <div class="orderDetail">
    <!-- <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" /> -->
    <div class="orderDetail-box">
      <div class="orderDetail-box-tit" :style="{background:baseColor}">
        <div class="orderDetail-box-tit-l" v-if="items.dataState==1 && items.dataStatestr == '1'">
          <i class="iconfont">&#xe675;</i>等待付款
        </div>
		<div class="orderDetail-box-tit-l" v-if="items.dataState == 1 && (items.dataStatestr == '2'||items.dataStatestr == '3')">
			<i class="iconfont">&#xe675;</i>
			等待审核
		</div>
        <div class="orderDetail-box-tit-l" v-if="items.dataState==2">
          <i class="iconfont">&#xe675;</i>等待发货
        </div>
        <div class="orderDetail-box-tit-l" v-if="items.dataState==3">
          <!-- <i class="iconfont">&#xe675;</i>已成团，等待收货 -->
          <i class="iconfont">&#xe675;</i>等待收货
        </div>
        <div class="orderDetail-box-tit-l" v-if="items.dataState==4">
          <i class="iconfont">&#xe675;</i>已完成
        </div>
        <div class="orderDetail-box-tit-l" v-if="items.dataState==-1">
          <i class="iconfont">&#xe675;</i>订单已取消
        </div>
        <div class="orderDetail-box-tit-l" v-if="items.dataState==30">
          <i class="iconfont">&#xe675;</i>待成团
        </div>
        <!-- <div
          class="orderDetail-box-tit-l showtimes"
          v-if="items.dataState==1 || items.dataState==30"
        >
          <i>{{items.goodsPbillno || 1}}人团，团购创建时间{{gmtCreate || '暂无'}}</i>
        </div>
        <div
          class="orderDetail-box-tit-l showtimes"
          v-if="items.dataState==2 || items.dataState==3 || items.dataState==4"
        >
          <i>{{items.goodsPbillno || 1}}人团，成团时间 {{items.contractValidate || '暂无'}}</i>
        </div> -->

        <!-- <div class="orderDetail-box-tit-r" v-if="items.dataState==3 || items.dataState==4">{{items.packageList[0].expressName}}</div> -->
      </div>
    </div>
    <div v-show="items.dataState==3 || items.dataState==4">
      <div class="orderDetail-logistics" v-if="traces.length!==0">
        <div class="orderDetail-logistics-l">
          <div class="orderDetail-logistics-l-icon">
            <i class="iconfont">&#xe735;</i>
          </div>
          <div>
            <p>{{traces.AcceptStation}}</p>
            <h6>{{traces.AcceptTime}}</h6>
          </div>
        </div>
        <div>
          <i class="iconfont">&#xe61d;</i>
        </div>
      </div>

      <div class="orderDetail-logistics" v-else>
        <div class="orderDetail-logistics-l">
          <div class="orderDetail-logistics-l-icon">
            <i class="iconfont" :style="{background:baseColor}">&#xe735;</i>
          </div>
          <div>暂无物流信息</div>
        </div>
      </div>
    </div>
    <div class="orderDetail-address">
      <div>
        <i class="iconfont">&#xe68c;</i>
      </div>
      <div>
        <p>
          {{items.goodsReceiptMem}}
          <span>{{items.goodsReceiptPhone}}</span>
        </p>
        <h6>{{items.goodsReceiptArrdess}}</h6>
      </div>
    </div>
    <div class="orderDetail-goods">
      <ul>
        <li v-for="(goods,index) in items.goodsList" :key="index">
          <a>
            <img :src="goods.dataPic" />
            <div>
              <div>
                <p class="currentP">{{goods.goodsName}}</p>
                <h6>{{goods.skuName}}</h6>
              </div>
              <div style="text-align:right;">
                <p
                  style="width:140rpx;"
                >{{unitPrice.obpay}}{{goods.pricesetNprice}}{{unitPrice.mapay}}</p>
                <h6>x{{goods.goodsNum}}</h6>
              </div>
            </div>
          </a>
          <div class="goods-btn">
            <span
              v-if="items.dataState == '2' && goods.contractGoodsRefnum != goods.goodsNum &&goods.refundFlag===0"
              @click="refundMoney(goods,items)"
              :style="{color:baseColor,borderColor:baseColor}"
            >退款</span>
            <span
              v-if="(items.dataState == '3' || items.dataState == '4') && goods.contractGoodsRefnum != goods.goodsNum"
              @click="afterService(goods,items)"
              :style="{color:baseColor,borderColor:baseColor}"
            >售后</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="orderDetail-info">
      <p>订单编号：{{items.contractBillcode}}</p>
      <p>下单时间：{{gmtCreate}}</p>
      <p>支付方式：在线支付</p>
      <!-- <p>支付时间：2018-10-9  00:10:20</p> -->
      <!-- <p>配送方式：圆通快递</p> -->
      <!-- <p>发票类型：不开发票</p> -->
    </div>
    <div class="orderDetail-price">
      <p>
        商品总额
        <span>{{unitPrice.obpay}}{{items.dataBmoney}}{{unitPrice.mapay}}</span>
      </p>
      <p>
        运费
        <span>{{unitPrice.obpay}}{{items.goodsLogmoney}}{{unitPrice.mapay}}</span>
      </p>
    </div>
    <div class="orderDetail-count">
      实付款：
      <span :style="{color:'#d66377'}">{{unitPrice.obpay}}{{items.dataBmoney}}{{unitPrice.mapay}}</span>
    </div>
    <div :style="{display:items.dataState==2||items.dataState==-1?'none':'block'}">
      <div class="orderDetail-footer">
        <div v-if="items.dataState == 1">
          <span @click="cancelOrder(items)">取消订单</span>
          <span :style="{borderColor:baseColor,color:baseColor}" @click="pay(items)">立即支付</span>
        </div>
        <div v-else-if="items.dataState == 2">
          <!-- <span>申请退款</span> -->
          <!-- <span>再次购买</span> -->
        </div>
        <div v-else-if="items.dataState == 3">
          <span @click="queryExpressInfo(items)">查看物流</span>
          <span @click="confirmReceive(items)" :style="{borderColor:baseColor,color:baseColor}">确认收货</span>
        </div>
        <div v-else-if="items.dataState == 4">
          <div v-if="items.contractAppraise ==1">
            <!-- <span>申请售后</span> -->
            <!-- <span>再次购买</span> -->
            <!-- <span>去评价</span> -->
          </div>
          <div v-else>
            <!-- <span>申请售后</span> -->
            <span
              :style="{borderColor:baseColor,color:baseColor}"
              @click="evaluate(items.goodsList)"
            >去评价</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { formatDate } from "@/utils/prototype/date.js";
import { getContractByCode, refund, myOrder } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
import Vue from "vue";
export default {
  data() {
    return {
      title: "订单详情",
      leftIcon: true,
      rightIcon: false,
      items: {},
      traces: [],
      baseColor: "",
      unitPrice: {},
      refundApply: "", //申请售后路径
      userImgurl: require("../../../../../../static/img/mine/default_header.png")
    };
  },
  onLoad() {
    // wx.setNavigationBarTitle({
    //   title: $storage.get("proappEnvName")
    // });
    // wx.setNavigationBarColor({
    //   frontColor: "#ffffff", // 必写项
    //   backgroundColor: "#" + this.$state.baseColor
    // });
  },
  mounted() {
    this.unitPrice = this.$state.unitPrice || $storage.get("unitPrice");
    this.$state.orderMenu.map(v => {
      if (v.menuAction == "refundApply") {
        this.refundApply = v.menuJspath;
      }
    });
    this.baseColor = "#" + this.$state.baseColor;
    this.params = this.$root.$mp.query;
    let code = {
      contractBillcode: this.params.contractBillcode
    };
    http.get(getContractByCode, code).then(res => {
      if (res) {
        if (res.contractValidate) {
          res.contractValidate = formatDate(res.contractValidate);
        }
        res.gmtCreate = formatDate(res.gmtCreate);
        this.items = res;
        this.items.goodsList.map(val => {
          if (!RegExp(/http/).test(val.dataPic)) {
            val.dataPic = this.$domain + val.dataPic;
          }
        });
      }
    });
    let prop = {
      expressType: this.params.expressType,
      expressNo: this.params.expressNo
    };
    if (this.items.dataState == 3 || this.items.dataState == 4) {
      http.get(refund.getExpressPageForProp, prop).then(res => {
        this.traces = JSON.parse(res.dataObj).Traces;
      });
    }
  },
  components: {
    commonHeader
  },
  computed: {
    gmtCreate() {
      return formatDate(this.items.gmtCreate);
    }
  },
  methods: {
    cancelOrder(items) {
      let that = this;
      wx.showModal({
        content: "取消订单",
        success(res) {
          if (res.confirm) {
            http
              .post(myOrder.cancelContractC, { contractId: items.contractId })
              .then(res => {
                if (res.success) {
                  $message.alert("取消成功!");
                }
              })
              .then(res => {
                Vue.set(that.items, "dataState", -1);
              });
          } else if (res.cancel) {
          }
        }
      });
    },
    queryExpressInfo(items) {
      let prop = {
        expressType: this.params.expressType,
        expressNo: this.params.expressNo
      };
      $router.push("logistics_modules/infor", prop);
      //   this.$state.orderMenu.map(v=>{
      //      if(v.menuAction=='logisticsinfor'){
      //        $router.push(v.menuJspath,prop)
      //      }
      //    })
    },
    confirmReceive(items) {
      http
        .post(myOrder.confirmReceive, {
          contractBillcode: items.contractBillcode
        })
        .then(res => {
          if (res && res.success) {
            $message.alert("确认收货成功!");
          }
        })
        .then(() => {
          Vue.set(that.items, "dataState", 4);
        });
    },
    afterService(goods, items) {
      goods.dataState = items.dataState;
      $router.push(this.refundApply, goods);
    },
    refundMoney(goods, items) {
      goods.dataState = items.dataState;
      $router.push(this.refundApply, goods);
    },
    pay(items) {
      this.$state.set("contractBillcode", items.contractBillcode);
      $router.push("pay/paySelect", {
        dataBmoney: items.dataBmoney,
        contractBillcode: items.contractBillcode
      });
    },
    evaluate(items) {
      this.$state.set("order", items);
      this.$state.orderMenu.map(v => {
        if (v.menuAction == "evaluate") {
          $router.push(v.menuJspath);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../../../common/css/common.less";
.orderDetail {
  width: 100%;
  // height: 100%;
  background: @white-color;
  &-box {
    // margin-top: 90rpx;
    &-tit {
      height: 138rpx;
      // display: flex;
      align-items: center;
      justify-content: space-between;
      color: @white-color;
      background: #b79f78;
      padding: @padding-30;
      text-align: center;
      padding-top: 38rpx;
      &-l {
        font-size: 32rpx;
        //   display: flex;
        align-items: center;

        i {
          margin-right: 15rpx;
          display: initial;
        }
      }
      &-r {
        font-size: 28rpx;
      }
      .showtimes {
        margin-top: 8rpx;
        font-size: 26rpx;
      }
    }
  }
  &-logistics {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 39rpx 30rpx 31rpx 30rpx;
    border-bottom: 1rpx solid #f6f6f8;
    &-l {
      display: flex;
      align-items: center;
      &-icon {
        margin-right: 27rpx;
        i {
          width: 44rpx;
          height: 44rpx;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #b79f77;
          color: @white-color;
        }
      }
      p {
        font-size: @top-title;
        color: #b79f77;
        margin-bottom: 40rpx;
        width: 580rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      h6 {
        color: @color-999;
        font-size: @middle-title;
      }
    }
  }
  &-address {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 59rpx 30rpx 30rpx 30rpx;
    i {
      width: 44rpx;
      height: 44rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @color-333;
      color: @white-color;
    }
    p {
      margin-left: 32rpx;
      font-size: @top-title;
      color: @color-333;
    }
    h6 {
      margin-left: 32rpx;
      color: @color-666;
      font-size: @middle-title;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  &-goods {
    border-top: 20rpx solid #fafafa;
    border-bottom: 20rpx solid #fafafa;
    ul {
      li {
        padding: 48rpx 30rpx 24rpx 30rpx;
        border-bottom: 1rpx solid #f6f6f8;
        a {
          display: flex;
          justify-content: space-between;
          img {
            width: 150rpx;
            height: 150rpx;
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
        &:last-child {
          border-bottom: 0;
        }
        .goods-btn {
          height: 50rpx;
          text-align: right;
          span {
            display: inline-block;
            height: 48rpx;
            line-height: 48rpx;
            color: #bfa676;
            font-size: 22rpx;
            border: 1rpx solid #bfa676;
            border-radius: 26rpx;
            padding: 0 20rpx;
          }
        }
      }
    }
  }
  &-info {
    padding: 20rpx 30rpx;
    border-bottom: 20rpx solid #f6f6f8;
    p {
      line-height: 64rpx;
      color: @color-333;
      font-size: @big-title;
    }
  }
  &-price {
    margin: 0 30rpx;
    padding: @padding-tb;
    border-bottom: 1px solid #f6f6f8;
    p {
      line-height: 46rpx;
      font-size: @middle-title;
      color: @color-333;
      span {
        float: right;
        color: @color-666;
      }
    }
  }
  &-count {
    float: right;
    color: @color-333;
    font-size: @middle-title;
    height: 86rpx;
    line-height: 86rpx;
    padding-right: 30rpx;
    padding-bottom: 98rpx;
    display: flex;
    align-items: center;

    span {
      color: #d66377;
      font-size: 36rpx;
    }
  }
  &-footer {
    height: 98rpx;
    width: calc(100% - 60rpx);
    border-top: 1rpx solid #f6f6f8;
    padding: @padding-30;
    position: fixed;
    background: @white-color;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    span {
      display: inline-block;
      height: 48rpx;
      line-height: 48rpx;
      color: @color-666;
      font-size: 22rpx;
      border: 1rpx solid #d4d4d4;
      border-radius: 26rpx;
      padding: 0 20rpx;
      margin-right: 20rpx;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>




