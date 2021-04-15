<template>
  <div class="shopcart" :style="{height:shopIdAttr.length<3?'100%':'auto'}">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <!-- <div class="shopcart-back">
        <a>
          <span class="iconfont" @click="goBack">&#xe62d;</span>
        </a>
    </div>-->
    <div class="shopcart-save" @click="edited" v-if="delStatus" v-show="listItems.length>0">编辑</div>
    <div class="shopcart-save" @click="finished" v-else v-show="listItems.length>0">完成</div>
    <!-- 配送地址 -->
    <!-- <div class="shopcart-address" @click="gotoAddressList">
      <div class="addressTitle">配送至:</div>
      <div class="addressDetail">{{addressDetail}}</div>
      <i class="iconfont" style="position: absolute;right:40rpx">&#xe61d;</i>
    </div>-->

    <ul v-if="listItems.length>0">
      <li v-for="(listItem,listIndex) in listItems" :key="listIndex">
        <div v-for="(list,liIndex) in listItem.shoppingpackageList" :key="liIndex">
          <div class="memberTit" @click="titCheckBox(list,liIndex)">
            <i
              class="iconfont"
              v-if="list.titChecked===0 || list.titChecked ===''"
              :style="{color:baseColor}"
            >&#xe671;</i>
            <i class="iconfont" v-else :style="{color:'#ededed'}">&#xe671;</i>
            {{list.memberName}}
          </div>
          <!-- 店的折扣和满减栏
          <div class="listHeader">
						<div class="leftTitle1">满减</div>
						<div class="leftTitle2">{{list.promotionInType}}</div>
						<div class="header" style="position: absolute;right:50rpx" @click="CollectBillClick">
                <div class="rightTitle" :style="{color:baseColor}" @click.stop="gotoCoudan">去凑单</div>
                <i class="iconfont" :style="{color:baseColor}">&#xe61d;</i>
              </div> 
          </div>-->
          <div class="list_li">
            <div class="list_pm list_p">
              <div v-show="list.promotionCode">
                <div class="tit">
                  <p :style="{background:baseColor}" :key="pbIndex">{{list.pbName}}</p>
                  <span
                    class="f-s22"
                  >{{list.disMsg?list.disMsg:''}}{{list.disNextMsg?list.disNextMsg:''}}</span>
                </div>
                <div v-if="list.disNextMsg" class="headers">
                  <div
                    class="rightTitle"
                    :style="{color:baseColor}"
                    @click.stop="gotoCoudan(list.promotionCode,list.pbCode,list.shoppingGoodsList,liIndex)"
                  >去凑单</div>
                  <i class="iconfont" :style="{color:baseColor}">&#xe61d;</i>
                </div>
              </div>

              <div class="itemGoods" v-for="(item,index) in list.shoppingGoodsList" :key="index">
                <a>
                  <div class="list-l" @click.stop="listCheckBox(item)">
                    <i
                      class="iconfont"
                      :style="{color:baseColor}"
                      v-if="item.shoppingGoodsCheck===0 || item.shoppingGoodsCheck===''"
                    >&#xe671;</i>
                    <i class="iconfont" :style="{color:'#ededed'}" v-else>&#xe671;</i>
                  </div>
                  <div class="list-img" @click.stop="goToGoodsDetail(item)">
                    <img :src="item.dataPic||userImgurl" />
                    <span v-show="item.dataState===2">已下架</span>
                    <span v-show="item.dataState===3">已失效</span>
                    <span v-show="item.dataState===1">库存不足</span>
                  </div>
                  <div class="list-r" :style="{color:item.dataState!==0?'#ccc':''}">
                    <p @click.stop="goToGoodsDetail(item)">{{item.goodsName}}</p>
                    <h3
                      :style="{color:item.dataState!==0?'#ccc':''}"
                      @click.stop="goToGoodsDetail(item)"
                    >{{item.skuName}}*{{item.goodsCamount}}</h3>
                    <div class="list-count">
                      <div
                        :style="{color:item.dataState!==0?'#ccc':'#d66377'}"
                      >{{unitPrice.obpay}}{{item.pricesetNprice}}{{unitPrice.mapay}}</div>
                      <div class="list-add">
                        <div @click.stop="subtract(item,index)">
                          <i
                            class="iconfont"
                            :style="{color:item.goodsCamount&&item.goodsCamount>0&&item.goodsCamount<=item.goodsMinnum?'#ccc':''}"
                          >&#xe755;</i>
                        </div>
                        <div>
                          <input type="text" v-model="item.goodsCamount" disabled />
                        </div>
                        <div @click.stop="add(item,index)">
                          <i class="iconfont">&#xe756;</i>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <div
                  v-show="list.promotionCode&&item.pmPromotionList&&item.pmPromotionList.length>0"
                >
                  <div class="updatePm">
                    <p :style="{color:baseColor,borderColor:baseColor}">
                      <i>已选择促销：</i>
                      {{list.promotionName}}
                    </p>
                    <span @click="updateAction(index,item,list.promotionName)">修改</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
      <!-- 整个店的商品总价 底部栏 -->
      <!-- <div class="listFooter">
            <div class="footerLeft">
              <div class="footerPrice">
                <div class="addCount1">
                  总计：
                  <i :style="{color:baseColor}" v-if="totalPointPrice > 0">¥ {{totalPointPrice}}</i>
                  <i :style="{color:baseColor}" v-if="totalPrice && totalPointPrice">+</i>
                  <i :style="{color:baseColor}" v-if="totalPrice > 0">{{totalPrice}}</i>
                  <i :style="{color:baseColor}" v-if="totalPrice == 0 && totalPointPrice == 0">0.00</i>
                </div>
                <span
                  class="Settlement"
                  v-if="delStatus"
                  :style="{background:baseColor}"
                  @click="getTotalPrice"
                >去结算</span>
                <div
                  class="del1"
                  v-else
                  :style="{color:baseColor,borderColor:baseColor}"
                  @click="delCartShopping"
                >删除</div>
      </div>-->
      <!-- <div class="footerDiscount">
                  <div>已优惠22元  |  免费配送</div>
      </div>-->
      <!-- </div>
      </div>-->
    </ul>
    <!-- 不在配送范围的商品 显示灰色 不可点击 -->
    <!-- <div class="outRange"> - 以下商品超出配送范围 -</div> -->

    <div class="shopcart-nulls" v-if="listItems.length == 0 && requestStatic">
      <img :src="nullImg" />
    </div>
    <div v-show="listItems.length>0">
      <div class="shopcart-count">
        <div @click="countCheckBox">
          <i class="iconfont" :style="{color:baseColor}" v-if="countChecked">&#xe671;</i>
          <i class="iconfont" :style="{color:'#ededed'}" v-else>&#xe671;</i>
          全选
        </div>
        <div v-if="delStatus" class="addCount">
          总计：
          <i :style="{color:baseColor}" v-if="totalPointPrice > 0">{{totalPointPrice}}</i>
          <i :style="{color:baseColor}" v-if="totalPrice && totalPointPrice">+</i>
          <i :style="{color:baseColor}" v-if="totalPrice > 0">{{totalPrice}}</i>
          <i :style="{color:baseColor}" v-if="totalPrice == 0 && totalPointPrice == 0">0.00</i>
          <span :style="{background:baseColor}" @click="getTotalPrice">去结算</span>
        </div>
        <div
          class="del"
          v-else
          :style="{color:baseColor,borderColor:baseColor}"
          @click="delCartShopping"
        >删除</div>
      </div>
    </div>
    <vueTabBar
      @fetch-index="clickIndexNav"
      :selectNavIndex="selectNavIndex"
      :baseColor="baseColor"
      :footerMenu="footerMenu"
    />
    <div class="shopcart-screenLeft" v-show="isShow" @click="(()=>{isShow=false})"></div>
    <div class="shopcart-preferential" v-show="isShow">
      <div class="shopcart-preferential-con">
        <p>
          修改促销
          <i class="iconfont" @click="()=>{isShow=false}">&#xe609;</i>
        </p>
        <ol>
          <li v-for="(op,opIndex) in options" :key="opIndex">
            <h3>
              {{op.promotionName}}
              <i
                class="iconfont"
                @click="checkPmPromotion(op)"
                :style="{color:optionsIndex===opIndex?baseColor:'#c6c6c6'}"
              >{{optionsIndex===opIndex?'&#xe671;':'&#xe672;'}}</i>
            </h3>
          </li>
        </ol>
        <div class="pre-btn" :style="{background:baseColor}">确认</div>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import {
  getTopPerMenuList,
  queryShoppingPage,
  updateShoppingGoodsCheckState,
  updateShoppingGoodsNum,
  deleteShoppingGoodsBatch,
  updateShoppingGoodsPmInfo,
  addressList
} from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
import vueTabBar from "@/components/communal/vueTabBar";
export default {
  data() {
    return {
      title: "购物车",
      leftIcon: false,
      rightIcon: false,
      footerMenu: [], //底部菜单
      selectNavIndex: 2,
      titChecked: false,
      countChecked: false,
      isShow: false,
      titCheckIndex: 0,
      listItems: [],
      userImgurl:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/img_default.jpg",
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noCar.png",
      baseColor: "",
      delStatus: true, // 是编辑还是完成
      totalPointPrice: 0,
      totalPrice: 0,
      options: [], //点修改后的所有营销活动
      optionsIndex: -1, //当前默认的营销活动名称index
      shopIdAttr: [], //所有的商品id
      addressDetail: "请选择配送地址",
      requestStatic: false
    };
  },
  components: {
    commonHeader,
    vueTabBar
  },
  computed: {
    // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
    unitPrice() {
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
  },
  onLoad(options) {
    // wx.getSetting({
    //   success: function(res) {
    //     if (!res.authSetting["scope.userInfo"]) {
    //       $router.push("authorization", {
    //         redirectUrl: "o2o/pages/o2o_ShoppingCart"
    //       });
    //     }
    //   },
    //   fail: function(res) {
    //     console.log(res);
    //   }
    // });
    Object.assign(this, this.$options.data());
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + $storage.get("baseColor")
    });
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    //console.log(options, prevpage);
    // this.getAddress();
    if (prevpage && prevpage.route) {
      if (prevpage.route == "pages/web/main") {
        $storage.set("beforeShopCartRouter", "goodsDetail");
      } else {
        $storage.set("beforeShopCartRouter", "");
      }
    }
  },
  onShow() {
    this.delStatus = true;
    this.baseColor = "#" + $storage.get("baseColor");
    // http.get(getTopPerMenuList).then(res => {
    // 	// 获取到的tabbar
    // 	this.footerMenu = res.filter(v => v.menuShow === 0)
    // })
    this.footerMenu = $storage.get("footerMenu");
    this.commonMounted();
    if ($storage.get("psAddress") != "") {
      var Addr = $storage.get("psAddress");
      this.addressDetail = Addr.roadName + Addr.addressDetail;
    }
  },
  methods: {
    commonMounted() {
      http.post(queryShoppingPage).then(res => {
        this.listItems = [];
        if (res && res.rows) {
          this.listItems = res.rows;
          this.requestStatic = true;
          this.listItems.map(v => {
            if (v.shoppingpackageList) {
              v.shoppingpackageList.map(val => {
                val.titChecked = 1;
                if (
                  val.shoppingGoodsList.filter(
                    vm => vm.shoppingGoodsCheck === 0
                  ).length === val.shoppingGoodsList.length
                ) {
                  val.titChecked = 0;
                }
                val.shoppingGoodsList.map(vk => {
                  vk.pricesetNprice = (vk.pricesetNprice * 1).toFixed(2);
                  vk.dataPic = this.$domain + vk.dataPic;
                });
              });
            }
          });
          this.listItems.map(v => {
            if (v.shoppingpackageList) {
              v.rowsCheck = 1;
              if (
                v.shoppingpackageList.filter(vm => vm.titChecked === 0)
                  .length === v.shoppingpackageList.length
              ) {
                v.rowsCheck = 0;
              }
            }
          });
          if (
            this.listItems.filter(val => val.rowsCheck === 0).length ===
            this.listItems.length
          ) {
            this.countChecked = true;
          } else {
            this.countChecked = false;
          }

          let totalPrice = 0;
          let totalPointPrice = 0;
          let productPresentPriceAll = 0;

          this.listItems.map(v => {
            if (v.shoppingpackageList) {
              v.shoppingpackageList.map(val => {
                productPresentPriceAll += Number(val.disMoney);
                this.productPresentPriceAll = productPresentPriceAll;
                totalPointPrice += Number(val.sumMoney);
                totalPrice += Number(val.pricesetRefrice);
                //console.log(productPresentPriceAll, 'productPresentPriceAllproductPresentPriceAll')
                this.totalPointPrice = (
                  totalPointPrice - productPresentPriceAll
                ).toFixed(2);
                this.totalPrice = totalPrice;
                console.log(totalPointPrice, totalPrice, 999999);
                val.shoppingGoodsList.map(vk => {
                  this.shopIdAttr.push(vk.shoppingGoodsId);
                });
              });
            }
          });
        } else {
          this.listItems = [];
          this.requestStatic = true;
        }
      });
    },
    // getAddress() {
    //   http.post(addressList).then(res => {
    //     for (let i = 0; i < res.length; i++) {
    //       if (res[i].addressDefault == 1) {
    //         this.addressDetail = res[i].roadName + res[i].addressDetail;
    //       }
    //     }
    //   });
    // },
    gotoAddressList() {
      $router.push("address_modules/address_manager", {
        data: 1
      });
    },
    titCheckBox(list, liIndex) {
      let ids = [];
      list.shoppingGoodsList.map(v => {
        ids.push(v.shoppingGoodsId);
      });
      let params = {
        shoppingCode: list.shoppingCode,
        checkState: list.titChecked === 0 ? 1 : 0,
        shoppingGoodsIdStr: ids.join(","),
        channelCode: "channelCode"
      };

      http.post(updateShoppingGoodsCheckState, params).then(res => {
        if (res && res.success) {
          this.commonMounted();
        }
      });
    },
    listCheckBox(item) {
      let params = {
        shoppingGoodsIdStr: item.shoppingGoodsId,
        shoppingCode: item.shoppingCode,
        checkState: item.shoppingGoodsCheck === 0 ? 1 : 0,
        channelCode: "channelCode"
      };
      http.post(updateShoppingGoodsCheckState, params).then(res => {
        if (res && res.success) {
          this.commonMounted();
        }
      });
    },
    countCheckBox() {
      let params = {
        shoppingGoodsIdStr: this.shopIdAttr.join(","),
        channelCode: "channelCode"
      };
      if (this.countChecked) {
        this.countChecked = false;
        params.checkState = 1;
      } else {
        this.countChecked = true;
        params.checkState = 0;
      }
      http.post(updateShoppingGoodsCheckState, params).then(res => {
        if (res && res.success) {
          this.commonMounted();
        }
      });
    },
    subtract(item, index) {
      let that = this;
      let goodsCamount = item.goodsCamount;
      let params = {
        shoppingGoodsId: item.shoppingGoodsId,
        amount: goodsCamount,
        goodWeight: 0
      };
      if (item.goodsMinnum && item.goodsMinnum > 0) {
        if (item.goodsCamount <= item.goodsMinnum) {
          $message.alert("购买数量不能小于起订量");
        } else if (item.goodsCamount > item.goodsMinnum && goodsCamount > 1) {
          goodsCamount--;
          params.amount = goodsCamount;
          wx.request({
            url: "/web/oc/shopping/updateShoppingGoodsNum.json", //请求接口的url
            method: "post", //请求方式
            data: params, //请求参数
            header: {
              "content-type": "application/json" // 默认值
            },
            complete() {
              //请求结束后隐藏 loading 提示框
              wx.hideLoading();
            },
            success: res => {
              that.commonMounted();
            },
            fail: res => {
              if (res.errorCode == "-1") {
                item.goodsCamount = item.goodsSupplynum;
                //购买商品数量不能超过商品库存
              }
            }
          });
          //   http.post(updateShoppingGoodsNum, params).then(res => {
          //     if (res && res.success) {
          //       this.commonMounted();
          //     } else {
          //       if (res.errorCode == "-1") {
          //         item.goodsCamount = item.goodsSupplynum;
          //         //购买商品数量不能超过商品库存
          //       }
          //     }
          //   });
        }
      } else {
        if (goodsCamount > 1) {
          goodsCamount--;
          params.amount = goodsCamount;
          http.post(updateShoppingGoodsNum, params).then(res => {
            if (res && res.success) {
              this.commonMounted();
            } else {
              if (res.errorCode == "-1") {
                item.goodsCamount = item.goodsSupplynum;
                //购买商品数量不能超过商品库存
              }
            }
          });
        }
      }
    },
    add(item, index) {
      let goodsCamount = item.goodsCamount;
      let params = {
        shoppingGoodsId: item.shoppingGoodsId,
        amount: goodsCamount,
        goodWeight: 0
      };
      if (item.goodsMinnum && item.goodsMinnum > 0) {
        if (goodsCamount < item.goodsMinnum && goodsCamount < 1000) {
          //goodsCamount = item.goodsMinnum
          params.amount = item.goodsMinnum;
        } else if (goodsCamount === item.goodsMinnum && goodsCamount < 1000) {
          goodsCamount++;
          params.amount = goodsCamount;
        }
      } else {
        if (goodsCamount < 1000) {
          goodsCamount++;
          params.amount = goodsCamount;
        }
      }

      http.post(updateShoppingGoodsNum, params).then(res => {
        if (res && res.success) {
          this.commonMounted();
        } else {
          if (res.errorCode == "-1") {
            $message.alert(res.msg);
          }
        }
      });
    },
    // 去凑单
    gotoCoudan(promotionCode, pbCode, shoppingGoodsList, Index) {
      $router.push("o2o/pages/o2o_activity/center", { code: promotionCode });
    },
    goToGoodsDetail(item) {
      let json = {
        skuCode: item.skuCode
      };
      $router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail", json);
    },
    delCartShopping() {
      let attr = [];
      this.listItems.map((v, k) => {
        if (v.shoppingpackageList) {
          v.shoppingpackageList.map((val, index) => {
            val.shoppingGoodsList.map((vk, vt) => {
              if (vk.shoppingGoodsCheck === 0) {
                attr.push(vk.shoppingGoodsId);
              }
            });
          });
        }
      });
      if (attr.length === 0) {
        $message.alert("你还未选择删除的商品");
      } else {
        let shoppingGoodsIdStr = JSON.stringify(attr);
        let params = {
          shoppingGoodsIdStr: shoppingGoodsIdStr
        };
        http.post(deleteShoppingGoodsBatch, params).then(res => {
          if (res && res.success) {
            http
              .post(updateShoppingGoodsCheckState, {
                checkState: 1
              })
              .then(res => {
                if (res && res.success) {
                  this.commonMounted();
                }
              });
          }
        });
      }
    },
    getTotalPrice() {
      //console.log('--------去结算')
      let shoppingGoodsIdStr = [];
      let rsSkuListStr = [];
      let orderDomainStr = [...this.listItems];
      let shoppingType = [];
      this.listItems.map((v, k) => {
        if (v.shoppingpackageList) {
          v.shoppingpackageList.map((val, index) => {
            val.shoppingGoodsList.map(vk => {
              if (vk.shoppingGoodsCheck === 0) {
                shoppingGoodsIdStr.push(vk.shoppingGoodsId);
                let params = {
                  skuCode: vk.skuCode,
                  pricesetAsprice: vk.pricesetAsprice,
                  pricesetRefrice: vk.pricesetRefrice,
                  pricesetNprice: vk.pricesetNprice,
                  goodsNum: vk.goodsCamount
                };
                rsSkuListStr.push(params);
                shoppingType.push({
                  shoppingType: this.listItems[k].shoppingType
                });
              }
            });
          });
        }
      });

      this.$state.set("shoppingType", shoppingType);
      this.$state.set("shoppingGoodsIdStr", shoppingGoodsIdStr);
      this.$state.set("rsSkuListStr", rsSkuListStr);
      if (shoppingGoodsIdStr.length == 0) {
        $message.success("请选择购买商品");
      } else {
        $router.push("o2o/pages/o2o_ShoppingCart/o2o_order");
      }
    },
    edited() {
      this.delStatus = false;
    },
    finished() {
      this.delStatus = true;
    },
    updateAction(itemIndex, itemGood, promotionName) {
      this.options = [];
      this.isShow = true;
      this.options = itemGood.pmPromotionList; //当前商品的所有营销活动
      this.promotionName = promotionName;
      this.pmPromotionList = itemGood.pmPromotionList; //当前商品的所有营销活动
      this.shoppingGoodsId = itemGood.shoppingGoodsId; //当前的商品id
      this.optionsIndex = this.options.findIndex(
        op => op.promotionName == this.promotionName
      );
      // this.options.map(v => {
      //   v.value = v.promotionName;
      //   v.label = v.promotionName;
      // });

      //console.log( itemGood.pmPromotionList);
    },
    checkPmPromotion(op) {
      this.promotionName = op.promotionName; //当前选中的营销活动

      http
        .post(updateShoppingGoodsPmInfo, {
          shoppingGoodsId: this.shoppingGoodsId,
          promotionCode: op.promotionCode
        })
        .then(res => {
          this.isShow = false;
          this.commonMounted();
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../common/css/common.less";
.iconfont {
  font-size: 38rpx;
}
.shopcart {
  width: 100%;
  // height: 100%;
  background: #fafafa;
  position: relative;
  padding-top: 100rpx;
  &-save {
    position: fixed;
    z-index: 99999;
    height: 90rpx;
    width: 70rpx;
    line-height: 90rpx;
    text-align: right;
    right: 30rpx;
    top: 0;
    font-size: @big-title;
  }
  &-address {
    background-color: white;
    margin-left: 30rpx;
    margin-top: 30rpx;
    width: 690rpx;
    height: 100rpx;
    display: flex;
    flex-direction: row;
    line-height: 100rpx;
    .addressTitle {
      color: rgb(172, 172, 172);
      font-size: 26rpx;
      margin-left: 20rpx;
    }
    .addressDetail {
      color: rgb(62, 62, 62);
      font-size: 28rpx;
      margin-left: 20rpx;
      width: 500rpx;
      overflow: hidden;
    }
  }
  .listFooter {
    background-color: white;
    height: 120rpx;
  }
  .footerLeft {
    display: flex;
    flex-direction: column;
    margin-left: 20rpx;
  }
  .footerPrice {
    display: flex;
    flex-direction: column;
  }
  .footerDiscount {
    color: rgb(123, 123, 123);
    font-size: 28rpx;
    margin-left: 20rpx;
  }
  .addCount1 {
    margin-top: 20rpx;
    margin-left: 20rpx;
    display: flex;
  }
  .Settlement {
    color: white;
    font-size: 28rpx;
    width: 180rpx;
    height: 60rpx;
    text-align: center;
    line-height: 60rpx;
    position: absolute;
    right: 50rpx;
    margin-top: 20rpx;
  }
  .del1 {
    color: rgb(32, 142, 67);
    font-size: @big-title;
    width: 128rpx;
    height: 58rpx;
    border: 1rpx solid #b79f77;
    border-radius: 30rpx;
    text-align: center;
    line-height: 60rpx;
    position: absolute;
    right: 40rpx;
    margin-top: 20rpx;
  }
  .outRange {
    color: rgb(148, 148, 148);
    text-align: center;
    margin-top: -180rpx;
  }
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
      justify-content: center;
      align-items: center;
    }
  }
  .headers {
    position: absolute;
    right: 50rpx;
    margin-top: -45rpx;
    display: flex;
    justify-content: space-betwee;
    font-size: 24rpx;
    .rightTitle {
      line-height: 46rpx;
    }
  }
  .listHeader {
    background-color: white;
    display: flex;
    flex-direction: row;
    height: 60rpx;
    border-bottom: 1rpx solid #f6f6f8;
    .header {
      display: flex;
      flex-direction: row;
      line-height: 60;
    }
    .leftTitle1 {
      background-color: rgb(32, 142, 67);
      color: white;
      font-size: 24rpx;
      width: 80rpx;
      height: 30rpx;
      border-radius: 30rpx;
      margin-left: 20rpx;
      margin-top: 15rpx;
      text-align: center;
      line-height: 30rpx;
    }
    .leftTitle2 {
      color: rgb(134, 134, 134);
      font-size: 28rpx;
      margin-left: 20rpx;
      line-height: 60rpx;
    }
    .rightTitle {
      font-size: 18rpx;
      line-height: 20rpx;
    }
  }
  ul {
    margin-bottom: 226rpx;
    li {
      margin: 26rpx 30rpx 20rpx;
      // background: @white-color;
      // border-radius: 6rpx;
      .memberTit {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        height: 68rpx;
        font-size: 28rpx;
        color: @color-333;
        i {
          padding-right: 15rpx;
        }
      }
      // .tit{
      //   display: flex;
      //   align-items: center;
      //   justify-content: flex-start;
      //   height: 68rpx;
      //   margin:0 22rpx;
      //   border-bottom: 1rpx solid #f6f6f8;
      //   i{
      //     margin-right: 15rpx;
      //   }
      // }
      .list_li {
        .list_p {
          border-bottom: 20rpx solid #fafafa;
        }
        .list_pm {
          background: @white-color;
          border-radius: 6rpx;
          .tit {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 68rpx;
            margin: 0 22rpx;
            font-size: 22rpx;
            color: @color-666;
            border-bottom: 1rpx solid #f6f6f8;
            p {
              padding: 5rpx 8rpx;
              font-size: 18rpx;
              color: @white-color;
              // background: #b79f77;
              border-radius: 20rpx;
              margin-right: 10rpx;
            }
          }
          .updatePm {
            height: 66rpx;
            padding: 0 22rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            p {
              font-size: 22rpx;
              color: @color-666;
              display: flex;
              align-items: center;
              i {
                padding: 5rpx 0 5rpx 10rpx;
                border-radius: 20rpx;
                text-align: center;
                margin-right: 15rpx;
              }
            }
            span {
              width: 66rpx;
              text-align: right;
              font-size: 22rpx;
              color: @color-333;
            }
          }
          .itemGoods {
            a {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 22rpx 22rpx 35rpx;
              border-bottom: 1rpx solid #f6f6f8;
              .list-l {
                padding-right: 25rpx;
              }
              .list-img {
                position: relative;
                img {
                  width: 160rpx;
                  height: 160rpx;
                  margin-right: 25rpx;
                }
                span {
                  width: 160rpx;
                  height: 44rpx;
                  background: #b3b3b3;
                  color: @white-color;
                  font-size: 22rpx;
                  text-align: center;
                  line-height: 44rpx;
                  position: absolute;
                  bottom: 0;
                  left: 0;
                }
              }
              .list-r {
                p {
                  width: 380rpx;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  font-size: @middle-title;
                }
                h3 {
                  font-size: 22rpx;
                  color: @color-999;
                  margin: 10rpx 0 13rpx 0;
                }
                .list-count {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  .list-add {
                    display: flex;
                    align-items: center;
                    input {
                      width: 50rpx;
                      text-align: center;
                      font-size: 22rpx;
                    }
                    div:last-child {
                      i {
                        font-size: 42rpx;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  &-count {
    display: flex;
    width: calc(100% - 60rpx);
    position: fixed;
    z-index: 9999;
    padding: @padding-30;
    bottom: 102rpx;
    left: 0;
    align-items: center;
    justify-content: space-between;
    height: 98rpx;
    font-size: @middle-title;
    color: @color-666;
    background: #fff;
    .del {
      color: #b79f77;
      font-size: @big-title;
      width: 118rpx;
      height: 58rpx;
      border: 1rpx solid #b79f77;
      border-radius: 30rpx;
      text-align: center;
      line-height: 60rpx;
    }
    div:first-child {
      display: flex;
      align-items: center;
    }
    .addCount:last-child {
      display: flex;
      align-items: center;
    }
    i {
      padding-right: 15rpx;
    }
    span {
      display: inline-block;
      width: 206rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      color: @white-color;
      border-radius: 5rpx;
      background: #b79f77;
      margin-left: 28rpx;
    }
  }
  &-nulls {
    height: calc(100% - 202rpx);
    text-align: center;
    img {
      width: 349rpx;
      height: 309rpx;
      margin: 280rpx auto 0;
    }
  }
  &-screenLeft {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 99999;
  }
  &-preferential {
    width: 100%;
    height: 488rpx;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100000;
    &-con {
      background-color: #fff;
      height: 488rpx;
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
      ol {
        height: 300rpx;
        overflow-y: auto;
        overflow-x: hidden;
        padding: @padding-30;
        li {
          border-bottom: 1rpx solid #f6f6f8;
          height: 106rpx;
          h3 {
            height: 106rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: @big-title;
            color: @color-333;
            h4 {
              display: flex;
              align-items: center;
              span {
                background: #b79f77;
                font-size: 22rpx;
                color: #fff;
                padding: 4rpx 10rpx;
                border-radius: 20rpx;
                margin-left: 10rpx;
              }
            }
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
}
</style>