<template>
  <div class="accounts" ref="accounts">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="accounts-back">
      <a>
        <span class="iconfont" @click="goBack">&#xe62d;</span>
      </a>
    </div>
    <!-- 选择配送方式 -->
    <div v-if="psType == 1">
      <div class="psType">
        <div class="ps" @click="psTypeClick" style="background-color:white">
          <!-- <img class="psImage" src="/static/img/address/ps_select@2x.png" alt /> -->
          <span
            class="iconfont"
            :style="{color:baseColor,'font-size':'42rpx'}"
            @click="goBack"
          >&#xe79c;</span>
          <div :style="{color:baseColor}">配送上门</div>
        </div>
        <div class="zt" @click="ztTypeClick" style="background-color:rgb(236, 236, 236)">
          <!-- <img class="psImage" src="/static/img/address/zt_unselect@2x.png" alt /> -->
          <span class="iconfont" style="color:#acacac" @click="goBack">&#xe79d;</span>
          <div style="color:#acacac">到店自提</div>
        </div>
      </div>
      <div class="accounts-haveAddress" v-if="isHaveAddress" @click="changeAddress">
        <div class="accounts-haveAddress-l">
          <h5>
            收货人：{{addressList.addressMember}}
            <span>{{addressList.addressPhone}}</span>
          </h5>
          <p>
            <span :style="{background:baseColor}">默认</span>
            {{addressList.roadName}}{{addressList.addressDetail}}
          </p>
        </div>
        <div class="accounts-haveAddress-r" @click="changeAddress">
          <i class="iconfont">&#xe61d;</i>
        </div>
      </div>
      <div class="accounts-noAddress" @click="changeAddress" v-else>
        <i class="iconfont">&#xe752;</i>
        添加收货地址
      </div>
      <!-- 选择配送时间 -->
      <!-- <div
        class="psTime"
        @click="timeTabShow"
        style="display: flex;flex-direction: row;background-color: white;border-bottom: 20rpx solid #f8f8f8;height:80rpx"
      >
        <div
          class="timeLeft"
          style="font-size: 24rpx;margin-left:20rpx;color: #aaaaaa;line-height: 80rpx;"
        >配送时间:</div>
        <div
          class="timeRight"
          style="font-size: 28rpx;position: absolute;right: 50rpx;line-height: 80rpx;display: flex;flex-direction: row;"
        >
          <div class="timeTitle" v-if="weeks == '今天'">{{psTime}}</div>
          <div class="timeTitle" v-else>{{psTime}}</div>
          <i class="iconfont">&#xe61d;</i>
        </div>
      </div>-->
    </div>
    <!-- 到店自提 -->
    <div v-if="psType==2">
      <div class="psType">
        <div class="ps" @click="psTypeClick" style="background-color:rgb(236, 236, 236)">
          <span class="iconfont" style="font-size:42rpx; color:#acacac" @click="goBack">&#xe79c;</span>
          <!-- <img class="psImage" src="/static/img/address/ps_unselect@2x.png" alt /> -->
          <div style="color:#acacac">配送上门</div>
        </div>
        <div class="zt" @click="ztTypeClick" style="background-color:white">
          <span class="iconfont" :style="{color:baseColor}" @click="goBack">&#xe79d;</span>
          <!-- <img class="psImage" src="/static/img/address/zt_select@2x.png" alt /> -->
          <div :style="{color:baseColor}">到店自提</div>
        </div>
      </div>
      <!-- 显示到店自提地址信息 -->
      <!-- {{showZtAddress}}{{ztAdressInfo.userinfoCompname}} -->
      <div class="accounts-haveAddress" v-if="showZtAddress" @click="changeZtAddress">
        <div class="accounts-haveAddress-l">
          <h5>{{ztAdressInfo.userinfoCompname}}</h5>
          <p>
            {{ztAdressInfo.provinceName}}
            {{ztAdressInfo.cityName}}
            {{ztAdressInfo.areaName }}
            {{ztAdressInfo.companyAddress}}
          </p>
        </div>
        <div class="accounts-haveAddress-r" @click="changeAddress">
          <i class="iconfont">&#xe61d;</i>
        </div>
      </div>
      <div class="accounts-noAddress" @click="changeZtAddress" v-else>
        <i class="iconfont">&#xe752;</i>
        添加自提地址
      </div>
      <!-- 选择自提时间 -->
      <!-- <div
        class="psTime"
        @click="timeTabShow"
        style="display: flex;flex-direction: row;background-color: white;border-bottom: 20rpx solid #f8f8f8;height:80rpx"
      >
        <div
          class="timeLeft"
          style="font-size: 24rpx;margin-left:20rpx;color: #aaaaaa;line-height: 80rpx;"
        >提货时间:</div>
        <div
          class="timeRight"
          style="font-size: 28rpx;position: absolute;right: 50rpx;line-height: 80rpx;display: flex;flex-direction: row;"
        >
          <div class="timeTitle" v-if="weeks == '今天'">{{ztTime}}</div>
          <div class="timeTitle" v-else>{{ztTime}}</div>
          <i class="iconfont">&#xe61d;</i>
        </div>
      </div>-->
    </div>

    <div v-if="shoppingItems&&shoppingItems.length>0"></div>
    <div class="accounts-info" v-for="(shoppingItem,index) in shoppingItems" :key="index">
      <div class="accounts-info-tit">{{shoppingItem.memberName}}</div>
      <div v-for="(list,listIndex) in shoppingItem.shoppingpackageList" :key="listIndex">
        <div>
          <div
            class="infoCenter"
            v-for="(goods,goodsIndex) in list.shoppingGoodsList"
            :key="goodsIndex"
          >
            <img :src="goods.dataPic" />
          </div>
          <div class="infoCenter" v-for="(gift,giftIndex) in list.giftList" :key="giftIndex">
            <img :src="gift.dataPic" />
            <div></div>
            <h2>
              <span :style="{color:baseColor,borderColor:baseColor}">赠品</span>
              {{gift.goodsName}}
            </h2>
            <h3>{{gift.skuName}}</h3>
            <h4>
              0
              <span>×1</span>
            </h4>
          </div>
        </div>
        <!-- <div class="accounts-info-money">共{{list.goodsNum}}件，小计：
            <span :style="{color:baseColor}" v-if="list.goodsMoney">¥{{list.goodsMoney}}</span>
        </div>-->
        <div class="infoNum">
          <div>
            共{{list.goodsNum}}件
            <i
              class="iconfont"
              style="margin-top:-160rpx;margin-left:40rpx;position: absolute;right: 10rpx;"
            >&#xe61d;</i>
          </div>
        </div>
        <!-- <div class="accounts-count1"> -->
        <!-- <div class="psTime" @click="gotoInvoice" style="display: flex;flex-direction: row;background-color: white;height:80rpx">
          <div class="timeLeft" style="font-size: 24rpx;color: #aaaaaa;line-height: 80rpx;">发票:</div>
          <div class="timeRight" style="font-size: 28rpx;position: absolute;right: 50rpx;line-height: 80rpx;display: flex;flex-direction: row;">
            <div class="timeTitle">{{isInvoice}}</div>
            <i class="iconfont">&#xe61d;</i>
          </div>
        </div>-->
        <div
          class="psTime"
          @click="gotoRemarks"
          style="display: flex;flex-direction: row;background-color: white;height:80rpx"
        >
          <div
            class="timeLeft"
            style="font-size: 24rpx;width:120rpx;color: #aaaaaa;line-height: 80rpx;"
          >订单备注:</div>
          <div>
            <div>
              <input
                style="margin-top:18rpx; margin-left:20rpx; font-size: 24rpx; width:520rpx"
                placeholder="请填写"
                v-model="list.packageRemark"
              />
            </div>
          </div>

          <!-- <div class="timeRight" style="font-size: 28rpx;position: absolute;right: 50rpx;line-height: 80rpx;display: flex;flex-direction: row;">
            <div class="timeTitle">{{isRemarks}}</div>
            <i class="iconfont">&#xe61d;</i>
          </div>-->
        </div>
        <!-- </div> -->
      </div>
    </div>

    <!-- {{unitPrice.obpay}}{{shoppingCountPrice}}{{unitPrice.mapay}} -->

    <div class="Deductioncenter">
      <!--<div class="center" v-if="psType == 2">
        <div
          class="DeductionLeft"
        >包装袋 {{unitPrice.obpay}}({{storeInfo.packingFee?storeInfo.packingFee:0}}{{unitPrice.mapay}})</div>
        <div class="DeductionRight" @click="selectBZD">
          <i class="iconfont" :style="{color:baseColor}" v-if="isSelectBZD">&#xe671;</i>
          <i class="iconfont" :style="{color:'#ededed'}" v-else>&#xe671;</i>
        </div>
      </div>-->
      <!-- <div class="center" v-if="upointsNum > 0">
          <div class="DeductionLeft">使用{{upointsNum}}积分抵扣{{unitPrice.obpay}}{{upointsNum/100}}{{unitPrice.mapay}}</div>
          <div class="DeductionRight" @click="selectJF">
            <i class="iconfont" :style="{color:baseColor}" v-if="isSelectJF">&#xe671;</i>
            <i class="iconfont" :style="{color:'#ededed'}" v-else>&#xe671;</i>
          </div>
      </div>-->
    </div>

    <div class="accounts-con">
      <div>
        优惠券
        <p @click="isShowPreferential">
          <span>{{selectPromotionName}}</span>
          <i class="iconfont">&#xe61d;</i>
        </p>
      </div>
    </div>
    <div class="accounts-count" v-if="psType == 1">
      <p>
        商品金额
        <span>{{unitPrice.obpay}}{{shoppingCountPrice}}{{unitPrice.mapay}}</span>
      </p>
      <!-- <p>
        活动优惠
        <span>-{{unitPrice.obpay}}{{totalDiscountPrice}}{{unitPrice.mapay}}</span>
      </p>-->
      <p>
        优惠券
        <span>-¥{{comDisMoney}}</span>
      </p>
      <p>
        配送费
        <span>{{unitPrice.obpay}}{{freight}}{{unitPrice.mapay}}</span>
      </p>
    </div>
    <div class="accounts-count" v-else>
      <p>
        商品金额
        <span>{{unitPrice.obpay}}{{shoppingCountPrice}}{{unitPrice.mapay}}</span>
      </p>
      <!-- <p>
        活动优惠
        <span>-{{unitPrice.obpay}}{{totalDiscountPrice}}{{unitPrice.mapay}}</span>
      </p>-->
      <p>
        优惠券
        <span>-¥{{comDisMoney}}</span>
      </p>
    </div>
    <div class="accounts-sum">
      <div class="moneySum">
        <p>
          应付金额:
          <i>{{unitPrice.obpay}}{{accountsSumPrice}}{{unitPrice.mapay}}</i>
        </p>
        <div
          class="zkMoney"
          v-if="psType == 1 && freight == 0"
        >已优惠{{unitPrice.obpay}}{{totalDiscountPrice}}{{unitPrice.mapay}} | 免费配送</div>
        <div
          class="zkMoney"
          v-if="psType == 1 && freight != 0"
        >已优惠{{unitPrice.obpay}}{{totalDiscountPrice}}{{unitPrice.mapay}} | 配送费{{unitPrice.obpay}}{{freight}}{{unitPrice.mapay}}</div>
        <div
          class="zkMoney"
          v-if="psType == 2"
        >已优惠{{unitPrice.obpay}}{{totalDiscountPrice}}{{unitPrice.mapay}}</div>
      </div>

      <span @click="savePayPrice" :style="{background:baseColor}">立即支付</span>
    </div>
    <div class="accounts-preferential" v-show="isShow">
      <div class="accounts-preferential-con">
        <p>
          优惠劵
          <i class="iconfont" @click="colse()">&#xe609;</i>
        </p>
        <ul v-if="couponList.length != 0">
          <li v-for="(coupon,couponIndex) in couponList" :key="couponIndex">
            <div class="pre-left">
              <h1>
                <i :style="{color:baseColor}">{{coupon.pbName}}</i>
                {{coupon.discStart}}
              </h1>
              <h2 v-if="coupon.dataState == 0 && coupon.pbCode === '0004'">{{coupon.discName}}</h2>
              <h2 v-else></h2>
            </div>
            <div class="pre-center">
              <h3>{{coupon.promotionName}}</h3>
              <h4>{{coupon.couponStart}}至{{coupon.couponEnd}}</h4>
            </div>
            <div class="pre-right">
              <i
                class="iconfont"
                :style="{color:couponIndex===currentIndex?baseColor:'#e0e0e0'}"
                @click="checkCoupon(coupon,couponIndex)"
              >&#xe671;</i>
            </div>
          </li>
        </ul>
        <div class="no-prom" v-if="couponList.length == 0">
          <img :src="nullImg" />
        </div>
        <div class="pre-btn" :style="{background:baseColor}" @click="couponOK">确认</div>
      </div>
    </div>
    <!-- 时间选择 -->
    <div class="delivery_time" @click="cancelChoose" v-if="timeTab">
      <div class="timeBar">
        <div class="left_bar">
          <span>{{weeks}}（周{{weekdays[weekdayIndex]}}）</span>
        </div>
        <div class="right_bar">
          <div class="choose_time">
            <div
              class="time_item"
              v-for="(item, index) in timeDatas"
              :key="index"
              @click="chooseTime(index)"
            >
              <span>{{item}}</span>
              <img src="/static/img/address/y@2x.png" alt v-if="index == timeIndex " />
            </div>
          </div>
        </div>
      </div>
      <div class="cancelChoose" @click="cancelChoose">取消</div>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import {
  addressList,
  queryToContract,
  calculateFreightFare,
  getTotalDiscountPrice,
  queryShoppingToContract,
  saveContract,
  syncContractState,
  addContractSub,
  saveOrderSubToPay,
  paymentCommit,
  coupon,
  getStoreInfo,
  integral,
  getSecretKeyCodeByconfigType
} from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
import { formatTimes } from "@/utils/prototype/date.js";
import { QQMapWX } from "@/utils/location/qqmap-wx-jssdk.js";
var qqmapsdk;
export default {
  data() {
    return {
      title: "确认订单",
      leftIcon: false,
      rightIcon: false,
      isHaveAddress: false, //判断是否存在地址
      showZtAddress: false, //判断是否存在地址
      addressList: {},
      shoppingItems: [],
      totalDiscountPrice: 0.0, //权益差价
      shoppingCountPrice: 0, //商品总金额
      accountsSumPrice: 0.0, //最后应付金额
      discount: 0.0, //优惠劵
      freight: 0.0, //运费
      comDisMoney: 0.0, //优惠
      copyComDisMoney: 0.0, // 复制一份优惠值
      contractGoodsList: [], //结算时候需要将所有的商品信息传过去
      scontractBlance: "", // 结算方式 0 全款 1 订金 2 分次 3 分期    多个用,分割
      scontractPmode: "", // 付款方式 0 线上、 1 线下  2 不付款  多个用,分割
      orderDomainStr: [],
      contractBillcode: "",
      contractSubCode: "",
      ptradeSeqno: "", //支付流水号
      query: {},
      baseColor: "",
      isShow: false, //优惠劵弹窗
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/no_coupon.png",
      couponList: [], //优惠劵列表
      currentIndex: -1,
      currentCoupon: {},
      pmContractGoodsDomainListStr: [], // 获取优惠劵列表需要传所有商品的参数
      selectPromotionName: "", // 选中的优惠劵名字
      // userImgurl: require("../../../../static/img/mine/default_header.png"),
      psType: 1, // 配送方式 1为送货上门  2 为到店自提
      psTime: "尽快送达", // 配送时间选择
      ztTime: "请选择", // 自提时间
      serviceTime: "", // 提交后台的参数  预计送达时间
      timeTab: false,
      remarkS: true,
      weekdays: ["日", "一", "二", "三", "四", "五", "六"],
      weekdayIndex: 0,
      weeks: "今天", // 显示今天还是明天
      timeDatas: [],
      timeIndex: 0,
      isInvoice: "不开发票",
      isRemarks: "默认: 缺货时电话联系",
      isSelectJF: false, // 是否选择积分抵扣
      isSelectBZD: false, // 是否选择包装袋
      BZDPric: "0", //包装费
      storeOpenTime: "08:30", // 门店开门时间
      storeCloseTime: "12:30", // 门店关门时间
      storeAddress: "", // 门店地址
      storeInfo: {}, // 获取到的门店信息
      ztAdressInfo: {}, // 获取到的门店信息
      psAdress: "", //配送地址
      groupCode: "",
      groupname: "",
      upointsNum: 0 // 可用积分
    };
  },
  watch: {
    psType(val) {
      console.log(val, "监听值");
    }
  },
  onLoad(options) {
    if ($storage.get("mappPssword")) {
      this.mapPass = $storage.get("mappPssword");
      qqmapsdk = new QQMapWX({
        key: this.mapPass
      });
    } else {
      http
        .get(getSecretKeyCodeByconfigType, { oauthEnvconfigType: "secretKid" })
        .then(res => {
          if (res.success) {
            this.mapPass = res.dataObj;
            qqmapsdk = new QQMapWX({
              key: this.mapPass
            });
          }
        });
    }

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
    //判断是否是h5详情页跳转过来的
    if (options && options.json) {
      let attr = JSON.parse(options.json);
      $storage.set("pageRouter", "0");
      $storage.set("beforeRouter", "h5");
      $storage.set("htmlMessage", attr);
    } else {
      if ($storage.get("beforeRouter") != "h5") {
        $storage.set("pageRouter", prevpage.route);
      }
    }
    if (options && options.date == "2") {
      this.psType = 2;
    }
    this.getIntegralJF();
  },
  onShow() {
    if ($storage.get("psAddress") != "") {
      this.addressList = $storage.get("psAddress");
    }
    if ($storage.get("zitiAddress") != "") {
      this.ztAdressInfo = $storage.get("zitiAddress");
      this.showZtAddress = true;
    } else {
      this.showZtAddress = false;
    }
  },
  computed: {
    // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
    unitPrice() {
      return this.$state.unitPrice || $storage.get("unitPrice");
    },
    createTime() {
      // 配送时间
      let l_now = new Date();
      // console.log('-----时间',l_now.getHours(),l_now.getDay())
      var temTime = l_now.getHours() + ":00";
      if (temTime >= this.storeOpenTime && temTime <= this.storeCloseTime) {
        // 在当天的营业时间段内  显示今天日期
        this.weekdayIndex = l_now.getDay();
        this.weeks = "今天";
      } else {
        // 不在当天时间段内 显示明天的日期
        if (l_now.getDay() + 1 >= 7) {
          this.weekdayIndex = 0;
        } else {
          this.weekdayIndex = l_now.getDay() + 1;
        }
        this.weeks = "明天";
      }
      l_now.setMinutes(
        l_now.getMinutes() + (wx.getStorageSync("store").waitTime || 30),
        l_now.getSeconds(),
        0,
        0
      );
      // 配送待选时间
      l_now = new Date();
      let timeStep = 20; // 时间跨度
      let nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      //  这是当前时间到凌晨还有多少分钟
      let minutes = Math.floor((nextDay - l_now) / 1000 / 60);
      let remainder = minutes % 60;
      let multiple = parseInt(minutes / 60);

      let timeArr = new Array();
      timeArr.push("00:00");
      for (let i = multiple; i > 0; i--) {
        nextDay.setMinutes(nextDay.getMinutes() - 60, 0, 0);
        timeArr.push(
          (nextDay.getHours() < 10
            ? "0" + nextDay.getHours()
            : nextDay.getHours()) +
            ":" +
            (nextDay.getMinutes() < 10
              ? "0" + nextDay.getMinutes()
              : nextDay.getMinutes())
        );
      }
      timeArr.reverse();
      this.timeDatas = [];
      timeArr.forEach(ele => {
        if (ele >= this.storeOpenTime && ele <= this.storeCloseTime) {
          // 在当天的营业时间段内  显示今天的时间段
          this.timeDatas.push(ele);
        }
      });
      // 如果是不在今天的营业时间呢 显示明天的银业时间段
      // 开店时间              关门时间
      // this.storeOpenTime   this.storeCloseTime
      if (this.weeks == "明天") {
        let openTime = this.storeOpenTime;
        let closeTime = this.storeCloseTime;
        if (openTime && openTime.indexOf(":") >= 0) {
          openTime = parseInt(openTime.replace(/:/g, ""));
        }
        if (closeTime && closeTime.indexOf(":") >= 0) {
          closeTime = parseInt(closeTime.replace(/:/g, ""));
        }
        for (let i = 0; i < 24; i++) {
          if (openTime < closeTime) {
            openTime += 100;
            let timeItem = openTime.toString();
            if (timeItem.length == 3) {
              timeItem = "0" + timeItem;
            }
            let afterTemp = timeItem.substring(2, 4);
            if (afterTemp != "00") {
              afterTemp = "00";
            }
            timeItem = timeItem.substring(0, 2);
            let item = timeItem + ":" + afterTemp;
            this.timeDatas.push(item);
          }
        }
      }
      // console.log('=======this.timeDatas',this.timeDatas)
      // bug已处理，底部遮住看不见最后一个了。。。。。。。。。
      this.timeDatas.push("");
    }
  },
  mounted() {
    this.groupName = $storage.get("groupName") ? $storage.get("groupName") : "";
    this.groupCode = $storage.get("groupCode") ? $storage.get("groupCode") : "";
    this.discount = 0;
    this.currentIndex = -1;
    this.freight = 0;
    this.baseColor = "#" + this.$state.baseColor;
    this.shoppingCountPrice = 0;
    //地址接口
    let shoppingGoodsIdStr = JSON.stringify(this.$state.shoppingGoodsIdStr);
    let rsSkuListStr = JSON.stringify(this.$state.rsSkuListStr);
    http
      .get(addressList)
      .then(res => {
        if (res && res.length > 0 && res[0].addressDefault == "1") {
          this.isHaveAddress = true;
          this.addressList = res[0];
        } else {
          this.isHaveAddress = false;
        }
      })
      .then(() => {
        if (this.$root.$mp.query.addressMember) {
          this.isHaveAddress = true;
          this.addressList = this.$root.$mp.query;
        }

        // console.log($storage.get('htmlMessage'))
        //商品总价+ 商品列表
        let params =
          $storage.get("pageRouter") == "0"
            ? $storage.get("htmlMessage")
            : { shoppingGoodsIdStr: shoppingGoodsIdStr };
        // console.log(params,'params')
        http
          .post(
            $storage.get("pageRouter") == "0"
              ? queryToContract
              : queryShoppingToContract,
            params
          )
          .then(res => {
            if (res) {
              this.shoppingItems = res;
              // console.log('-----shoppingItems---',this.shoppingItems);
              this.shoppingItems.map(v => {
                v.shoppingpackageList.map(vk => {
                  //vk.shoppingGoodsList = [...vk.shoppingGoodsList,...vk.giftList]
                  this.comDisMoney += vk.disMoney;
                  this.copyComDisMoney += vk.disMoney;

                  vk.shoppingGoodsList.map(val => {
                    val.dataPic = this.$domain + val.dataPic;
                    this.contractGoodsList.push(val);
                    this.pmContractGoodsDomainListStr.push(val);
                  });
                  if (vk.giftList) {
                    vk.giftList.map(val => {
                      val.dataPic = this.$domain + val.dataPic;
                      this.contractGoodsList.push(val);
                    });
                  }
                });
              });

              //运费接口
              let _htmlMessage = [];
              if ($storage.get("pageRouter") == "0") {
                _htmlMessage.push($storage.get("htmlMessage"));
              }

              let freightFare =
                $storage.get("pageRouter") == "0"
                  ? {
                      skuIdStr: JSON.stringify(_htmlMessage),
                      areaCode: this.addressList.areaCode
                    }
                  : {
                      areaCode: this.addressList.areaCode,
                      shoppingGoodsIdStr: shoppingGoodsIdStr
                    };

              http
                .post(calculateFreightFare, freightFare)
                .then(res => {
                  if (res && res.success) {
                    this.freight = res.dataObj;
                  } else {
                    if ((res.errorCode = "-1")) {
                      $message.alert(res.msg);
                    }
                  }
                })
                .then(() => {
                  this.shoppingItems.map((v, k) => {
                    v.shoppingpackageList.map(vk => {
                      vk.shoppingGoodsList.map((val, index) => {
                        // console.log(val.pricesetNprice,'val.pricesetNprice')
                        // console.log(val.goodsCamount,'goodsCamount')
                        this.shoppingCountPrice +=
                          val.pricesetNprice * val.goodsCamount;
                      });
                    });

                    if (this.psType == 1) {
                      // 配送上门 要算上运费
                      this.accountsSumPrice = (
                        this.shoppingCountPrice -
                        this.totalDiscountPrice -
                        this.discount -
                        this.comDisMoney +
                        this.freight
                      ).toFixed(2);
                    } else {
                      // 门店自提不要运费
                      this.accountsSumPrice = (
                        this.shoppingCountPrice -
                        this.totalDiscountPrice -
                        this.discount -
                        this.comDisMoney
                      ).toFixed(2);
                    }
                    this.shoppingCountPrice = this.shoppingCountPrice;
                  });
                });
              //用户权益差价
              let skuList = { rsSkuListStr: rsSkuListStr };
              http.post(getTotalDiscountPrice, skuList).then(res => {
                if (res && res.success) {
                  this.totalDiscountPrice = res.dataObj.totalDiscountPrice;
                }
              });

              // 查询营业时间等接口 userinfoCode: $storage.get("shopinforCode")
              // let storeCode = {userinfoCode:'13101040828385'}
              let storeCode = {
                userinfoCode: "10000210819705"
              };
              http.get(getStoreInfo, storeCode).then(res => {
                console.log("----营业时间-----", res);
                this.storeInfo = res;
                this.storeOpenTime = res.storeOpenTime;
                this.storeCloseTime = res.storeCloseTime;
                this.storeAddress =
                  res.provinceName +
                  res.cityName +
                  res.areaName +
                  res.companyAddress;
              });
            }
          });
      });
  },
  components: {
    commonHeader
  },
  watch: {
    accountsSumPrice(v) {
      return parseFloat(
        (
          this.shoppingCountPrice -
          this.totalDiscountPrice -
          this.comDisMoney +
          this.freight
        ).toFixed(2)
      );
    },
    discount() {
      this.accountsSumPrice = parseFloat(
        (
          this.shoppingCountPrice -
          this.totalDiscountPrice -
          this.comDisMoney +
          this.freight
        ).toFixed(2)
      );
    }
  },
  methods: {
    colse() {
      this.isShow = false;
    },
    goBack() {
      $storage.set("htmlMessage", "");
      $storage.set("pageRouter", "");
      $router.back(1, { stay: 500 });
    },
    psTypeClick() {
      this.psType = 1;
      this.accountsSumPrice = (
        this.shoppingCountPrice -
        this.totalDiscountPrice -
        this.discount -
        this.comDisMoney +
        this.freight
      ).toFixed(2);
      if (this.isSelectJF) {
        this.accountsSumPrice = (
          this.shoppingCountPrice -
          this.totalDiscountPrice -
          this.discount -
          this.comDisMoney +
          this.freight -
          this.upointsNum / 100
        ).toFixed(2);
      }
    },
    ztTypeClick() {
      this.psType = 2;
      // 自提不加配送费
      this.accountsSumPrice = (
        this.shoppingCountPrice -
        this.totalDiscountPrice -
        this.discount -
        this.comDisMoney
      ).toFixed(2);
      this.BZDPric = this.storeInfo.packingFee ? this.storeInfo.packingFee : 0;
      if (this.isSelectJF) {
        if (this.isSelectBZD) {
          this.accountsSumPrice = (
            this.shoppingCountPrice -
            this.totalDiscountPrice -
            this.discount -
            this.comDisMoney -
            this.upointsNum / 100 +
            this.BZDPric
          ).toFixed(2);
        } else {
          this.accountsSumPrice = (
            this.shoppingCountPrice -
            this.totalDiscountPrice -
            this.discount -
            this.comDisMoney -
            this.upointsNum / 100
          ).toFixed(2);
        }
      } else {
        if (this.isSelectBZD) {
          this.accountsSumPrice = (
            this.shoppingCountPrice -
            this.totalDiscountPrice -
            this.discount -
            this.comDisMoney +
            this.BZDPric
          ).toFixed(2);
        } else {
          this.accountsSumPrice = (
            this.shoppingCountPrice -
            this.totalDiscountPrice -
            this.discount -
            this.comDisMoney
          ).toFixed(2);
        }
      }
      // console.log('点击了到店自提',this.psType)
    },
    // 展示时间面板
    timeTabShow() {
      this.timeTab = true;
    },
    cancelChoose() {
      this.timeTab = false;
    },

    getDayNumByYearMonth(year, month) {
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31;
          break;
        case 4:
        case 6:
        case 9:
        case 11:
          return 30;
          break;
        case 2:
          this.actions.isLeapYear(year) ? 29 : 28;
      }
    },

    // 选择时间
    chooseTime(index) {
      this.timeIndex = index;
      let date = new Date();
      let check = this.getDayNumByYearMonth(
        date.getFullYear(),
        date.getMonth()
      );
      //   console.log(check,"check00000000000000000")
      // console.log('选择时间-index：',this.timeIndex)
      if (this.psType == 1) {
        this.psTime = this.timeDatas[index];
        if (this.weeks == "明天") {
          this.psTime = "预约明天" + this.psTime + "配送";
          if (date.getMonth() < "12") {
            if (check == "31" && date.getDate() == "31") {
              let Years = date.getFullYear();
              let Month = date.getMonth() + 1;
              let Date = "01";
            } else if (check == "30" && date.getDate() == "30") {
              let Years = date.getFullYear();
              let Month = date.getMonth() + 1;
              let Date = "01";
            } else if (check == "29" && date.getDate() == "29") {
              let Years = date.getFullYear();
              let Month = date.getMonth() + 1;
              let Date = "01";
            } else if (check == "28" && date.getDate() == "28") {
              let Years = date.getFullYear();
              let Month = date.getMonth() + 1;
              let Date = "01";
            } else {
              let Years = date.getFullYear();
              let Month = date.getMonth();
              let Dates = date.getDate();
            }
          } else if (date.getMonth() == "12") {
            if (check == "31" && date.getDate() == "31") {
              let Years = date.getFullYear() + 1;
              let Month = "01";
              let Date = "01";
            }
          }
          this.serviceTime =
            Years + "-" + Month + "-" + Dates + "" + this.timeDatas[index];
          //   if (
          //     check == "31" ||
          //     check == "30" ||
          //     check == "29" ||
          //     check == "28"
          //   ) {
          //     let Month = date.getMonth() + 1;
          //     let Date = "01";
          //   } else {
          //     let Month = date.getMonth();
          //     let Dates = date.getDate();
          //   }
          //   this.serviceTime =date.getFullYear() + "-" + Month + "-" + Dates + "" + this.timeDatas[index];
          //   this.serviceTime = new Date(nowDta).getTime();
        } else {
          this.serviceTime =
            date.getFullYear() +
            "-" +
            date.getMonth() +
            "-" +
            date.getDate() +
            "" +
            this.timeDatas[index];
          //   this.serviceTime = new Date(nowDta).getTime();
        }
      } else {
        this.ztTime = this.timeDatas[index];
        if (this.weeks == "明天") {
          this.ztTime = "预约明天" + this.ztTime + "到店自提";
          if (date.getMonth() < "12") {
            if (check == "31" && date.getDate() == "31") {
              let Years = date.getFullYear();
              let Month = date.getMonth() + 1;
              let Date = "01";
            } else if (check == "30" && date.getDate() == "30") {
              let Years = date.getFullYear();
              let Month = date.getMonth() + 1;
              let Date = "01";
            } else if (check == "29" && date.getDate() == "29") {
              let Years = date.getFullYear();
              let Month = date.getMonth() + 1;
              let Date = "01";
            } else if (check == "28" && date.getDate() == "28") {
              let Years = date.getFullYear();
              let Month = date.getMonth() + 1;
              let Date = "01";
            } else {
              let Years = date.getFullYear();
              let Month = date.getMonth();
              let Dates = date.getDate();
            }
          } else if (date.getMonth() == "12") {
            if (check == "31" && date.getDate() == "31") {
              let Years = date.getFullYear() + 1;
              let Month = "01";
              let Date = "01";
            }
          }
          this.serviceTime =
            Years + "-" + Month + "-" + Dates + " " + this.timeDatas[index];
          //   if (
          //     check == "31" ||
          //     check == "30" ||
          //     check == "29" ||
          //     check == "28"
          //   ) {
          //     let Month = date.getMonth() + 1;
          //     let Date = "01";
          //   } else {
          //     let Month = date.getMonth();
          //     let Dates = date.getDate();
          //   }
          //   this.serviceTime =
          //     date.getFullYear() +
          //     "-" +
          //     Month +
          //     "-" +
          //     Dates +
          //     " " +
          //     this.timeDatas[index];
          //   this.serviceTime = new Date(nowDta).getTime();
        } else {
          this.serviceTime =
            date.getFullYear() +
            "-" +
            date.getMonth() +
            "-" +
            date.getDate() +
            " " +
            this.timeDatas[index];
          //   this.serviceTime = new Date(nowDta).getTime();
        }
      }
      this.timeTab = false;
    },
    // 选择配送地址
    changeAddress() {
      $router.push("o2o/pages/address_modules/address_manager", { data: 1 });
    },
    changeZtAddress() {
      $router.push("o2o/pages/address_modules/ztAddress_manager", { data: 1 });
    },
    gotoInvoice() {},
    gotoRemarks() {},
    selectJF() {
      this.isSelectJF = !this.isSelectJF;
      if (this.isSelectJF && this.psType == 1) {
        // 选择了积分抵扣并 是 配送方式的
        this.accountsSumPrice = (
          this.shoppingCountPrice -
          this.totalDiscountPrice -
          this.discount -
          this.comDisMoney +
          this.freight -
          this.upointsNum / 100
        ).toFixed(2);
      } else if (this.isSelectJF && this.psType == 2) {
        // 选择了积分抵扣并 是 上门自提的
        if (this.isSelectBZD) {
          this.BZDPric = this.storeInfo.packingFee
            ? this.storeInfo.packingFee
            : 0;
          this.accountsSumPrice = (
            this.shoppingCountPrice -
            this.totalDiscountPrice -
            this.discount -
            this.comDisMoney -
            this.upointsNum / 100 +
            this.BZDPric
          ).toFixed(2);
        } else {
          this.accountsSumPrice = (
            this.shoppingCountPrice -
            this.totalDiscountPrice -
            this.discount -
            this.comDisMoney -
            this.upointsNum / 100
          ).toFixed(2);
        }
      } else if (this.isSelectJF == false) {
        if (this.psType == 1) {
          this.accountsSumPrice = (
            this.shoppingCountPrice -
            this.totalDiscountPrice -
            this.discount -
            this.comDisMoney +
            this.freight
          ).toFixed(2);
        } else {
          // 未选择积分 的自提订单
          this.BZDPric = this.storeInfo.packingFee
            ? this.storeInfo.packingFee
            : 0;
          if (this.isSelectBZD) {
            this.accountsSumPrice = (
              this.shoppingCountPrice -
              this.totalDiscountPrice -
              this.discount -
              this.comDisMoney +
              this.BZDPric
            ).toFixed(2);
          } else {
            this.accountsSumPrice = (
              this.shoppingCountPrice -
              this.totalDiscountPrice -
              this.discount -
              this.comDisMoney
            ).toFixed(2);
          }
        }
      }
      console.log("------是否选中积分抵扣", this.isSelectJF);
    },
    selectBZD() {
      this.isSelectBZD = !this.isSelectBZD;
      if (this.psType == 2) {
        if (this.isSelectBZD) {
          this.BZDPric = this.storeInfo.packingFee
            ? this.storeInfo.packingFee
            : 0;
          if (this.isSelectJF) {
            // 选中包装袋  并且选中了 积分抵扣
            this.accountsSumPrice = (
              this.shoppingCountPrice -
              this.totalDiscountPrice -
              this.discount -
              this.comDisMoney +
              this.BZDPric -
              this.upointsNum / 100
            ).toFixed(2);
          } else {
            // 选中包装袋  并且没有选中积分抵扣
            this.accountsSumPrice = (
              this.shoppingCountPrice -
              this.totalDiscountPrice -
              this.discount -
              this.comDisMoney +
              this.BZDPric
            ).toFixed(2);
          }
        } else {
          // 未选择包装袋 选中了积分抵扣
          if (this.isSelectJF) {
            this.accountsSumPrice = (
              this.shoppingCountPrice -
              this.totalDiscountPrice -
              this.discount -
              this.comDisMoney -
              this.upointsNum / 100
            ).toFixed(2);
          } else {
            // 未选择包装袋 也没选择积分抵扣
            this.accountsSumPrice = (
              this.shoppingCountPrice -
              this.totalDiscountPrice -
              this.discount -
              this.comDisMoney
            ).toFixed(2);
          }
        }
      }

      console.log("------是否选中包装袋", this.isSelectBZD);
    },

    // 获取积分
    getIntegralJF() {
      http.get(integral.getUpmupointsPageByPC).then(res => {
        console.log("----获取到的积分-----", res);
        if (res) {
          this.upointsNum = res.upointsNum;
        }
      });
    },
    // addClass(){
    // console.log('--------呵呵呵')
    // $router.push('address_modules/address_manager',{data:1})
    // this.$state.columnList.map(v=>{
    //   if(v.menuAction=='selectAddress'){
    //     $router.replace(v.menuJspath)
    //   }
    // })
    // },
    isShowPreferential() {
      http
        .post(coupon.couponListcar, {
          pmContractGoodsDomainListStr: JSON.stringify(
            this.pmContractGoodsDomainListStr
          )
        })
        .then(res => {
          if (res) {
            this.couponList = res;
            this.couponList.map(v => {
              v.couponStart = formatTimes(v.couponStart);
              v.couponEnd = formatTimes(v.couponEnd);
            });
          }
        });
      if (this.isShow) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    checkCoupon(coupon, couponIndex) {
      this.currentIndex = couponIndex;
      this.currentCoupon = coupon;
      // console.log(this.currentCoupon);
    },
    couponOK() {
      if (this.currentCoupon.discAmount > this.shoppingCountPrice) {
        $message.alert("该优惠劵不满足条件，请使用其他优惠劵");
        this.currentCoupon = {};
      } else {
        this.isShow = false;
        this.selectPromotionName = this.currentCoupon.promotionName;
        if (Object.keys(this.currentCoupon).length > 0) {
          if (
            this.currentCoupon.pbCode === "0003" ||
            this.currentCoupon.pbCode === "0004"
          ) {
            this.discount = this.currentCoupon.discAmount;
            this.comDisMoney = this.copyComDisMoney + this.discount;
            //this.accountsSumPrice = this.accountsSumPrice-this.currentCoupon.pmPromotion.pmPromotionDiscountList[0].discAmount
          }
          if (this.currentCoupon.pbCode === "0005") {
            this.discount =
              this.shoppingCountPrice *
              parseFloat(1 - this.currentCoupon.discAmount / 100).toFixed(10);
            this.comDisMoney = this.copyComDisMoney + this.discount;
            //this.accountsSumPrice = this.accountsSumPrice*(this.currentCoupon.pmPromotion.pmPromotionDiscountList[0].discAmount/100)
          }
          // if(this.currentCoupon.dataState == 0 && this.currentCoupon.pbCode === '0004'){
          //   this.discount = this.currentCoupon.condResultAmount
          //   this.comDisMoney = this.comDisMoney + this.discount
          // //this.accountsSumPrice = this.accountsSumPrice-this.currentCoupon.pmPromotion.pmPromotionConditionList[0].condResultAmount
          // }
        }
      }
    },
    savePayPrice() {
      // let shoppingGoodsIdStr = this.$state.shoppingGoodsIdStr;
      // console.log('--------立即支付-',shoppingGoodsIdStr);
      // console.log('--------预计送达时间',this.serviceTime);
      // console.log('--------配送方式',this.psType)
      var tjpsType;
      if (this.psType == 1) {
        tjpsType = 0;
      } else if (this.psType == 2) {
        tjpsType = 1;
      }
      // console.log('最后的配送方式---',tjpsType);
      this.orderDomainStr = [];
      let _htmlMessage = [];
      //商品详情直接下单
      if ($storage.get("pageRouter") == "0") {
        _htmlMessage.push($storage.get("htmlMessage"));
      }
      let htmlDomainStr = [
        {
          contractProperty: "0", //订单性质
          contractTypepro: $storage.get("contractTypepro")
            ? $storage.get("contractTypepro")
            : "0", //订单类型属性(引合同、发货/中转)
          contractBlance: this.scontractBlance || 0, //结算方式:全款、订金、融资
          contractPmode: this.scontractPmode || 0, //付款方式：场内、场外，即线上、线下
          contractPumode: tjpsType, //提货方式   0是配送 , 1是自提
          goodsSupplierName:
            tjpsType == 1 ? "" : this.ztAdressInfo.userinfoCompname, //配送商
          goodsSupplierCode:
            tjpsType == 1 ? "" : this.ztAdressInfo.userinfoCode, //配送商Code
          packageList: [],
          packageMode: "", //配送方式
          ContractEffectivedate: this.serviceTime, // 预计送达时间
          // 加入是否选中积分
          JF: this.isSelectJF, // 是否选中积分
          contractPaymoney: this.BZDPric, // 是否选中包装袋
          contractType: this.shoppingItems[0].shoppingType,
          ocContractSettlList:
            Object.keys(this.currentCoupon).length > 0
              ? [
                  {
                    contractSettlBlance: "COP",
                    contractPmode: "0",
                    contractSettlGmoney: Number(
                      this.currentCoupon.couponAmount
                    ),
                    contractSettlPmoney: this.discount,
                    contractSettlOpno: this.currentCoupon.usercouponCode,
                    contractSettlOpemo: this.currentCoupon.promotionCode
                  }
                ]
              : [],
          contractInmoney: (
            Number(this.shoppingCountPrice) -
            this.copyComDisMoney +
            Number(this.freight.toFixed(2))
          ).toFixed(2), //  销售含税金额 (优惠前)
          contractMoney: (
            Number(this.shoppingCountPrice) -
            this.copyComDisMoney -
            Number(this.discount.toFixed(2))
          ).toFixed(2), // 最终销售含税金额 (优惠后)
          goodsReceiptMem: this.addressList.addressMember, //收货人
          goodsReceiptPhone: this.addressList.addressPhone, //收货联系方式
          goodsReceiptArrdess:
            tjpsType != 1
              ? this.addressList.provinceName +
                this.addressList.cityName +
                this.addressList.areaName +
                this.addressList.addressDetail
              : this.ztAdressInfo.provinceName +
                this.ztAdressInfo.cityName +
                this.ztAdressInfo.areaName +
                this.ztAdressInfo.companyAddress, //自提地址
          areaCode: this.addressList.areaCode, //从地址上面带过来`
          contractNbillcode: this.shoppingItems[0].contractNbillcode,
          skuIdList: _htmlMessage,
          giftSkuIdList: [],
          memberCcode:
            this.groupCode && this.groupCode != null && this.groupCode != "null"
              ? this.groupCode
              : "",
          memberCname:
            this.groupName && this.groupName != null && this.groupName != "null"
              ? this.groupName
              : ""
        }
      ];

      console.log(htmlDomainStr, "哈哈哈哈哈");
      this.shoppingItems.map((v, index) => {
        this.orderDomainStr.push({
          contractProperty: "0", //订单性质
          contractTypepro: $storage.get("contractTypepro")
            ? $storage.get("contractTypepro")
            : "0", //订单类型属性(引合同、发货/中转)
          contractBlance: this.scontractBlance || 0, //结算方式:全款、订金、融资
          contractPmode: this.scontractPmode || 0, //付款方式：场内、场外，即线上、线下
          contractPumode: tjpsType, //提货方式    0,为外卖配送  1,为门店自提
          goodsSupplierName: "", //配送商
          goodsSupplierCode: "", //配送商Code
          packageMode: "", //配送方式
          ContractEffectivedate: this.serviceTime, // 预计送达时间
          memberCcode:
            $storage.get("contractTypepro") == 40
              ? $storage.get("groupCode")
              : "", // 加上40为社区团购订单
          memberCname:
            $storage.get("contractTypepro") == 40
              ? $storage.get("groupName")
              : "", // 加上40为社区团购订单
          goodsSupplierName:
            tjpsType == 1 && $storage.get("contractTypepro") == 40
              ? $storage.get("zitiAddress").userinfoCompname ||
                this.ztAdressInfo.userinfoCompname
              : "", //加上40为社区团购订单
          goodsSupplierCode:
            tjpsType == 1 && $storage.get("contractTypepro") == 40
              ? $storage.get("zitiAddress").userinfoCode ||
                this.ztAdressInfo.userinfoCode
              : "", //加上40为社区团购订单
          // 加入是否选中积分  这个后面改成定义的字段
          JF: this.isSelectJF, // 是否选中积分
          contractPaymoney: this.BZDPric, // 是否选中包装袋
          contractType: v.shoppingType,
          packageList: [],
          //contractType: this.$state.shoppingType[index].shoppingType,
          ocContractSettlList:
            Object.keys(this.currentCoupon).length > 0
              ? [
                  {
                    contractSettlBlance: "COP",
                    contractPmode: "0",
                    contractSettlGmoney: Number(
                      this.currentCoupon.couponAmount
                    ),
                    contractSettlPmoney: this.discount,
                    contractSettlOpno: this.currentCoupon.usercouponCode,
                    contractSettlOpemo: this.currentCoupon.promotionCode
                  }
                ]
              : [],
          // shoppingGoodsIdList:this.$state.shoppingGoodsIdStr,
          contractInmoney: (
            Number(this.accountsSumPrice) -
            this.copyComDisMoney +
            Number(this.freight.toFixed(2))
          ).toFixed(2), //  销售含税金额 (优惠前)
          contractMoney: (
            Number(this.accountsSumPrice) -
            this.copyComDisMoney -
            Number(this.discount.toFixed(2))
          ).toFixed(2), // 最终销售含税金额 (优惠后)
          goodsReceiptMem: this.addressList.addressMember, //收货人
          goodsReceiptArrdess:
            tjpsType != 1
              ? this.addressList.provinceName +
                this.addressList.cityName +
                this.addressList.areaName +
                this.addressList.addressDetail
              : this.ztAdressInfo.provinceName +
                this.ztAdressInfo.cityName +
                this.ztAdressInfo.areaName +
                this.ztAdressInfo.companyAddress, //自提地址
          goodsReceiptPhone: this.addressList.addressPhone, //收货联系方式
          areaCode: this.addressList.areaCode //从地址上面带过来`
        });
        // console.log("--------", this.orderDomainStr);
        // console.log( '----这是啥',v.shoppingpackageList);
        v.shoppingpackageList.map(val => {
          let list = [];
          if (val.giftList) {
            list = [...val.giftList, ...val.shoppingGoodsList];
          } else {
            list = val.shoppingGoodsList;
          }

          let shoppingGoodsIdList = [];
          val.shoppingGoodsList.map(vk => {
            shoppingGoodsIdList.push(vk.shoppingGoodsId);
          });
          if (val.disMoney && val.disMoney > 0) {
            if (val.pmCalcBeanList && val.pmCalcBeanList.length > 0) {
              val.pmCalcBeanList.map(els => {
                this.orderDomainStr[index].ocContractSettlList.push({
                  contractSettlBlance: els.promotionInType == 0 ? "PM" : "COP",
                  contractPmode: "0",
                  contractSettlGmoney: Number(els.disMoney.toFixed(2)),
                  contractSettlPmoney: Number(els.disMoney.toFixed(2)),
                  contractSettlOpno: els.promotionCode,
                  contractSettlOpemo: els.promotionName
                });
              });
            }
            htmlDomainStr[0].ocContractSettlList = this.orderDomainStr.ocContractSettlList;
          }
          this.orderDomainStr[index].packageList.push({
            contractGoodsList: list,
            shoppingGoodsIdList: shoppingGoodsIdList,
            promotionCode: val.promotionCode,
            packageRemark: val.packageRemark
          });
          htmlDomainStr[0].packageList.push({
            contractGoodsList: list,
            shoppingGoodsIdList: [],
            promotionCode: val.promotionCode,
            packageRemark: val.packageRemark
          });
        });
      });

      let orderDomainStr =
        $storage.get("pageRouter") == "0"
          ? JSON.stringify(htmlDomainStr)
          : JSON.stringify(this.orderDomainStr);
      let params = { orderDomainStr: orderDomainStr };
      console.log(orderDomainStr, "goodsReceiptArrdess");
      var checkedAdress = JSON.parse(orderDomainStr)[0].goodsReceiptArrdess;
      console.log(checkedAdress, "checkedAdress----------------------0000");
      var that = this;
      if (that.psType != 1) {
        let times =
          params.orderDomainStr &&
          JSON.parse(params.orderDomainStr)[0].ContractEffectivedate;
        console.log("为到店自提----", params);
        // if (times == "") {
        //   $message.alert("请选择提货时间");
        // } else {
        if (checkedAdress == null) {
          $message.alert("请选择地址");
        } else {
          http
            .post(saveContract, params)
            .then(res => {
              if (res.success) {
                that.contractBillcode = res.dataObj.contractBillcode;
                that.$state.set("contractBillcode", that.contractBillcode);
              } else {
                $message.alert(res.msg);
              }
            })
            .then(() => {
              $storage.set("htmlMessage", "");
              $storage.set("pageRouter", "");
              $router.push("pay/paySelect");
            });
        }

        // }
      } else {
        qqmapsdk.geocoder({
          //获取表单传入地址
          address: checkedAdress, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
          success: function(res) {
            //成功后的回调
            console.log(res.result.location, "999");
            that.psAdress = res.result.location;
            var res = res.result;
            var latitude = res.location.lat;
            var longitude = res.location.lng;
            // psType:1,  // 配送方式 1为送货上门  2 为到店自提
            // if (that.psType == 1) {
            let lng = that.psAdress.lng;
            let lat = that.psAdress.lat;
            console.log(that.storeInfo.storeMapLocation, "storeInfo");
            let latitudes = that.storeInfo.storeMapLocation.split(",")[0];
            let longitudes = that.storeInfo.storeMapLocation.split(",")[1];
            let startposition = {
              latitude: lat,
              longitude: lng
            };
            let sugs = [];
            sugs.push({
              latitude: latitudes,
              longitude: longitudes
            });
            qqmapsdk.calculateDistance({
              from: startposition || "",
              to: sugs,
              success: function(res) {
                if (
                  res.result.distance / 1000 <
                  that.storeInfo.storeDistribution
                ) {
                  $message.alert("配送地址超出了配送范围");
                } else {
                  let times =
                    params.orderDomainStr &&
                    JSON.parse(params.orderDomainStr)[0].ContractEffectivedate;
                  console.log(
                    "1为送货上门----",
                    JSON.parse(params.orderDomainStr)[0].ContractEffectivedate
                  );
                  //   if (times == "") {
                  //     $message.alert("请选择配送时间");
                  //   } else {
                  http
                    .post(saveContract, params)
                    .then(res => {
                      if (res.success) {
                        that.contractBillcode = res.dataObj.contractBillcode;
                        that.$state.set(
                          "contractBillcode",
                          that.contractBillcode
                        );
                        console.log("成功");
                      } else {
                        console.log("失败");
                        $message.alert(res.msg);
                      }
                    })
                    .then(res => {
                      $storage.set("htmlMessage", "");
                      $storage.set("pageRouter", "");
                      $router.push("pay/paySelect");
                    });
                  //   }
                }
              }
            });
            // } else {
            //   let times =
            //     params.orderDomainStr &&
            //     JSON.parse(params.orderDomainStr)[0].ContractEffectivedate;
            //   console.log("为到店自提----", params);
            //   // if (times == "") {
            //   //   $message.alert("请选择提货时间");
            //   // } else {
            //   http
            //     .post(saveContract, params)
            //     .then(res => {
            //       that.contractBillcode = res.dataObj.contractBillcode;
            //       that.$state.set("contractBillcode", that.contractBillcode);
            //     })
            //     .then(() => {
            //       $storage.set("htmlMessage", "");
            //       $storage.set("pageRouter", "");
            //       $router.push("pay/paySelect");
            //     });
            //   // }
            // }
          },
          fail: function(error) {
            $message.alert("请选择地址");
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../../common/css/common.less";
.accounts {
  width: 710rpx;
  margin-left: 20rpx;
  padding-bottom: 116rpx;
  &-back {
    a {
      width: 70rpx;
      height: 90rpx;
      position: fixed;
      z-index: 99999;
      left: 30rpx;
      top: 0;
      display: inline-block;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .psType {
    display: flex;
    flex-direction: row;
    background-color: rgb(249, 249, 249);
    margin-top: 110rpx;
    height: 90rpx;
    width: 710rpx;
    // margin-left: 20rpx;
    border-radius: 10rpx;
    .ps {
      width: 350rpx;
      height: 90rpx;
      display: flex;
      flex-direction: row;
      text-align: center;
      line-height: 90rpx;
      // background-color: white;
      border-top-right-radius: 10rpx;
      border-top-left-radius: 10rpx;
      justify-content: center;
    }
    .zt {
      width: 350rpx;
      height: 90rpx;
      display: flex;
      flex-direction: row;
      margin-left: 10rpx;
      text-align: center;
      line-height: 90rpx;
      // background-color: rgb(236, 236, 236);
      justify-content: center;
      border-top-right-radius: 10rpx;
      border-top-left-radius: 10rpx;
    }
    .psImage {
      width: 42rpx;
      height: 32rpx;
      margin-top: 30rpx;
      margin-right: 10rpx;
    }
  }
  .infoCenter {
    display: inline-block;
    flex-direction: row;
    img {
      width: 110rpx;
      height: 110rpx;
      margin-left: 20rpx;
      margin-bottom: 20rpx;
    }
  }
  .infoNum {
    position: absolute;
    right: 40rpx;
    width: 150rpx;
    height: 160rpx;
    margin-top: -160rpx;
    line-height: 160rpx;
    text-align: center;
    font-size: 28rpx;
  }
  .Deductioncenter {
    background-color: white;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
  }
  .center {
    height: 60rpx;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .DeductionLeft {
      margin-left: 20rpx;
      line-height: 60rpx;
      font-size: 24rpx;
    }
    .DeductionRight {
      margin-top: 10rpx;
      margin-right: 30rpx;
    }
  }
  .moneySum {
    display: flex;
    flex-direction: column;
    .zkMoney {
      font-size: 22rpx;
      color: #959595;
    }
  }
  &-noAddress {
    height: 178rpx;
    // margin-top: 90rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 20rpx solid #fafafa;
    background: @white-color;
    i {
      margin-right: @margin-right;
      font-size: 50rpx;
    }
  }
  &-haveAddress {
    height: 180rpx;
    background: @white-color;
    padding: @padding-30;
    border-bottom: 1rpx solid #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-l {
      font-size: @top-title;
      width: 618rpx;
      h5 {
        margin-bottom: 12rpx;
        font-size: 28rpx;
        span {
          margin-left: 112rpx;
        }
      }
      p {
        overflow: hidden;
        -webkit-line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        width: 618rpx;
        color: @color-666;
        font-size: @middle-title;
        span {
          display: inline-block;
          font-size: 18rpx;
          padding: 3rpx 15rpx;
          border-radius: 15rpx;
          background: #b79f77;
          margin-right: 12rpx;
          color: @white-color;
        }
      }
    }
  }
  &-info {
    padding: 10rpx 30rpx 0rpx 30rpx;
    border-bottom: 20rpx solid #fafafa;
    background: @white-color;
    border-bottom: 20rpx solid #fafafa;
    &-tit {
      height: 68rpx;
      line-height: 68rpx;
      border-bottom: 1rpx solid #f6f6f8;
      margin-bottom: 30rpx;
      font-size: 28rpx;
    }
    &-con {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40rpx;
      background-color: red;
      &:last-child {
        margin-bottom: 0;
      }
      img {
        width: 110rpx;
        height: 110rpx;
        margin-right: 30rpx;
      }
      div {
        width: 500rpx;
        h2 {
          width: 500rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 28rpx;
          span {
            border: 1rpx solid #b79f77;
            border-radius: 6rpx;
            padding: 0 5rpx;
            margin-right: 5rpx;
            font-size: @middle-title;
            color: #b79f77;
          }
        }
        h3 {
          color: @color-999;
          font-size: @middle-title;
          margin: 10rpx 0;
        }
        h4 {
          color: #d66377;
          display: flex;
          align-items: center;
          justify-content: space-between;
          span {
            font-size: @middle-title;
            color: @color-666;
          }
        }
      }
    }
    .accounts-con,
    .accounts-textarea {
      height: 108rpx;
      padding: 0;
      border-bottom: 1rpx solid #fafafa;
    }
    &-money {
      padding: 0;
      height: 102rpx;
      line-height: 102rpx;
      text-align: right;
      font-size: @middle-title;
    }
  }
  &-con {
    padding: @padding-30;
    background: @white-color;
    border-bottom: 20rpx solid #fafafa;
    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28rpx;
      height: 110rpx;
      border-bottom: 1rpx solid #f6f6f8;
      p {
        display: flex;
        align-items: center;
        i {
          font-size: 28rpx;
          color: #999;
        }
        span {
          color: @color-999;
          margin-right: 10rpx;
        }
      }
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  &-textarea {
    display: flex;
    align-items: center;
    height: 88rpx;
    border-bottom: 20rpx solid #fafafa;
    background: @white-color;
    padding: @padding-30;
    font-size: 28rpx;
    span {
      display: inline-block;
      width: 172rpx;
    }
  }
  &-count {
    padding: 30rpx;
    background: @white-color;
    margin-bottom: 20rpx;
    p {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 55rpx;
      font-size: @middle-title;
      span {
        color: @color-666;
      }
    }
  }
  &-count1 {
    padding: 30rpx;
    background: @white-color;
    margin-bottom: 20rpx;
  }
  &-sum {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    height: 96rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: @white-color;
    text-indent: 20rpx;
    width: 100%;
    p {
      display: flex;
      align-items: center;
      i {
        color: #d66377;
      }
    }
    span {
      display: inline-block;
      height: 96rpx;
      width: 245rpx;
      line-height: 96rpx;
      color: @white-color;
      font-size: 32rpx;
      text-align: center;
      background: #b79f77;
    }
  }
  &-preferential {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 999999;
    background: rgba(0, 0, 0, 0.6);
    &-con {
      background-color: #fff;
      height: 880rpx;
      position: absolute;
      width: 100%;
      bottom: 0;
      p {
        height: 92rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1rpx solid #f5f5f5;
        padding: @padding-lr;
      }
      ul {
        height: 675rpx;
        overflow: scroll;
        li {
          background-color: #fff;
          -webkit-box-shadow: 0rpx 0rpx 30rpx #eee;
          box-shadow: 0rpx 0rpx 30rpx #eee;
          border-radius: 8rpx;
          margin: 20rpx 30rpx 0;
          display: -moz-box;
          display: -webkit-box;
          display: box;
          padding: 20rpx 0;
          .pre-left {
            width: 186rpx;
            text-align: center;

            h1 {
              display: inline-block;
              color: #d66377;
              font-size: 40rpx;
              i {
                font-size: @middle-title;
                display: inline-block;
                vertical-align: top;
                color: #b79f77;
              }
            }
            h2 {
              font-size: 22rpx;
              color: @color-999;
            }
          }
          .pre-center {
            -webkit-box-flex: 1;
            box-flex: 1;
            width: 0;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;

            h3 {
              font-size: @top-title;
              color: @color-333;
              margin-bottom: 10rpx;
              text-align: left;
            }
            h4 {
              font-size: 20rpx;
              color: @color-999;
            }
          }
          .pre-right {
            width: 86rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
      .pre-btn {
        height: 96rpx;
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        line-height: 96rpx;
        color: @white-color;
        font-size: @top-title;
        background: #b79f77;
      }
    }
  }
  /* 弹出时间 */
  .delivery_time {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.7);
    z-index: 99999;
  }
  .timeBar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 252.5px;
    background: #fff;
    z-index: 9999;
    overflow: hidden;
    display: flex;
  }
  .timeBar .left_bar {
    width: 127.5px;
    height: 100%;
    background: #f7f7f9;
    text-align: center;
    font-size: 13px;
    color: #666;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .timeBar .left_bar span {
    display: inline-block;
    width: 100%;
    height: 44.5px;
    line-height: 44.5px;
    background: #fff;
  }

  .right_bar {
    width: 247.5px;
    overflow-y: auto;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: flex;
    margin-bottom: 30px;
  }
  .choose_time {
    width: 100%;
    padding: 10px;
    font-size: 13px;
    color: #666;
  }
  .choose_time .time_item {
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
  }
  .choose_time img {
    width: 13px;
    height: 13.5px;
    /* margin-left: 140px; */
  }
  .cancelChoose {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    text-align: center;
    color: #999;
    font-size: 15px;
    z-index: 99999;
    background: #f0f0f0;
  }
  .no-prom {
    img {
      display: block;
      width: 379rpx;
      height: 296rpx;
      margin: 100rpx auto;
    }
  }
}
</style>




