<template>
  <div class="selectAddress">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="shopList-left" @click="close">
      <i class="iconfont">&#xe62d;</i>
    </div>
    <div class="selectAddress-search">
      <input
        :data-city="city"
        :data-longitude="longitude"
        :data-latitude="latitude"
        @input="getsuggest"
        placeholder="搜索"
      />
    </div>
    <div class="selectAddress-list" v-if="judge">
      <div
        class="selectAddress-item"
        v-for="(item,index) in textdata"
        :key="index"
        @click="changeAddress(item.latitude,item.longitude,item.title)"
      >
        <p class="h1">{{item.title}}</p>
        <p class="h_address">{{item.addr}}</p>
      </div>
    </div>
    <div class="selectAddress-list shoplist" v-if="!judge">
      <div class="current-location">
        <p>当前定位位置</p>
        <p>
          <i class="icon iconfont icon-dizhi1" :style="{color:baseColor}"></i>
          {{address}}
        </p>
      </div>
      <div class="shops">
        <p class="shops-title">附近地址</p>
        <div class="noshops" v-if="showshop == 1">附近暂无可服务门店，请选择其他地址门店</div>
        <div
          class="selectAddress-item"
          v-for="(item,index) in arryShoplist"
          :key="index"
          @click="changeShop(item.userinfoCode)"
        >
          <div class="h1 t-box">
            <p class="t-box-flex1">{{item.userinfoCompname}}</p>
            <i>{{item.distance}}米</i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { QQMapWX } from "@/utils/location/qqmap-wx-jssdk.js";
import {
  addAddress,
  queryStoreBySimpleObjPage,
  getTginfoForTOCom,
  getStoreInfo,
  getTopPerMenuListFPc,
  getSecretKeyCodeByconfigType
} from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
var lonlat;
var city;
var qqmapsdk;
var markersData = [];
export default {
  data() {
    return {
      title: "选择地址",
      leftIcon: false,
      rightIcon: false,
      baseColor: "",
      keypassword: "",
      address: "",
      showshop: "", //是否有门店标识
      shopList: [], //处理数据的数组
      arryShoplist: [], //最终循环数组
      judge:false,
      textdata: [],
    };
  },
  components: {
    commonHeader
  },
  created() {},
  onLoad(options) {
    http
      .get(getSecretKeyCodeByconfigType, { oauthEnvconfigType: "secretKid" })
      .then(res => {
        if (res.success) {
          this.keypassword = res.dataObj;
          $storage.set("mappPssword", res.dataObj);
          qqmapsdk = new QQMapWX({
            key: this.keypassword
          });
        } else {
          $message.alert(res.msg);
        }
      });
    this.getLocation();
    Object.assign(this.$data, this.$options.data()); //初始化数据
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set("prevpage", prevpage.route);
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    this.baseColor = "#" + this.$state.baseColor;
  },
  onShow() {},
  mounted() {},

  methods: {
    // 获取定位信息
    getLocation() {
      let that = this;
      wx.getLocation({
        type: "gcj02", //返回可以用于wx.openLocation的经纬度
        success: function(res) {
          var latitude = res.latitude; //维度
          var longitude = res.longitude; //经度
          that.loadCity(latitude, longitude); //根据定位解析城市名称  objs为1.则是首页，为0则是地址
        }
      });
    },

    //根据定位解析城市名称
    loadCity(latitude, longitude) {
      var that = this;
      let location = {
        latitude: latitude,
        longitude: longitude
      };
      qqmapsdk.reverseGeocoder({
        location: location || "",
        coord_type: 5,
        get_poi: 1,
        success: function(res) {
          that.address = res.result.address;
          that.getShoplist(location, res.result.ad_info.city);
        }
      });
    },
    // 获取所有店铺列表  obj  代表城市
    getShoplist(location, obj) {
        console.log("调用门店列表")
      let that = this;
      let params = {
        cityName: obj
      };
      http.get(queryStoreBySimpleObjPage, params).then(res => {
        this.shopList = res.list;
        let str = [];
        if (res.list.length > 0) {
          for (var j = 0; j < res.list.length; j++) {
            this.shopList[j].latitude = res.list[j].storeMapLocation.split(",")[0];
            this.shopList[j].longitude = res.list[j].storeMapLocation.split(",")[1];
          }
          this.getLocationShop(location, obj, this.shopList); //准备计算
        } else {
          this.arryShoplist = res.list;
          that.showshop = 1
        }
      });
    },

    //触发关键词输入提示事件
    getsuggest(e) {
      var that = this;
      that.judge = true;
      let searchName = e.mp.detail.value;
      console.log(e.mp.detail.value,"搜索条件")
      that.getLocationShop("", searchName, "");
    },

    //实施计算 location:经纬度； names：城市名称； str:店铺列表； num：0/1
    getLocationShop(location, names, str) {
      let parname;
      if (names) {
        parname = names;
      } else {
        parname = "";
      }
      var _this = this;
      var sug = [];
      //调用关键词提示接口
      qqmapsdk.getSuggestion({
        keyword: parname,
        success(res) {
          for (var i = 0; i < res.data.length; i++) {
            sug.push({
              title: res.data[i].title,
              id: res.data[i].id,
              addr: res.data[i].address,
              city: res.data[i].city,
              district: res.data[i].district,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng
            });
          }
           _this.textdata = sug;
           console.log("内容")
           _this.jsDis(location, str);
          // 1：首页，0：代表地址
        //   if (names == "") {
            // _this.textdata = _this.items;
        //   } else {
            // _this.textdata = sug;
            // if (_this.judge == 0 && _this.addrShow == 1) {
            // } else if (_this.judge == 1 && _this.addrShow == 0) {
            //   if (num == 1) {
            //     _this.judge = 0;
            //   } else {
            //   }
            // _this.jsDis(location, str);
            // }
        //   }
        }
      });
    },

    //计算距离
    jsDis(str, strlist) {
        console.log("计算距离")
      let sugs = [],
        _this = this;
      for (var j = 0; j < _this.shopList.length; j++) {
        sugs.push({
          latitude: _this.shopList[j].latitude,
          longitude: _this.shopList[j].longitude
        });
      }
      let startposition = {
        latitude: str.latitude,
        longitude: str.longitude
      };
      qqmapsdk.calculateDistance({
        from: startposition || "",
        to: sugs,
        success: function(res) {
          var res = res.result;
          for (var i = 0; i < strlist.length; i++) {
            strlist[i].distance = res.elements[i].distance;
          }

          strlist = strlist.filter(function(v) {
            return v.distance / 1000 < Number(v.storeDistribution);
          });
          var compare = function(obj1, obj2) {
            var val1 = obj1.distance;
            var val2 = obj2.distance;
            if (val1 < val2) {
              return -1;
            } else if (val1 > val2) {
              return 1;
            } else {
              return 0;
            }
          };
          _this.arryShoplist = strlist.sort(compare);
          if (_this.arryShoplist.length == 0) {
            _this.showshop = 1;
          }
        }
      });
    },

    //选择地址
    changeAddress(str0, str1,str) {
      // 1：首页，0：代表地址
      //   if (this.judge == 0 && this.addrShow == 0) {
      // if (this.chageShow == 1) {
      this.address = str;
      this.judge = false;
      console.log(str0,str1,"zhu")
      //   this.judge = 1;
      this.loadCity(str0, str1);
      // } else if (this.chageShow == 0) {
      //   $storage.set("addr", str);
      //   if ($storage.get("different") == "edit") {
      //     $router.push("o2o/pages/address_modules/address_edit");
      //   } else if ($storage.get("different") == "add") {
      //     $router.back(1, {
      //       stay: 500
      //     });
      //   }
      // }
    }
  },

  //选择门店
  changeShop(str) {
    http
      .get(getStoreInfo, {
        userinfoCode: str
      })
      .then(res => {
        var storeOpenTime = res.storeOpenTime;
        var storeCloseTime = res.storeCloseTime;
        http
          .get(getTginfoForTOCom, {
            memberCode: str
          })
          .then(res => {
            var resobj = res;
            console.log(res, "门店列表");
            $storage.set("shopinforCode", str);
            let gobackHome = $storage.get("getTopPerMenuList");
            gobackHome.map(v => {
              if (v.menuCode == "00000042") {
                let json = {
                  tginfoName: resobj.tginfoName,
                  shopadr: resobj.memberName,
                  gourl: resobj.tginfoCompanyurl,
                  storeOpenTime: storeOpenTime,
                  storeCloseTime: storeCloseTime
                };
                $storage.set("getshopinfor", JSON.stringify(json));
                this.$router.replace("web", {
                  defaultUrl:
                    "https://" +
                    resobj.tginfoCompanyurl +
                    "/paas/shop" +
                    v.menuAction
                });
              }
            });
          });
      });
  },
  close() {
    let gobackHome = $storage.get("getTopPerMenuList");
    if (
      $storage.get("getshopinfor") &&
      $storage.get("getshopinfor") != "" &&
      $storage.get("judge") == "1"
    ) {
      let goindex = JSON.parse($storage.get("getshopinfor")).gourl;
      gobackHome.map(v => {
        if (v.menuCode == "00000042") {
          this.$router.replace("web", {
            defaultUrl: "https://" + goindex + "/paas/shop" + v.menuAction
          });
        }
      });
    } else {
      this.$router.back();
    }
  }
  //   }
};
</script>
<style lang="less" scoped>
@import "../../../../../common/css/common.less";
.t-box {
  display: flex;
}

.t-box-flex1 {
  flex: 1;
}
.shopList-left {
  position: fixed;
  z-index: 10000;
  height: 90rpx;
  width: 70rpx;
  line-height: 90rpx;
  text-align: left;
  left: 30rpx;
  top: 0;
}

.selectAddress {
  background: #ffffff;
  position: relative;
  padding-top: 90rpx;
  &-search {
    width: 90%;
    margin: 5px auto;
    border: 1px solid #c3c3c3;
    height: 30px;
    border-radius: 3px;
    padding: 0 5px;
    border: 1px solid #ccc;
    border-radius: 40px;
    text-align: center;
    input {
      height: 30px;
      line-height: 30px;
    }
  }
  &-item {
    border-bottom: 1px solid #eee;
    .h1 {
      margin: 15px 20px 5px;
      font-size: 15px;
    }
    .h_address {
      font-size: 12px;
      color: gray;
      margin-bottom: 10px;
      margin-left: 20px;
    }
  }
}

.shoplist {
  .current-location {
    p {
      padding: 15px 20px 5px;
      font-size: 24rpx;
    }
    p:first-child {
      background: #fafafa;
      color: #999999;
    }
    p:last-child {
      i {
        display: inline;
        font-size: 24rpx;
        font-weight: 400;
      }
    }
  }
  .noshops {
    padding: 15px 20px 5px;
    font-size: 24rpx;
  }
  .shops {
    .shops-title {
      padding: 15px 20px 5px;
      background: #fafafa;
      color: #999999;
      font-size: 24rpx;
    }
  }
  .selectAddress-item {
    .h1 {
      p {
        font-size: 24rpx;
      }
      i {
        font-size: 22rpx;
      }
    }
  }
}
.orderLists-save {
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
</style>