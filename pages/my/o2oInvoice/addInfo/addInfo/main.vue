<template>
    <div class="addInfo">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="addInfo-tit">
       <ul>
         <li v-for="(item,index) in items" :key="index" @click="myInvoiceTitle(index)">
           <a :class="current === index ? 'active' : ''" :style="{color:current === index ? baseColor : ''}">{{item}}<span :style="{background:baseColor}"></span></a>
         </li>
       </ul>
     </div>
     <div class="addInfo-con">
       <ul>
         <li v-for="(invo,voIndex) in Invos" :key="voIndex">
           <div>
             <span>{{invo.userinvMember}}</span>
             <span>{{invo.userinvNo?invo.userinvNo:''}}</span>
             <span>{{invo.userinvSort=='1'?'单位':'个人'}}</span>
           </div>
           <p>
              <span :style="{color:baseColor,borderColor:baseColor}" @click="editInfo(invo)">编辑</span>
              <span :style="{color:baseColor,borderColor:baseColor}" @click="deleteInfo(invo)">删除</span>
            </p>
         </li>
       </ul>
     </div>
     <div class="addInfo-btn" :style="{background:baseColor}" @click="()=>{$router.push('my/addInvoiceInfo')}">新增</div>
      <lastPageLine :lastPageLine="lastPageLine"/>
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router} from '@/utils/prototype/vue.js'
import {invoice} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
import lastPageLine from '@/components/communal/last-page-line';
export default {
  data() {
    return {
      title:'发票信息',
      leftIcon:true,
      rightIcon:false,
      baseColor:"",
      items:['全部','单位','个人'],
      Invos:[],
      current:0,
      total:0,
      params:{
        page:1,
        rows:5,
        notDataState:-1,
        userinvSort:-1
      },
      lastPageLine:false,
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
    this.baseColor='#'+this.$state.baseColor
    
    this.commonMounted(0)
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();
  },
  methods: {
    commonMounted(index){

      if(index===0){
        delete this.params.userinvSort
      }
      http.get(invoice.getinvoicesList,this.params).then(res=>{
        if(res){
          this.Invos = res.rows;
          this.total = res.total;
        }
      })
    },
    myInvoiceTitle(index){
      this.current = index;
      if(index===1){
        this.params.userinvSort = 1
      }else if(index===2){
        this.params.userinvSort = 2
      }
      this.commonMounted(index)

    },
    editInfo(invo){
      $router.push('my/editInvoiceInfo',{userinvId: invo.userinvId})
    },
    deleteInfo(invo){
      let that = this;
      wx.showModal({
        //title: '提示',
        content: '删除发票信息',
        success(res) {
          if (res.confirm) {
            http.get(invoice.deleteInfo,{userinvId: invo.userinvId}).then(res=>{
              if(res&&res.success){
                that.commonMounted(0)
              }
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      
    },
    loadMore(){
      let num = Math.ceil(this.total/5);
      this.params.page++;
      if(this.params.page<= num){
        http.get(invoice.getinvoicesList,this.params).then(res=>{
          if(res){
            this.Invos = [...this.Invos,...res.rows]
            this.total = res.total;
          }
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
.addInfo{
  width: 100%;
  &-tit{
    width: 100%;
    position: fixed;
    top: 90rpx;
    left: 0;
    z-index: 999;
    background: @white-color;
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
    border-top: 20rpx solid #fafafa;
    margin-top: 180rpx;
    ul{
      li{
        border-bottom: 20rpx solid #fafafa;
        padding:@padding-30;
        div{
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 78rpx;
          border-bottom:  1rpx solid #f6f6f8;
        }
        p{
          height: 89rpx;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          span{
            width: 108rpx;
            height: 47rpx;
            border:1rpx solid #bfa676;
            color: #bfa676;
            font-size: 22rpx;
            text-align: center;
            line-height: 49rpx;
            border-radius: 25rpx;
            margin-right: @margin-right;
            &:last-child{
              margin-right: 0;
            }
          }
        }
      }
    }
  }
  &-btn{
    font-size: 32rpx;
    height: 96rpx;
    width: 100%;
    color: #fff;
    line-height: 96rpx;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    background: #b79f77;
  }
}
</style>




