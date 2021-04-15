<template>
  <div class="myHistory">
    <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
    <div class="myHistory-edit" v-if="edits" @click="edit" v-show="orders.length>0">编辑</div>
    <div class="myHistory-edit" v-else @click="ok" v-show="orders.length>0">完成</div>
    <div v-if="orders.length > 0">
      <div class="myHistory-con" v-for="(item,index) in order" :key="index">
        <div class="myHistory-con-times" @click="nowCheck(index)" v-if="!edits">
          <p :class="{'opacity':edits}">
            <i class="iconfont" v-show="!item.allCheck" :style="{color:baseColor}">&#xe672;</i>
            <i class="iconfont" v-show="item.allCheck" :style="{color:baseColor}">&#xe671;</i>
          </p>
          <span :class="{'iconMargin':!edits}">{{item.time}}</span>
        </div>
        <div class="myHistory-con-times" v-else>
          <p :class="{'opacity':edits}">
            <i class="iconfont" v-show="!item.allCheck" :style="{color:baseColor}">&#xe672;</i>
            <i class="iconfont" v-show="item.allCheck" :style="{color:baseColor}">&#xe671;</i>
          </p>
          <span :class="{'iconMargin':!edits}">{{item.time}}</span>
        </div>
        <ul>
          <li v-for="(todo,todoIndex) in item.list" :key="todoIndex">
            <a>
              <div class="historyImg">
                <img :src="todo.footprintOppic" @click="toGoodsDetail(todo)" />
                <span v-show="todo.dataState===2">已下架</span>
                <span v-show="todo.dataState===3">已失效</span>
                <span v-show="todo.dataState===1">库存不足</span>
              </div>
              <div class="money">
                <span
                  style="#d66377"
                  v-if="todo.footprintOpnum"
                >{{unitPrice.obpay}}{{todo.footprintOpnum}}{{unitPrice.mapay}}</span>
                <span :style="{color:baseColor}" v-else>暂无价格</span>
                <p v-if="!edits" @click="checkLi(index,todoIndex)">
                  <i class="iconfont" v-if="!todo.check" :style="{color:baseColor}">&#xe672;</i>
                  <i class="iconfont" v-else :style="{color:baseColor}">&#xe671;</i>
                </p>
                <p v-else @click="openMask(index,todoIndex)">
                  <i class="iconfont">&#xe632;</i>
                </p>
              </div>
              <div class="delIcon" v-show="todo.show && edits">
                <p @click="deleteGoodsList(index,todoIndex)" :style="{background:baseColor}">删除</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="!edits" v-show="orders.length > 0">
      <div class="myHistory-count">
        <div @click="checkAll">
          <i class="iconfont" :style="{color:baseColor}">{{all?'&#xe671;':'&#xe672;'}}</i>
          全选
        </div>
        <div>
          <span :style="{background:baseColor}" @click="deleteAll">删除</span>
        </div>
      </div>
    </div>
    <div class="myHistory-nulls" v-if="orders.length == 0 && requestStatic">
      <img :src="nullImg" />
      <p>暂无足迹...</p>
    </div>
    <lastPageLine :lastPageLine="lastPageLine" />
  </div>
</template>

<script>
import http from "@/api/http.js";
import { $storage, $router, $message } from "@/utils/prototype/vue.js";
import { history } from "@/api/interface.js";
import commonHeader from "@/components/communal/commonHeader";
import vueTabBar from "@/components/communal/vueTabBar";
import lastPageLine from "@/components/communal/last-page-line";
import { formatTimes } from "@/utils/prototype/date.js";

export default {
  data() {
    return {
      title: "我的足迹",
      leftIcon: true,
      rightIcon: false,
      baseColor: "",
      delStatus: true,
      allChecked: false,
      lastPageLine: false,
      edits: true,
      all: false,
      checked: [],
      total: 0,
      page: 1,
      rows: 50,
      order: [],
      orders: [],
      userImgurl: require("../../../../../static/img/mine/default_header.png"),
      nullImg:
        this.$imgDomain +
        "/paas/shop-master/c-static/images/wxminiImg/noHistory.png",
      requestStatic: false
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
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: $storage.get("proappEnvName")
    });
    wx.setNavigationBarColor({
      frontColor: "#ffffff", // 必写项
      backgroundColor: "#" + this.$state.baseColor
    });
    Object.assign(this, this.$options.data());
  },
  mounted() {
    this.baseColor = "#" + this.$state.baseColor;
    this.commonMounted();
  },
  methods: {
    commonMounted() {
      http
        .post(history.queryFootprintPagePlat, { page: 1, rows: 50 })
        .then(res => {
          if (res && res.rows.length > 0) {
            this.orders = res.rows;

            let msg = {
                time: "",
                list: [],
                allCheck: false
              },
              arr = [],
              newArr = [];
            for (let i = 0; i < this.orders.length; i++) {
              this.orders[i].gmtCreate = formatTimes(this.orders[i].gmtCreate);
              if (!RegExp(/http/).test(this.orders[i].footprintOppic)) {
                this.orders[i].footprintOppic =
                  this.$domain + this.orders[i].footprintOppic;
              }
              this.orders[i].show = false;
              this.orders[i].check = false;
              arr.push(formatTimes(this.orders[i].gmtCreate));
            }
            arr = Array.from(new Set(arr));
            arr.map((el, index) => {
              msg = {
                time: "",
                list: [],
                allCheck: false
              };
              this.orders.map((els, index1) => {
                if (el == els.gmtCreate) {
                  msg.time = el;
                  msg.list.push(els);
                }
              });
              newArr.push(msg);
            });
            this.order = newArr;
            this.requestStatic = true;
          } else if (res && res.rows.length === 0) {
            console.log(res.rows, "res.rows--长度");
            console.log("删除成功，走这里了吗？");
            this.orders = res.rows;
            if (this.orders.length == 0) {
              this.requestStatic = true;
            }
          }
        });
    },
    edit() {
      this.edits = false;
    },
    ok() {
      this.edits = true;
    },
    checkAll() {
      this.all = this.all ? false : true;
      if (this.all) {
        this.order.map(el => {
          el.allCheck = true;
          el.list.map(els => {
            els.check = true;
          });
        });
      } else {
        this.order.map(el => {
          el.allCheck = false;
          el.list.map(els => {
            els.check = false;
          });
        });
      }
      let arr = this.order;
      this.order.splice(0, this.order.length, ...arr); //更新整个数组
    },
    deleteAll() {
      this.order.map((el, listIndex) => {
        el.list.map(els => {
          if (els.check) {
            this.checked.push(els.footprintCode);
          }
        });
      });
      if (this.checked.length < 1) {
        $message.alert("请勾选您要删除的商品");
        return;
      }
      let data = {
        footprintCodeStr:
          this.checked.length == 1 ? this.checked + "," : this.checked.join()
      };
      http.post(history.deleteAllFootprintByCode, data).then(res => {
        if (res.success) {
          $message.alert("删除成功");
          this.commonMounted();
        }
      });
    },
    nowCheck(index) {
      let silde = true;
      this.order[index].allCheck = this.order[index].allCheck ? false : true;
      this.order[index].list.map(el => {
        if (this.order[index].allCheck) {
          el.check = true;
        } else {
          el.check = false;
        }
      });
      this.order.map(el => {
        if (!el.allCheck) {
          silde = false;
        }
      });
      if (silde) {
        this.all = true;
      } else {
        this.all = false;
      }
      let arr = this.order;
      this.order.splice(0, this.order.length, ...arr); //更新整个数组
    },
    checkLi(index, todoIndex) {
      this.order[index].list[todoIndex].check = this.order[index].list[
        todoIndex
      ].check
        ? false
        : true;
      let click = true,
        silde = true;
      this.order[index].list.map((el, index6) => {
        if (!el.check) {
          click = false;
        }
      });
      if (click) {
        this.order[index].allCheck = true;
      } else {
        this.order[index].allCheck = false;
      }
      this.order.map(el => {
        if (!el.allCheck) {
          silde = false;
        }
      });
      if (silde) {
        this.all = true;
      } else {
        this.all = false;
      }
      let arr = this.order;
      this.order.splice(0, this.order.length, ...arr); //更新整个数组
    },
    openMask(index, todoIndex) {
      this.order[index].list[todoIndex].show = this.order[index].list[todoIndex]
        .show
        ? false
        : true;
      let arr = this.order;
      this.order.splice(0, this.order.length, ...arr); //更新整个数组
    },
    deleteGoodsList(index, todoIndex) {
      http
        .post(history.deleteFootprintByCode, {
          footprintCode: this.order[index].list[todoIndex].footprintCode
        })
        .then(res => {
          if (res.success) {
            $message.alert("删除成功！");
            this.commonMounted();
          } else {
            $message.alert(res.msg);
          }
        })
        .catch(err => {
          $message.alert(err);
        });
    },
    toGoodsDetail(todo) {
      let json = {
        skuCode: todo.footprintOpcode
      };
      $router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail", json);
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../../../common/css/common.less";
.myHistory {
  width: 100%;
  padding-top: 90rpx;
  background: #fafafa;
  &-edit {
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
  &-left {
    position: fixed;
    z-index: 9999;
    height: 90rpx;
    width: 70rpx;
    line-height: 90rpx;
    text-align: left;
    left: 30rpx;
    top: 0;
  }
  &-con {
    &-times {
      height: 86rpx;
      line-height: 86rpx;
      font-size: 22rpx;
      color: @color-333;
      padding: 0 30rpx;
      display: flex;
      align-items: center;
      .opacity {
        margin-right: 10rpx;
        display: none;
      }
      .iconMargin {
        margin-left: 20rpx;
      }
    }
    ul {
      overflow: hidden;
      zoom: 1;
      li {
        margin-right: 15rpx;
        margin-bottom: 15rpx;
        width: 240rpx;
        float: left;
        background: @white-color;

        a {
          position: relative;
          width: 100%;
          height: 100%;
          .historyImg {
            position: relative;
            width: 240rpx;
            height: 240rpx;
            img {
              width: 240rpx;
              height: 240rpx;
            }
            span {
              width: 240rpx;
              height: 44rpx;
              background: #b3b3b3;
              color: @white-color;
              font-size: 22rpx;
              text-align: center;
              line-height: 44rpx;
              position: absolute;
              bottom: 0;
              left: 0;
            }
          }
          .money {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20rpx;
            span {
              color: #d66377;
              font-size: @big-title;
            }
            i {
              color: #dcdcdc;
            }
          }
          .delIcon {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            position: absolute;
            z-index: 2;
            top: 0;
            left: 0;
            p {
              width: 98rpx;
              height: 98rpx;
              border-radius: 50%;
              background: #d66377;
              text-align: center;
              line-height: 98rpx;
              color: @white-color;
              font-size: 22rpx;
              position: absolute;
              left: 50%;
              top: 50%;
              margin-left: -49rpx;
              margin-top: -49rpx;
            }
          }
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
  &-count {
    display: flex;
    width: calc(100% - 30rpx);
    position: fixed;
    z-index: 9999;
    padding-left: 30rpx;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: space-between;
    height: 96rpx;
    font-size: @middle-title;
    color: @color-666;
    background: #fff;
    border-top: 1rpx solid #eee;
    div:first-child {
      display: flex;
      align-items: center;
    }
    div:last-child {
      display: flex;
      align-items: center;
    }
    i {
      margin-right: 15rpx;
    }
    span {
      display: inline-block;
      width: 246rpx;
      height: 96rpx;
      line-height: 96rpx;
      text-align: center;
      color: @white-color;
      font-size: 32rpx;
      background: #b79f77;
    }
  }
  &-nulls {
    height: calc(100% - 202rpx);
    text-align: center;
    img {
      width: 359rpx;
      height: 276rpx;
      margin: 280rpx auto 0;
    }
    p {
      margin-top: 40rpx;
      height: 72rpx;
      line-height: 72rpx;
      text-align: center;
      color: #999999;
      font-size: 24rpx;
    }
  }
}
</style>




