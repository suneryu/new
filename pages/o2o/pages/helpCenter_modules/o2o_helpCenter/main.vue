<template>
  <div class="HelpCenter">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="HelpCenter-top">
      <img class="HelpCenter-banner" src="/static/img/helpCenter/header.png" alt />
      <div class="HelpCenter-center">
        <div class="top-title">在线客服</div>
        <div>客服在线时间:24小时在线</div>
        <div class="top-click" @click="Service">立即咨询</div>
      </div>
    </div>
    <!--过渡层-->
    <div class="ceng" v-show="showhiden"></div>
    <div class="customer-service" :style="{bottom:botser}">
      <ul v-for="(item,index) in sevTelList" :key="index">
        <li class="tel">
          <p>
            {{item.ocsOcserviceReDomain.ocserviceName}}:
            <span>{{item.ocsOcserviceReDomain.ocserviceRemark}}</span>
          </p>
        </li>
        <li @click="_close()">取消</li>
      </ul>
    </div>
    <div class="HelpCenter-list">
      <div class="title">- 常见问题 -</div>
      <div class="center-list">
        <div
          class="help-list"
          v-for="(item,index) in helpList"
          :key="index"
          @click="goInfor(item.doclistId)"
        >
          <div class="questions t-box">
            <i class="title-icon" :style="{background:baseColor}">?</i>
            <p class="flex1 title-name">{{item.doclistTitle}}?</p>
            <i class="iconfont">&#xe61d;</i>
          </div>
        </div>
      </div>
    </div>
    <lastPageLine :lastPageLine="lastPageLine" />
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { article, queryOcsconfigList } from "@/api/interface.js";
import lastPageLine from "@/components/communal/last-page-line";
import commonHeader from "@/components/communal/commonHeader";
export default {
  config: {
    enablePullDownRefresh: true
  },
  data() {
    return {
      title: "帮助中心",
      leftIcon: true,
      rightIcon: false,
      baseColor: "",
      helpList: [],
      page: 1,
      rows: 10,
      total: 0,
      lastPageLine: false,
      botser: "-70px",
      showhiden: false,
      sevTelList: []
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
  onLoad() {
    Object.assign(this.$data, this.$options.data()); //初始化数据
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set("prevpage", prevpage.route);
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    if (this.$state.baseColor) {
      this.baseColor = "#" + this.$state.baseColor;
    } else {
      this.baseColor = "#07913B";
    }
    this.queryLists();
  },
  methods: {
    //获取帮助中心列表
    queryLists() {
      http
        .get(article.articleList, {
          tginfoMenuCode: "help",
          page: this.page,
          rows: this.rows
        })
        .then(res => {
          this.helpList = res.list;
          this.total = res.total;
        });
    },
    //客服
    Service() {
      http.get(queryOcsconfigList).then(res => {
        if (res.length > 0) {
          this.showhiden = true;
          this.botser = "50px";
          this.sevTelList = res;
        }
      });
    },
    _close() {
      this.showhiden = false;
      this.botser = "-70px";
    },
    //帮助中心详情
    goInfor(codeid) {
      $router.push("o2o/pages/helpCenter_modules/o2o_helpDetail", {
        dicCodeId: codeid
      });
    },
    commonMounted() {
      this.lastPageLine = false;
    },
    loadMore() {
      let num = Math.ceil(this.total / 10);
      this.page++;
      let params = { page: this.page, rows: this.rows };
      if (this.page <= num) {
        http.get(article.articleList, params).then(res => {
          let list = res.rows;
          list.map(v => {
            if (!RegExp(/http/).test(v.dataPic)) {
              v.dataPic = this.$domain + v.dataPic;
            }
          });
          this.helpList = [...this.helpList, ...list];
        });
      } else {
        this.lastPageLine = true;
      }
    }
  }
};
</script>

<style  lang="less" scoped>
@import "../../../../../common/css/common.less";
.t-box {
  display: flex;
  // justify-content: space-between;
}
.t-box-flex1 {
  flex: 1;
}
.HelpCenter {
  position: relative;
  padding-top: 90rpx;
  &-top {
    position: relative;
    top: 0;
  }
  &-banner {
    width: 100%;
    height: 296rpx;
  }
  &-list {
    margin-top: 30rpx;
  }
  &-center {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 30rpx;
    width: 100%;
    height: 246rpx;
    color: white;
    text-align: center;
    justify-content: space-evenly;
    .top-title {
      font-size: 44rpx;
    }
    .top-click {
      font-size: 32rpx;
      width: 230rpx;
      height: 70rpx;
      border-radius: 35rpx;
      border: 1px solid white;
      line-height: 70rpx;
      margin-left: 260rpx;
      margin-top: 20rpx;
    }
  }
  .title {
    text-align: center;
    color: rgb(172, 172, 172);
  }
  .center-list {
    margin-top: 30rpx;
  }
  .center-list {
    .help-list {
      .questions {
        margin-left: 20rpx;
        margin-right: 20rpx;
        border-bottom: 1rpx solid #eeeeee;
        height: 104rpx;
        line-height: 104rpx;
        .title-icon {
          height: 30rpx;
          width: 30rpx;
          text-align: center;
          color: @white-color;
          border-radius: 30rpx;
          line-height: 30rpx;
          margin-right: 20rpx;
          margin-top: 38rpx;
        }
        .title-name {
          width: 90%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .ceng {
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 100001;
  }
  .customer-service {
    position: fixed;
    left: 7.5%;
    width: 85%;
    z-index: 100001;
    margin: 0 auto;
    ul {
      height: 70px;
      li {
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 4px;
        margin-bottom: 4px;
        background: @white-color;
      }
      li:first-child {
      }
    }
  }
}
</style>