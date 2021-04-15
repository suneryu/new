<template>
  <div class="activity">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="activity-shopCart" @click="shopCart"><i class="iconfont">&#xe623;</i></div>
    <div class="activity-headerTop">已选: {{priceNow}}</div>
    <div class="activity-headerBottom" :style="{color:baseColor}">{{discName}}</div>
    <div class="activity-list" v-if="goodsList.length>0">
      <div class='malllist_all'>
        <block v-for="(item,index) in goodsList" :key="index">
          <div class='mallList_itemview' @click='goodsDetailClick(item)'>
            <img class='pro_image' :src="item.dataPic">
            <div class='pro_title'>{{item.goodsName}}</div>
            <div class="pro_footer">
              <div class='pro_price'>售价:￥{{item.pricesetNprice}}</div>
              <div class="AddPic" @click.stop="addShopCart(item.skuId,goodsCodeId,item.pricesetNprice)">+</div>
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
import { queryPromotionGoods,getPromotionByCode,addShoppingGoods } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
import lastPageLine from "@/components/communal/last-page-line";

export default {
  config:{
    "enablePullDownRefresh": true
  },
  data() {
    return {
      title: "活动专区",
      leftIcon: true,
      rightIcon: false,
      baseColor: "",
      lastPageLine: false,
      total: 0,
      page: 1,
      rows: 20,
      goodsList: [],
      goodsCodeId:'',
      priceNow:0,
      discName:''
    };
  },
  components: {
    commonHeader,
    lastPageLine
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();    
  },
  onLoad(options) {
    var that = this;
    that.goodsCodeId = options.code
    this.commonMounted(that.goodsCodeId);
    this.getByCode(that.goodsCodeId)
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
    commonMounted(code) {
      http.post(queryPromotionGoods,{page:this.page,rows:this.rows,promotionCode:code}).then(res=>{
        this.goodsCodeId = code
        this.goodsList = res.rows;
        this.goodsList.map(v=>{
          if(!RegExp(/http/).test(v.dataPic)){
            v.dataPic=this.$domain+v.dataPic
          }
        })
        this.total = res.total;
      })
    },
    getByCode(code){
      http.get(getPromotionByCode,{page:1,rows:10,promotionCode:code}).then(res=>{
        this.discName = res.pmPromotionDiscountList[0].discName
      })
    },
    shopCart() {
      $router.back()
    },
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
        let json = {
        skuCode: item.skuCode
      };
      $router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail", json);
    //   $router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail", {
    //     json: item.goodsCode
    //   });
    },
    loadMore(){
      let num = Math.ceil(this.total/10);
      this.page++;
      if(this.page<= num){
        http.post(queryPromotionGoods,{page:this.page,rows:this.rows,promotionCode:this.goodsCodeId}).then(res=>{
          let list = res.rows
          list.map(v=>{
            if(!RegExp(/http/).test(v.dataPic)){
              v.dataPic=this.$domain+v.dataPic
            }
          })
          this.goodsList = [...this.goodsList,...list]
        })
      }else{
        this.lastPageLine = true;
      }
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
  &-shopCart {
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
  &-headerTop{
    margin-left: 20rpx;
    margin-top: 10rpx;
    color: rgba(51, 51, 51, 1)
  }
  &-headerBottom{
    margin-left: 20rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
  }
  &-center{
    display: flex;
    .bannerImg{
      width: 750rpx;
      height: 300rpx;
      background-color: red;
    }
  }
  &-list{
      width: 100%;
      margin-top: 20rpx;
      .malllist_all {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 29rpx 20rpx 0;
      }
      .mallList_itemview {
        width: 345rpx;
        height: 450rpx;
        
        background-color: white;
        margin-bottom: 20rpx;
        display: flex;
        flex-direction: column;
      }
      .pro_image {
        width: 345rpx;
        height: 345rpx;
        // border-radius: 10px 10px 0px 0px;
      }
      .pro_title {
        height: 25rpx;
        font-size: 26rpx;
        font-family: SourceHanSansCN-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 25rpx;
        margin-left: 30rpx;
        margin-top: 13rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .pro_footer{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .pro_price {
        font-size: 28rpx;
        font-family: SourceHanSansCN-Regular;
        font-weight: 400;
        color: rgba(238, 81, 81, 1);
        line-height: 24rpx;
        margin-left: 30rpx;
        margin-top: 27rpx;
      }
      .AddPic{
        width: 30rpx;
        height: 30rpx;
        background-color: #208F43;
        line-height: 24rpx;
        text-align: center;
        border-radius: 15rpx;
        color: #fafafa;
        margin-top: 25rpx;
        margin-right: 30rpx;
      }
    }
}
</style>




