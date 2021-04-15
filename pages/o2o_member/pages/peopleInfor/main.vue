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
    <!-- <div class="goodsList-left" @click="goBack">
      <i class="iconfont">&#xe62d;</i>
    </div>
    <div class="goodsList-right">
      <i class="iconfont">&#xe75e;</i>
      <i class="iconfont">&#xe76a;</i>
    </div>-->
    <div class="people-top">
      <div class="bgcolor" :style="{'color':baseColor}"></div>
      <img class="peo-img" :src="hyCard" @click="femo" />
    </div>
    <div class="warp" v-for="(item,index) in menuList" :key="index">
      <div class="list-box">
        <h3 class="list-title">{{item.name}}</h3>
        <ul class="list flex">
          <li class="flex-item1" v-for="(items,indexs) in item.childList" :key="indexs" @click="flBtn(items.id)">
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
          name: "客户管理",
          childList: [
            { iconLists: "icon-kehuguanli1", menuname: "我的客户",id:'' },
            { iconLists: "icon-kefu-", menuname: "在线咨询",id:'' },
            { iconLists: "icon-web-icon-", menuname: "营销推广", id:'o2o_member/pages/promotion' },
            // { icon: "&#xe792;", menuname: "在线咨询" }
          ]
        },
        {
          name: "订单管理",
          childList: [
            { iconLists: "icon-wodedingdan", menuname: "代客下单",id:'' },
            { iconLists: "icon-xuqiu", menuname: "订单管理" ,id:'o2o_member/pages/orderList' },
            { iconLists: "icon-shangdian1", menuname: "预约下单",id:'' },
            // { icon: "&#xe792;", menuname: "在线咨询" }
          ]
        },
        {
          name: "业绩管理",
          childList: [
            { iconLists: "icon-bianji", menuname: "业绩统计",id:'' },
            { iconLists: "icon-sousuo1;", menuname: "佣金查询" ,id:'' },
          ]
        }
      ],
      src: null
    };
  },
  onLoad(options) {
    Object.assign(this, this.$options.data());
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    this.baseColor = "#178d43";

    console.log("555555555");
  },

  methods: {
      flBtn(id){
          if(id){
 this.$router.push(id)
          }
         
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
    margin-bottom: 182rpx;
  }
  .peo-img {
    position: absolute;
    top: 0rpx;
    left: 0rpx;
    display: inline-block;
    width: 686rpx;
    height: 355rpx;
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