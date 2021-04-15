<template>
  <div class="search">
    <div class="search-top">
      <div class="iconfont" @click="goBack">&#xe62d;</div>
      <div class="search-top-input">
        <i class="iconfont" style="margin-left: 20rpx;">&#xe613;</i>
        <view class="section">
          <input
            placeholder="请输入关键字搜索"
            type="text"
            placeholder-style="color:#999"
            confirm-type="search"
            @confirm="onSubmit($event)"
            auto-focus
            v-model="inputValue"
          />
        </view>
      </div>
      <div class="search-top-btn" @click="searchBtn">搜索</div>
    </div>
    <!-- <div class="search-list">
      <div class="search-list-title">
        <div class="search-list-title-icon">
          <span></span>热门搜索
        </div>
      </div>
      <ul>
        <li v-for="(item,index) in items" :key="index" @click="searchItems(item,index)">
          <a>{{item}}</a>
        </li>
      </ul>
    </div>-->
    <div class="search-line"></div>
    <div class="search-list">
      <div class="search-list-title">
        <div class="search-list-title-icon">
          <span></span>历史搜索记录
        </div>
        <span class="iconfont" @click="clearHistory">&#xe66d;</span>
      </div>
      <ul>
        <li v-for="(item,index) in items" :key="index" @click="searchItems(item,index)">
          <a>{{item}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router } from "@/utils/prototype/vue.js";
import { getProappinfo } from "@/api/interface.js";
export default {
  data() {
    return {
      title: "搜索",
      leftIcon: true,
      rightIcon: true,
      items: [],
      inputValue: "",
      inputArray: []
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
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    if (prevpage && prevpage.route) {
      $storage.set("searchAfterRouter", prevpage.route);
    }

    if (options && options.json) {
      switch (JSON.parse(options.json).path) {
        case "home":
          $storage.set("searchAfterRouter", "home");
          break;
        case "classify":
          $storage.set("searchAfterRouter", "classify");
          break;
      }
    }
  },
  mounted() {
    if ($storage.get("searchHistory")) {
      this.items = $storage.get("searchHistory");
    }
  },
  methods: {
    searchBtn() {
      this.commonHistory();
    },
    commonHistory() {
      if (this.inputValue) {
        if ($storage.get("searchHistory")) {
          let attr = $storage.get("searchHistory");
          attr.unshift(this.inputValue);
          $storage.set("searchHistory", attr);
        } else {
          this.inputArray.unshift(this.inputValue);
          $storage.set("searchHistory", this.inputArray);
        }
      }

      let query = {
        sortField: "",
        order: "desc",
        page: 1,
        rows: 10,
        searchParam: this.inputValue
      };
      $storage.set("searchParam", this.inputValue);
      this.inputValue = "";
      $router.push("o2o/pages/o2oSearch_modules/searchResult", query);
    },
    clearHistory() {
      this.items = [];
      this.inputArray = [];
      $storage.remove("searchHistory");
    },
    onSubmit(e) {
      this.inputValue = e.target.value;
      this.commonHistory();
    },
    searchItems(item, index) {
      let query = {
        searchParam: item
      };
      $storage.set("searchParam", item);
      $router.push("o2o/pages/o2oSearch_modules/searchResult", query);
    },
    goBack() {
      this.inputValue = "";
      $router.back(-1);
      switch ($storage.get("searchAfterRouter")) {
        case "home":
          $router.replace("web", {
            defaultUrl:
              this.$businessDomain + "/paas/shop/" + this.$state.homeUrl
          });
          break;
        // case 'classify':
        //   $router.replace('web',{defaultUrl:this.$businessDomain+'/paas/shop/'+this.$state.classifyUrl})
        // break;
      }
    }
  }
};
</script>


<style lang="less" scoped>
@import "../../../../../common/css/common.less";
.search {
  width: 100%;
  height: 100%;
  background: @white-color;
  &-top {
    padding: 20rpx 20rpx 10rpx 30rpx;
    display: flex;
    justify-content: space-between;
    height: 58rpx;
    align-items: center;
    border-bottom: 1rpx solid #ececec;
    &-back {
      a {
        width: 36rpx;
        height: 58rpx;
        display: inline-block;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    &-input {
      position: relative;
      width: calc(100% - 64rpx);
      background-color: #eeeeee;
      border-radius: 58rpx;
      margin-left: 30rpx;
      i {
        width: 36rpx;
        height: 68rpx;
        line-height: 68rpx;
        display: inline-block;
        position: absolute;
        left: 0rpx;
        top: 0;
        color: @color-999;
      }
      input {
        display: 1;
        height: 58rpx;
        font-size: @middle-title;
        padding-left: 60rpx;
      }
      input::-webkit-input-placeholder {
        color: @color-999;
      }
    }
    &-btn {
      width: 88rpx;
      height: 58rpx;
      line-height: 58rpx;
      text-align: center;
      font-size: 28rpx;
    }
  }
  &-line {
    background-color: #f8f2f2;
    height: 1rpx;
    margin-left: 20rpx;
    margin-top: 20rpx;
    width: 710rpx;
  }
  &-list {
    padding: 0 40rpx;
    &-title {
      height: 122rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-icon {
        display: flex;
        align-items: center;
        font-size: @top-title;
        span {
          width: 4rpx;
          height: 16rpx;
          display: inline-block;
          margin-right: 18rpx;
          background: @color-666;
        }
      }
    }
    ul {
      overflow: hidden;
      zoom: 1;
      li {
        float: left;
        background: #f9f9f9;
        margin-right: @margin-right;
        margin-bottom: @margin-bottom;
        a {
          height: 48rpx;
          line-height: 48rpx;
          padding: 5rpx 40rpx;
          font-size: @middle-title;
        }
      }
    }
  }
}
</style>

