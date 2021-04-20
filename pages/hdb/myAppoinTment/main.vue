<template>
	<div class="homepage-content">
		<div class="search-box">
			<div class="box-center" style="display: flex;">
				<div style="width: 50%;">预约编号：
					<span>10000000000</span>
				</div>
				<div style="width: 50%; text-align: right;">预约合同子分类-3</div>
			</div>
		</div>
		<!-- 		<div  v-if="Buyers.length > 0"> -->
		<div>
			<!-- v-for="(item,index) in Buyers" :key="index" -->
			<div style="height: 100px;border-bottom: 3px solid #E0E0E0;margin-top: 5px;padding: 0 10px 0 10px">
				<!-- <div style="font-size: 12px">1</div> -->
				<div style="display: flex;">
					<div style="width: 80%; font-size: 17px;">项目合同名称</div>
				</div>
				<div style="display: flex; margin: 5px 0;">
					<div style="width: 80%; font-size: 12px;">合同描述：
					</div>
					<div style="width: 20%; font-size: 12px;text-align: right;">
						<span style="color: #007AFF; text-decoration: underline;">预约合同</span>
					</div>
				</div>
				<div style="display: flex;font-size: 12px;margin: 10px 0;">
					<div style="width: 100%;">合同签订时间：
						<span>5</span>
						<button class="buttonClass" @click="salesperson">联系销售员</button>
					</div>
				</div>
				<div style="display: flex; font-size: 12px;border-top: 1px solid #E0E0E0;">
					<div style="width: 40%; color: #007AFF">服务完成
					</div>
				</div>
			</div>

		</div>
		<!-- 		</div> -->
		<!-- <div class="goodsList-nulls" v-else><img :src="nullImg" /></div> -->
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
				searchValue: '',
				companyPack: [],
				Buyers: [],
				options: '',
				nullImg: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noSearchResult.png',
			}
		},
		mounted() {
			// this.getdata()
		},
		// onLoad(options){
		// 	this.options = options.userinfoPhone
		// },
		methods: {
			salesperson() {
				let showHtml = ""
				wx.showModal({
					title: "企业信息",
					content: '上海测试有限公司 企业编码\r\n企业联系人：123\r\n电话：123',
					cancelText: '关闭',
					confirmText:'一键拨号',
					success: res => {
						if (res.confirm) {
							this.gocall()
						}
					}
				});
			},
			gocall() {
				console.log(1111)
				uni.makePhoneCall({

					// 手机号
					phoneNumber: '17835757271',

					// 成功回调
					success: (res) => {
						console.log('调用成功!')
					},

					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}

				});
			},
		},
	}
</script>

<style lang="less" scoped>
	@import '@/node_modules/qj-mini-pages/libs/css/common.less';

	.goodsList-nulls {
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
		width: 100%;
		height: 100%;
		line-height: 100rpx;
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
</style>
