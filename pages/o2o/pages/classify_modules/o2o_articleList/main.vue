<template>
  <div class="foodsList">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="foodsList-list" style="margin-top:30rpx">
      <div
        class="foodslist"
        v-for="(item,index) in helpList"
        :key="index"
        @click="gotoFoodsDetail(item.doclistId)"
      >
        <img class="foodsImg" :src="item.doclistInfopicpathe" alt />
        <div class="foodsCenter">
          <div class="title">{{item.doclistTitleNew}}</div>
          <div class="detail">{{item.doclistTitle1New}}</div>
          <div class="footer">
            <div class="footerLeft">{{item.doclistTitle4New}}</div>
            <div class="footerRight">{{item.gmtCreate}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="noimg" v-if="helpList.length == 0 && requestStatic">
      <img :src="nullImg" />
      <p>暂无列表...</p>
    </div>
    <lastPageLine :lastPageLine="lastPageLine" />
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { formatTimes } from "@/utils/prototype/date.js";
import { addAddress, article } from "@/api/interface.js";
import lastPageLine from "@/components/communal/last-page-line";
import commonHeader from "@/components/communal/commonHeader";
import { format } from "util";
export default {
  config: {
    enablePullDownRefresh: true
  },
  data() {
    return {
      title: "文章推荐",
      leftIcon: true,
      rightIcon: false,
      baseColor: "",
      helpList: [],
      page: 1,
      rows: 10,
      total: 0,
      lastPageLine: false,
      pars: "", //接受参数
      from: "",
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noGoods.png",
      requestStatic: false
    };
  },
  components: {
    commonHeader,
    lastPageLine
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();
  },
  onLoad(options) {
    Object.assign(this, this.$options.data());
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set("prevpage", prevpage.route);

    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    // console.log(JSON.parse(options.json));
    // this.pars = JSON.parse(options.json).menuList;
    // this.from = JSON.parse(options.json).path;
    // console.log(this.pars, "666");
    console.log(JSON.parse(options.json), "接受参数");
    this.pars = JSON.parse(options.json);
    if (this.pars.menuList == "menu") {
      this.title = "列表";
    } else if (this.pars.menuList == "video") {
      this.title = "列表";
    } else if (this.pars.menuList == "food") {
      this.title = "列表";
    }
    this.getList(this.pars.menuList);
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
  },
  methods: {
    getList(type) {
      var that = this;
      console.log(that.pars, "获取列表");
      http
        .get(article.articleList, {
          tginfoMenuCode: type,
          dataState: 2,
          page: that.page,
          rows: that.rows
        })
        .then(res => {
          that.helpList = res.list;
          this.requestStatic = true;
          that.total = res.total;
          that.helpList.map(v => {
            if (!RegExp(/http/).test(v.doclistInfopicpathe)) {
              v.doclistInfopicpathe = that.$domain + v.doclistInfopicpathe;
            }
            v.gmtCreate = formatTimes(v.gmtCreate);
          });
        });
    },
    gotoFoodsDetail(articleID) {
      console.log("-----id", articleID);
      $router.push("o2o/pages/classify_modules/o2o_articleDetail", {
        data: articleID
      });
    },
    commonMounted() {
      this.lastPageLine = false;
    },
    loadMore() {
      let num = Math.ceil(this.total / 10);
      this.page++;
      let params = {
        tginfoMenuCode: this.pars,
        page: this.page,
        rows: this.rows
      };
      console.log(params, "params----");
      if (this.page <= num) {
        http.get(article.articleList, params).then(res => {
          let list = res.rows;
          list.map(v => {
            if (!RegExp(/http/).test(v.dataPic)) {
              v.dataPic = this.$domain + v.dataPic;
            }
          });
          this.helpList = [...this.helpList, ...list];
          this.requestStatic = true;
        });
      } else {
        this.lastPageLine = true;
      }
    }
  }
};
</script>
<style lang="less">
page {
  background: #ffffff;
}
</style>
<style  lang="less" scoped>
@import "../../../../../common/css/common.less";
.noimg {
  margin-top: 280rpx;
  img {
    display: block;
    width: 359rpx;
    height: 276rpx;
    margin: 0 auto;
  }
  p {
    margin-top: 40rpx;
    height: 72rpx;
    line-height: 72rpx;
    text-align: center;
    color: #999999;
    font-size: 24rpx;
  }
}
.foodsList {
  position: relative;
  padding-top: 90rpx;
  background-color: white;
  &-list {
    .foodslist {
      display: flex;
      flex-direction: row;
      margin-bottom: 30rpx;
      .foodsImg {
        width: 234rpx;
        height: 174rpx;
        margin-top: 10rpx;
        margin-left: 20rpx;
      }
      .foodsCenter {
        display: flex;
        flex-direction: column;
        margin-left: 20rpx;
        margin-right: 20rpx;
        width: 460rpx;
        .title {
          font-size: 26rpx;
          height: 72rpx;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .detail {
          font-size: 24rpx;
          color: #828384;
          margin-top: 10rpx;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: break-word;
          white-space: normal !important;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          line-height: 42rpx;
          height: 42rpx;
        }
      }
      .footer {
        display: flex;
        flex-direction: row;
        margin-top: 28rpx;
        // margin-right: 20rpx;
        justify-content: space-between;
        .footerLeft {
          font-size: 24rpx;
          color: #8d8e8f;
        }
        .footerRight {
          font-size: 22rpx;
          color: #d1d2d3;
        }
      }
    }
  }
}
</style>>

