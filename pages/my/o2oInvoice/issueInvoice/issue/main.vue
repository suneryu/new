<template>
    <div class="orderList">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
     <div class="orderList-info">
       <ol>
         <li v-for="(order,index) in orderList" :key="index">
           <a>
             <div class="order-status">
               <div>订单编号：{{order.contractBillcode}}</div>
             </div>
             <div class="order-msg" v-for="(goods,goodsIndex) in order.goodsList" :key="goodsIndex">
                <img :src="goods.dataPic"/>
                <div>
                  <div>
                    <p class="currentP">{{goods.goodsName}}</p>
                    <h6>{{goods.skuName}}</h6>
                  </div>
                  <div style="text-align:right;">
                    <p style="width:160rpx;">￥{{goods.pricesetNprice}}</p>
                    <h6>x{{goods.goodsNum}}</h6>
                  </div>
                </div>
             </div>
            
              <div class="order-btn">
                <div>实付: <i :style="{color:'#d66377'}">¥{{order.dataBmoney}}</i></div>
                <div>
                  <span :style="{color:baseColor,borderColor:baseColor}" @click="toInvoiceTit(order,index)">开具发票</span>
                </div>
             </div>
           </a>
         </li>
       </ol>
     </div>
     <lastPageLine :lastPageLine="lastPageLine"/>
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router,$message} from '@/utils/prototype/vue.js'
import {invoice} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
import lastPageLine from '@/components/communal/last-page-line';
export default {
  data() {
    return {
      title:"交易记录",
      leftIcon:true,
      rightIcon:false,
      orderList:[],//订单列表
      current:0,
      baseColor:'',//颜色
      page:1,//分页
      total:0,//列表数据总数
      rows:10,
      lastPageLine:false,//底部提示
      userImgurl: require("../../../../../static/img/mine/default_header.png"), 

    }
  },
  components:{
    commonHeader,
    lastPageLine
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
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();
  },
  mounted() {
    this.baseColor='#'+this.$state.baseColor
    this.orderList = []
    this.page = 1;
    this.lastPageLine = false;
    this.commonMounted()
  },
  methods: {
    commonMounted(){
      let data = this.$root.$mp.query
      let params = {
        page:this.page,
        rows:this.rows,
        childFlag: true,
        goodsName:data.goodsName
      }
      http.post(invoice.invoicelist,params).then(res=>{
        if(res&&res.rows){
          let list = res.rows
          list.map(v=>{
            v.goodsList.map(val=>{
              val.dataPic = this.$domain+val.dataPic
            })
          })
          this.orderList = [...this.orderList,...list];
          this.total = res.total;
        }
      })
    },
    orderDetail(order){
      let params = {
        contractBillcode:order.contractBillcode,
        expressType:'',
        expressNo:'',
      }
      this.$state.orderMenu.map(v=>{
        if(v.menuAction=='orderInfor'){
          $router.push(v.menuJspath,params)
        }
      })
      //$router.push('orderDetail/orderDetail',params)
    }, 
    toInvoiceTit(order,index){
      let params = {
          code: order.contractBbillcode,
          money: order.contractPaygmoney,
          invlistOptype:'OcContract'
        }
      $router.push('my/invoiceTitle',params)
    },
    loadMore(){
      let num = Math.ceil(this.total/10);
      this.page++;
      if(this.page<= num){
        this.commonMounted()
      }else{
        this.lastPageLine = true;
      }
    },
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../common/css/common.less';
  .orderList{
    width: 100%;
    &-info{
      margin-top: 90rpx;
      ol{
        li{
          border-bottom: 20rpx solid #fafafa;
          padding:@padding-30;
          background: @white-color;
          &:first-child{
            border-top: 20rpx solid #fafafa;
          }
          a{
            .order-status{
              height: 79rpx;
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 1rpx solid #f6f6f8;
              >div{
                font-size: @big-title;
              }
            }
            .order-msg{
              padding:15rpx 0 48rpx 0;
              border-bottom: 1rpx solid #f6f6f8;
              display: flex;
              justify-content: space-between;
              img{
                width: 130rpx;
                height: 130rpx;
                margin-right: @margin-right;
              }
              >div{
                display: flex;
                justify-content: space-between;
                p{
                  font-size: @big-title;
                  color:@color-333;
                  margin: 12rpx 0 25rpx 0;
                }
                .currentP{
                  width: 380rpx;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                h6{
                  font-size: 24rpx;
                  color:@color-999;
                }
              }

            }
            .order-btn{
              height: 88rpx;
              display: flex;
              align-items: center;
              justify-content: space-between;
              div:first-child{
                 display: flex;
                 align-items: center;
                 i{
                   margin-left: 10rpx;
                 }
              }
              span{
                display: inline-block;
                border:1rpx solid #d4d4d4;
                line-height: 46rpx;
                border-radius: 26rpx;
                padding: 0 20rpx;
                font-size: 22rpx;
                color:@color-666;
                margin-right: @margin-right;
                &:last-child{
                  margin-right: 0;
                }
              }
            }
          }
        }
      }
    }

  }
</style>




