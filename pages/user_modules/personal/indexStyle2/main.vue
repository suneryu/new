<template>
  <div class="personal">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <!-- <div class="personal-save" @click="messageSave">保存</div> -->
    <div class="personal-img">
      <div class="flex align--center">
        <p class="flex-item1">头像</p>
        <img :src=" userInfo.avatarUrl||userImgurl" />
      </div>
    </div>
    <div class="personal-con">
      <ul>
        <li>
          团长姓名:
          <span>{{userMsg.userinfoCompname}}</span>
        </li>
        <li>
          所属小区：
          <span>{{userMsg.roadName || "美丽花园"}}</span>
        </li>
        <li>
          自提点地址：
          <span>{{userMsg.provinceName || ''}}{{userMsg.cityName|| ''}}{{userMsg.areaName|| ''}}{{userMsg.companyAddress|| ''}}</span>
        </li>
        <li class="flex er">
          <p class="flex-item1">我的二维码</p>
          <img src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/er.png" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { getPersonal, changePersonal } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
export default {
  data() {
    return {
      title: "团长信息",
      leftIcon: true,
      rightIcon: false,
      baseColor: "",
      userBirthday: "请选择",
      userMsg: {},
      userInfo: {},
      userImgurl: require("../../../../static/img/mine/default_header.png")
    };
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
  },
  components: {
    commonHeader
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    this.userInfo = this.$storage.get("userInfo");
    http
      .post(getPersonal, { userId: this.$storage.get("userId") })
      .then(res => {
        this.userMsg = res;
      });
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@import "../../../../common/css/common.less";
.personal {
  width: 100%;
  height: 100%;
  background: @white-color;
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
  &-img {
    padding: 110rpx 0 20rpx;
    // border-bottom: 20rpx solid #fafafa;
    margin: 0 30rpx;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    border-bottom: 1rpx solid #f6f6f8;
    img {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }
  }
  &-con {
    padding: @padding-30;
    ul {
      li {
        border-bottom: 1rpx solid #f6f6f8;
        height: 99rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: @big-title;
        color: @color-333;
        p {
          display: flex;
          align-items: center;
          span {
            display: flex;
            align-items: center;
            i {
              margin-right: 10rpx;
              color: #8d8d8d;
            }
            &:first-child {
              margin-right: 38rpx;
            }
          }
        }
      }
    }
  }
  .er {
    padding: 20rpx 0;
    img {
      width: 100rpx;
      height: 100rpx;
    }
  }
}
</style>




