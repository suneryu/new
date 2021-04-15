<template>
    <div class="logistics">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="logistics-box">
        <div class="logistics-box-tit">
          <div class="logistics-box-tit-img">
            <img :src="params.img"/>
            <span>共{{params.num}}件商品</span>
          </div>
          
          <div>
            <p>物流状态：{{wlStateInfor}}</p>
            <p>快递公司：{{params.expressName}}</p>
            <p>快递单号：{{params.expressNo}}</p>
          </div>
        </div>
        <div class="logistics-box-con" v-if="wltrack.length!==0">
          <div class="logistics-box-con-tit">
            <div class="logistics-box-con-tit-l">
              <p></p>
              <p></p>
              <span class="iconfont">&#xe637;</span>
            </div>
            <div class="logistics-box-con-tit_r">[收货地址]{{params.address}}</div>
          </div>
          <ul>
            <li v-for="(item,index) in wltrack" :key="index">
              <div class="log_l">
                <!-- <p>晚上</p> -->
                <p></p>
                <p>{{item.AcceptTime}}</p>
                <span></span>
              </div>
              <div class="log_r">
                <!-- <h5>派送中</h5> -->
                <h5></h5>
                <h6>{{item.AcceptStation}}</h6>
              </div>
            </li>
          </ul>
        </div>
        <div class="logistics-box-con" style="text-align:center" v-else>暂无物流信息</div>
      </div>
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router} from '@/utils/prototype/vue.js'
import {refund} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
export default {
  data() {
    return {
      title:"物流信息",
      leftIcon:true,
      rightIcon:false,
      wltrack: [],
      wlInfor: {},
      wlState: ["暂无物流信息", "已收件", "在途中", "已签收", "问题件"],
      wlStateInfor: "",
      resultState: "",
      params:{},//订单列表查看物流--传过来的信息
      userImgurl: require("../../../static/img/mine/default_header.png"), 

    }
  },
  components:{
    commonHeader
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: $storage.get('proappEnvName')
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#'+this.$state.baseColor
    })
  },
  mounted() {
    //console.log(this.$root.$mp.query)
    this.params = this.$root.$mp.query
    if(!RegExp(/http/).test(this.params.img)){
      this.params.img = this.$domain+this.params.img
    }
    let arrayParams = {
        expressType:this.params.expressType,
        expressNo:this.params.expressNo,
      }
    http.get(refund.getExpressPageForProp,arrayParams).then(res=>{
      if(res&&res.dataObj){
        let dataObj = JSON.parse(res.dataObj);
        let wltrack = dataObj.Traces;
        let arrwltrack = wltrack.reverse();

        this.resultstate = dataObj.State;
        this.wlInfor = dataObj;
        if (this.wlInfor.State == "0") {
          this.wltrack = [];
        } else {
          this.wltrack = arrwltrack;
        }
        this.wlStateInfor = this.wlState[this.wlInfor.State];
      }
    })
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import '../../../common/css/common.less';
  .logistics{
    &-box{
      margin-top: 90rpx;
      background: @white-color;
      padding-top: 10rpx;
      &-tit{
        display: flex;
        align-items: center;
        padding: 42rpx 30rpx 40rpx 30rpx;
        border-bottom:20rpx solid #fafafa;
        p{
          font-size: @big-title;
          &:nth-child(2){
            padding:10rpx 0;
          }
        }
        &-img{
          width: 130rpx;
          height: 130rpx;
          position: relative;
          margin-right: 25rpx;
          img{
            width: 100%;
            height: 100%;
          }
          span{
            display: inline-block;
            width:130rpx;
            height: 28rpx;
            font-size: 20rpx;
            text-align: center;
            line-height: 28rpx;
            color:@white-color;
            background:rgba(0,0,0,.3);
            position: absolute;
            left: 0;
            bottom: 0;
          }
        }
        
      }
      &-con{
        padding:40rpx 30rpx;
        background: #fff;
        &-tit{
          display: flex;
          align-items: flex-start;
          &-l{
            span{
              position: absolute;
              right:-18rpx;
              top:-6rpx;
              width: 36rpx;
              height: 43rpx;
              //background: url(${basePath}/newImages/address/address_tit.png) no-repeat center center;
              // -webkit-background-size: 100% 100%;
              // background-size: 100% 100%;
            }
          }
        }
        ul{
          li{
            display: flex;
            align-items: center;
            .log_l{
              span{
                position: absolute;
                right:-6rpx;
                top:50%;
                margin-top:-6rpx;
                width:12rpx;
                height: 12rpx;
                background: #cfcfcf;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                border-radius: 50%;
              }
            } 
            &:first-child .log_l span{
              background: #b79f77;
            }
            &:first-child .log_r{
              color:@color-333;
              font-size: @big-title;
              h6{
                font-size: 22rpx;
              }
            }
          }
        }
      }
    }
    .log_l,.logistics-box-con-tit-l{
      width: 120rpx;
      border-right: 1rpx solid #eee;
      text-align: right;
      font-size: 18rpx;
      color:@color-999;
      position: relative;
      padding:44rpx 22rpx 44rpx 0;
    }
    .log_r,.logistics-box-con-tit_r{
      padding-left: 30rpx;
      flex: 1;
      font-size: 22rpx;
      color:@color-999;
    }
  }
</style>




