<template>
    <div class="address">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="address-save" @click="saveAddress">保存</div>
      <div class="address-dlBox">
        <dl>
            <dt>收货地址</dt>
            <a></a>
            <dd>
              <div class="change-adress"  style="color:#999999">
                <span>
                  <i v-if="!getAddress" class="map-icon icon iconfont icon-dizhi1"></i>
                  <input type="text" placeholder="请选择" :disabled="disabled"  v-model="getAddress" />
                  <i class="right-icon icon iconfont icon-xiangyou" @click="chooseAddress"></i>
                </span>
              </div>
            </dd>
        </dl>
        <dl>
          <dt>门牌号</dt>
          <dd>
            <input type="text" placeholder="详细地址,如:16号楼5层502室" v-model="addressDetail"/>
          </dd>
        </dl>
        <dl>
          <dt>联系人</dt>
          <dd>
            <input type="text" placeholder="请输入收货人姓名" v-model="addressMember"/>
          </dd>
        </dl>
        <dl>
          <dt>性别</dt>
          <dd>
            <div class="choose-sex">
              <div class="choose-sex">
                <p>
                  <span></span>
                  <span @click="sexClick(1)">
                    <i class="iconfont" v-if="userMsg.userSex=='1'" :style="{color:baseColor}">&#xe671;</i>
                    <i class="iconfont" v-else>&#xe672;</i>
                    男士
                  </span>
                  <span @click="sexClick(2)">
                    <i class="iconfont" v-if="userMsg.userSex=='2'" :style="{color:baseColor}">&#xe671;</i>
                    <i class="iconfont" v-else>&#xe672;</i>
                    女士
                  </span>
                </p>
              </div>
            </div>
          </dd>
        </dl>
        <dl>
          <dt>手机号</dt>
          <dd>
            <input type="text"  placeholder="请输入手机号码" v-model="addressPhone"/>
          </dd>
        </dl>
        
        
      </div>
      <div class="address-isdefault">
        <dl class="check_item">
          <dd>默认地址</dd>
          <div @click="isDefault">
            <i class="iconfont" v-if="defaultIcon" :style="{color:baseColor}">&#xe671;</i>
            <i class="iconfont" :style="{color:baseColor}" v-else>&#xe672;</i>
          </div>
          
        </dl>
      </div>
      <!-- <div class="address-confirm" :style="{color:baseColor}" @click="saveAddress">确认</div> -->
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router,$message} from '@/utils/prototype/vue.js'
import {getAddress,updateAddress} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
export default {
  data() {
    return {
      title:'编辑收货地址',
      leftIcon:true,
      rightIcon:false,
      items:[],
      region: [],
      code:[],
      baseColor:'',
      addressMember:'',//用户名
      addressPhone:'',//手机号
      provinceCode:'',//省code
      provinceName:'',//省名称
      cityCode:'',//市code
      cityName:'',//市名称
      areaCode:'',//区code
      areaName:'',//区名称
      addressDefault: 0,
      defaultIcon:false,
      addressDetail:'',
      addressId:0,
      addressCode:'',
      getAddress:'',
      userMsg:{userSex:1},
    }
  },
  components:{
    commonHeader
  },
  onLoad: function (options) {
    let pages = getCurrentPages();
    let prevpage = pages[pages.length - 2];
    $storage.set('prevpage',prevpage.route)
    wx.setNavigationBarTitle({
      title: $storage.get('proappEnvName')
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#'+this.$state.baseColor
    })
    //console.log(prevpage.route)
  },
  mounted(){
    this.baseColor='#'+this.$state.baseColor;
    let params = {addressId:this.$state.addressId}
    http.get(getAddress,params).then(res=>{
      if( $storage.get("different") == "edit" && $storage.get("addr")){
        this.getAddress = $storage.get("addr");
      }else {
        this.getAddress = res.roadName;
      }
      
      this.userMsg.userSex = res.addressType,
      this.addressMember = res.addressMember
      this.addressPhone = res.addressPhone
      this.addressDefault = res.addressDefault
      this.addressId = this.$state.addressId
      this.addressDetail = res.addressDetail
      this.code = [res.provinceCode,res.cityCode,res.areaCode]
      this.region = [res.provinceName,res.cityName,res.areaName]
      this.defaultIcon = this.addressDefault=='1'?true:false
      this.provinceCode = res.provinceCode
      this.provinceName = res.provinceName
      this.cityCode = res.cityCode
      this.cityName = res.cityName
      this.areaCode = res.areaCode
      this.areaName = res.areaName
      this.addressCode = res.addressCode
    })
  },
  // onShow(){
  //   this.getAddress = $storage.get("addr");
  // },
  methods: {
    sexClick(index){
      if(index==1){
        this.userMsg.userSex='1'
      }else{
        this.userMsg.userSex='2'
      }
    },
    changeRegin(e) {
      this.region = e.mp.detail.value;
      this.code = e.mp.detail.code;
      this.provinceCode = e.mp.detail.code[0]
      this.provinceName = e.mp.detail.value[0]
      this.cityCode = e.mp.detail.code[1]
      this.cityName = e.mp.detail.value[1]
      this.areaCode = e.mp.detail.code[2]
      this.areaName = e.mp.detail.value[2]
    },
    isDefault(){
      if(this.defaultIcon){
        this.addressDefault = 0;
        this.defaultIcon = false;
      }else{
        this.addressDefault = 1;
        this.defaultIcon = true;
      }
    },
    chooseAddress(){
      $storage.set("different","edit")
      $router.replace('o2o/pages/address_modules/selectAddressList',{data:0});
    },
    chooseGender(gender){
      console.log('------性别',gender)
    },
    saveAddress(){
      let params = {
        addressMember:this.addressMember,
        addressPhone:this.addressPhone,
        provinceCode:this.provinceCode,
        provinceName:this.provinceName,
        cityCode:this.cityCode,
        cityName:this.cityName,
        areaCode:this.areaCode,
        areaName:this.areaName,
        addressDefault:this.addressDefault,
        addressDetail:this.addressDetail,
        addressId:this.addressId,
        addressCode: this.addressCode,
        dataState: 0
      }
      if(this.addressMember==''){
        $message.alert('收货人不能为空')
      }else if(this.addressPhone==''){
        $message.alert('手机号不能为空')
      }else if(!(/^1[34578]\d{9}$/.test(this.addressPhone))){
        $message.alert('手机号格式不正确')
      }else if(this.addressDetail==''){
        $message.alert('详细地址不能为空')
      }else{
        http.post(updateAddress,params).then(res=>{
            
          if(res&&res.success){
              console.log(res,"编辑保存成功")
            $router.replace("o2o/pages/address_modules/address_manager")
            // if($storage.get('prevpage')=='pages/o2o/pages/address_modules/address_manager/main'){
            //   this.$state.columnList.map(v=>{
            //     console.log("123")
            //     if(v.menuAction=='editAddress'){
            //      $router.replace(v.menuJspath)
            //     }
            //   })
            //   //$router.replace('address/addressList');
            // }else{
            //   this.$state.columnList.map(v=>{
            //     console.log("456")
            //     if(v.menuAction=='selectAddress'){
            //      $router.replace(v.menuJspath)
            //     }
            //   })
              //$router.replace('address/selectAddressList');
            // }
          }
        })
      }
    }
  },
}
</script>

<style  lang="less" scoped>
@import '../../../../../common/css/common.less';
  .address{
    position: relative;
    padding-top: 90rpx;
    .address-save {
      position: fixed;
      z-index: 9999;
      height: 90rpx;
      width: 70rpx;
      line-height: 90rpx;
      text-align: right;
      right: 30rpx;
      top: 0;
      font-size: @big-title;
    }
    &-dlBox{
      padding:15rpx 30rpx 0;
      background: @white-color;
      dl{
        overflow:hidden;
        border-bottom:1rpx solid #f6f6f8;
        display:flex;
        align-items:center;
        line-height:88rpx;
        .tui-picker-detail{
          font-size: @big-title;
        }
        &:last-child{
          border-bottom: none;
          align-items: flex-start;
        }
        &:nth-child(3){
            display: flex;
            justify-content: space-between;
            align-items: center;
            dt{
              width: 220rpx;
            }
        }
        dt{
          float:left;
          font-size:@big-title;
          width:160rpx;
        }
        dd{
          float:right;
          font-size:@big-title;
          width:calc(100% - 160rpx);
          text-align: right;
          img{
            margin-left: 10rpx;
            height: 16px;
            width: 16px;
          };
          input{
            border:0;
            color:@color-333;
            &::-webkit-input-placeholder{
                color: #999;
            }
        　　&:-moz-placeholder {
                color:#999;
            }
            &::-moz-placeholder {
                color:#999;
            }
            &:-ms-input-placeholder {
                color:#999;
            } 
          }
          textarea{
            border: 0;
            height: 150rpx;
            margin:25rpx 0;
            font-size: @big-title;
            width: 100%;
          }
        }

      }
    }
    &-isdefault{
      margin-top:30rpx;
      padding:0 30rpx;
      background: #fff;
      line-height: 88rpx;
      dl{
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        align-items: center;
        div{
          float: right;
          i{
            color: #8d8d8d;
          }
        }
        dd{
          float:left;
          font-size:@top-title;
        }
      }
    }
    &-confirm{
      // background-color: green;
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      color: #fff;
    }
    .change-adress {
       position: relative;
      span {
       
        i {
          position: absolute;
        }
        .map-icon {
          top: -16rpx;
          right: 140rpx;
        }
        .right-icon {
          top: -16rpx;
          right: 0;
        }

        input {
          padding-right: 50rpx;
        }
      }
    }
    .choose-sex {
      p{
          display: flex;
          align-items: center;
          span:first-child {
            flex: 2;
          }
          span{
            flex: 1;
            align-items: center;
            i{
              margin-right: 10rpx;
              color: #8d8d8d;
              display: inline-block;
            }
            &:first-child{
              margin-right: 38rpx;
            }
          }
      }  
    }
  }
</style>>

