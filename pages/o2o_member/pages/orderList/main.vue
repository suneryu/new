<template>
  <div class="orderList">
    <!-- <commonHeader title="订单管理" leftIcon="false" rightIcon="false" /> -->
    <div class="orderList-search">
      <div class="auto">
        <input @input="getsuggest" placeholder="搜索" />
      </div>
    </div>

    <div class="list">
      <ul>
        <li v-for="(item, index) in orderList" :key="index">
          <div class="auto">
            <div class="title flex">
              <h4 class="flex-item1">客户名称:{{ item.memberName }}</h4>
              <p v-if="item.dataState == -1">已取消</p>
              <p v-else-if="item.dataState == 1">待付款</p>
              <p v-else-if="item.dataState == 2">待发货</p>
              <p v-else-if="item.dataState == 3">待收货</p>
              <p v-else-if="item.dataState == 4">交易成功</p>
            </div>
            <div class="list-box">
              <p class="f-s24">订单编号：{{ item.contractBillcode }}</p>
              <p class="f-s24">下单时间：{{ formatDate(item.gmtCreate) }}</p>
              <p class="f-s24">商品数量：{{ item.goodsNum }}</p>
              <p class="f-s24">应付总额：￥{{ item.dataBmoney }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import commonHeader from '@/components/communal/commonHeader';
import http from '@/api/http.js';
import { myOrder } from '@/api/interface.js';

export default {
  components: {
    commonHeader
  },
  data() {
    return {
      orderList: [],
      items: ['全部', '待付款', '待配送', '配送中', '待评价']
    }
  },
  onLoad() {},
  created() {},
  mounted() {
    this.getOrder()
  },
  methods: {
    getOrder() {
      http
        .get(myOrder.queryContractPage, {
          page: 1,
          rows: 10,
          childFlag: true
        })
        .then(res => {
          if (res && res.rows) {
            if (this.page === 1 && res.rows.length === 0) {
              this.orderList = []
            } else {
              res.rows.map(v => {
                v.dataBmoney = (v.dataBmoney * 1).toFixed(2)
              })
              this.orderList = res.rows
            }
          }
        })
    },
    add0(m) {
      return m < 10 ? '0' + m : m
    },
    formatDate(stamp) {
      // shijianchuo是整数，否则要parseInt转换
      var time = new Date(stamp)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      return (
        y +
        '-' +
        this.add0(m) +
        '-' +
        this.add0(d) +
        '  ' +
        this.add0(h) +
        ':' +
        this.add0(mm) +
        ':' +
        this.add0(s)
      )
    }
  }
}
</script>
<style lang="less">
@import "../../../../common/css/common.less";
.orderList {
  &-search {
    background: #fff;
    padding: 10rpx 0;
    input {
      border: 1px solid #c3c3c3;
      height: 30px;
      border-radius: 3px;
      padding: 0 5px;
      border: 1px solid #ccc;
      border-radius: 40px;
      text-align: center;
      height: 30px;
      line-height: 30px;
    }
  }
  .list {
    li {
      margin: 0rpx 0 20rpx;
      background: #fff;
      .title {
        border-bottom: 1rpx solid #e0e0e0;
        height: 80rpx;
        line-height: 80rpx;
      }
      .list-box {
        padding: 10rpx 0 20rpx;
        line-height: 50rpx;
      }
    }
  }
}
</style>
