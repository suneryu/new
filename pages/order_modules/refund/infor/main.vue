<template>
    <div class="afterDetail">
      <!-- <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      /> -->
      <div class="afterDetail-tit" :style="{background:baseColor}">
        <div>
          <h3>{{refundStateInfor}}</h3>
          <!-- <p>2018-10-9  10:00</p> -->
        </div>
      </div>
      <!-- <div class="afterDetail-count">
        <div>退款总金额<span>￥1280</span></div>
        <div>退回银行卡(尾号0987)<span>￥1280</span></div>
      </div> -->
      <div class="afterDetail-info">
        <p>退款信息</p>
        <div class="afterDetail-info-con">
          <img :src="refundOrderList.dataPic"/>
          <div>
            <h2>{{goodsName}}</h2>
            <h3>{{skuName}}</h3>
          </div>
        </div>
      </div>
      <div  class="afterDetail-msg">
        <p>退款原因：{{items.refundEx}}</p>
        <p>退款金额：{{unitPrice.obpay}}{{items.refundMoney}}{{unitPrice.mapay}}</p>
        <p>申请件数：{{refundOrderList.goodsNum}}</p>
        <p>申请时间：{{creatTime}}</p>
        <p>退款编号：{{items.refundCode}}</p>
        <p>退款说明：{{items.refundMeo}}</p>
        <p>退款凭证：
          <img v-for="(imgUrl,index) in items.ocRefundFileList" :key="index" :src="imgUrl.refundFileUrl" />
        </p>
      </div>
      <div v-show=" items.dataState == 0 ">
        <div class="afterDetail-revokeBtn" >
          <div :style="{borderColor:baseColor,color:baseColor}" @click="revokeBtn">撤销申请</div>
        </div>
      </div>
      <div v-if="items.dataState != 0 && items.dataState != -1">
        <div class="afterDetail-btn" @click="submitBtn" :style="{background:baseColor}" >填写物流信息</div>
      </div>
      
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router} from '@/utils/prototype/vue.js'
import {refund} from '@/api/interface.js'
import {formatDate} from '@/utils/prototype/date.js'
import commonHeader from '@/components/communal/commonHeader';
export default {
  data() {
    return {
      title:"退款详情",
      leftIcon:true,
      rightIcon:false,
      current:0,
      items:{},
      refundState:{
        "0": "提交申请成功，等待卖家审核",
        "1":"审核通过",
        "2":"买家发货中...",
        "3":"卖家收到货",
        "4":"退款中",
        "5":"卖家拒绝申请",
        "6":"卖家拒绝收货",
        "7":"退款完成",
        "-1":"撤销退款申请",
        "8":"退款完成"
      },
      refundStateInfor:'',
      refundOrderList:{},
      goodsName:'',
      skuName:'',
      creatTime:'',//创建时间
      baseColor:'',
      refundType:false,//退货状态
      params:{},//路由传参
      userImgurl: require("../../../../static/img/mine/default_header.png"), 

    }
  },
  components:{
    commonHeader
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
  },
  onLoad() {
    this.commonMounted();
    wx.setNavigationBarTitle({
      // title: $storage.get('proappEnvName')
      title: this.title
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#'+this.$state.baseColor
    })
  },
  mounted() {
    
  },
  methods: {
    commonMounted(){
      this.baseColor='#'+this.$state.baseColor
      this.params = this.$root.$mp.query
      http.post(refund.getRefundByCode,this.params).then(res=>{
        this.items = res;
        
        this.refundOrderList = this.items.ocRefundGoodsList[0]; //退款信息
        this.refundStateInfor = this.refundState[this.items.dataState]; //退款状态
        this.creatTime = formatDate(this.items.gmtCreate); 
        if(!RegExp(/http/).test(this.refundOrderList.dataPic)){
          this.refundOrderList.dataPic=this.$domain+this.refundOrderList.dataPic
        }
        this.goodsName = this.refundOrderList.goodsName;
        this.skuName = this.refundOrderList.skuName;
        if (
            this.items.refundType === "B02" &&
            this.items.dataState === 1
          ) {
            //需要退货,并且审核通过
            this.refundType = true;
          }else{
            this.refundType = false;
          }
          console.log(this.items,"更新王城")
      })
    },
    submitBtn(){
      this.$state.orderMenu.map(v=>{
        if(v.menuAction=='refundLogistics'){
          $router.push(v.menuJspath,this.params)
        }
      })
      //$router.push('afterService/afterLogistics',this.params)
    },
    revokeBtn(){
        console.log(this.refundOrderList.goodsCode,"参数");
          let that = this;
        let pars = that.params;
        pars.goodsCode = this.refundOrderList.goodsCode;

        console.log(pars,"参数00000")
    
      wx.showModal({
        //title: '提示',
        content: '撤销退款',
        success(res) {
          if (res.confirm) {
            http.post(refund.revokeApply,that.params).then(res=>{
              if(res.success){
                that.commonMounted()
              }
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../common/css/common.less';
.afterDetail{
  width: 100%;
  background: @white-color;
  &-tit{
    // margin-top: 90rpx;
    height: 138rpx;
    width: calc(100% - 60rpx);
	width: 100%;
    padding: @padding-30;
    background: #baa37c;
    color: @white-color;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    h3{
      font-size: 32rpx;
    }
    p{
      font-size: @middle-title;
    }
  }
  &-count{
    border-bottom: 20rpx solid #fafafa;
    padding: @padding-30;
    div{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 103rpx;
      border-bottom: 1rpx solid #f6f6f8;
      font-size:@big-title;
      span{
        color: @color-666;
      }
      &:last-child{
        border-bottom: 0;
      }
    }
  }
  &-info{
    padding: 0 30rpx 35rpx 30rpx;
    border-bottom: 20rpx solid #fafafa;
    p{
      height: 110rpx;
      line-height: 110rpx;
      font-size:@big-title;
    }
    &-con{
      display: flex;
      align-items: center;
      img{
        width: 160rpx;
        height: 160rpx;
        margin-right: 30rpx;
      }
      div{
        width: 500rpx;
        h2{
          width: 500rpx;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 28rpx;
          margin-bottom: 10rpx;
        }
        h3{
          color: @color-999;
          font-size: @middle-title;
        }
      }

    }
  }
  &-msg{
    padding: 20rpx 30rpx 128rpx;
    p{
      line-height: 65rpx;
      color: @color-666;
      font-size:@big-title;
      img{
        width: 150rpx;
        height: 150rpx;
        margin: 0 20rpx 20rpx 0;
      }
      &:last-child{
        display: flex;
        align-items: flex-start;
      }
    }
  }
  &-revokeBtn{
    height: 98rpx;
    width:calc(100% - 60rpx);
	// width: 100%;
    border-top: 1rpx solid #f6f6f8;
    padding: @padding-30;
    position: fixed;
    background: @white-color;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    div{
      display: inline-block;
      height: 48rpx;
      line-height: 48rpx;
      color: #bfa676;
      font-size: 22rpx;
      border: 1rpx solid #bfa676;
      border-radius: 26rpx;
      padding:0 20rpx;
      margin-right: 20rpx;
      &:last-child{
        margin-right: 0;
      }
    }
  }
  &-btn{
    height: 98rpx;
    line-height: 98rpx;
    width: 100%;
    text-align: center;
    background: #bfa676;
    font-size: 32rpx;
    color: @white-color;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
  }
}
</style>




