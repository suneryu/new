<template>
  <div class="homepage-content">
    <!-- 	<div class="search-box" >
			<div class="box-center" @click="search()">
				<u-search placeholder="输入商品名称" :show-action="false" disabled="false"></u-search>
			</div>
			<div class="box-right" @click="Minemsg()">
				<span class="iconfont icon-tishi"></span>
			</div>
		</div> -->
    <div style="display: flex;background-color: #fff;position: fixed;width: 100%;z-index: 99;">
      <div
        class="constractName0"
        @click="parts('0')"
        :style="{ color: fontColor1 }"
      >
        零配件预付款合同
      </div>
      <div
        class="constractName1"
        @click="parts('1')"
        :style="{ color: fontColor2 }"
      >
        固定价格合同
      </div>
      <div
        class="constractName2"
        @click="parts('2')"
        id="constractName3"
        :style="{ color: fontColor3 }"
      >
        线下销售合同
      </div>
    </div>
    <div style = 'position: relative;margin-top: 40px;'>
      <div v-for="items in contractData">
        <div
          style="
            width: 100%;
            height: 150px;
            padding: 0 8px 0 8px;
            border-top: 10rpx solid #fafafa;
            border-bottom: 10rpx solid #fafafa;
          "
        >
          <div
            style="
              width: 100%;
              height: 30px;
              display: flex;
              border-bottom: 1rpx solid #e0e0e0;
              font-size: 11px;
            "
          >
            <div style="width: 70%; line-height: 30px">
              合同编号：<span>{{ items.scontractObillcode }}</span>
            </div>
            <div style="width: 30%; line-height: 30px; text-align: center">
              {{ items.memberGname }}
            </div>
          </div>
          <div
            style="
              width: 100%;
              height: 100px;
              border-bottom: 1rpx solid #e0e0e0;
            "
          >
            <div
              style="height: 25px;width: 100%;font-size: 14px; sans-serif;font-weight: 400;font-style: normal;line-height: 25px;"
            >
              {{ items.scontractName }}
            </div>
            <div
              style="
                height: 25px;
                width: 100%;
                font-size: 13px;
                line-height: 25px;
              "
            >
              合同描述： <span>{{ items.contractRemark }}</span>
            </div>
            <div style="height: 25px; width: 100%; display: flex">
              <div
                style="
                  height: 25px;
                  width: 80%;
                  font-size: 11px;
                  color: rgba(153, 153, 153, 0.619607843137255);
                  line-height: 25px;
                "
              >
                合同金额：<span>￥{{ items.goodsMoney }}</span>
              </div>
              <div
                class="lookconstr"
                style="height: 25px; width: 20%; text-align: center"
              >
                <u style="text-decoration: underline" @click="preview(items)"
                  >合同预览</u
                >
              </div>
            </div>
            <div style="height: 25px; width: 100%; display: flex">
              <div
                style="
                  height: 25px;
                  width: 80%;
                  font-size: 11px;
                  color: rgba(153, 153, 153, 0.619607843137255);
                  line-height: 25px;
                "
              >
                合同有效时间：<span>{{ items.date1 }}~{{ items.date2 }}</span>
              </div>
              <div
                style="height: 25px; width: 20%"
                v-if="items.memberGcode == 0"
              >
                <button class="buttonClass" @click="useContract(items)" v-if="now > items.contractValidate && items.dataState == 1" > 使用合同 </button>
                <button class="buttonClass" v-if="items.dataState == 0" > 未开始 </button>
                <button class="buttonClass" v-if="items.dataState == 2" > 已暂停 </button>
                <button class="buttonClass" v-if="items.dataState == 3" > 已禁用 </button>
                <button class="buttonClass" v-if="items.dataState == 4" > 已完成 </button>
                <button class="buttonClass" v-if="items.dataState == 5" > 已关闭 </button>
                <!-- <button class="buttonClass1" v-if='now < items.contractValidate'>待启用</button> -->
              </div>
              <!-- <div style='height: 25px;width: 20%;' v-if='items.memberGcode == 1'><button class="buttonClass">使用合同</button></div> -->
            </div>
          </div>
          <div style="width: 100%; height: 20px; display: flex">
            <div class="lessMoney">进度：{{ items.memberCcode }}%</div>
            <div class="lessMoney" v-if="items.memberGcode == 0">
              余额：{{ items.memberCname }}
            </div>
            <div
              class="lessMoney"
              style="text-decoration: underline; width: 35%; text-align: right"
              v-if="items.memberGcode == 0"
              @click="order(items.scontractObillcode)"
            >
              使用详情
            </div>
          </div>
        </div>
      </div>
    </div>
    <view class="popup" v-show="htImg">
      <view class="htImage">
        <div
          style="
            text-align: right;
            font-size: 18px;
            color: azure;
            font-weight: 800;
          "
        >
          <span @click="htImg = false">关闭</span>
        </div>
        <img
          class="htImg"
          :src="img + fileUrl"
          @click="savePhoto(img + fileUrl)"
        />
        <div style="font-size: 16px; font-weight: 900; color: #fff">
          点击图片进行下载
        </div>
      </view>
    </view>
  </div>
</template>		

<script>
import vueTabBar from "@/components/communal/vueTabBar";
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import {
  getHomePage,
  queryScontractPageNew,
  queryBuyerScontractPage,
  queryScontractFilePage,
} from "@/api/interfaceHDB.js";
export default {
  data() {
    return {
      now: new Date().getTime(),
      fileUrl: "", // 图片的url
      htImg: false, //图片点击展示
      img: this.$imgDomain, // 域名
      selectValue: false,
      imgDefalut: "icon-arrfill_l",
      contractData: [
        {
          scontractName: "千匠",
          goodsMoney: "1000.00",
          scontractNbcode: "1年",
          contractValidate: "2020/11/02",
          contractPaydate: "2021/02/24",
          contractRemark: "合同的描述。。。。。",
          memberCcode: "25",
          memberCname: "12032",
        },
        {
          scontractName: "千禧",
          goodsMoney: "2000.00",
          scontractNbcode: "2年",
          contractValidate: "2022/11/02",
          contractPaydate: "2023/02/24",
          contractRemark: "千禧合同的描述。。。。。",
          memberCcode: "25",
          memberCname: "12032",
        },
      ],
      iconShow1: true, //线下合同弹出层
      iconShow2: false,
      fontColor1: "#004178", //字体颜色
      fontColor2: "#000000", //字体颜色
      fontColor3: "#000000", //字体颜色
      page: 1,
      info: {}, //登录人信息
      userPhone: "", //当前登录人的手机号
      userinfoType: "", // 用户类型
    };
  },
  onLoad() {
    this.baseColor = `#${$storage.get("baseColor")}`;
    wx.setNavigationBarTitle({
      title: "合同列表",
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      // backgroundColor: this.baseColor,
      backgroundColor: "#374e80",
    });
  },
  created() {
    this.userinfoType = $storage.get("loginInfor").userinfoType;
    console.log($storage.get("loginInfor"), "$storage.get('loginInfor')");
    console.log(
      $storage.get("loginInfor").userPhone,
      "$storage.get('loginInfor').userPhone"
    );
    this.info = $storage.get("loginInfor");

    console.log("userPhone", this.info.userPhone);
    let parmas = {
      memberGcode: "0",
      contractInvstate: 1,
      rows: 10,
      page: 1,
      goodsSupplierName: this.info.userPhone,
    };
    this.getData(parmas);
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    console.log("this.contractData[0]", this.contractData[0].memberGcode);
    this.loadMore(this.contractData[0].memberGcode);
  },
  methods: {
    //保存图片
    savePhoto(data) {
      console.log("data", data);
      const _this = this;
      wx.getImageInfo({
        src: data,
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.path,
            success(result) {
              // _this.setData({ show: false });
              wx.showToast({
                title: "保存成功",
                icon: "success",
                duration: 2000,
              });
            },
            fail(err) {
              if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                wx.openSetting({
                  success(settingdata) {
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      _this.savePhoto();
                    } else {
                      wx.showToast({
                        title: "获取权限失败,无法保存图片",
                        icon: "success",
                        duration: 2000,
                      });
                    }
                  },
                });
              }
            },
          });
        },
      });
    },
    //点击使用合同
    useContract(items) {
      console.log("点击使用合同,跳转到合同列表页", items);
      // $router.push("hdb/personCenter/myContractGoodsList",items)
      $router.push("hdb/contractGoodsList", {
        scontractCode: items.scontractCode,
        scontractName: items.scontractName,
		contractProperty:items.scontractId
      });
    },
    //查询合同附件的接口
    queryScontractFilePage(item) {
      let data = item;

      console.log("合同信息code", data.scontractCode);
      http
        .get(queryScontractFilePage, {
          scontractCode: data.scontractCode,
        })
        .then((res) => {
          console.log("合同附件", res);
          console.log("合同附件", this.userinfoType);
          res.rows.forEach((element) => {
            if (element.memo == "1") {
              console.log("scontractFileUrl...", element.scontractFileUrl);
              this.fileUrl = element.scontractFileUrl;
            }
            // this.contractData = res.rows;
          });
        });
    },
    //合同预览
    preview(items) {
      this.htImg = true;
      console.log("合同预览，，，", items);
      this.queryScontractFilePage(items);
      if (this.fileUrl == null || this.fileUrl == "") {
        //this.tankuang();
      } else {
        console.log("有信息");
      }
      console.log(this.fileUrl);
    },

    // //预览合同
    // preview(items){
    // 	//点击预览图片
    // 	this.htImg = true;
    // 	console.log("传来的参数：+",items)
    // },

    //懒加载的事件
    loadMore(code) {
      this.page++;
      console.log("qqqqqqqqqqqqaaaaa", this.page);
      console.log("qqqqqqqqqqqqaaaaa2", code);
      let parmas = {
        memberGcode: code,
        contractInvstate: 0,
        rows: 10,
        page: this.page,
        goodsSupplierName: this.info.userPhone,
      };
      http.get(queryBuyerScontractPage, parmas).then((res) => {
        console.log("resData....", res);

        res.rows.forEach((element) => {
          element.date1 = this.format(element.contractEffectivedate);
          element.date2 = this.format(element.contractDepositdate);
          this.contractData.push(element);
          // this.contractData = res.rows;
        });
      });
    },

    //根据合同类型查询合同数据
    parts(data) {
      console.log(data, "data");
      if (data == "0") {
        console.log("零配件预付款合同");
        this.fontColor1 = "#004178"; //字体颜色
        this.fontColor2 = "#000000"; //字体颜色
        this.fontColor3 = "#000000"; //字体颜色
        //合同查询接口  web/sp/scontract/queryScontractPageNew.json? memberGcode=2-1,2-2&contractInvstate=0

        this.page = 1; //第一次展示的十条数据
        //合同查询接口  web/sp/scontract/queryScontractPageNew.json? memberGcode=2-1,2-2&contractInvstate=0
        let parmas = {
          memberGcode: "0",
          contractInvstate: 1,
          rows: 10,
          page: 1,
          goodsSupplierName: this.info.userPhone,
        };
        this.getData(parmas);
      }
      if (data == "1") {
        console.log("固定价格合同");
        this.fontColor1 = "#000000"; //字体颜色
        this.fontColor2 = "#004178"; //字体颜色
        this.fontColor3 = "#000000"; //字体颜色

        this.page = 1; //第一次展示的十条数据
        //合同查询接口  web/sp/scontract/queryScontractPageNew.json? memberGcode=2-1,2-2&contractInvstate=0
        let parmas = {
          memberGcode: "1",
          contractInvstate: 1,
          rows: 10,
          page: 1,
          goodsSupplierName: this.info.userPhone,
        };
        this.getData(parmas);
      }
      if (data == "2") {
        console.log("线下销售合同");
        this.fontColor1 = "#000000"; //字体颜色
        this.fontColor2 = "#000000"; //字体颜色
        this.fontColor3 = "#004178"; //字体颜色

        let parmas = {
          memberGcode: "2",
          contractInvstate: 1,
          rows: 10,
          page: 1,
          goodsSupplierName: this.info.userPhone,
        };
        this.getData(parmas);
      }
    },
    getData(data) {
      // 查询当前买家合同
      http.get(queryBuyerScontractPage, data).then((res) => {
        console.log("resData....", res);
        if (res.total > 0) {
          res.rows.forEach((element) => {
            element.date1 = this.format(element.contractEffectivedate);
            element.date2 = this.format(element.contractDepositdate);
            if (element.memo == this.userinfoType) {
              console.log(",,,", element.scontractFileUrl);
            }
            this.contractData = res.rows;
          });
        } else {
          this.contractData = [];
        }
      });
    },
    format(shijianchuo) {
      //shijianchuo是整数，否则要parseInt转换
      var time = new Date(shijianchuo);
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      // var h = time.getHours();
      // var mm = time.getMinutes();
      // var s = time.getSeconds();
      return y + "-" + this.add0(m) + "-" + this.add0(d);
    },
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    search() {
      uni.navigateTo({
        url: "../../../search_modules/index/main",
      });
    },
    Minemsg() {
      this.$qj.router.push("user_modules/user/user-ui/webMail");
    },
    order(scontractObillcode) {
      this.$router.push("hdb/personCenter/contractOrder", {
        scontractObillcode,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.popup {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9998;
}

.popup-title {
  font-size: 14px;
  font-weight: 700;
}

.popup-log {
  font-size: 15px;
  font-weight: 500;
  color: #666666;
  margin: 24rpx;
}

.popup-btn {
  display: flex;
  border-top: 1rpx solid #e6e5e5;
  margin-top: 100rpx;
}

.popup-btn .btn {
  width: 50%;
  padding: 10px;
}
button {
  font-size: 30rpx;
  width: 90%;
  margin: 10rpx;
  background: #fff;

  &::after {
    border: none;
  }
}

.popup-info {
  position: fixed;
  width: 550upx;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30upx;
  padding: 40upx 0 10rpx 0;
  border-radius: 20upx;
  background-color: #fff;
  z-index: 9999;
  text-align: center;
}

.htImg {
  margin: 0 auto;
}

.htImage {
  text-align: center;
  width: 88%;
  height: 570px;
  margin: 0 auto;
  border: 1px solid #fff;
  position: absolute;
  top: 60px;
  left: 22px;
  z-index: 20000;
}
.lessMoney {
  width: 30%;
  height: 20px;
  line-height: 20px;
  font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  color: #02a7f0;
}
.chekboxType {
  width: 45%;
  height: 39.5rem;
  box-shadow: 0px 0px 10px gray;
  background-color: #ffffff;
  position: absolute;
  top: 93px;
  right: 0;
}

.checkDiv {
  margin-top: 10px;
  margin-left: 10px;
  font-size: 13px;
}

.cancelBtn,
.sureBtn {
  display: inline-block;
  width: 55px;
  height: 30px;
  font-size: 12px;
}

.cancelBtn {
  position: absolute;
  left: 15px;
  bottom: 5px;
}
.sureBtn {
  position: absolute;
  right: 20px;
  bottom: 5px;
}

.cancelBtn:hover,
.sureBtn:hover {
  color: white;
  background-color: skyblue;
}
.lookconstr {
  font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 10px;
  color: #169bd5;
}
.miaoshu {
  font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 10px;
  color: #7f7f7f;
}
.money {
  font-size: 11px;
  color: rgba(153, 153, 153, 0.619607843137255);
}
.buttonClass {
  width: 80%;
  height: 30rpx;
  line-height: 30rpx;
  color: #fff;
  background-color: #004178;
  font-size: 12px;
}
.buttonClass1 {
  width: 80%;
  height: 30rpx;
  line-height: 30rpx;
  color: #fff;
  background-color: #4f4f4f;
  font-size: 12px;
}
.entryName {
  width: 30%;
  font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
  font-weight: 400;
  font-style: normal;
  margin-top: 10rpx;
}
.effctivTime {
  width: 30%;
  font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 10px;
  color: #aaaaaa;
  text-align: left;
  line-height: 60rpx;
}
.contractType {
  width: 40%;
  font-family: "PingFangSC-Regular", "PingFang SC", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  text-align: right;
}
.constractName0 {
  width: 34%;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  font-family: "PingFangSC-Medium", "PingFang SC Medium", "PingFang SC",
    sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 13px;
  // color: #004178;
}
.constractName1 {
  width: 33%;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  font-family: "PingFangSC-Medium", "PingFang SC Medium", "PingFang SC",
    sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 13px;
}
.constractName2 {
  width: 33%;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  font-family: "PingFangSC-Medium", "PingFang SC Medium", "PingFang SC",
    sans-serif;
  font-weight: 500;
  font-style: normal;
  font-size: 13px;
}
.constractName3 {
  width: 8%;
  height: 80rpx;
  text-align: left;
  line-height: 80rpx;
}

.search-box {
  background-color: #ffffff;
  z-index: 1000;
  height: 100rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #f4f4f5;

  .box-left {
    height: 80rpx;
    width: 80rpx;
    padding: 10rpx;
    line-height: 80rpx;
    margin-left: 20rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .box-center {
    width: 500rpx;
    height: 100%;
    line-height: 100rpx;
  }

  .box-right {
    height: 80rpx;
    width: 80rpx;
    padding: 10rpx;
    margin-left: 10rpx;
    line-height: 80rpx;
    text-align: center;

    span {
      height: 100%;
      width: 100%;
      font-size: 38rpx;
    }
  }
}
</style>








