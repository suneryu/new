<template>
  <div class="member">
    <div class="member-head">会员码</div>
    <div class="member-center">
      <div class="header">
        <img class="headerPic" :src='userInfo.avatarUrl' alt="">
        <div class="header_right">
          <div class="right_top">
            <div class="title">{{userData.userPhone}}</div>
            <div class="title1">年消费金额: <i> ¥10.00</i></div>
          </div>
          <div class="right_bottom">
            <img src="/static/img/address/address_default@2x.png" alt="">
            <i>会员有效期至2020-11-10</i>
          </div>
        </div>
      </div>
      <div class="detail">
        <div class="detailBtn1"> 
          <i>¥ 0.00</i>
          返利劵
        </div>
        <div class="detailBtn1"> 
          <h3>0.00</h3>
          电子购物卡
        </div>
        <div class="detailBtn1"> 
          <h4>0</h4>
          积分
        </div>
      </div>
      <div class="code">
        <div class="number">Card No: {{userData.userInfoCode}}</div>
        <div class="codePic">
          <canvas style="width: 150px; height: 150px;" canvas-id="canvasId"></canvas>
        </div>
        <div class="subTitle">使用时请向收银员出示此二维码</div>
        <div class="bottom">
          <div class="btn1">
            <img src="" alt="">
            <i>优惠券</i>
          </div>
          <div class="btn1" @click="Sao">
            <img src="" alt="">
            <i>扫一扫</i>
          </div>
        </div>
      </div>
    </div>
    
  </div>
  
</template>
<script>
import {$storage,$router} from '@/utils/prototype/vue.js'
import http from '@/api/http.js'
import {code} from '@/utils/code.js';

export default {
  data(){
    return {
      userData:{},
      userInfo:{},
      src: '',
      // 画布的宽高要和object里面的宽高保持一致
      object: {
          text: '扫我干啥,扫你咋地', // 二维码的内容
          width: 150, // 二维码的宽
          height: 150, // 二维码的高
          canvasId: 'canvasId' //canvas的ID（唯一标识）
      }
    }
  },
  onLoad() {
    this.userData = $storage.get('loginInfor')
    this.userInfo = $storage.get('userInfo')
    this.object.text = this.userData.userPhone + ',' + this.userData.userInfoCode
   console.log('--00000--',$storage.get('loginInfor')) 
  },
  created(){
    

  },
  mounted() {
   this.getCode(this.object)
    
  },
  methods: {
    getCode(object) {
      let that = this
        var promise;

      // 调用生成二维码的函数
      code(object).then(data => {
          that.src = data
      })
    },
    Sao(){
      wx.scanCode({
        success (res) {
          console.log(res)
        }
      })
    }
  },
}
</script>
<style lang="less">
@import '../../../../../common/css/common.less';
.member{
  background-color: #208F43;
  &-head{
    color: white;
    text-align: center;
  }
  &-center{
    margin-top: 20rpx;
    width: 690rpx;
    height: 900rpx;
    background-color: white;
    margin-left: 30rpx;
    border-top-right-radius: 20rpx;
    border-top-left-radius: 20rpx;
    .header{
      display: flex;
      flex-direction: row;
      .headerPic{
        width: 100rpx;
        height: 100rpx;
        border-radius: 50rpx;
        margin-top: 30rpx;
        margin-left: 20rpx;
      }
      .header_right{
        display: flex;
        flex-direction: column;
        margin-left: 20rpx;
        margin-top: 20rpx;
      }
      .right_top{
        display: flex;
        flex-direction: row;
        .title{
          font-size: 34rpx;
        }
        .title1{
          display: flex;
          flex-direction: row;
          margin-left: 20rpx;
          margin-top: 10rpx;
          font-size: 22rpx;
          color: #666666;
          i{
            color: red;
            margin-left: 10rpx;
          }
        }
      }
      .right_bottom{
        display: flex;
        flex-direction: row;
        margin-top: 10rpx;
        img{
          margin-top: 10rpx;
          width: 100rpx;
          height: 30rpx;
        }
        i{
          margin-top: 10rpx;
          margin-left: 30rpx;
          color: #999999;
          font-size: 20rpx;
        }
      }
    }
    .detail{
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      width: 660rpx;
      height: 120rpx;
      border-bottom: rgb(237, 238, 239) solid 1rpx;
      border-top: rgb(237, 238, 239) solid 1rpx;
      margin-left: 15rpx;
      margin-top: 20rpx;
      .detailBtn1{
        margin-top: 20rpx;
        color: #666666;
        font-size: 22rpx;
        text-align: center;
        i{
          color: #208F43;
          font-size: 24rpx;
        }
        h3{
          color: red;
          font-size: 24rpx;
        }
        h4{
          color: #2F7DBA;
          font-size: 24rpx;
        }
      }
    }
    .code{
      margin-top: 20rpx;
      text-align: center;
      .number{
        font-size: 24rpx;
        color: #666666;
      }
      .codePic{
          display:flex;                  
          justify-content: center; 
          margin-top: 20rpx;
      }
      .subTitle{
        text-align: center;
        font-size: 20rpx;
        color: #666666;
        margin-top: 20rpx;
      }
      .bottom{
        display: flex;
        flex-direction: row;
        margin-top: 30rpx;
        justify-content: space-evenly;
        .btn1{
          img{
            width: 30rpx;
            height: 20rpx;
            background-color: #208F43;
          }
          i{
            text-align: center;
            font-size: 20rpx;
            color: #666666;
            // margin-top: 5rpx;
          }
        }
      }
    }
  }
}
</style>

