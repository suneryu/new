<template>
  <div class="orderDetail">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />

    <div class="orderDetail-box newStyle">
      <div class="orderDetail-box-tit newStyle-add">
        <div
          class="orderDetail-box-tit-l newStyle-add-center newStyle-add-yh"
          v-if="items.dataState==1"
        >
          <i class="iconfont">&#xe675;</i>等待付款
        </div>
        <div class="orderDetail-box-tit-l newStyle-add-center" v-if="items.dataState==2">
          <i class="iconfont">&#xe675;</i>等待发货
        </div>
        <div class="orderDetail-box-tit-l newStyle-add-center" v-if="items.dataState==3">
          <i class="iconfont">&#xe675;</i>等待提货
        </div>
        <div class="orderDetail-box-tit-l newStyle-add-center" v-if="items.dataState==4">
          <i class="iconfont">&#xe675;</i>
          <span v-if="items.contractAppraise=='1'">交易成功</span>
          <span v-else>等待评价</span>
        </div>
        <div class="orderDetail-box-tit-l newStyle-add-center" v-if="items.dataState==-1">
          <i class="iconfont">&#xe675;</i>订单已取消
        </div>

        <!-- <div class="orderDetail-box-tit-r newStyle-add-center" v-if="items.dataState==3 || items.dataState==4">{{items.packageList[0].expressName}}</div> -->
        <div
          class="orderDetail-box-tit-l newStyle-add-center newStyle-add-yj"
          v-if="items.dataState==1"
        >
          <span>12:00:00</span>后订单自动取消
        </div>
        <div
          class="orderDetail-box-tit-l newStyle-add-center newStyle-add-yj"
          v-if="items.dataState==2"
        >正在给您准备商品</div>
        <div
          class="orderDetail-box-tit-l newStyle-add-center newStyle-add-yj"
          v-if="items.dataState==3"
        >门店已发货，请注意查收</div>
        <div
          class="orderDetail-box-tit-l newStyle-add-center newStyle-add-yj"
          v-if="items.dataState==4"
        >感谢您的支持，期待您的再次光临</div>
        <div
          class="orderDetail-box-tit-l newStyle-add-center newStyle-add-yj"
          v-if="items.dataState==-1"
        >期待下次光临</div>
        <!-- <div class="order-btn" v-if="items.dataState == 1">
              <span @click="cancelOrder(items)">取消订单</span>
              <span @click="pay(items)" :style="{borderColor:baseColor,color:baseColor}">立即支付</span>
        </div>-->
        <div :style="{display:items.dataState==2||items.dataState==-1?'none':'block'}">
          <div class="operation-btn">
            <div v-if="items.dataState == 1">
              <span @click="cancelOrder(items)">取消订单</span>
              <span :style="{borderColor:baseColor,color:baseColor}" @click="pay(items)">立即支付</span>
            </div>
            <div v-else-if="items.dataState == 2">
              <!-- <span>申请退款</span> -->
              <!-- <span>再次购买</span> -->
            </div>
            <div v-else-if="items.dataState == 3">
              <div class="color-666" v-if="items.contractPumode==1">
                <div class="leftShop">提货码：{{items.contractDelcode}}</div>
              </div>
              <span  v-if="items.contractPumode==1"
                @click="erweima(items.contractDelcode,items.contractBillcode)"
                class="rightShop"
              >生成二维码</span>
              <span  v-if="items.contractPumode!=1" @click="queryExpressInfo(items)">查看物流</span>
              <span v-if="items.contractPumode!=1"
                @click="confirmReceive(items)"
                :style="{borderColor:baseColor,color:baseColor}"
              >确认收货</span>
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
    <!-- <div class="orderDetail-address">
        <div><i class="iconfont">&#xe68c;</i></div>
        <div>
          <p>{{items.goodsReceiptMem}} <span>{{items.goodsReceiptPhone}}</span></p>
          <h6>{{items.goodsReceiptArrdess}}</h6>
        </div>
    </div>-->
    <div class="buygoods-infor">
      <div class="orderDetail-goods">
        <div class="shop-name">
          <p>上蔬永辉 - 南京路店</p>
          <!-- 联系门店   icon-dadianhua-->
          <p @click="callPhone()" :style="{color:baseColor}">
            <i class="icon iconfont"></i>
            <span></span>
          </p>
        </div>
        <ul>
          <li v-for="(goods,index) in items.goodsList" :key="index">
            <a>
              <div style="width:150rpx;height:150rpx">
                <img :src="goods.dataPic" />
              </div>
              <div class="flex-item1">
                <div>
                  <p class="currentP">{{goods.goodsName}}</p>
                  <h6>{{goods.skuName}}</h6>
                </div>
                <div style="text-align:right;">
                  <p style="width:140rpx;">
                    {{unitPrice.obpay}}
                    {{goods.pricesetNprice}}
                    {{unitPrice.mapay}}
                  </p>
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
          <span>
            {{unitPrice.obpay}}
            {{items.dataBmoney}}
            {{unitPrice.mapay}}
          </span>
        </p>
        <p>
          配送运费
          <span>
            {{unitPrice.obpay}}
            {{items.goodsLogmoney}}
            {{unitPrice.mapay}}
          </span>
        </p>
        <p>
          包装袋
          <span>
            {{unitPrice.obpay}}
            {{items.goodsLogmoney}}
            {{unitPrice.mapay}}
          </span>
        </p>
        <!-- <p>优惠活动<span :style="{color:'#E40506'}">满100减10</span></p> -->
        <p>
          活动优惠
          <span :style="{color:'#E40506'}">
            -
            {{unitPrice.obpay}}
            {{items.goodsLogmoney}}
            {{unitPrice.mapay}}
          </span>
        </p>
      </div>
      <div class="orderDetail-count">
        实付款：
        <span :style="{color:'#E40506'}">
          {{unitPrice.obpay}}
          {{items.dataBmoney}}
          {{unitPrice.mapay}}
        </span>
      </div>
    </div>

    <!--弹窗的页面-->
    <div class="modalMask" v-show="isModel" @tap="tapCancel"></div>
    <div class="modalDialog" v-show="changeModel">
      <div class="modalContent">
        <div class="contentTip">
          <p>出示此二维码提货</p>
          <canvas
            class="canvas-code"
            canvas-id="myQrcode"
            bindlongtap="save"
            :style="{width:qrcode_w,height:qrcode_w}"
          ></canvas>
        </div>
      </div>
      <!-- <div class="modalFooter">
        <div class="btnCancel" @tap="tapCancel">取消</div>
        <div class="btnConfirm" @tap="confirmSend">确定</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import QRCode from "@/utils/weapp-qrcode.js";

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
      changeModel: false,
      isModel: false,
      qrcode_w: "",
      leftIcon: true,
      rightIcon: false,
      items: {},
      traces: [],
      baseColor: "",
      unitPrice: {},
      refundApply: "" //申请售后路径
      // userImgurl: require("../../../../../static/img/mine/default_header.png"),
    };
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
  mounted() {
    this.unitPrice = this.$state.unitPrice || $storage.get("unitPrice") || {};
    console.log(this.$state.orderMenu, "this.$state.orderMenu");
    this.$state.orderMenu.map(v => {
      if (v.menuAction == "refundApply") {
        this.refundApply = v.menuJspath;
      }
    });
    this.baseColor = "#" + this.$state.baseColor;
    this.params = this.$root.$mp.query;
    this.getOrderInfor(this.params);
    // let code = {
    //   contractBillcode:this.params.contractBillcode
    // }
    // http.get(getContractByCode,code).then(res=>{
    //   if(res){
    //     this.items = res;
    //     this.items.goodsList.map(val=>{
    //       if(!RegExp(/http/).test(val.dataPic)){
    //         val.dataPic=this.$domain+val.dataPic
    //       }
    //     })
    //   }
    // })
    // let prop = {
    //   expressType:this.params.expressType,
    //   expressNo:this.params.expressNo,
    // }
    // if(this.items.dataState==3 || this.items.dataState==4){
    //   http.get(refund.getExpressPageForProp,prop).then(res=>{
    //     this.traces = JSON.parse(res.dataObj).Traces
    //   })
    // }
  },
  components: {
    commonHeader
  },
  computed: {
    gmtCreate() {
      return formatDate(this.items.gmtCreate);
    }
    // styles1() {
    //   console.log(this.qrcode_w);
    //   return {
    //     width: this.qrcode_w,
    //     height: this.qrcode_w
    //   };
    // }
  },
  methods: {
    tapCancel() {
      console.log("取消");
      this.changeModel = false;
      this.isModel = false;
    },
    //  确认
    confirmSend() {
      console.log("确认");
      this.changeModel = false;
      this.isModel = false;
    },

    erweima(qrcode, billcode) {
      const W = wx.getSystemInfoSync().windowWidth;
      const rate = 750.0 / W;
      const qrcode_w = 300 / rate;
      this.qrcode_w = qrcode_w + "px";
      new QRCode("myQrcode", {
        text: qrcode,
        width: qrcode_w,
        height: qrcode_w,
        padding: 6, // 生成二维码四周自动留边宽度，不传入默认为0
        correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
        callback: res => {
          console.log(res.path);
          // 接下来就可以直接调用微信小程序的api保存到本地或者将这张二维码直接画在海报上面去，看各自需求
        }
      });
      this.changeModel = true;
      this.isModel = true;
    },

    getOrderInfor(obj) {
      let code = {
        contractBillcode: obj.contractBillcode
      };
      http.get(getContractByCode, code).then(res => {
        if (res) {
          this.items = res;
          this.items.goodsList.map(val => {
            if (!RegExp(/http/).test(val.dataPic)) {
              val.dataPic = this.$domain + val.dataPic;
            }
          });
        }
      });
      let prop = {
        expressType: obj.expressType,
        expressNo: obj.expressNo
      };
      if (this.items.dataState == 3 || this.items.dataState == 4) {
        http.get(refund.getExpressPageForProp, prop).then(res => {
          this.traces = JSON.parse(res.dataObj).Traces;
        });
      }
    },

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
      // $router.push('evaluate_modules/index')
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
.color-666 {
  color: #666;
  font-size: 24rpx;
  text-align: center;
}
.canvas-code {
  width: 200rpx;
  height: 200rpx;
}
/* 弹窗开始 */
.modalMask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
  overflow: hidden;
  z-index: 9000;
  color: #fff;
}
.modalDialog {
  box-sizing: border-box;
  width: 560rpx;
  overflow: hidden;
  position: fixed;
  top: 50%;
  left: 0;
  z-index: 9999;
  background: #fff;
  margin: -180rpx 95rpx;
  border-radius: 8rpx;
}
.modalContent {
  box-sizing: border-box;
  display: flex;
  padding: 50rpx 53rpx;
  font-size: 32rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.contentTip {
  text-align: center;
  font-size: 32rpx;
  padding: 20rpx 0;
  color: #333333;
}
.teleStyle {
  background: #ffffff;
  border: 1px solid #979797;
  border-radius: 6rpx;
  line-height: 50rpx;
  height: 50rpx;
  box-sizing: border-box;
  padding-left: 12rpx;
  width: 460rpx;
  font-size: 28rpx;
  /*color: rgba(0,0,0,0.25);*/
  margin-top: 30px;
}
.modalFooter {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  height: 100rpx;
  border-top: 1px solid #e5e5e5;
  font-size: 32rpx;
  line-height: 100rpx;
}
.btnCancel {
  width: 50%;
  font-size: 32rpx;
  color: #333;
  text-align: center;
  border-right: 1px solid #e5e5e5;
}
.btnConfirm {
  font-size: 32rpx;
  width: 50%;
  color: #508cee;
  text-align: center;
}
/* 弹窗结束 */

.orderDetail {
  width: 100%;
  background: #fafafa;
  .commonHeader {
    border-bottom: none;
  }
  .newStyle {
    margin-top: 120rpx;

    &-add {
      background: @white-color;
      display: block;
      width: 688rpx;
      height: auto;
      border-radius: 10rpx;
      overflow: hidden;
      padding: 0;
      padding-bottom: 36rpx;
      margin: 0 auto;
      margin-top: 16rpx;
      &-center {
        color: #333333;
        display: block;
        font-size: 30rpx;
        font-weight: 600;
        margin: 0 auto;
        text-align: center;
        margin-top: 20rpx;
        i {
          color: #168f3f;
          font-size: 34rpx;
          font-weight: bold;
          margin-right: 18rpx;
          display: inline;
        }
      }
      &-yj {
        color: #999999;
        font-weight: normal;
      }
      &-yh {
        margin-top: 36rpx;
      }
      .order-btn {
        margin-top: 20rpx;
        text-align: center;
        span {
          display: inline-block;
          border: 1rpx solid #d4d4d4;
          line-height: 46rpx;
          border-radius: 26rpx;
          padding: 0 20rpx;
          font-size: 22rpx;
          color: #666;
        }
        span:first-child {
          margin-right: 20rpx;
        }
      }
    }
  }

  &-box {
    margin-top: 90rpx;
    &-tit {
      height: 138rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: @white-color;
      background: #b79f78;
      padding: @padding-30;
      &-l {
        font-size: 32rpx;
        display: flex;
        align-items: center;
        i {
          margin-right: 15rpx;
        }
      }
      &-r {
        font-size: 28rpx;
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
  .operation-btn {
    text-align: center;
    margin-top: 26rpx;
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
  .buygoods-infor {
    width: 688rpx;
    border-radius: 10rpx;
    background: @white-color;
    margin: 0 auto;
    .orderDetail-goods {
      border-bottom: 1px solid #fafafa;
    }
    .orderDetail-info {
      border-bottom: 1px solid #fafafa;
    }
    .orderDetail-count {
      display: block;
      text-align: right;
      float: none;
      height: 70rpx;
      line-height: 70rpx;
      padding-bottom: 0;
    }
  }
  .shop-name {
    font-size: 28rpx;
    display: flex;
    padding: 20rpx 30rpx 0rpx 30rpx;
    p:first-child {
      flex: 1;
    }
    p:last-child {
      text-align: right;
      i {
        display: initial;
        margin-right: 10rpx;
      }
    }
  }
}
</style>




