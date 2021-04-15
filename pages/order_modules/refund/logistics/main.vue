<template>
    <div class="afterDetail">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="afterDetail-info">
        <div class="afterDetail-info-con">
          <img :src="items.dataPic"/>
          <div>
            <h2>{{items.goodsName}}</h2>
            <h3>{{items.skuName}}</h3>
          </div>
        </div>
      </div>
      <div class="afterDetail-con">
        <div>物流公司
          <p>
            <picker @change="bindPickerChange" :value="index" :range="array" mode="selector">
              <view class="picker">
                {{packageName}}
              </view>
            </picker>
            <i class="iconfont">&#xe61d;</i>
          </p>
          </div>
        <div>物流单号<input placeholder="请填写物流单号" v-model="packageBillno"/></div>
        <!-- <div>联系电话<input placeholder="请填写手机号"/></div> -->
      </div>
      <div class="afterDetail-btn" :style="{background:baseColor}" @click="saveSubmit">提交</div>
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router,$message} from '@/utils/prototype/vue.js'
import {refund} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
export default {
  data() {
    return {
      title:"退货物流",
      leftIcon:true,
      rightIcon:false,
      current:0,
      baseColor:'',
      params:{},
      packageName:'请选择物流公司',//物流名称
      array:[],
      items:{},
      packageBillno:'',//物流单号
      userImgurl: require("../../../../static/img/mine/default_header.png"), 
      refundList:''//售后列表路径

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
    Object.assign(this, this.$options.data());
  },
  mounted() {
    this.baseColor='#'+this.$state.baseColor
    this.$state.myOrder.map(v=>{
      if(v.menuAction=='refundList'){
        this.refundList = v.menuJspath
      }
    })
    this.params = this.$root.$mp.query
    http.post(refund.getRefundByCode,this.params).then(res=>{
      this.items = res.ocRefundGoodsList[0]
      if(!RegExp(/http/).test(this.items.dataPic)){
        this.items.dataPic=this.$domain+this.items.dataPic
      }
      
      http.post(refund.queryExpressPageForProp,{dataState:res.dataState}).then(res=>{
        let attr = []
        this.array = []
        res.rows.map(val=>{
          this.array.push(val.expressName)
        })
      })
    })
    
  },
  methods: {
     bindPickerChange(e){
      this.packageName = this.array[Number(e.target.value)]

    },
    saveSubmit(){
      let params = {
        packageName:this.packageName,
        packageBillno:this.packageBillno,
        refundCode:this.params.refundCode
      }
      let reg = /^[0-9a-zA-Z]+$/
      if(!this.packageBillno){
         $message.alert('请输入快递单号！')
      }else if(!reg.test(this.packageBillno)){
        $message.alert('请输入正确的快递单号！')
      }else{
        http.post(refund.sendGoods,params).then(res=>{
          if(res.success){
            
            $router.push(this.refundList)
          }
        })
      }
      
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../common/css/common.less';
.afterDetail{
  width: 100%;
  background: @white-color;
  &-info{
    padding: 130rpx 30rpx 35rpx 30rpx;
    border-bottom: 20rpx solid #fafafa;
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
  &-con{
    padding: @padding-30;
    div{
      display: flex;
      align-items: center;
      justify-content:space-between;
      font-size: @big-title;
      height: 108rpx;
      border-bottom: 1rpx solid #f6f6f8;
      p{
        display: flex;
        align-items: center;
        span{
          color: @color-999;
          margin-right: 10rpx;
        }
      }
      input{
        height: 38rpx;
        text-align: right;
        padding-right: 30rpx;
         &::-webkit-input-placeholder {
          color: #ccc;
            
        }
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
  }
}
</style>




