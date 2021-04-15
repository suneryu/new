<template>
    <div class="myInvoice">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
       <div class="myInvoice-top">
        <div>
        	<div class="left"  @click="()=>{$router.push(addInfo)}" :style="{backgroundColor:baseColor}">
        		<i class="iconfont">&#xe758;</i>
        	</div>
          <p>发票信息</p>
        </div>
        <div>
        	<div class="center"  @click="()=>{$router.push(issueInvoice)}" :style="{backgroundColor:baseColor}">
        		<i class="iconfont">&#xe757;</i>
        	</div>
          <p>开具发票</p>
        </div>
        <div>
        	<div class="right"  @click="addInvoice" :style="{backgroundColor:baseColor}">
        		<i class="iconfont">&#xe753;</i>
        	</div>
          <p>增票资质</p>
        </div>
      </div>
      <div class="myInvoice-tit">
       <ul>
         <li v-for="(item,index) in items" :key="index" @click="myInvoiceTitle(index)">
           <a :class="current === index ? 'active' : ''" :style="{color:current === index ? baseColor : ''}">{{item}}<span :style="{background:baseColor}"></span></a>
         </li>
       </ul>
     </div>
     <div class="myInvoice-con">
       <ul>
         <li v-for="(invo,invoIndex) in Invos" :key="invoIndex">
           <h1>开票时间:&nbsp;&nbsp;{{invo.gmtModified}}<span>{{invo.dataState=='0'?'已提交':invo.dataState=='1'?'已开票':'开票失败'}}</span></h1>
            <p>发票类型:&nbsp;&nbsp;{{invo.userinvType=='1'?'电子普通发票':invo.userinvType=='3'?'增值税纸质普通发票':'增值税专用发票'}}</p>
            <p>开票类型:&nbsp;&nbsp;{{invo.userinvSort=='2'?'个人' :'单位'}}</p>
            <p>开票名称:&nbsp;&nbsp;{{invo.userinvMember}}</p>
            <p>开票金额:&nbsp;&nbsp;{{invo.invlistOpamt}}</p>
            <p v-if="invo.userinvSort=='1'">纳税人识别号:{{invo.invUserinvDomain.userinvNo}}</p>
            <div v-if="invo.userinvType=='1'">
              <div class="see" v-if="invo.memo">
                <span @click="go(invo.memo)">查看电子发票</span>
              </div>
            </div>
         </li>
       </ul>
     </div>
      <lastPageLine :lastPageLine="lastPageLine"/>
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router} from '@/utils/prototype/vue.js'
import {invoice} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
import {formatDate} from '@/utils/prototype/date.js'
import lastPageLine from '@/components/communal/last-page-line';
export default {
  data() {
    return {
      title:'我的发票',
      leftIcon:true,
      rightIcon:false,
      baseColor:"",
      items:['全部','已提交','已开票','开票失败'],
      Invos:[],
      current:0,
      total:0,
      page:1,
      rows:5,
      dataState:-1,
      lastPageLine:false,
      issueInvoice:'',
      addInfo:'',
      addInvoiceMenu:'',
      userImgurl: require("../../../../../static/img/mine/default_header.png"), 
    }
  },
  components:{
    commonHeader,
    lastPageLine
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: $storage.get('proappEnvName')
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#'+this.$state.baseColor
    })
  },
  mounted() {
    this.page = 1;
    this.baseColor='#'+this.$state.baseColor
    console.log(this.$state.columnList)
    this.$state.application.map(v=>{
      if(v.menuAction=='myInvoice'){
        
        v.children.map(val=>{
          if(val.menuAction=='issueInvoice'){
            this.issueInvoice = val.menuJspath
          }
          if(val.menuAction=='addInfo'){
            this.addInfo = val.menuJspath
          }
          if(val.menuAction=='addInvoice'){
            this.addInvoiceMenu = val.menuJspath
          }
        })
      }
    })
    this.commonMounted(0)
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();
  },
  methods: {
    commonMounted(index){
      this.Invos=[]
      let params = {
        page:this.page,
        rows:this.rows
      }
      if(index===0){
        delete params.dataState
      }else if(index===1){
        params.dataState = 0
      }else if(index===2){
        params.dataState = 1
      }else{
        params.dataState = 2
      }

      http.get(invoice.getInfolist,params).then(res=>{
        if(res){
          this.Invos = res.rows;
          this.total = res.total;
        }
      })
    },
    myInvoiceTitle(index){
      this.current = index;
      this.page = 1;
       this.lastPageLine = false;
      this.commonMounted(index)
    },
    addInvoice(){
      http.get(invoice.checkAuditing).then(res=>{
        if(res.dataState == "1"){
          $router.push(this.addInvoiceMenu)
        }else if (res.dataState == "2") {
          wx.showModal({
           // title: '提示',
            content: '您提交的增票资质待审核失败',
            confirmText:"重新申请",
            success(res) {
              if (res.confirm) {
                $router.push(this.addInvoiceMenu)
              } else if (res.cancel) {
                // console.log('用户点击取消')
              }
            }
          })
        }else if (res.dataState == "0") {
          wx.showModal({
            //title: '提示',
            content: '您提交的增票资质待审核',
            showCancel: false,//是否显示取消按钮
            success(res) {
              if (res.confirm) {
              }
            }
          })
        }else{
          $router.push(this.addInvoiceMenu)
        }
       
      })
    },
    loadMore(){
      let num = Math.ceil(this.total/5);
      this.page++;
      if(this.page<= num){
        let params = {
          page:this.page,
          rows:this.rows
        }
        if(this.dataState===-1){
          delete params.dataState
        }else{
          params.dataState = this.dataState
        }
        http.get(invoice.getInfolist,params).then(res=>{
          this.Invos = res.rows;
          this.Invos = [...this.Invos,...res.rows]
        })
      }else{
        this.lastPageLine = true;
      }
    } 
  },
}
</script>

<style lang="less" scoped>
@import '../../../../../common/css/common.less';
.myInvoice{
  width: 100%;
  &-top{
    top: 90rpx;
    left: 0;
    position: fixed;
    display: flex;
    justify-content: space-around;
    height: 220rpx;
    width: 100%;
    background: @white-color;
    .left,.center,.right{
      margin-top: 40rpx;
      text-align: center;
      border-radius: 50%;
      width: 102rpx;
      height: 102rpx;
      line-height: 102rpx;
      background-color: #b79f77;
      i{
        color: #fff;
        font-size: 46rpx;
      }
    }
    p{
      color: @color-666;
      font-size: @big-title;
      margin-top: @margin-top;
    }
  }
  &-tit{
    width: 100%;
    position: fixed;
    top: 310rpx;
    left: 0;
    z-index: 999;
    background: @white-color;
    padding-top: 10rpx;
    ul{
      display: flex;
      justify-content: space-between;
      padding:@padding-30;
      height: 90rpx;
      li{
        height: 90rpx;
        a{
          width: 100%;
          height: 100%;
          line-height: 90rpx;
          display: inline-block;
          position: relative;
          font-size: 28rpx;
          color:@color-333;
        }
        .active{
          color: #bfa676;
          span{
          position: absolute;
          height: 3rpx;
          width: 100%;
          background: #bfa676;
          bottom: 0;
          left: 0;
          }
        }
      }
    }
  }
  &-con{
    margin-top: 410rpx;
    border-top: 20rpx solid #fafafa;

    background: @white-color;
    ul{
      li{
        padding:@padding-30;
        border-bottom: 20rpx solid #fafafa;
        h1{
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 79rpx;
          border-bottom: 1rpx solid #f6f6f8;
          margin-bottom: 20rpx;
        }
        p{
          height: 46rpx;
          line-height: 46rpx;
          color: @color-666;
          font-size: @middle-title;
          &:last-child{
            padding-bottom: 20rpx;
          }
        }
        
        .see{
          height: 90rpx;
          border-top: 1rpx solid #f6f6f8;
          line-height: 90rpx;
          text-align: right;
          span{
            width: 218rpx;
            height: 48rpx;
            border:1rpx solid #b79f77;
            color: #b79f77;
            line-height: 48rpx;
            text-align: center;
            border-radius: 25rpx;
            font-size: 22rpx;
          }
        }
      }
    }
  }
}
</style>




