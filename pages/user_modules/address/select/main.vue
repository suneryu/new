<template>
    <div class="address">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="address-add" @click="addAddressClick">新增</div>
      <div class="address-ul" v-if="items.length>0">
        <ul>
          <li class="address-ul-li" v-for="(item,index) in items" :key="index" @click.stop="selectAddress(item)">
            <div class="address-ul-li-info">
              <div class="address-ul-li-info-con">
                <h3>
                  <div style="text-align:center">{{item.addressMember}}</div>
                  <div v-show="item.addressDefault=='1'" :style="{background:baseColor}">默认</div>
                </h3>
                <div>
                  <span>{{item.addressPhone}}</span>
                  <div class="address-detail">
                    <div>{{item.provinceName}} {{item.cityName}} {{item.areaName}}</div>
                    <div>{{item.addressDetail}}</div>
                  </div>
                </div>
              </div>
              <div class="address-ul-li-info-icon">
                <i class="iconfont" @click.stop="editAddress(item)">&#xe62e;</i>
                <i class="iconfont" @click.stop="removeAddress(item)">&#xe66d;</i>
              </div>
            </div>

          </li>
        </ul>
      </div>
      <div class="address-nulls" v-else>
        <img :src="nullImg"/>
      </div>
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router,$message} from '@/utils/prototype/vue.js'
import {addressList,deleteAddress} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
export default {
  data() {
    return {
      title:'选择收货地址',
      leftIcon:true,
      rightIcon:false,
      items:[],
      baseColor:'',
      nullImg:this.$imgDomain+'/paas/shop-master/c-static/images/wxminiImg/noAddress.png'

    }
  },
  components:{
    commonHeader
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: $storage.get('proappEnvName')
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#'+this.$state.baseColor
    })
  },
  mounted(){
    this.baseColor='#'+this.$state.baseColor
    this.commonMounted()
  },
  methods: {
    commonMounted(){
       http.get(addressList).then(res=>{
        this.items = res;
      })
    },
    removeAddress(item){
      let that = this;
      wx.showModal({
        //title: '提示',
        content: '删除地址',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            let params = {addressId:item.addressId}
            http.get(deleteAddress,params).then(res=>{
              if(res&&res.success){
                that.commonMounted()
              }
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    },
    editAddress(item){
      this.$state.set('addressId', item.addressId) 
      this.$state.columnList.map(v=>{
        if(v.menuAction=='editAddress'){
          $router.replace(v.menuJspath)
        }
      })
     // $router.push('address/editAddress')
    },
    selectAddress(item){
      $router.replace('order/accounts',item)
    },
    addAddressClick(){
      this.$state.columnList.map(v=>{
        if(v.menuAction=='addAddress'){
          $router.push(v.menuJspath)
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
@import '../../../../common/css/common.less';
  .address{
    position: relative;
    padding-top: 90rpx;
    width: 100%;
    height: 100%;
    background: @white-color;
    &-add{
      position: fixed;
      z-index: 99999;
      height: 90rpx;
      width: 70rpx;
      line-height: 90rpx;
      text-align: right;
      right: 30rpx;
      top: 0;
      font-size: @big-title;
    }
    &-ul{
      margin:0 30rpx;
      &-li{
        border-bottom:1rpx solid #f6f6f8;
        padding:33rpx 0 30rpx 0;
        &-info{
          display:flex;
          justify-content: space-between;
          align-items: flex-start;
          &-con{
            display:flex;
            h3{
              margin-right:39rpx;
              div{
                &:first-child{
                  margin-bottom:20rpx;
                }
                &:last-child{
                  color:@white-color;
                  border-radius: 18rpx;
                  height: 36rpx;
                  line-height: 36rpx;
                  padding:0 10rpx;
                  font-size:20rpx;
                  text-align:center;
                  background: #b3a07c;
                }
              }
            }
            span{
              margin-bottom:20rpx;
              display:inline-block;
            }
            .address-detail{
              font-size: @middle-title;
              color: @color-666;
              div{
                &:last-child{
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  width:400rpx;
                }
              }
            }

          }
          &-icon{
            display: flex;
            align-items: center;
            i{
              &:last-child{
                margin:0 10rpx 0 25rpx;
              }
            }
          }
        }
      }
    }
    &-nulls{
    height: calc(100% - 202rpx);
    text-align: center;
      img{
        width: 438rpx;
        height: 280rpx;
        margin: 280rpx auto 0;
      }
    }
  }
</style>




