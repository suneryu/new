<template>
  <div class="foodsDetail">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="shopList-left" @click="goBack">
      <i class="iconfont">&#xe62d;</i>
    </div>
    <div class="foodsDetail-text">
      <div class="art-top">
        <h3 class="art-title">{{articleDetaileDic.doclistTitleNew}}</h3>
        <p class="subtitle">{{articleDetaileDic.doclistTitle1New}}</p>
        <div class="author t-box">
          <p class="t-box-flex1 left-cont">{{articleDetaileDic.doclistTitle4New}}</p>
        </div>
      </div>
      <div v-html="articless">{{articless}}</div>
      <!-- <div> -->
          <!-- {{articleDetaileDic.doclistContent}} -->
          <!-- <rich-text nodes="{{articleDetaileDic.doclistContent}}"></rich-text> -->
      <!-- </div> -->
      
      <!-- <wxParse :content="articless" @preview="preview" @navigate="navigate"/> -->
    </div>
    <!-- <div class="foodsDetail-header">
        <div class="title">{{articleDetaileDic.doclistTitle}}</div>
        <div class="userInfo">
          <img class="headerImg" src="" alt="">
          <div class="headerCenter">
            <div class="nickname">善财爱吃鱼</div>
            <div class="subDetail">2019/09/16  15:46 . 浏览423</div>
          </div>
          <div class="add" @click="addUser">关注</div>
        </div>
      </div>
      <div class="foodsDetail-center">
        <div class="foodsList" v-for="(item,index) in foodsList" :key="index">
          <img class="imgPic" src="/static/img/mine/news/foodsTemp.png" alt="">
          <div class="DetailText">铁板牛排套餐,我们一家人都喜欢吃.在店里吃牛排的时候,特别羡慕店里的那个铁板,不过自己在家烧铁板有点危险基金会发热不错吧不会把你的别废话那你发 吃饭 附近附近 </div>
        </div>
    </div>-->
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { addAddress, article } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
// import marked from 'marked'
// import wxParse from 'mpvue-wxparse'
export default {
  data() {
    return {
      title: "详情",
      leftIcon: false,
      rightIcon: false,
      items: [],
      defaultIcon: false,
      baseColor: "",
      foodsList: [1, 1, 1, 1, 1],
      articleID: "",
      articleDetaileDic: {},
      articless: "",
      getUrl: ""
      // bgimage:require("../../../static/img/helpCenter/header.png"),
    };
  },
  components: {
    commonHeader
  },
  onLoad(options) {
    // this.articleID = options.data
    // this.getDetail(this.articleID)

    Object.assign(this.$data, this.$options.data()); //初始化数据
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set("prevpage", prevpage.route);
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    if (options && options.json) {
      this.articleID = JSON.parse(options.json).dicCodeId;
      this.getUrl = JSON.parse(options.json).path;
      this.getDetail(JSON.parse(options.json).dicCodeId);
    } else {
      this.articleID = options.data;
      this.getDetail(options.data);
    }
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
  },
  methods: {
    //返回
    goBack() {
      if (this.getUrl == "find") {
        $router.replace("web", {
          defaultUrl: this.$businessDomain + "/paas/shop/" + this.$state.findUrl
        });
      } else {
        this.$router.back();
      }
    },
    addUser() {
      console.log("加关注");
    },
    getDetail(articleID) {
      var that = this;
      http.get(article.articleDetail, { doclistId: articleID }).then(res => {
        this.articleDetaileDic = res;
        let str = RegExp('http');
        res.doclistContent.replace(
            /<img[^>]+src="(?:(?!(https|http))[^>]+)>/g,
             function(match, capture) {
                return
            }
        ),
        res.doclistContent.replace(
          /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
          function(match, capture) {
              console.log(match,"====",capture)
            console.log(that.$domain + capture, "-------", that.$domain);
            return (
              '<img style="width:auto"  src="' +
              (that.$domain + capture) +
              '"/>'
            );
          }
        );
        this.articless = res.doclistContent;
      });
    },
    preview(src, e) {
      // do something
    },
    navigate(href, e) {
      // do something
    }
  }
};
</script>

<style  lang="less" scoped>
@import "../../../../../common/css/common.less";
.t-box {
  display: flex;
}
.t-box-flex1 {
  -webkit-flex: 1; /* Chrome */
  -ms-flex: 1; /* IE 10 */
  flex: 1; /* NEW, Spec - Opera 12.1, Firefox 20+ */
  -webkit-box-flex: 1; /* OLD - iOS 6-, Safari 3.1-6 */
  -moz-box-flex: 1; /* OLD - Firefox 19- */
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
.foodsDetail {
  position: relative;
  padding-top: 90rpx;
  background-color: white;
  &-text {
    margin-left: 20rpx;
    margin-right: 20rpx;
    margin-top: 20rpx;
    color: #666666;
    font-size: 26rpx;
    word-wrap: break-word;
    overflow: hidden;
    .art-top {
      margin-bottom: 24rpx;
      // border-bottom: 1rpx solid #eeeeee;
      .art-title {
        font-size: 32rpx;
        font-weight: bold;
        line-height: 60rpx;
      }
      .subtitle {
        color: #999999;
        line-height: 40rpx;
      }
      .author {
        .left-cont {
          line-height: 40rpx;
        }
      }
    }
  }
  // &-header{
  //   margin-left: 20rpx;
  //   margin-right: 20rpx;
  //   .title{
  //     font-size: 36rpx;
  //     margin-top: 20rpx;
  //   }
  //   .userInfo{
  //     display: flex;
  //     flex-direction: row;
  //     margin-top: 20rpx;
  //     margin-bottom: 20rpx;
  //     .headerImg{
  //       width: 60rpx;
  //       height: 60rpx;
  //       border-radius: 60rpx;
  //       background-color: aqua;
  //     }
  //     .headerCenter{
  //       display: flex;
  //       flex-direction: column;
  //       margin-left: 20rpx;
  //       .nickname{
  //         font-size: 24rpx;
  //         color: #6f6f70;
  //       }
  //       .subDetail{
  //         margin-top: 6rpx;
  //         font-size: 22rpx;
  //         color: #d6d6d7;
  //       }
  //     }
  //     .add{
  //       color:white;
  //       font-size: 26rpx;
  //       background-color: #16903F;
  //       width: 120rpx;
  //       height: 40rpx;
  //       border-radius: 40rpx;
  //       text-align: center;
  //       line-height: 40rpx;
  //       position: absolute;
  //       right: 30rpx;
  //     }
  //   }
  // }
  // &-center{
  //   margin-left: 20rpx;
  //   margin-right: 20rpx;
  //   .imgPic{
  //     width: 710rpx;
  //     height: 320rpx;
  //     margin-top: 20rpx;
  //     margin-bottom: 20rpx;
  //   }
  //   .DetailText{
  //     font-size: 28rpx;
  //     color: #828384;
  //     margin-top: 20rpx;
  //     margin-bottom: 20rpx;
  //     line-height: 50rpx;
  //   }
  // }
}
</style>>

