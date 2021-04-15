<template>
  <div class="people-center">
    <div class="top-icon t-box" :style="{background:baseColor}">
      <div class="t-box-flex1">
        <i class="iconfont" style="width:40px;" @click="goback"></i>
      </div>
      <div class="right-cont">
        <i class="iconfont">&#xe75e;</i>
        <i class="iconfont">&#xe76a;</i>
      </div>
    </div>
    <div class="people-top">
      <div class="bgcolor" :style="{'color':baseColor}"></div>
      <!-- <img class="peo-img" :src="hyCard" @click="femo" /> -->
      <div class="t-box personal-msg">
        <div class="personal-img" @click="infoHandler">
          <img :src="userInfo.avatarUrl || userImgurl" @click="toPersonal" />
        </div>
        <div class="t-box-flex1 personal-name">
          <h3 v-if="userInfo.nickName">{{userInfo.nickName}}</h3>
          <p>小区-{{user.roadName || "美丽花园"}}</p>
          <p>地址-{{user.provinceName || ''}}{{user.cityName|| ''}}{{user.areaName|| ''}}{{user.companyAddress|| ''}}</p>

          <!-- <button
            class="nologin"
            v-if="!userInfo.nickName"
            open-type="getUserInfo"
            @getuserinfo="bindGetUserInfo"
          >登录/注册</button>-->
        </div>
        <div class="personal-er">
          <img src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/er.png" />
        </div>
      </div>
    </div>
    <div style="height:12rpx"></div>
    <div class="warp" v-for="(item,index) in menuList" :key="index">
      <div class="list-box">
        <h3 class="list-title">{{item.name}}</h3>
        <ul class="list flex">
          <li
            class="flex-item1"
            v-for="(items,indexs) in item.childList"
            :key="indexs"
            @click="flBtn(items.id)"
          >
            <p class="menu-icon">
              <i class="iconfont" :class="items.iconLists ? items.iconLists : 'icon-wodedingdan'"></i>
            </p>
            <p class="menu-title">{{items.menuname}}</p>
          </li>
        </ul>
      </div>
      <div class="line"></div>
    </div>
    <div class="top-indexBox" v-if="boxShow"></div>
    <div class="code" v-if="boxShow">
      <div class="t-right" @click="close">X</div>
      <h3>我的二维码</h3>
      <p>让客户扫描二维码为他服务</p>
      <div class="codes">
        <!-- <canvas style="width: 120px; height: 120px;margin:0 auto;" canvas-id="canvasId"></canvas> -->
        <img src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/er.png" class="img" alt />
      </div>
      <div class="share-btn">
        <button open-type="share" :style="{'background':baseColor,'border-color':baseColor}">一键分享</button>
        <!-- <span :style="{'background':baseColor,'border-color':baseColor}" @click="shareOther">
          <i class="iconfont">&#xe6e3;</i>分享给好友
        </span>-->
      </div>
    </div>
  </div>
</template>
<script>
import commonHeader from "@/components/communal/commonHeader";
import { $storage, $router } from "@/utils/prototype/vue.js";
import { code } from "@/utils/code.js";
import http from "@/api/http.js";
import { getPersonal } from "@/api/interface.js";
export default {
  components: { commonHeader },
  data() {
    return {
      leftIcon: false,
      rightIcon: false,
      baseColor: "",
      boxShow: false,
      hyCard: require("../../../../static/img/mine/pe.png"),
      // 画布的宽高要和object里面的宽高保持一致
      object: {
        text: "扫我干啥,扫你咋地", // 二维码的内容
        width: 120, // 二维码的宽
        height: 120, // 二维码的高
        canvasId: "canvasId" //canvas的ID（唯一标识）
      },
      menuList: [
        {
          name: "应用工具",
          childList: [
            {
              iconLists: "icon-xuqiu",
              menuname: "订单管理",
              id: "o2o/pages/order_modules/o2o_order/indexGroup"
            },
            {
              iconLists: "icon-bianji",
              menuname: "我的钱包",
              id: "o2o/pages/wallet/index"
            },
            {
              iconLists: "icon-sousuo1;",
              menuname: "配货单",
              id: "o2o/pages/order_modules/o2o_order/distribution"
            },
            {
              iconLists: "icon-sousuo1;",
              menuname: "团长信息",
              id: "user_modules/personal/indexStyle2"
            }
          ]
        }
      ],
      src: null,
      userInfo: $storage.get("userInfo"),
      user: {}
    };
  },
  onLoad(options) {
    this.getUser();
    Object.assign(this, this.$options.data());
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    this.baseColor = "#178d43";

    // console.log("555555555");
  },

  methods: {
    flBtn(id) {
      if (id) {
        this.$router.push(id);
      }
    },
    getUser() {
      http
        .get(getPersonal, { userId: this.$storage.get("userId") })
        .then(res => {
          this.user = res;
        });
    },
    goback() {
      this.$router.back();
    },
    getCode(object) {
      let that = this;
      var promise;
      console.log("开始生产二维码");
      // 调用生成二维码的函数
      code(object, function(data) {
        console.log(data, "that.src = data;");
        that.src = data;
      });
    },
    femo() {
      console.log("dinji--");
      // this.getCode(this.object);
      this.boxShow = true;
    },
    close() {
      console.log("xiaoshi+++");
      this.boxShow = false;
    },
    shareOther() {
      wx.showShareMenu({
        withShareTicket: true
      });
    },
    infoHandler() {
      $router.push("user_modules/personal/indexStyle2");
    }
  }
};
</script>
<style lang="less">
page {
  background: #ffffff;
}
</style>
<style lang="less" scoped>
@import "../../../../common/css/common.less";
.t-right {
  height: 60rpx;
  text-align: right;
  padding: 0 60rpx;
}
.personal-msg {
  width: 650rpx;
  padding: 40rpx 20rpx 20rpx;
  min-height: 170rpx;
  box-shadow: 1px 2px 5px rgb(211, 211, 211);
  border-radius: 10rpx;
  background: #fff;
  background: #fff;
  margin: 0 30rpx;
  position: absolute;
  top: 0;
  .personal-img {
    margin-right: 40rpx;
    img {
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
    }
  }
  .personal-name {
    h3 {
      font-size: 30rpx;
      color: #333;
      margin-top: 20rpx;
    }
    p {
      font-size: 26rpx;
      color: #999;
      margin-top: 10rpx;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
    }
  }
}
.personal-er {
  img {
    width: 100rpx;
    height: 100rpx;
    margin: 25rpx;
  }
}
.top-indexBox {
  background-color: rgba(0, 0, 0, 0.5);
  background-color: black;
  opacity: 0.5;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100002;
  color: #ffffff;
}
.code {
  padding-top: 30rpx;
  text-align: center;
  width: 600rpx;
  height: 600rpx;
  border-radius: 50rpx;
  background: #ffffff;
  position: fixed;
  top: 20%;
  left: 75rpx;
  z-index: 100003;
  h3 {
    margin-bottom: 20rpx;
    font-weight: 600;
  }
}
.codes {
  text-align: center;
  margin-top: 40rpx;
  margin-bottom: 40rpx;
  img {
    width: 240rpx;
    height: 240rpx;
    display: block;
    margin: 0 auto;
  }
}
.share-btn {
  margin-top: 40rpx;
  color: #ffffff;
  button {
    color: #fff;
    width: 240rpx;
    margin: 0 auto;
  }
  .iconfont {
    display: inline-block;
    margin-right: 4rpx;
  }
  span {
    display: inline-block;
    border: 1rpx solid #000000;
    border-radius: 80rpx;
    padding: 4rpx 40rpx;
  }
}
.t-box {
  display: flex;
}

.t-box-flex1 {
  flex: 1;
}

.t-box-flex2 {
  flex: 2;
}
.top-icon {
  color: #ffffff;
  height: 98rpx;
  line-height: 98rpx;
  padding: 0 30rpx;
}
.right-cont {
  i {
    display: inline-block;
  }
  i:last-child {
    margin-left: 20rpx;
  }
}
.goodsList-left {
  position: fixed;
  z-index: 9999;
  height: 90rpx;
  width: 70rpx;
  line-height: 90rpx;
  text-align: left;
  left: 30rpx;
  top: 0;
  color: #ffffff;
}
.goodsList-right {
  position: fixed;
  z-index: 9999;
  height: 90rpx;
  width: 140rpx;
  line-height: 90rpx;
  text-align: right;
  right: 30rpx;
  top: 0;
  color: #ffffff;
  i {
    display: inline-block;
  }
  i:first-child {
    margin-right: 30rpx;
  }
}
.people-top {
  position: relative;
  .bgcolor {
    height: 180rpx;
    width: 100%;
    background: #07913b;
    padding-bottom: 36rpx;
    margin-bottom: 20rpx;
  }
  .peo-img {
    position: absolute;
    top: 0rpx;
    left: 0rpx;
    display: inline-block;
    width: 686rpx;
    height: 226rpx;
    margin: 0 auto;
    margin-left: 5%;
    border-radius: 20rpx;
    box-shadow: 0rpx 6rpx 6rpx rgba(0, 0, 0, 0.1);
  }
}
.list-box {
  padding: 0 30rpx;
  .list-title {
    height: 80rpx;
    line-height: 80rpx;
    border-bottom: 1rpx solid #f2f2f2;
    font-size: 32rpx;
    font-weight: 600;
  }
  .list {
    overflow: hidden;
    margin-top: 20rpx;
    li {
      // background: pink;
      padding-bottom: 20rpx;
      .menu-icon {
        width: 90rpx;
        height: 90rpx;
        line-height: 90rpx;
        background: green;
        border-radius: 50%;
        margin: 0 auto;
        margin-bottom: 20rpx;
        color: #ffffff;
        text-align: center;
        .iconfont {
          font-size: 42rpx;
        }
      }
      .menu-title {
        text-align: center;
        font-size: 28rpx;
      }
    }
  }
}
.line {
  width: 100%;
  height: 20rpx;
  background: #f2f2f2;
}

// .warp .line:last-child {
//     background: #ffffff;
// }
</style>