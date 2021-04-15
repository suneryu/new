<template>
  <div class="banners-list">
    <swiper
      class="swiper"
      indicator-dots="true"
      autoplay="true"
      interval="4000"
      duration="1000"
      circular="true"
      :style="{ height: Hei + 'px' }"
    >
      <block
        v-for="(item, index) in skuList.rsGoodsFileDomainList"
        :index="index"
        :key="index"
      >
        <swiper-item>
          <image
            :src="item.goodsFileUrl"
            mode="aspectFit"
            class="slide-image"
          />
        </swiper-item>
      </block>
    </swiper>
    <div class="goods-infor">
      <h3>{{ skuList.goodsName }}</h3>
      <p class="price" v-if="price && price != 'NaN'">
        {{ unitPrice.obpay }}
        <span>{{ price }}</span>
        {{ unitPrice.mapay }}
      </p>
    </div>
  </div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
import { article } from '@/api/interface.js';

export default {
  props: ['skuList'],
  data() {
    return {
      goodsinfor: '',
      rsSkuDomainList: [],
      Hei: 0,
      price: ''
    }
  },
  updated() {
    this.price = (this.skuList.pricesetNprice * 1).toFixed(2)
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice")
    }
  },
  filters: {
    numFilter(value) {
      let realVal = null
      if (value) {
        // 截取当前数据到小数点后两位
        realVal = parseFloat(value).toFixed(2)
      } else {
        realVal = '--';
      }
      console.log(realVal, 'realVal')
      return realVal
    }
  },
  watch: {
    skuList() {
      return this.skuList
    }
  },
  onLoad(options) {
    Object.assign(this.$data, this.$options.data()) //初始化数据
    let pages = getCurrentPages()
    let prevpage = pages[0]
    $storage.set('prevpage', prevpage.route)
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#' + this.$state.baseColor,
      backgroundColor: '#07913B'
    })
  },
  mounted() {
    this.baseColor = '#' + this.$state.baseColor
    this.baseColor = '#07913B';
  },
  methods: {}
}
</script>

<style lang="less" scoped>
@import "../../../common/css/common.less";
page {
  background: @white-color;
}
.banners-list {
  background: @white-color;
  margin-top: 98rpx;
  .swiper {
    min-height: 400rpx;
    .slide-image {
      height: 100%;
      width: 100%;
    }
  }
  .goods-infor {
    padding: 20rpx 30rpx;
    h3 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .price {
      color: #e40506;
      font-size: 36rpx;
      margin-top: 16rpx;
    }
  }
}
</style>
