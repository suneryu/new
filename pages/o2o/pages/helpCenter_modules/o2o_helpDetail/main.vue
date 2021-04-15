<template>
  <div class="address">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="helpInfor">
      <h3>{{helpTitle}}</h3>
      <ul class="lists">
        <li>
          <div v-html="doclistContent">{{doclistContent}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { article } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
export default {
  data() {
    return {
      title: "帮助详情",
      leftIcon: true,
      rightIcon: false,
      items: [],
      defaultIcon: false,
      baseColor: "",
      doclistContent: "",
      helpTitle: ""
    };
  },
  components: {
    commonHeader
  },
  onLoad() {
    Object.assign(this.$data, this.$options.data()); //初始化数据
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set("prevpage", prevpage.route);
    // wx.setNavigationBarTitle({
    //   title: $storage.get('proappEnvName')
    // })
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    console.log(this.$root.$mp.query.dicCodeId, "dicCodeId");
    this.getDoclistForAts(this.$root.$mp.query.dicCodeId);
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
  },
  methods: {
    // 获取文章详情
    getDoclistForAts(code) {
      let parames = {
        doclistId: code
      };
      http.get(article.articleDetail, parames).then(res => {
        this.helpTitle = res.doclistTitle;
        this.doclistContent = res.doclistContent;
        let that = this;
        this.doclistContent =
          this.doclistContent &&
          this.doclistContent.replace(
            /<img [^>]*src=['"]([^'"]+)[^>]*>/gi,
            function(match, capture) {
              return (
                '<img style="width:100%"  src="' +
                (that.$domain + capture) +
                '"/>'
              );
            }
          );
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
@import "../../../../../common/css/common.less";
.address {
  background-color: white;
}
.helpInfor {
  padding-top: 90rpx;
  width: 690rpx;
  margin: 0 auto;
  background-color: white;
  h3 {
    line-height: 48rpx;
    font-size: 32rpx;
    font-weight: 600;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
  }
  li {
    margin-bottom: 36rpx;
    line-height: 48rpx;
    color: #666666;
    div {
      word-wrap: break-word;
    }
  }
}
</style>

