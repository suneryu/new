<template>
  <div class="banners-list">
    <swiper
      class="swiper"
      indicator-dots="true"
      autoplay="true"
      interval="4000"
      duration="1000"
      circular="true"
      :style="{ height: Hei + 'px',width:'100%' }"
    >
      <block
        v-for="(item, index) in skuList.rsGoodsFileDomainList"
        :index="index"
        :key="index"
      >
        <swiper-item>
          <image
            :src="item.goodsFileUrl"
            mode="aspectFit"
            class="slide-image"
          />
        </swiper-item>
      </block>
    </swiper>
    <div class="goods-infor">
      <h3>{{ skuList.goodsName }}</h3>
	  <div v-if='userinfoType=="1"' style='margin-top: 10px;font-size: 11px;color: #b7b5b5;'>认证为企业用户可以查看价格</div>
	  <!-- <div style='display: flex;' v-else> -->
	  <!-- <h3 v-if="userinfoType=='2' && goodsClass == '1' && checkModifyAudit != '3'" :style="{ color: '#d66377' }">{{ unitPrice.obpay }}{{ pricesetNprice }}{{ unitPrice.mapay }}</h3> -->
	  <div style='display: flex;'>
		  <p class="price1"  style='text-decoration: line-through;' v-if=" pricesetNprice && pricesetNprice != 'NaN' && userinfoType == '2' && checkModifyAudit=='3' && goodsClass=='1'">
		    原价：{{ unitPrice.obpay }}
		    <span>{{ pricesetNprice }}</span>
		    {{ unitPrice.mapay }}
		  </p>
		  <p class="price1"   v-if=" pricesetNprice && pricesetNprice != 'NaN' && userinfoType == '2' && checkModifyAudit !='3'">
		    商品价：{{ unitPrice.obpay }}
		    <span>{{ pricesetNprice }}</span>
		    {{ unitPrice.mapay }}
		  </p>
		  <!-- <h3 v-if="userinfoType=='2' && goodsClass != '1'" :style="{ color: '#d66377' }">{{ unitPrice.obpay }}{{ pricesetNprice }}{{ unitPrice.mapay }}</h3> -->
		  
		  <p class="price" v-if="goodsClass == '1' && userinfoType == '2' && checkModifyAudit == '3'">
		    采购价：{{ unitPrice.obpay }}
		    <span>{{ price.toFixed(2) }}</span>
		    {{ unitPrice.mapay }}
		  </p>
	  </div>
     
    </div>
  </div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
import { userapplyStateAndAuth,article } from '@/api/interface.js';
import {
	queryNewUserinfoPageByDealerqt
	} from '@/api/interfaceHDB.js';
export default {
  props: ['skuList','goodsClass'],
  data() {
    return {
      goodsinfor: '',
      rsSkuDomainList: [],
      Hei: 0,
      price: '',
	  pricesetNprice :"",
	  skuList:"",
	  userinfoType:"",   //个人类型
	  checkModifyAudit:"",  // 是否授权
	  userInfoCode:"",
	  userinfoOcode: 1, //权益值
	  userPhone:"" ,  //手机号
	 // goodsClass:''
    }
  },
  updated() {
	  console.log('qweee',this.skuList)
    this.pricesetNprice = this.skuList.pricesetNprice
    // this.pricesetNprice  = (this.skuList.pricesetNprice  * 1).toFixed(2) //对外价格
	if(this.userinfoType == '2' && this.checkModifyAudit == '3'){
		this.price = Number(this.pricesetNprice) * Number(this.userinfoOcode)
	}
	
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice")
    }
  },
  filters: {
    numFilter(value) {
      let realVal = null
      if (value) {
        // 截取当前数据到小数点后两位
        realVal = parseFloat(value).toFixed(2)
      } else {
        realVal = '--';
      }
      console.log(realVal, 'realVal')
      return realVal
    }
  },
  watch: {
    skuList() {
      return this.skuList
    }
  },
  onLoad(options) {
  // onLoad() {
    Object.assign(this.$data, this.$options.data()) //初始化数据
    let pages = getCurrentPages()
    let prevpage = pages[0]
    $storage.set('prevpage', prevpage.route)
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#' + this.$state.baseColor,
      backgroundColor: '#07913B'
    })
  },
  created(){
	 this.userinfoType = $storage.get('loginInfor').userinfoType;
	 this.userInfoCode = $storage.get('loginInfor').userInfoCode;
	 this.userPhone = $storage.get('loginInfor').userPhone;
	 console.log(this.userPhone,'this.userPhone')
	 console.log(this.userInfoCode,'this.userInfoCode')
	 console.log(this.userinfoType,'this.userinfoType')
	 // this.goodsClass = $storage.get("goodsClass")
	 console.log('当前商品类型---',this.goodsClass)
  },
  mounted() {
	 
	  // console.log(options, '111111111')
	  console.log(this.$qj.storage.get('userInfo'))
	
    this.baseColor = '#' + this.$state.baseColor
    this.baseColor = '#07913B';
	this.pricesetNprice = this.skuList.pricesetNprice
	console.log('qweee',this.skuList.pricesetNprice)
	if(this.userinfoOcode!=null && this.userinfoOcode !="" ){
		if(this.userinfoType == '2' && this.checkModifyAudit == '3'){
			this.price = Number(this.pricesetNprice) * this.userinfoOcode
		}
	}else{
		this.price = Number(this.pricesetNprice) * 1
	}
	 
	console.log(this.userPhone,'手机号=---')
	this.getQY();
	this.searchStatus();
	if(this.userinfoType == '2' && this.checkModifyAudit == '3'){
		this.price = Number(this.pricesetNprice) * this.userinfoOcode
	}
  },
  methods: {
	  //查询权益
	  getQY(){
	  	this.$qj
	  		.http(this.$qj.domain)
	  		.get(queryNewUserinfoPageByDealerqt, {
	  			userinfoPhone: this.userPhone
	  		})
	  		.then(res => {
				console.log("-----",res)
	  			console.log('权益值',res.rows[0].userinfoOcode)
	  			this.userinfoOcode = res.rows[0].userinfoOcode
				if(this.userinfoOcode == null || this.userinfoOcode ==''){
					this.userinfoOcode = 1;
				}
	  		})
	  },
	  // 从缓存中判断这个人是个人还是企业
	  // 查询 认证授权 状态
	  searchStatus() {
	  	let paramsStatus = {}
	  	paramsStatus.userCode = this.userInfoCode
	  	this.$qj
	  		.http(this.$qj.domain)
	  		.get(userapplyStateAndAuth, paramsStatus)
	  		.then(res => {
	  			console.log("认证授权状态，",res)
	  			if (res.checkModifyAudit == '3') {
	  				this.checkModifyAudit = "3"
	  			}
	  
	  		});
	  },
	  
  }
}
</script>

<style lang="less" scoped>
@import "../../../common/css/common.less";
page {
  background: @white-color;
}
.banners-list {
  background: @white-color;
  margin-top: 20rpx;
  .swiper {
    min-height: 700rpx;
    .slide-image {
      height: 100%;
      width: 100%;
    }
  }
  .goods-infor {
    padding: 20rpx 30rpx;
    h3 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
	
    .price {
		width: 50%;
      color: #e40506;
      font-size: 30rpx;
      margin-top: 16rpx;
    }
	.price1 {
		// text-decoration:line-through;
		width: 50%;
	  color: #000000;
	  font-size: 30rpx;
	  margin-top: 16rpx;
	}
  }
}
</style>
