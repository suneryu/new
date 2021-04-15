<template>
  <div class="pro-box">
    <h3 style='margin-top: 30rpx;'>产品简介</h3>
    <ul>
      <li>
        <div v-html="goodsRemark"></div>
      </li>
    </ul>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
export default {
  props: ["goodsRemark"],
  data() {
    return {
      baseColor: "",
	  goodsRemark:""
    };
  },
  components: {},
  onLoad() {
    Object.assign(this.$data, this.$options.data()); //初始化数据
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set("prevpage", prevpage.route);
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor,
    });
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@import "../../../common/css/common.less";
.pro-box {
  background: @white-color;
  padding: 0 30rpx;
  h3 {
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
  }
  img {
    width: 100%;
  }
}
</style>

