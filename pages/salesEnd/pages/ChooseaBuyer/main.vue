<template>
	<div class="homepage-content">
		<div class="search-box">
			<div class="box-center">
				<u-search @blur="screen" placeholder="输入合同名称" :show-action="false" clearabled="true" v-model="searchValue"></u-search>
			</div>
			<div class="box-right">
				<span class="iconfont icon-tishi"></span>
			</div>
		</div>
		<div  v-if="Buyers.length > 0" style='margin-bottom: 125rpx;'>
			<div v-for="(item,index) in Buyers" :key="index" >
				<div style="height: 260rpx;margin-bottom: 3px; border-bottom: 3px solid #E0E0E0;margin-top: 5px;padding: 0 10px 0 10px">
				<div style="font-size: 12px">{{item.giftCode}}</div>
				<div style="display: flex;">
					<div style="width: 80%; font-size: 17px;">{{item.giftName}}</div>
				</div>
				<div style="display: flex; font-size: 12px">{{item.contractRemark}}</div>
				<div style="display: flex; margin: 5px 0;">
					<div style="width: 80%; font-size: 12px;">合同金额：
						<span>{{item.giftCnum}}</span>
					</div>
					<div style="width: 20%; font-size: 12px;text-align: right;">
<!-- 						<a href="">预约合同</a> -->
					</div>
				</div>
				<div style="font-size: 12px;margin: 5px 0 10px 0;">合同有效时间：
					<div style="width: 100%;display: flex;justify-content: space-between;">
						<span>{{item.memberCcode}}~{{item.memberCname}}</span>
						<button class="buttonClass" @click="useContract(item)">使用合同</button>
					</div>
				</div>
				<div style="display: flex; font-size: 12px;border-top: 1px solid #E0E0E0;align-items: center;height: 50rpx;">
					<div style="width: 40%;">进度：
						<span>{{(Number(item.giftUserWeight)*100).toFixed(2)}}%</span>
					</div>
					<div style="width: 40%;">余额：
						<span>{{item.appmanageIcode}}</span>
					</div>
					<span style="width: 20%; text-align: right;" @click='toOrderList(item)'>使用详情</span>
				</div>
			</div>
			
			</div>
		</div>
		<div class="goodsList-nulls" v-else><img :src="nullImg" /></div>
		<div class="creatButton"
			style="position: fixed; bottom: 0; text-align: center; width: 100%; height: 120rpx;display: flex; justify-content: center;background: #fff;">
			<button @click="toCreateQuo" style="width: 90%;">线上商城</button>
		</div>
	</div>
</template>

<script>
	import vueTabBar from '@/components/communal/vueTabBar';
	import http from '@/api/http.js';
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		queryBuyerScontractPage,
	} from '@/api/interfaceHDB.js';
	export default {
		data() {
			return {
				searchValue:'',
				companyPack:[],
				Buyers: [],
				options:'',
				userinfoCode:'',
				nullImg: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noSearchResult.png',
			}
		},
		mounted() {
			this.getdata()
		},
		onLoad(options){
			this.options = options.userinfoPhone
			this.userinfoCode = options.memberBcode
		},
		methods: {
			toOrderList(scontractObillcode){
				this.$router.push("order_modules/order/index", {
				  isContract:false,serachPhone:this.options,searchGiftcode:scontractObillcode.giftCode
				});
			},
			getdata() {
				http.get('/web/gt/giftUser/queryGiftUserPage.json', {
					giftUserPhone:this.options,
					giftName:this.searchValue,
					departCode:19
				}).then(res => {
					if(res.list.length>0){
						res.list.forEach(item=>{
							item.memberCcode = item.memberCcode==null?item.memberCcode:item.memberCcode.slice(0,10)
							item.memberCname = item.memberCname==null?item.memberCname:item.memberCname.slice(0,10)
						})
					}
					
						this.Buyers = res.list || []
				});
			},
			toCreateQuo(){
				$router.push("salesEnd/pages/createQuotation",{userinfoPhone:this.options})
			},
			useContract(item){
				$router.push("salesEnd/pages/createQuotation",{userinfoPhone:this.options,scontractCode:item.giftUserCode,giftCode:item.giftCode,giftUserId:item.giftUserId})
			},
			screen(value){
				this.searchValue = value
				this.getdata()
			}
		},
	}
</script>

<style lang="less" scoped>
	@import '@/node_modules/qj-mini-pages/libs/css/common.less';
	.goodsList-nulls{
			width: 100%;
			margin-top: 200rpx;
			text-align: center;

			img {
				width: 402rpx;
				height: 337rpx;
				margin: 0 auto;
			}
		}

	.search-box {
		background-color: #ffffff;
		z-index: 1000;
		height: 100rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #F4F4F5;
	}

	.box-center {
		margin: 0 30rpx;
		width: 80%;
		height: 100%;
		line-height: 100rpx;
	}

	.box-right {
		height: 80rpx;
		width: 80rpx;
		padding: 10rpx;
		margin-left: 10rpx;
		line-height: 80rpx;
		text-align: center;

		span {
			height: 100%;
			width: 100%;
			font-size: 38rpx;

		}
	}

	.buttonClass {
		float: right;
		font-size: 12px;
		height: 30rpx;
		line-height: 30rpx;
		color: #fff;
		background-color: #004178;
		width: 120rpx;
		border-radius: 10px;
	}
	.creatButton button {
		height: 80rpx;
		font-size: 15px;
		color: #FFFFFF;
		width: 80%;
		background-color: #004178;
	}
</style>
