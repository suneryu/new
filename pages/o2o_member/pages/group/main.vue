<template>
  <div class="evaluate-box bc">
    <section @touch.stop id="evaluate-box-inner">
      <div class="p-s">
        <div class="commonHeader-leftIcon" @click="()=>{$router.back(1,{stay: 500})}">
          <i class="iconfont">&#xe62d;</i>
        </div>
        <div class="g-title">申请成为团长</div>
        <div class="g-share">分享给微信好友,下单即可返佣</div>
        <img
          src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/wx-img/groupBg.png"
          alt
          width="100% "
          height="100%;"
        />
      </div>

      <article class="score_con">
        <ul id="ull">
          <!-- 循环商品 -->
          <li class="lii">
            <span class="remark">*</span>
            <input v-model="name" class="inp form" type="text" placeholder="请输入您的姓名" />
          </li>
          <li class="lii">
            <span class="remark">*</span>
            <input v-model="phone" class="inp form" type="text" placeholder="请输入您的手机号" />
          </li>
          <li class="lii">
            <span class="remark">*</span>
            <input v-model="email" class="inp form" type="text" placeholder="请输入您的邮箱" />
          </li>
          <li class="lii">
            <span class="remark">*</span>
            <input v-model="idcode" class="inp form" type="text" placeholder="请输入您的身份证号" />
          </li>

          <li class="limg">
            <div v-for="(item,index) in goodsList" :key="index" class="goodslist">
              <div class="result" name="result">
                <div>
                  <form action>
                    <div class="weui-uploader__input-box">
                      <div class="weui-uploader__input">
                        <div class="g-img" v-if="item.result">
                          <img
                            :src="item.result"
                            style="width:100%;height:100%"
                            alt
                            class="moreImg"
                          />

                          <span class="iconfont icon-delete" @click="delImg(index)"></span>
                        </div>
                        <div class="apply-up-img" v-else @click="chooseImage(index)">
                          <i class="iconfont">&#xe620;</i>
                          <span>{{item.label}}</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </li>
          <li class="lii">
            <textarea
              class="textarea"
              v-model="reson"
              rows="3"
              cols="20"
              placeholder="请输入您的申请原因,有助于通过审核哦"
            ></textarea>
          </li>
        </ul>
      </article>
      <!--<article class="f5"></article>-->

      <!-- 提交 -->
      <article class="bottomEva">
        <button @click="subEval1">提交</button>
      </article>
    </section>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import {
  uploadGoodsFile,
  saveUserinfoapplyByUser,
  getUserinfoserviceByLogin
} from "@/api/interface.js";

import commonHeader from "@/components/communal/commonHeader";
export default {
  data() {
    return {
      groupstr: "",
      reson: "",
      zheng: "",
      fan: "",
      name: "",
      phone: "",
      email: "",
      idcode: "",
      items: [],
      evaluateShopContent: "",
      evaluateGoodsContent: "",
      ImgSrc: [],
      evals: [],
      shopTemplates: [],
      goodsTemplates: [],
      shopData: [],

      // strNum: 0, //字数数量，默认是0
      goodsList: [
        { result: "", label: "身份证正面", limit: true, flag: "above" },
        { result: "", label: "身份证反面", limit: true, flag: "reverse" }
      ],
      pingjiaList: [],
      contractType: "",
      scopList: [] // 店铺评分
    };
  },
  created() {
    for (let i = 0; i < this.goodsList.length; i++) {
      this.items.push([]);
    }
  },
  onLoad(options) {},
  components: {
    commonHeader
  },
  mounted() {
    http.post(getUserinfoserviceByLogin).then(res => {
      if (res) {
        // this.phone = res.userinfoPhone;
        this.userinfoCode = res.userinfoCode;
        this.groupstr = res.userinfoQuality;
        if (this.groupstr.indexOf("group") > -1) {
          $message.alert("您已经是团长了,请勿重复申请");
          setTimeout(() => {
            history.go(-1);
          }, 2000);
        }
      }
      console.log(res, "用户信息");
    });
  },
  methods: {
    delImg(index) {
      let that = this;
      that.goodsList[index].result = "";
      console.log(that.goodsList);
    },
    chooseImage(index) {
      let i = 0; // 多图上传时使用到的index
      let that = this;
      let max = 1; //最大选择数
      let upLength; //图片数组长度
      let imgFilePaths; //图片的本地临时文件路径列表
      wx.chooseImage({
        count: max, //一次最多可以选择的图片张数
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          console.log(res, "imgFilePaths");
          imgFilePaths = res.tempFilePaths;
          upLength = imgFilePaths.length;
          wx.showLoading({
            title: "上传中..."
          });
          that.upLoad(imgFilePaths, i, upLength, index); //上传操作
        },
        fail: function() {
          console.log("fail");
        },
        complete: function() {
          console.log("commplete");
        }
      });
    },
    upLoad(imgPath, i, upLength, index) {
      console.log(imgPath[i]);
      let that = this;
      //上传文件
      wx.uploadFile({
        url: this.$domain + uploadGoodsFile,
        filePath: imgPath[i],
        name: "file",
        formData: {
          imgIndex: i
        },
        header: {
          "Content-Type": "multipart/form-data",
          cookie:
            wx.getStorageSync("miniToken") +
            "=" +
            wx.getStorageSync("sessionid"),
          "saas-Agent": "qj-wemini"
        },
        success: function(res) {
          that.goodsList[index].result =
            that.$domain + JSON.parse(res.data).fileUrl;
          console.log(res, "ppp");
        },
        fail: function(res) {
          wx.hideLoading();
          wx.showModal({
            //title: '提示',
            content: "上传图片失败",
            showCancel: false,
            success: function(res) {}
          });
        },
        complete: function() {
          i++;
          if (i == upLength) {
            wx.hideLoading();
          } else {
            that.upLoad(imgPath, i, upLength);
          }
        }
      });
    },
    subEval1() {
      if (
        this.name &&
        this.phone &&
        this.email &&
        this.idcode &&
        this.goodsList[0].result &&
        this.goodsList[1].result
      ) {
        var emailreg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

        if (!/^1[3456789]\d{9}$/.test(this.phone)) {
          $message.alert("手机号码有误，请重填");
          return false;
        }
        if (!emailreg.test(this.email)) {
          $message.alert("邮箱有误，请重填");
          return false;
        }
        if (!idcardReg.test(this.idcode)) {
          $message.alert("身份证有误，请重填");
          return false;
        }
        var param = {
          userinfoCode: this.userinfoCode,
          userinfoCompname: this.name,
          userinfoPhone: this.phone,
          userinfoapplyRemark: this.reson,
          umUserinfoapplyQuaList: [
            {
              userinfoapplyQuaKey: "userinfo_userinfoCompname",
              userinfoapplyQuaVaule: this.name
            },
            {
              userinfoapplyQuaKey: "userinfo_userinfoPhone",
              userinfoapplyQuaVaule: this.phone
            },
            {
              userinfoapplyQuaKey: "userinfo_userinfoEmail",
              userinfoapplyQuaVaule: this.email
            },
            {
              userinfoapplyQuaKey: "userinfo_userinfoCoid",
              userinfoapplyQuaVaule: this.idcode
            },
            {
              userinfoapplyQuaKey: "userinfo_userinfoCert1Url",
              userinfoapplyQuaVaule: this.goodsList[0].result
            },
            {
              userinfoapplyQuaKey: "userinfo_userinfoCert2Url",
              userinfoapplyQuaVaule: this.goodsList[1].result
            }
          ]
        };
        http
          .post(saveUserinfoapplyByUser, {
            applyJson: JSON.stringify(param)
          })
          .then(res => {
            if (res.success) {
              $message.alert("申请成功");
              $router.push("o2o_mine");
            } else {
              $message.alert(res.msg);
            }
          });
      } else {
        $message.alert("请完善表单信息");
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../../common/css/common.less";
.evaluate-box {
  height: 100%;
  #evaluate-box-inner {
    background: #cf1e1a;
    width: 100%;
  }
  .p-s {
    position: relative;
    text-align: center;
    .g-title {
      width: 100%;
      text-align: center;
      position: absolute;
      top: 450rpx;
      color: white;
      font-size: 42rpx;
    }
    .commonHeader-leftIcon {
      position: absolute;
      height: 90rpx;
      line-height: 90rpx;
      text-align: left;
      top: 0;
      color: #fff;
      left: 30rpx;
      width: 60rpx;
    }
    .g-share {
      width: 100%;
      text-align: center;
      position: absolute;
      top: 510rpx;
      color: white;
      font-size: 26rpx;
    }
    .g-share + img {
      margin: 0 auto;
      width: 100%;
    }
  }

  .bottomEva {
    width: 669rpx;
    height: 90rpx;
    margin: 0 auto;
    button {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        0deg,
        rgba(255, 157, 60, 1),
        rgba(255, 207, 118, 1)
      );
      font-size: 36rpx;
      border-radius: 10rpx;
      margin-bottom: 4rpx;

      color: #fff;
    }
  }
}
.score_con {
  margin-top: 20rpx;
  .g-img {
    width: 326rpx;
    height: 200rpx;
    margin: 0 18rpx 18rpx 0;
    position: relative;
    overflow: hidden;
    float: left;
    img {
      width: 326rpx !important;
      height: 200rpx !important;
    }
  }

  .g-img > span {
    position: absolute;
    left: -2rpx;
    top: -6rpx;
    font-size: 40rpx;
  }
  .limg {
    height: 230rpx;
    overflow: hidden;
  }
  .goodslist {
    background-color: white;
    width: 316rpx;
    height: 205rpx;
    margin-right: 18rpx;
    float: left;
    .apply-up-img {
      margin-top: 63rpx;
    }
    .result {
      width: 316rpx;
      height: 205rpx;
      border-bottom: 0;
      form {
        opacity: 0.3;
        width: 100%;
        height: 100%;
        position: relative;
        .apply-up-img i,
        .apply-up-img span {
          display: inline-block;
          width: 100%;
          height: 45%;
          text-align: center;
        }
      }
    }
  }
}
#ull {
  padding: 0 40rpx;
  .lii {
    position: relative;
    background: #fff;
    border-radius: 10rpx;
    margin-bottom: 24rpx;
    .remark {
      color: red;
      position: absolute;
      left: 20rpx;
      line-height: 66rpx;
    }
    .remark + input {
      padding-left: 50rpx;
      box-sizing: border-box;
    }
    .inp {
      border-radius: 10rpx;
      width: 670rpx;
      height: 66rpx;
    }
    .textarea {
      padding: 20rpx;
      border-radius: 10rpx;
      width: 670rpx;
      height: 260rpx;
      border: 0;
    }
  }
}
</style>




