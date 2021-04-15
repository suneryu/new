<template>
  <div class="spec-box eval-box">
    <div class="spec-infor">
      <p class="left-con">全部评价({{totals}})</p>
      <p class="right-con" @click="moreEvalute">
        <span class="checkAll">查看全部</span>
        <i class="iconfont">&#xe61d;</i>
      </p>
    </div>
    <div class="evaluate-list">
      <ul v-if="evaluateList.length !=0">
        <li>
          <div class="img-box">
            <img :src="evaluateList.userImgurl" />
            <h3>{{evaluateList.memberBname}}</h3>
          </div>
          <p class="ev-infor">{{evaluateList.evaluateGoodsContent}}</p>
        </li>
      </ul>
      <h3 v-if="evaluateList.length ==0">暂无评价</h3>
    </div>
  </div>
</template>
<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { formatTimes } from "@/utils/prototype/date.js";
import { evaluate } from "@/api/interface.js";
export default {
  props: ["goodsCode"],
  data() {
    return {
      userImgurl: require("../../../static/img/helpCenter/header.png"),
      showEv: false,
      totals: "",
      evaluateList: [],
      load: true
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
      backgroundColor: "#07913B"
    });
  },
  watch: {
    // goodsCode(newVal, old) {
    //     console.log(newVal,"监听的值")
    //   if (this.load && newVal) {
    //     this.load = false;
    //     this.getList(newVal);
    //   }
    // }
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    if (this.goodsCode) {
      this.getList();
    }
  },
  methods: {
    getList(val) {
    //   if (val) {
        let _date = {
          goodsCode: this.goodsCode
        };
        http.get(evaluate, _date).then(res => {
          if (res.list.length > 0) {
            res.list.map(el => {
              el.memberBname = formatPhone(el.memberBname);
              if (!RegExp(/http/).test(el.dataPic)) {
                el.dataPic = this.$domain + el.dataPic;
              }
            });
            this.totals = res.total;
            this.evaluateList = res.list[0];
          } else {
            this.totals = "0";
          }
        });
    //   }
    },
    //跳转查看评价页面
    moreEvalute() {
      $router.push("evaluate/goodsEvaluates", {
        json: JSON.stringify(this.goodsCode)
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../../common/css/common.less";
.t-box {
  display: flex;
}
.t-box-flex1 {
  flex: 1;
}
.t-box-flex2 {
  flex: 2;
}
.mar-r20 {
  margin-right: 20rpx;
}
.mar-t6 {
  margin-top: 20rpx;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.color-red {
  color: #e40506;
}
.fontw-400 {
  font-weight: 600;
}
.color-999 {
  color: #999999;
}

.get-btn {
  display: inline-block;
  width: 120rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  background: #07913b;
  color: #ffffff;
  border-radius: 60rpx;
}
.red-btn {
  background: #999999;
}
.eval-box {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
.spec-box {
  background: @white-color;
  font-size: 24rpx;
  .spec-infor {
    line-height: 102rpx;
    margin: 0rpx 30rpx;
    display: flex;
    border-bottom: 1rpx solid #ededed;
    border-left: none;
    border-right: none;
    .left-con {
      flex: 5;
    }
    .right-con {
      .checkAll {
        flex: 1;
        margin-right: 8rpx;
      }

      i {
        display: inline-block;
      }
    }
  }
  .evaluate-list {
    padding: 30rpx;
    ul {
      margin-top: 20rpx;
      li {
        .img-box {
          overflow: hidden;
          margin-bottom: 20rpx;
          img {
            width: 60rpx;
            height: 60rpx;
            border-radius: 60rpx;
            float: left;
          }
          h3 {
            float: left;
            vertical-align: middle;
            height: 60rpx;
            line-height: 60rpx;
            margin-left: 20rpx;
          }
        }
        .ev-infor {
          line-height: 48rpx;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
</style>

