<template>
  <div class="appointment">
    <div class="input">
      <input type="text" placeholder-style="color:#e2e2e2;" v-model="name" placeholder="输入姓名" />
      <input type="text" placeholder-style="color:#e2e2e2;" v-model="phone" placeholder="输入手机号" />
      <button type="primary" class="btn" @click="btn">预约</button>
    </div>
  </div>
</template>
<script>
import { $storage, $router } from "@/utils/prototype/vue.js";
export default {
  data() {
    return {
      name: null,
      phone: null
    };
  },
  onLoad() {},
  created() {},
  mounted() {},
  methods: {
    btn() {
      let that = this;
      if (!this.name) {
        wx.showToast({
          title: "姓名不能为空",
          icon: "none"
        });
        return;
      }
      if (!this.phone) {
        wx.showToast({
          title: "手机号不能为空",
          icon: "none"
        });
        return;
      }
      wx.showToast({
        title: "预约成功！",
        icon: "success",
        complete: function() {
          // console.log("d");
          setTimeout(() => {
            that.$router.push("o2o_mine");
          }, 400);
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "../../../../common/css/common.less";
.appointment {
  background-image: url("https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/bg.jpg");
  background-size: cover;
  width: 100%;
  height: 100%;
  .input {
    width: 80%;
    margin: 300rpx 10% 0;
    input {
      height: 88rpx;
      line-height: 88rpx;
      border-bottom: 1rpx solid #fff;
      color: #fff;
      margin: 20rpx 0 0;
    }
  }
  .btn {
    margin-top: 50rpx;
    background: #07913b;
  }
}
</style>

