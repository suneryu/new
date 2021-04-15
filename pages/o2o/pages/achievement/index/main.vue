<template>
  <div class="wallet-box">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <!-- tab -->
    <div class="wallet-tab">
      <ul class="flex tab-ul">
        <li
          :class="['flex-item1',active == index ? 'active' : '']"
          v-for="(item,index) in tabItem"
          :key="index"
          :style="{background:active ==index? baseColor : ''}"
          @click="tabHandler(item,index)"
        >{{item.label}}</li>
      </ul>
      <div class="tab-cont mar-t20 pad-t20 pad-b20 mar-b20 auto">
        <ul class="t-box">
          <li class="t-box-flex1 t-center">
            <p>订单数量</p>
            <span class="mar-t20">{{orderNum}}</span>
          </li>
          <li class="t-box-flex1 t-center">
            <p>订单金额</p>
            <span class="mar-t20">{{orderAmount}}</span>
          </li>
        </ul>
      </div>
      <div class="tab-main">
        <ul>
          <li class="flex align--center" v-for="(item,index) in dataList" :key="index">
            <div class="flex-item1 f-s24">
              <p>下单时间：{{item.gmtCreate}}</p>
              <p>订单编号：{{item.contractBillcode}}</p>
            </div>
            <h4 class="f-s30">
              +
              <span>{{unitPrice.obpay}}{{item.contractMoney}}{{unitPrice.mapay}}</span>
            </h4>
          </li>
          <p v-if="dataList.length == 0" style="color:#999;text-align:center;padding:50px 0">暂无数据</p>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { refund } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
import { queryContForGroup } from "@/api/interface.js";
// import picker from '@/components/communal/picker';
export default {
  data() {
    return {
      title: "我的业绩",
      leftIcon: true,
      rightIcon: false,
      baseColor: "",
      //   tabItem: ["今日", "昨日", "本周", "本月"],
      tabItem: [
        { label: "今日", name: "today" },
        {
          label: "昨日",
          name: "yesterday"
        },
        {
          label: "本周",
          name: "week"
        },
        {
          label: "本月",
          name: "month"
        }
      ],
      orderNum: 0, // 订单数量
      orderAmount: 0, //订单金额
      dataList: [],
      active: 0,
      page: 1,
      rows: 10,
      params: {
        startDate: null, //'2019 - 12 - 03',
        endDate: null //'2019 - 12 - 11'
      }
    };
  },
  components: {
    commonHeader
    // picker
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    this.baseColor = this.$state.baseColor
    Object.assign(this, this.$options.data());
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice") || {};
    }
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor
    this.formatDate(false, "today");
    this.getOrder();
  },
  methods: {
    tabHandler(item, index) {
      this.active = index;
      this.formatDate(false, item.name);
      this.getOrder();
    },
    getOrder() {
      http.get(queryContForGroup, this.params).then(res => {
        this.orderNum = this.orderAmount = 0;
        this.dataList = res.rows;
        this.orderNum = res.total;
        res.rows.map(res => {
          this.orderAmount = this.accAdd(this.orderAmount, res.contractMoney).toFixed(2);
        });
      });
    },
    accAdd(num1, num2) {
      var r1, r2, m;
      try {
        r1 = num1.toString().split(".")[1].length;
      } catch (e) {
        r1 = 0;
      }
      try {
        r2 = num2.toString().split(".")[1].length;
      } catch (e) {
        r2 = 0;
      }
      m = Math.pow(10, Math.max(r1, r2));
      // return (num1*m+num2*m)/m;
      return Math.round(num1 * m + num2 * m) / m;
    },
    formatDate(stamp, name) {
      // shijianchuo是整数，否则要parseInt转换
      var time = stamp ? new Date(stamp) : new Date();
      var y = time.getFullYear();
      var m = time.getMonth() + 1;
      var d = time.getDate();
      var dy = time.getDate() - 1;
      var h = time.getHours();
      var mm = time.getMinutes();
      var s = time.getSeconds();
      //一天的毫秒数
      var millisecond = 1000 * 60 * 60 * 24;
      //减去的天数
      var minusDay = d != 0 ? d - 9 : 6;
      var monday = new Date(time.getTime() - minusDay * millisecond);
      var sunday = new Date(monday.getTime() + 6 * millisecond);
      var sm = monday.getMonth() + 1;
      var sd = monday.getDate();
      var em = sunday.getMonth() + 1;
      var ed = sunday.getDate();

      if (name == "today") {
        this.params.startDate = y + "-" + this.add0(m) + "-" + this.add0(d);
        this.params.endDate = y + "-" + this.add0(m) + "-" + this.add0(d);
      } else if (name == "yesterday") {
        this.params.startDate = y + "-" + this.add0(m) + "-" + this.add0(dy);
        this.params.endDate = y + "-" + this.add0(m) + "-" + this.add0(dy);
      } else if (name == "month") {
        this.params.startDate = y + "-" + this.add0(m) + "-01";
        this.params.endDate = y + "-" + this.add0(m) + "-" + this.getDay(y, m);
      } else if (name == "week") {
        //本周 周一
        this.params.startDate = y + "-" + this.add0(sm) + "-" + this.add0(sd);
        this.params.endDate = y + "-" + this.add0(em) + "-" + this.add0(ed);
      } else {
        return (
          y +
          "-" +
          this.add0(m) +
          "-" +
          this.add0(d) +
          "  " +
          this.add0(h) +
          ":" +
          this.add0(mm) +
          ":" +
          this.add0(s)
        );
      }
    },
    add0(m) {
      return m < 10 ? "0" + m : m;
    },
    getDay(year, month) {
      var d = new Date(year, month, 0);
      return d.getDate();
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
.wallet-box {
  background: #fff;
}
.t-box {
    display: flex;
}
.t-box-flex1 {
    flex: 1;
}
.t-center {
    text-align: center;
}

.wallet-tab {
  padding: 110rpx 30rpx 30rpx;
  margin: 20rpx 30rpx 0;
  .tab-ul {
    height: 76rpx;
    line-height: 76rpx;
    border: 1rpx solid #e0e0e0;
    border-radius: 10rpx;
    text-align: center;
    font-size: 26rpx;
    li {
      border-right: 1rpx solid #e0e0e0;
    }
    li:first-child {
      border-right: 0rpx solid #e0e0e0;
      border-radius: 10rpx 0 0 10rpx;
    }
    li:last-child {
      border-radius: 0rpx 10rpx 10rpx 0rpx;
    }
    li.active {
      color: #fff;
      // background: #178d43;
    }
  }
}
.tab-cont {
    margin-top: 40rpx;
  ul {
    li {
      span {
        color: red;
        font-size: 36px;
        display: block;
      }
    }
  }
}
.tab-main {
  ul {
    li {
      padding: 20rpx 0;
      p {
        line-height: 40rpx;
      }
      border-bottom: 1rpx solid #e0e0e0;
    }
  }
}
</style>




