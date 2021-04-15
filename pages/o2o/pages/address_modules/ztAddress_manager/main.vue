<template>
  <div class="address">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="search-infor t-box-flex1">
      <input
        @input="onSubmit($event)"
        confirm-type="search"
        placeholder="请输入关键字搜索"
        placeholder-style="color:#999"
        type="text"
        v-model="inputValue"
      />
      <div class="selectAddress" v-if="selectAddressState">
        <div
          class="selectAddress-item"
          v-for="(item,index) in textdata"
          :key="index"
          @click="changeAddress(item.latitude,item.longitude,item.title)"
        >
          <p class="h1">{{item.title}}</p>
          <!-- <p class="h_address">{{item.addr}}</p> -->
        </div>
      </div>
    </div>
    <div class="ceng"></div>
    <div class="address-ul" v-if="items.length>0">
      <ul>
        <li
          class="address-ul-li"
          v-for="(item,index) in items"
          :key="index"
          @click="chooseAddress(item)"
        >
          <div class="address-ul-li-info">
            <div class="address-ul-li-info-con">
              <h3>
                <div style="text-align:center">{{item.userinfoCompname}}</div>
                <div
                  v-show="zitiadd&&zitiadd.userinfoCode == item.userinfoCode"
                  :style="{background:baseColor}"
                >默认</div>
                <!-- <div
                  v-show="zitiadd&&zitiadd.userinfoCode == item.userinfoCode"
                  :style="{background:baseColor}"
                >默认</div>-->
              </h3>
              <div>
                <span>{{item.userinfoConPhone}}</span>
                <div class="address-detail">
                  <div>{{item.provinceName}}{{item.cityName}}{{item.areaName}}</div>
                  <div>{{item.companyAddress}}</div>
                </div>
              </div>
            </div>
            <div class="address-ul-li-info-icon">
              <span>{{item.dis}}Km</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="address-nulls" v-if="items.length == 0 && requestStatic">
      <img :src="nullImg" />
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { QQMapWX } from "@/utils/location/qqmap-wx-jssdk.js";
import {
  addressList,
  deleteAddress,
  queryZtaddressList,
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
      title: "自提点列表",
      leftIcon: true,
      rightIcon: true,
      items: [],
      baseColor: "",
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noAddress.png",
      isBack: "", // 判断是从购物车过来的 选择地址后会回调地址到上个页面
      requestStatic: false,
      rows: 10, //一页显示10条数据
      page: 1, //当前页数
      keypassword: "", //授权密钥
      address: "",
      zitiadd: "",
      textdata: [],
      selectAddressState: false
    };
  },
  components: {
    commonHeader
  },
  onLoad(options) {
    this.zitiadd = "";
    this.zitiadd = $storage.get("zitiAddress")
      ? $storage.get("zitiAddress")
      : "";
    console.log(this.zitiadd, "地址");
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    this.params = {
      page: 1,
      rows: this.rows
    };
    http
      .get(getSecretKeyCodeByconfigType, { oauthEnvconfigType: "secretKid" })
      .then(res => {
        if (res.success) {
          this.keypassword = res.dataObj;
          $storage.set("mappPssword", res.dataObj);
          qqmapsdk = new QQMapWX({
            key: this.keypassword
          });
          this.getLocation(); //获取定位
        }
      });
  },
  mounted() {
    this.zitiadd = "";
    this.baseColor = "#" + this.$state.baseColor;
    // this.commonMounted();
  },
  methods: {
    // 获取定位信息
    getLocation() {
      let that = this;
      wx.getLocation({
        type: "gcj02", //返回可以用于wx.openLocation的经纬度
        success: function(res) {
          var latitude = res.latitude; //维度
          var longitude = res.longitude; //经度
          $storage.set("latitude", res.latitude); //存纬度
          $storage.set("longitude", res.longitude); //存经度
          that.loadCity(latitude, longitude); //根据定位解析城市名称  objs为1.则是首页，为0则是地址
        }
      });
    },
    onSubmit(e) {
      var that = this;
      let searchName = e.mp.detail.value;
      that.getLocationShop("", searchName, "", 1);
      this.selectAddressState = true;
    },
    //根据经纬度确认地址
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
    //实施计算 location:经纬度； names：城市名称； str:店铺列表； num：0/1
    getLocationShop(location, names, str, num) {
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
          // 1：首页，0：代表地址
          if (names == "") {
            _this.textdata = _this.items;
          } else {
            _this.textdata = sug;
            if (_this.judge == 0 && _this.addrShow == 1) {
            } else if (_this.judge == 1 && _this.addrShow == 0) {
              if (num == 1) {
                _this.judge = 0;
              } else {
              }
              _this.jsDis(location, str);
            }
          }
        }
      });
    },
    //选择地址
    changeAddress(str0, str1, str) {
      let that = this;
      console.log(str0, str1, str, "str0, str1, str");
      this.selectAddressState = false;
      that.loadCity(str0, str1); //根据定位解析城市名称  objs为1.则是首页，为0则是地址
    },
    //获取自提点地址
    getShoplist(location, obj) {
      let that = this;
      let params = {
        cityName: obj,
        rows: this.rows,
        page: this.page
      };
      http.get(queryZtaddressList, params).then(res => {
        that.items = [];
        if (res.list.length > 0) {
          res.list.map(el => {
            qqmapsdk.geocoder({
              //获取表单传入地址
              address: el.provinceName + el.cityName + el.companyAddress, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
              success: function(res) {
                //成功后的回调
                var res = res.result;
                var latitude = res.location.lat;
                var longitude = res.location.lng;
                let fromaddress = location;
                let sugs = [
                  {
                    latitude: latitude,
                    longitude: longitude
                  }
                ];
                qqmapsdk.calculateDistance({
                  from: fromaddress || "",
                  to: sugs,
                  success: function(res) {
                    var resdate = res.result;
                    el.dis = resdate.elements[0].distance / 1000;
                    if (el.dis <= 5) {
                      that.items.push(el);
                    }
                  }
                });
              },
              fail: function(error) {
                console.error(error);
              },
              complete: function(res) {
                console.log(res);
              }
            });
          });
        }
      });
    },
    commonMounted() {
      http.get(queryZtaddressList, this.params).then(res => {
        console.log(res, "shu");
        this.items = res;
        this.requestStatic = true;
      });
    },
    chooseAddress(item) {
      $storage.set("zitiAddress", item);
      $router.push("o2o/pages/o2o_ShoppingCart/o2o_order", { date: 2 });
    }
  }
};
</script>
<style lang="less" >
page {
  background: #ffffff;
}
</style>
<style lang="less" scoped>
@import "../../../../../common/css/common.less";

.address {
  position: relative;
  padding-top: 90rpx;
  width: 100%;
  .search-infor {
    margin: 20rpx;
    position: relative;
    input {
      height: 50rpx;
      border-radius: 50rpx;
      border: 1rpx solid #eeeeee;
      font-size: 28rpx;
      padding: 10rpx 20rpx;
    }
    .selectAddress {
      position: fixed;
      background: #fff;
      top: 200rpx;
      left: 0;
      width: 100%;
      min-height: 500rpx;
      height: auto;
      overflow-y: scroll;
      // border-radius: 0 0 10rpx 10rpx;
      // box-shadow: 0rpx 2rpx 10rpx #eee;
      .selectAddress-item {
        padding: 25rpx 30rpx;
        border-bottom: 2rpx solid #f5f5f5;
      }
    }
  }
  &-add {
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
  &-ul {
    margin: 0 30rpx;
    &-li {
      border-bottom: 1rpx solid #f6f6f8;
      padding: 33rpx 0 30rpx 0;
      &-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        &-con {
          display: flex;
          h3 {
            margin-right: 39rpx;
            div {
              &:first-child {
                margin-bottom: 20rpx;
              }
              &:last-child {
                color: @white-color;
                border-radius: 18rpx;
                height: 36rpx;
                line-height: 36rpx;
                padding: 0 10rpx;
                font-size: 20rpx;
                text-align: center;
                background: #b3a07c;
              }
            }
          }
          span {
            margin-bottom: 20rpx;
            display: inline-block;
          }
          .address-detail {
            font-size: @middle-title;
            color: @color-666;
            div {
              &:last-child {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 400rpx;
              }
            }
          }
        }
        &-icon {
          display: flex;
          align-items: center;
          i {
            &:last-child {
              margin: 0 10rpx 0 25rpx;
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
      width: 438rpx;
      height: 280rpx;
      margin: 280rpx auto 0;
    }
  }
}
</style>




