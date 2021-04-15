<template>
  <div class="promotion">
    <div class="tab">
      <ul class="flex">
        <li class="flex-item1" :class="active == 1 ? 'active' : ''" @click="tabBtn(1)">图文推广</li>
        <li class="flex-item1" :class="active == 2 ? 'active' : ''" @click="tabBtn(2)">商品推广</li>
      </ul>
    </div>
    <div class="tab-main">
      <div class="tab-item" v-if="active == 1">
        <ul>
          <li v-for="(item,index) in data1" :key="index">
            <div class="auto">
              <h3 class="f-s30" style="margin-bottom:20rpx;padding-top:20rpx;">{{item.title}}</h3>
              <img :src="item.img" class="img" />
              <div class="tab-footer flex">
                <div class="flex-item1">
                  <h4 class="f-s28">{{item.h3}}</h4>
                  <p class="f-s24">{{item.p}}</p>
                </div>
                <div class="tab-btn" @click="shareBtn">
                  <button open-type="share">一键分享</button>
                </div>
              </div>
            </div>
            <div class="seat"></div>
          </li>
        </ul>
      </div>
      <div class="tab-item" v-if="active == 2">
        <ul>
          <li class="tab-li" v-for="(item,i) in data2" :key="i">
            <div class="auto flex">
              <div class="img-goods">
                <img :src="item.img" alt />
              </div>
              <div class="flex-item1 goods-box">
                <h3 class="fs-26">{{item.title}}</h3>
                <div class="flex f-s24" style="margin-top:20rpx;">
                  <p class="flex-item1" style="color:#e60012">{{item.price1}}</p>
                  <span>{{item.price2}}</span>
                </div>
              </div>
              <div class="share">
                <button open-type="share">
                  <i class="iconfont icon-share"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import commonHeader from "@/components/communal/commonHeader";
export default {
  components: {
    commonHeader
  },
  data() {
    return {
      active: 1,
      data1: [
        {
          title: "浙江金华店",
          h3: "顾家家居真皮沙发椅懒人电动功能沙发客厅单人沙发椅6001",
          p: "限时抢购3999...",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/1.jpg"
        },
        {
          title: "顾家家居",
          h3: "顾家家居席梦思弹簧独立筒床垫卧室家具护脊乳胶3D椰棕床垫M0001",
          p: "独立袋装弹簧 三区弹力设计",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/2.jpg"
        },
        {
          title: "顾家家居",
          h3: "顾家家居现代简约钢化玻璃茶几电视柜组合客厅成套家具1675",
          p: "光洁靓丽，易于打理，圆润边角防磕碰",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/3.jpg"
        },
        {
          title: "顾家家居全屋定制",
          h3: "顾家家居日式飘窗小卧室榻榻米床衣柜整体地柜一体上下床垫定制",
          p: "店铺预售,付款后45天内发货",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/4.jpg"
        }
      ],
      data2: [
        {
          title: "顾家家居 进口头层黄牛皮简约真皮功能沙发 KG.086 体验款",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/s1.jpg",
          price1: "¥ 17199.00",
          price2: "¥ 40998.00"
        },
        {
          title: "顾家家居全屋定制现代简约卧室组合推拉移门实木整体衣柜衣帽间Y",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/s2.jpg",
          price1: "¥ 2998.00",
          price2: "¥ 4098.00"
        },
        {
          title: "[新品]顾家家居简约意式轻奢真皮高脚沙发客厅沙发KUKA.123门店款",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/s3.jpg",
          price1: "¥ 18300.00",
          price2: "¥ 191598.00"
        },
        {
          title: "顾家家居宽邸 现代简约高脚金属真皮客厅沙发小户型沙发组合S020",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/s4.jpg",
          price1: "¥ 5899.00",
          price2: "¥ 9998.00"
        },
        {
          title: "顾家家居 真皮轻奢整装组合皮沙发现代简约大小户型1022R！",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/s5.jpg",
          price1: "¥ 9349.00",
          price2: "¥ 10998.00"
        },
        {
          title: "顾家家居北欧床脚榻榻米床双人床1.8米床PTM301B",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/s6.jpg",
          price1: "¥ 4699.00",
          price2: "¥ 9998.00"
        },
        {
          title: "顾家家居惠致系列现代简约真皮床双人储物卧室软床板式床B859",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/s7.jpg",
          price1: "¥ 6399.00",
          price2: "¥ 14679.00"
        },
        {
          title: "顾家家居惠尚系列真皮床主卧现代简约双人床主卧婚床B879 体验款",
          img: "https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/s8.jpg",
          price1: "¥ 7049.00   ",
          price2: "¥ 17998.00"
        }
      ]
    };
  },
  onLoad() {},
  created() {},
  mounted() {},
  methods: {
    tabBtn(item) {
      this.active = item;
    },
    shareBtn() {
      wx.showShareMenu({
        withShareTicket: true
      });
    }
  }
};
</script>
<style lang="less">
@import "../../../../common/css/common.less";
page {
  background: #fff;
}
.promotion {
  .tab {
    width: 420rpx;
    margin: 20rpx auto;
    border-radius: 10rpx;
    border: 1rpx solid #07913b;
    color: #07913b;
    height: 78rpx;
    line-height: 78rpx;
    text-align: center;
    li:first-child {
      border-right: 1rpx solid #07913b;
    }
    li.active {
      background: #07913b;
      color: #fff;
    }
  }
  .tab-item {
    .seat {
      height: 20rpx;
      background: #f5f5f5;
    }
    .tab-footer {
      margin: 20rpx 0;
      h4 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 10rpx;
        width: 500rpx;
      }
      .tab-btn {
        margin-left: 20rpx;
        button {
          width: 160rpx;
          height: 66rpx;
          border-radius: 52rpx;
          border: 2rpx solid #07913b;
          color: #07913b;
          line-height: 66rpx;
          text-align: center;
          font-size: 28rpx;
          background: none;
        }
      }
    }
    .img {
      width: 700rpx;
      height: 320rpx;
    }
    .img-goods {
      margin-right: 20rpx;
      img {
        width: 180rpx;
        height: 180rpx;
      }
    }
    .tab-li {
      border-bottom: 1rpx solid #e0e0e0;
      padding: 20rpx;
    }
    .goods-box {
      h3 {
        height: 130rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      span {
        text-decoration: line-through;
      }
    }
    .share {
      margin-left: 10rpx;
      button {
        border: 0px solid transparent;
        padding: 0 10rpx;
        background: none;
        &::after {
          border: none;
        }
      }
    }
  }
}
</style>

