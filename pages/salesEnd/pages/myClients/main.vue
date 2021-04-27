<template>

	<div class="homepage-content">
		<div class="search-box">
			<div class="box-center">
				<u-keyboard ref="uKeyboard" mode="number" @backspace="backspace" @change="valChange" v-model="show">
				</u-keyboard>
				<u-search @blur="screen" @focus="show=true" placeholder="输入查询手机号" :show-action="true" animation="true"
					clearabled="true" v-model="areaCode"></u-search>
			</div>
		</div>
		<div v-if="company.length > 0">
			<div v-for="(item,index) in company" :key="index">
				<div style="height: 82px;border-bottom: 1px solid #E0E0E0;margin-top: 5px;padding: 0 10px 0 10px">
					<div style="display: flex;">
						<div style="width: 80%; font-size: 17px; color: #004178;">{{item.userinfoCompname}}</div>
						<div style="width: 20%; position: relative;">
							<i class="iconfont" v-if="item.userinfoType == 2"
								style="font-size: 12px;color: #03BF16;top: -6px;position: absolute;right: -5px;z-index: 999;">&#x3bf16;</i>
							<button class="buttonClass" v-if="item.userinfoType == 2">企业</button>
							<button class="buttonClass" v-else="item.userinfoType == 1">个人</button>
						</div>
					</div>
					<div style="display: flex; margin: 5px 0;">
						<div style="width: 80%; font-size: 12px;">企业编码：
							<span>{{item.companyCode}}</span>
						</div>
						<div style="width: 20%; font-size: 12px;text-align: right;">
							<div class="authorization" style="color: #4CD964;"
								v-if="item.userinfoType == 2 && item.checkModifyAudit == 3">已授权</div>
							<div class="authorization" style="color: red;" v-else>未授权</div>
						</div>
					</div>
					<div style="display: flex;font-size: 12px;margin: 10px 0;">
						<div style="width: 40%;">联系人：
							<span>{{item.userinfoCon}}</span>
						</div>
						<div style="width: 50%;font-size: 12px;">
							<div class="phone">电话：
								<span>{{item.userinfoPhone}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="goodsList-nulls" v-else><img :src="nullImg" /></div>
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
		queryGroupBuyerPageByAG,
	} from '@/api/interfaceHDB.js';
	export default {
		config: {
			enablePullDownRefresh: true
		},
		data() {
			return {
				show: false,
				company: [],
				areaCode: '',
				nullImg: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noSearchResult.png',
			}
		},
		mounted() {
			this.getdata()
		},
		// onShow() {
		// 	console.log("home-监听页面显示");
		// 	//执行频率：game（20ms/次）、ui（60ms/次）、normal（200ms/次）
		// 	setInterval(function() {
		// 		uni.hideKeyboard(); //隐藏软键盘
		// 		// plus.key.hideSoftKeybord();
		// 	}, 60);
		// },
		watch: {
			show(value) {
				if (value == false) {
					if (this.areaCode == "") {
						this.getdata()
					} else {
						http.get(queryGroupBuyerPageByAG, {
							buyerPhone: this.areaCode
						}).then(res => {
							this.company = res.list
						});
					}
				}
			}
		},
		methods: {
			getdata() {
				http.get(queryGroupBuyerPageByAG, {
					memberCode: $storage.get('loginInfor').userInfoCode
				}).then(res => {
					this.company = res.list
				})
			},
			screen(value) {
				// this.show = false;
				// if (value == "") {
				// 	this.getdata()
				// } else {
				// 	http.get(queryGroupBuyerPageByAG, {
				// 		buyerPhone: value
				// 	}).then(res => {
				// 		this.company = res.list
				// 	});
				// }

			},
			valChange(val) {
				// 将每次按键的值拼接到value变量中，注意+=写法
				this.areaCode += val;
			},
			backspace() {
				// 删除value的最后一个字符
				if (this.areaCode.length) this.areaCode = this.areaCode.substr(0, this.areaCode.length - 1);
			}
		}
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
		padding: 0 20rpx;
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
		width: 50px;
		border-radius: 10px;
	}
</style>
