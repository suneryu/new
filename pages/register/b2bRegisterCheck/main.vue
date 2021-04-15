<template>
	<view class="register-check">
		<div class="iconBox">
			<div class="successIcon" v-bind:style="{ backgroundColor: baseColor }">
				<icon v-if="checkModifyAudit == 0" type="waiting" size="36" />
				<!-- 审核失败 -->
				<icon v-if="checkModifyAudit == 2" type="cancel" size="36" />
				<!-- 审核成功 -->
				<icon v-if="checkModifyAudit == 1" type="success_no_circle" size="36" />
			</div>
		
		</div>
		<view class="check-type">
			<div v-if="checkModifyAudit == 0">
				<div class="successTitle" >审核中</div>
				<div class="successTip">已提交申请,等待处理</div>
				<div class="successTip" >我们将在7个工作日内完成人工审核</div>
				<div class="successTip" >请耐心等待审核结果</div>
				
			</div>
			<!-- <text v-if="checkModifyAudit == 0">请等待审核</text> -->
			<text v-if="checkModifyAudit == 2">审核失败</text>
			<text v-if="checkModifyAudit == 1">审核成功</text>
		</view>
		
		<view class="customer-service" v-if="customerServicePhone">
			<text>客服电话：{{ customerServicePhone }}</text>
		</view>
		<view class="checkBtn">
			<button type="default" v-bind:style="{ backgroundColor: baseColor }"  @click="backHome">前往首页</button>
			<button type="default" v-bind:style="{ backgroundColor: baseColor }" v-if="checkModifyAudit == 2" @click="reCommitCheck">重新提交审核</button>
			<button type="default" v-bind:style="{ backgroundColor: baseColor }" v-if="checkModifyAudit == 1" @click="check">申请授权</button>
		</view>
		<!-- <button type="default" v-bind:style="{ backgroundColor: baseColor }" v-if="checkState == 0" @click="backHome">返回首页</button> -->
	</view>
</template>

<script>
import { userapplyStateAndAuth,queryUserInfoApplyByPhone, queryOcserviceConfPage } from '@/api/interface.js';
export default {
	props: {
		propUserPhone: {
			type: String,
			default: ''
		},
		propRedirectUrl: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			logoImg: this.$qj.domain + '/paas/shop-master/c-static/images/B2B/waiting.png',
			baseColor: '',
			userPhone: '',
			redirectUrl: '',
			// 审核状态
			checkState: 1,
			failReason: '',
			customerServicePhone: '',
			provinceCode: '',
			provinceName: '',
			cityCode: '',
			cityName: '',
			areaCode: '',
			areaName: '',
			// 填写的个人或者公司名称
			userinfoCompname: '',
			// 公司：2 个人：1
			userinfoType: '',
			// 经销商类型
			qualityQtypeCode: '',
			qualityQtypeName: '',
			// 渠道类型
			userinfoDischannelcode: '',
			userinfoDischannelname: '',
			// 注册时填写的手机号
			userinfoPhone: '',
			userInfoCode: '',
			checkModifyAudit:'',
			
		};
	},
	onLoad(options) {
		this.userPhone = options.userPhone;
		this.redirectUrl = options.redirectUrl;
		this.checkModifyAudit = options.checkModifyAudit || this.checkModifyAudit
	},
	onShow() {
		// this.getCheckState(this.userPhone);
	},
	watch: {
		propUserPhone(newValue, oldValue) {
			this.userPhone = newValue;
		},
		propRedirectUrl(newValue, oldValue) {
			this.redirectUrl = newValue;
		}
	},
	created(){
		this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
		this.getAuthState()
		this.$qj
			.http(this.$qj.domain)
			.get(queryOcserviceConfPage, {
				ocserviceCode: 'phoneCall'
			})
			.then(res => {
				if(res.rows.length > 0){
					this.customerServicePhone = res.rows[0].ocserviceConfValue
				}
			});
	},
	mounted() {
		
	},
	methods: {
		redirectTo(options) {
			this.$qj.router.replace(options.url, options.query ? options.query : '');
		},
		navigateBack() {
			this.$qj.router.back();
		},
		navigateTo(options){
			this.$qj.router.push(options.url, options.query ? options.query : '');
		},
		// 获取授权状态
		getAuthState() {
			let that = this
			let paramsStatus = {}
			paramsStatus.userCode = this.$qj.storage.get('loginInfor').userInfoCode
			this.$qj
				.http(this.$qj.domain)
				.get(userapplyStateAndAuth, paramsStatus)
				.then(res => {
					 this.checkModifyAudit = res.checkModifyAudit
		
				});
		
		},
		 
		backHome() {
			// if (this.redirectUrl) {
				let options = {
					url: 'indexHDB',
					query: {
						defaultUrl: this.redirectUrl
					}
				};
				this.redirectTo(options);
			// } else {
			// 	this.navigateBack();
			// }
		},
		reCommitCheck() {
			let registerParams = {
				provinceCode: this.provinceCode,
				provinceName: this.provinceName,
				cityCode: this.cityCode,
				cityName: this.cityName,
				areaCode: this.areaCode,
				areaName: this.areaName,
				// 填写的个人或者公司名称
				userinfoCompname: this.userinfoCompname,
				// 公司：2 个人：1
				userinfoType: this.userinfoType,
				// 经销商类型
				qualityQtypeCode: this.qualityQtypeCode,
				qualityQtypeName: this.qualityQtypeName,
				// 渠道类型
				userinfoDischannelcode: this.userinfoDischannelcode,
				userinfoDischannelname: this.userinfoDischannelname,
				userinfoCode: this.userInfoCode
			}
			let options = {
				url: 'register/b2bRegisterCom',
				query: {
					registerParams: JSON.stringify(registerParams),
					// 注册时填写的手机号
					userPhone: this.userinfoPhone,
					pageState: 1
				}
			};
			this.redirectTo(options);
		},
		
		check() {
			let registerParams = {
				provinceCode: this.provinceCode,
				provinceName: this.provinceName,
				cityCode: this.cityCode,
				cityName: this.cityName,
				areaCode: this.areaCode,
				areaName: this.areaName,
				// 填写的个人或者公司名称
				userinfoCompname: this.userinfoCompname,
				// 公司：2 个人：1
				userinfoType: this.userinfoType,
				// 经销商类型
				qualityQtypeCode: this.qualityQtypeCode,
				qualityQtypeName: this.qualityQtypeName,
				// 渠道类型
				userinfoDischannelcode: this.userinfoDischannelcode,
				userinfoDischannelname: this.userinfoDischannelname,
				userinfoCode: this.userInfoCode
			}
			let options = {
				url: 'register/check',
				query: {
					registerParams: JSON.stringify(registerParams),
					// 注册时填写的手机号
					userPhone: this.userinfoPhone,
					pageState: 1
				}
			};
			this.redirectTo(options);
		}
	}
};
</script>

<style lang="less" scoped>
@import '@/common/css/common.less';
.register-check {
	width: 100%;
	height: 100%;
	background: @white-color;
	.checkBtn{
		display: flex;
	}
	.iconBox {
		display: flex;
		justify-content: center;
	}
	
	.registerSuccess {
		width: 100%;
		margin-top: 60px;
		text-align: center;
	
	}
	
	.successIcon {
		// width: 40px;
		padding: 14px;
		border-radius: 33px;
	}
	
	.logo {
		margin-top: 180rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		image {
			width: 86rpx;
			height: 102rpx;
		}
		.iconfont {
			font-size: 123rpx;
		}
	}
	.check-type {
		margin-top: 84rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		color: #666666;
		text-align: center;
	}
	.fail-reason {
		margin-top: 43rpx;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #666666;
	}
	.customer-service {
		font-size: 24rpx;
		color: #666666;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 19rpx;
	}
	button {
		width: 291rpx;
		margin: 0 auto;
		margin-top: 76rpx;
		height: 84rpx;
		line-height: 84rpx;
		text-align: center;
		font-size: 30rpx;
		color: #ffffff;
		border-radius: 42rpx;
		border: none;
		background: #374e80;
	}
}
</style>
