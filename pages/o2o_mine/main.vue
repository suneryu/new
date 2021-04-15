<template>
  <!-- <routerView> -->
  <div class="personal-center">
    <et-header
      v-if="headerShow1"
      :baseColor="baseColor"
      :userInfo="userInfo"
      @getmenulist="getmenulist"
      :isShow="isShow"
      @isShowFalse="isShowFalse"
      :myorderList="myorderList"
      :myOrderName="myOrderName"
      :webmail="webmail"
    ></et-header>
    <!-- <button type="button" @click="loginOut()">退出当前账号</button> -->
    <!-- <button type="button" @click="col()">搜藏</button>  -->
    <orderList
      v-if="myOrders.length > 0"
      :baseColor="baseColor"
      :myOrders="myOrders"
      :myOrderName="groupName"
    ></orderList>
    <orderList
      v-if="zitiOrderList.length > 0"
      :baseColor="baseColor"
      :myOrders="zitiOrderList"
      :myOrderName="zitiName"
    ></orderList>
    <orderWallet
      v-if="yhcxList.length > 0"
      :baseColor="baseColor"
      :myWalletList="yhcxList"
      :myWalletListName="yhcxName"
    ></orderWallet>
    <orderWallet
      v-if="myWalletList.length > 0"
      :baseColor="baseColor"
      :myWalletList="myWalletList"
      :myWalletListName="myWalletListName"
    ></orderWallet>
    <orderTool
      v-if="moreToolList.length > 0"
      :baseColor="baseColor"
      :moreToolList="moreToolList"
      :moreToolListName="moreToolListName"
    ></orderTool>
    <orderTool
      v-if="tzcenterList.length > 0"
      :baseColor="baseColor"
      :moreToolList="tzcenterList"
      :moreToolListName="tzName"
    ></orderTool>
    <vueTabBar
      @fetch-index="clickIndexNav"
      :selectNavIndex="selectNavIndex"
      :baseColor="baseColor"
      :footerMenu="footerMenu"
    />
  </div>
  <!-- </routerView> -->
</template>
<script>
import getUserInfo from "@/components/communal/getUserInfo";
import etHeader from "../user_modules/o2oheader/index";
import orderWallet from "../user_modules/o2omywallet/index";
import orderTool from "../user_modules/o2otool/index";
import orderList from "../user_modules/o2ohyorder/index";
import { $storage, $router } from "@/utils/prototype/vue.js";
import http from "@/api/http.js";
import vueTabBar from "@/components/communal/vueTabBar";
import {
  loginOut,
  getProappinfo,
  loginIn,
  getTopPerMenuList,
  getTopPerMenuListFPc,
  thirdLogin,
  loginMicroMessenger,
  loginMiniProgram
} from "@/api/interface.js";
import { clearTimeout, setTimeout } from "timers";
export default {
  data() {
    return {
      show: false,
      selectNavIndex: 3,
      appid: "",
      secret: "",
      state: "wx",
      grant_type: "",
      domains: this.$domain,
      baseColor: "",
      message: "",
      isShow: false,
      application: [], //应用
      footerMenu: [], //底部菜单
      myOrder: [],
      webmail: "",
      topStyle: "",
      myorderList: [], //我的订单
      myWalletList: [], //我的钱包
      myWalletListName: "", //我的钱包名字
      moreToolList: [], //更多工具
      moreToolListName: "", //更多工具名字
      headerShow1: false, //是否是这个header
      myOrders: [], //团长订单
      zitiOrderList: [], //自提点订单
      groupName: "", //团长名字
      zitiName: "", //自提点名字
      myOrderName: "我的订单", //普通订单名字
      tzcenterList: [],
      tzName: "",
      yhcxList: [],
      yhcxName: "",
      userInfo: {}
    };
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
  },

  mounted() {
    let that = this;
    if ($storage.get("userInfo")) {
      that.msg = $storage.get("userInfo");
    }
    console.log($storage.get("userInfo"), "userInfo");
    that.getmenulist();
    // 登陆颜色 商城名字信息
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    that.baseColor = "#" + $storage.get("baseColor");
  },
  components: {
    etHeader,
    orderWallet,
    orderTool,
    vueTabBar,
    orderList
  },
  methods: {
    // 退出当前账号
    loginOut() {
      http.get(loginOut).then(res => {});
    },
    col() {
      //   $router.push("o2o/pages/o2o_collection/goods");
      // $router.push('o2o/pages/o2o_collection/history')
      //   $router.push('o2o/pages/o2oPromotion_modules/coupon/couponList')
      //   $router.push("user_modules/user/user-ui/webMail");
      // $router.push("marketing_module/pages/groupBuy/gbgoodsdetails");
      // $router.push("marketing_module/pages/groupBuy/grouporder_modules/index",{dataState:"0"});
      // $router.push("marketing_module/pages/groupBuy/groupbugList");
      // $router.push("o2o/pages/address_modules/ztAddress_manager")
      // $router.push("o2o/pages/order_modules/o2o_order/indexms")
    },
    getmenulist() {
      http.get(getTopPerMenuListFPc).then(res => {
        this.footerMenu = res.menuList.filter(v => v.menuShow === 0); //后面去取routerMap
        this.$state.set("footerMenu", this.footerMenu);
        if (res) {
          res.menuList.map((v, k) => {
            //我的页面
            if (v.menuCode == "00000042") {
              this.$state.set("homeUrl", v.menuAction);
              v.children.map((ve, n) => {
                if (ve.menuCode == "P0000111") {
                  if (
                    v.children[n].menuAction &&
                    v.children[n].menuAction.indexOf("${htmldataFilename}") > 0
                  ) {
                    $storage.set(
                      "hrefs",
                      v.children[n].menuAction.split("${htmldataFilename}")[0]
                    );
                  } else {
                    $storage.set("hrefs", v.menuAction);
                  }
                }
              });
            }
            if (v.menuCode == "MP000007") {
              this.$state.set("classifyUrl", v.menuAction);
            }
            if (v.menuCode == "MP000200") {
              this.$state.set("FindUrl", v.menuJspath);
            }
            if (v.menuCode == "MP000001") {
              //this.$state.set('FindUrl'.v.menuAction)
            }
            if (v.menuAction == "user") {
              v.children.map((val, index) => {
                if (
                  val.menuDefaultClass == "headerStyle7" &&
                  val.menuName == "个人信息"
                ) {
                  this.headerShow1 = true;
                  this.myorderList = [];
                  this.myorderList = val.children.filter(v => v.menuShow === 0);
                  this.$state.set(
                    "orderMenu",
                    val.children.filter(v => v.menuShow === 1)
                  );
                }
                // 我的钱包
                if (
                  val.menuDefaultClass == "gridListCard3" &&
                  val.menuName == "我的钱包"
                ) {
                  this.myWalletListName = val.menuName;
                  this.myWalletList = val.children.filter(
                    v => v.menuShow === 0
                  );
                }
                // 优惠促销
                if (
                  val.menuDefaultClass == "gridListCard3" &&
                  val.menuName == "优惠促销"
                ) {
                  this.yhcxName = val.menuName;
                  this.yhcxList = val.children.filter(v => v.menuShow === 0);
                }
                // 更多工具
                if (
                  val.menuDefaultClass == "gridListCard4" &&
                  val.menuName == "更多工具"
                ) {
                  this.moreToolListName = val.menuName;
                  this.moreToolList = val.children.filter(
                    v => v.menuShow === 0
                  );
                  this.$state.set(
                    "application",
                    val.children.filter(v => v.menuShow === 1)
                  );
                  this.$state.set(
                    "moreToolList",
                    val.children.filter(v => v.menuShow === 0)
                  );
                }
                //团长中心
                if (
                  val.menuDefaultClass == "gridListCard4" &&
                  val.menuName == "团长中心"
                ) {
                  this.tzcenterList = val.children.filter(
                    v => v.menuShow === 0
                  );
                  this.tzName = val.menuName;
                }
                // 团长订单
                if (
                  val.menuDefaultClass == "rowListNav" &&
                  val.menuName == "团长订单"
                ) {
                  this.myOrders = val.children.filter(v => v.menuShow === 0);
                  this.groupName = val.menuName;
                }
                // 自提点订单
                if (
                  val.menuDefaultClass == "rowListNav" &&
                  val.menuName == "自提点订单"
                ) {
                  this.zitiOrderList = val.children.filter(
                    v => v.menuShow === 0
                  );
                  this.zitiName = val.menuName;
                }
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../common/css/common.less";
.personal-center {
  padding-bottom: 92rpx;
}
</style>