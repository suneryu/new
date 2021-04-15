<template>
  <div class="user users">
    <div  class="user-order">
      <div class="user-order-title">
        <span class="my-order">{{myOrderName}}</span>
        <a @click="statusOrder(0,1,arryorderList[0].menuJspath)">全部订单<i class="iconfont">&#xe61d;</i></a>
      </div>
      <div class="user-order-my">
        <a @click="statusOrder(orderIndex+1,order,order.menuJspath)" v-for="(order,orderIndex) in arryorderList" :key="orderIndex">
          <i class="iconfont" :class="order.menuSelectClass ? order.menuSelectClass : 'icon-wodedingdan'" :style="{color:baseColor}"></i>
          <p>{{order.menuName}}</p>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
// import getUserInfo from '@/components/communal/getUserInfo';
import {$storage,$router} from '@/utils/prototype/vue.js'
import http from '@/api/http.js'
import {getProappinfo,loginIn,getTopPerMenuList,getTopPerMenuListFPc,thirdLogin,loginMicroMessenger,loginMiniProgram,loginOut} from '@/api/interface.js'
import { clearTimeout, setTimeout } from 'timers';
import { log } from 'util';
export default {
  props:['myOrders','baseColor',"myOrderName"],
  data(){
    return {
      domains:this.$domain,
      baseColor:'',
      arryorderList:[],
      // webmail:''
    }
  },
  onLoad(options) {
      this.message = options.message
  },
  created(){},
  computed:{
    // 监听接收数据
    orderlist(){
        console.log(this.myOrders,"99999999999999999999")
      var that = this;
      that.arryorderList = [];
      for (var i = 1; i < this.myOrders.length; i++) { 
        that.arryorderList.push(this.myOrders[i])
      }
      return that.arryorderList
    }
   
  },
  mounted() {    
  },
  methods: {
    statusOrder(dataState,order,path){
        console.log(path)
      if(order.menuCode=='00000200'){
        this.myOrders.map(v=>{
          if(v.menuAction=='refundList'){
            $router.push(v.menuJspath)
          }
        })
      }else{
        // $router.push("order_modules/o2o_order/index",{dataState:dataState})
        $router.push(path,{dataState:dataState});
        
      }
      
    },
  },
}
</script>
<style lang="less">
@import '../../../common/css/common.less';
page {
  background: #faf9f9;
}
.user{
  &-header{
    height: 270rpx;
    padding:@padding-lr;
    // background:url("../../../static/img/mine/user_bg.jpg") no-repeat center center;
    background-size: 100% 100%;
    &-message{
      text-align: @t-right;
      height: 80rpx;
      line-height: 80rpx;
      i{
        color:@white-color;
      }
    }
    &-box{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      color: @white-color;
      font-size:@big-title;
      &-img{
        width: 130rpx;
        height: 130rpx;
        margin-right:@margin-right;
        img{
          width: 130rpx;
          height: 130rpx;
          border-radius: 50%;
        }
      }
      h3{
        position: relative;
        text-align: center;
        i{
          width:12rpx;
          height:12rpx;
          border-radius:50%;
          position:absolute;
          right:-16rpx;
          top:-23rpx;
          border:4rpx solid #0070ac;

        }
      }
      p{
        margin-top:5rpx;
        padding:9rpx 12rpx;
        background: #0070ac;
        border-radius: 8rpx;
        display:inline-block;
        font-size:@middle-title;

      }
    }
  }
  &-collection{
    display: flex;
    background: @white-color;
    a{
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      text-align: @t-center;
      h4{
        font-size: @middle-title;
        color:@color-999;
      }
    }
  }
  &-order{
    background: @white-color;
    &-title{
      margin:@margin-lr;
      font-size: @big-title;
      padding:@padding-tb;
      display:flex;
      align-items: center;
      justify-content:space-between;
      .my-order {
        font-size: 28rpx;
        font-weight: 600;
      }
      a{
        display:flex;
        align-items: center;
        font-size: @middle-title;
        color: @color-999;
        i{
          font-size: 32rpx;
          color: #9d9d9d;
        }
      }
    }
    &-my{
      display: flex;
      // padding:@padding;
      padding: 0 20rpx 20rpx 20rpx;
      a{
        flex:1;
        text-align:@t-center;
        font-size: @middle-title;
        i{
          display: inline-block;
          // width: 72rpx;
          // height: 72rpx;
          // background: #ebdfdf;
          // border-radius: 50%;
          font-size: 44rpx;
          text-align:@t-center;
          line-height: 72rpx;
          margin-bottom: 5rpx;

        }
      }
    }
  }
  .my-allet {
    background: @white-color;
  }
  // &-list{
  //   // margin-bottom:@margin-bottom;
  //   background: @white-color;
  //   margin-bottom: 102rpx;
  //   ul{
  //     margin:@margin-lr;
  //     li{
  //       border-bottom: 1rpx solid #f5f5f5;
  //       a{
  //         display: flex;
  //         align-items: center;
  //         justify-content: space-between;
  //         padding: 30rpx 0;
  //         >div{
  //           display: flex;
  //           align-items: center;
  //           i{
  //             font-size: 32rpx;
  //             color: #b79f77;
  //           }
  //           p{
  //             margin-left: 10rpx;
  //             font-size: @big-title;
  //             color:@color-666;
  //           }
  //         }
  //         .fr{
  //           font-size: 32rpx;
  //           float: right;
  //           color: #9d9d9d;
  //         }
  //       }
  //     }
  //   }
  // }
  
}
</style>

