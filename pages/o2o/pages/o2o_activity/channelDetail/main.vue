<template>
  <div class="activity">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="activity-center">
      <img src="/static/img/helpCenter/WechatIMG154.png" alt="">
      <div class="title">
        请选择自提门店下单购买
      </div>
      <div class='malllist_all'>
        <block v-for="(item,index) in goodsList" :key="index">
          <div class='mallList_itemview' @click='goodsDetailClick(item)'>
            <div class='pro_title'>连胜菜市南山社区店</div>
            <div class="pro_footer">
              立即购买
            </div>
          </div>
        </block>
      </div>
    </div>
    <lastPageLine :lastPageLine="lastPageLine" />
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import commonHeader from "@/components/communal/commonHeader";
import lastPageLine from "@/components/communal/last-page-line";

export default {
  config:{
    "enablePullDownRefresh": true
  },
  data() {
    return {
      title: "频道详情",
      leftIcon: true,
      rightIcon: false,
      baseColor: "",
      lastPageLine: false,
      total: 0,
      page: 1,
      rows: 20,
      goodsList: [1,1,1,1],
      goodsCodeId:'',
      priceNow:0,
    };
  },
  components: {
    commonHeader,
    lastPageLine
  },
  computed: {
    
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();    
  },
  onLoad(options) {
    var that = this;
    
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    Object.assign(that, that.$options.data());
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    
  },
  methods: {
    
    
    addShopCart(goodsCode,goodsCodeId,priceNow){
      http.post(addShoppingGoods, {skuId: goodsCode,goodsNum: 1,shoppingGoodsPm:goodsCodeId}).then(st => {
        if (st.success) {
          this.priceNow = this.priceNow + priceNow;
          // this.$emit("getSpec", this.specsStrList);
          $message.alert("加入购物车成功");
        } else {
          $message.alert(st.msg);
        }
      });
    },
    goodsDetailClick(item) {
      $router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail", {
        json: item.goodsCode
      });
    },
    
  }
};
</script>

<style lang="less" scoped>
@import "../../../../../common/css/common.less";
.activity {
  width: 100%;
  padding-top: 90rpx;
  background: #fafafa;
  &-center{
    display: flex;
    flex-direction: column;
    img{
      width: 750rpx;
      height: 500rpx;
    }
    .title{
      width: 710rpx;
      height: 100rpx;
      margin-left: 20rpx;
      font-size: 34rpx;
      text-align: center;
      line-height: 120rpx;
      color: black;
      font-weight: 500;
      border-bottom:1rpx solid #208F43;
    }
  }
  .malllist_all {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 40rpx 40rpx 0;
      }
      .mallList_itemview {
        width: 300rpx;
        height: 120rpx;
        background-color: white;
        border: 1rpx solid #208F43; 
        border-radius: 10rpx; 
        margin-bottom: 20rpx;
        display: flex;
        flex-direction: column;
        text-align: center;
      }
      .pro_title {
        text-align: center;
        height: 25rpx;
        font-size: 26rpx;
        font-family: SourceHanSansCN-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 25rpx;
        margin-top: 20rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .pro_footer{
        background-color: red;
        color: white;
        font-size: 22rpx;
        text-align: center;
        width: 140rpx;
        height: 30rpx;
        line-height: 30rpx;
        margin-top: 20rpx;
        margin-left: 80rpx;
        border: 1rpx solid red; 
        border-radius: 20rpx; 
      }
}
</style>




