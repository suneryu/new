<template>
	<view class="b2b-register" v-if="checkModifyAudit != '-1'">
		<view class="input-container">
			<!-- 企业名称 -->
			<view class="company-or-personal">
				<!-- <view class="iconfont icon-city"></view> -->
				<view class="inputLabel">企业名称：</view>

				<input class="company-personal-input" type="text" disabled v-model="userinfoCompname" />
			</view>

			<!-- 营业执照号 -->
<!-- 			<view class="company-or-personal">
				<view class="inputLabel">营业执照号：</view>
				<input class="company-personal-input" type="text" disabled v-model="userinfoCertNo" />
			</view> -->
			<!-- 统一信用代码 -->
			<view class="company-or-personal">
				<view class="inputLabel">统一信用代码：</view>
				<input class="company-personal-input" type="text" disabled v-model="userinfoCert2No" />
			</view>

			<view class="address-choose">
				<view class="inputLabel">城市：</view>
				<view class="container">
					<input type="text" disabled v-model="city" />
					<!-- <view class="iconfont icon-jiantou12"></view> -->
				</view>
			</view>
			<view class="company-or-personal">
				<view class="inputLabel">详细地址：</view>
				<input class="company-personal-input" disabled type="text" v-model="companyAddress" />
			</view>

			<!-- <view class="Business">
				<div class="left">
					<h3>上传营业执照（正本）</h3>
					<h6>支持png、jpg格式的图片</h6>
				</div>
				<div class="right"><img :src="imgBusiness" @click="Business" /></div>
			</view> -->
			<view style="display: flex; margin: 4px 0;">
				<view class="imgBusiness">
					<view class="inputLabel">营业执照：</view>
					<img :src="imgBusiness" />
				</view>
				<view class="imgBusiness">
					<view class="inputLabel">企业授权书：</view>
					<img :src="memoauthFileurl" />
				</view>

			</view>



			<view class="company-or-personal">
				<view class="inputLabel">真实姓名：</view>
				<input class="company-personal-input" type="text" v-model="userinfoCorp" disabled />
			</view>
			<view class="company-or-personal">
				<view class="inputLabel">联系人姓名：</view>
				<input class="company-personal-input" type="text" v-model="userinfoCon" disabled />
			</view>
			<view class="account">
				<view class="inputLabel">联系人电话：</view>
				<input class="account-input" type="number" maxlength="11" v-model="userinfoTel" disabled />
			</view>

		</view>

		<view style="display: flex;">
			<button type="default" class="register-btn" v-bind:style="{ backgroundColor: baseColor }" @click="gotoCheck">前往授权页</button>
			<button type="default" class="register-btn" v-bind:style="{ backgroundColor: baseColor }" @click="updateRegister">修改注册信息</button>

		</view>



		<!-- <u-picker mode="selector" v-model="distributorPicker" :default-selector="[0]" :range="distributorArray" range-key="qtypeQtypeName"
		 @confirm="distributorPickerConfirm"></u-picker>

		<u-picker mode="selector" v-model="channelPicker" :default-selector="[0]" :range="channelArray" range-key="channelName"
		 @confirm="channelPickerConfirm"></u-picker> -->
		<u-picker mode="region" v-model="cityPicker" :area-code="['11', '1101', '110101']" @confirm="cityPickerConfirm"></u-picker>
	</view>
</template>

<script>
	import {
		querySaveDealerChannel,
		queryDealerQualityQtype,
		changePhone,
		saveUserDealerByQuality,
		saveDealerUserinfoapply,
		saveUserDealer,
		uploadGoodsFile,
		// userInfoByCodeNew,
		userInfoApplyByPhone,
		userapplyStateAndAuth,
	} from '@/api/interface.js';
	import http from '@/api/http.js';
	export default {
		props: {
			propUserPhone: {
				type: String,
				default: ''
			},
			propPageState: {
				type: Number,
				default: 0
			},

		},

		data() {
			return {
				// 页面状态
				// 从审核失败页面或者授权手机号页面：1
				// 从账号密码登录界面：2
				// 上次注册填写的信息
				registerParams: {},
				// 新add
				// registerParams: this.propRegisterParams,
				logoImg: `${this.$qj.domain}/paas/shop-master/c-static/images/B2B/logo/120×120.png`,
				userType: 2,
				baseColor: '',

				userinfoCompname: '',
				city: '',
				userinfoCert2No: '',
				companyAddress: '',
				userinfoCorp: '',
				userinfoCon: '',
				userinfoTel: '',
				// userinfoCertNo: '',

				cityPicker: false,
				provinceCode: '',
				cityCode: '',
				areaCode: '',
				provinceName: '',
				cityName: '',
				areaName: '',
				userInfoCode: '',
				imgBusiness: '',
				imgBusinessHttp: '',
				pageState: 0,
				// userinfoType:2,
				inputUserPhone: '',
				userPhone: '',
				memoauthFileurl: '',
				userCode: '',
				checkModifyAudit: ''
			};
		},
		watch: {
			propUserPhone(newValue, oldValue) {
				this.userPhone = newValue;
				if (this.userPhone) {
					this.inputUserPhone = this.$qj.asterisk(this.userPhone);
				}
			},
			propPageState(newValue, oldValue) {
				this.pageState = newValue;
			},
		},
		onLoad(options) {
			console.log(options,'--------options')
			this.userPhone = options.userPhone;
			this.pageState = options.pageState ? options.pageState : 0;
			if (options.registerParams) this.registerParams = JSON.parse(options.registerParams);
			if (this.registerParams != {}) {
				this.userType = this.registerParams.userinfoType;
				// this.distributor = this.registerParams.qualityQtypeName;
				// this.distributorCode = this.registerParams.qualityQtypeCode;
				// this.channel = this.registerParams.userinfoDischannelname;
				// this.channelCode = this.registerParams.userinfoDischannelcode;
				this.userinfoCompname = this.registerParams.userinfoCompname;

				this.city = this.registerParams.provinceName + this.registerParams.cityName + this.registerParams.areaName;
				this.provinceCode = this.registerParams.provinceCode;
				this.cityCode = this.registerParams.cityCode;
				this.areaCode = this.registerParams.areaCode;
				this.provinceName = this.registerParams.provinceName;
				this.cityName = this.registerParams.cityName;
				this.areaName = this.registerParams.areaName;

				this.userInfoCode = this.registerParams.userinfoCode;
			}
		},
		onShow() {},
		created() {
			this.getAuthState()
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			// this.userPhone = this.$qj.storage.get('userPhone');

			this.getComInfo()
			this.userPhone = this.$qj.storage.get('userPhone');
			this.loginInfor = this.$qj.storage.get('loginInfor')
			this.userCode = this.loginInfor.userInfoCode;
		},
		mounted() {
			// this.userCode = this.$qj.storage.get('loginInfor').userInfoCode;
		},
		methods: {
			navigateBack() {
				this.$qj.router.back();
			},

			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},

			redirectTo(options) {
				this.$qj.router.replace(options.url, options.query ? options.query : '');
			},
			/**
			 * 城市选择
			 */
			chooseCity() {
				this.cityPicker = true;
			},
			/**
			 -
			 */
			cityPickerConfirm(params) {
				this.city = params.province.label + params.city.label + params.area.label;
				this.provinceCode = params.province.value;
				this.cityCode = params.city.value;
				this.areaCode = params.area.value;
				this.provinceName = params.province.label;
				this.cityName = params.city.label;
				this.areaName = params.area.label;
			},

			// 前往授权页
			gotoCheck() {
				let options = {
					url: 'register/check',
					query: {
						registerParams: JSON.stringify(this.registerParams),
						// registerParams: this.registerParams,
						userPhone: this.userPhone,
					}
				};
				this.redirectTo(options);
			},
			// 获取认证 授权状态

			getAuthState() {
				let that = this
				let paramsStatus = {}
				paramsStatus.userCode = this.$qj.storage.get('loginInfor').userInfoCode
				this.$qj
					.http(this.$qj.domain)
					.get(userapplyStateAndAuth, paramsStatus)
					.then(res => {
						let that = this
						this.checkModifyAudit = res.checkModifyAudit
						if (res.checkModifyAudit == '0') {
							let options = {
								url: 'register/b2bRegisterCheck',
								query: {
									userPhone: this.userPhone || this.inputUserPhone,
									checkModifyAudit: res.checkModifyAudit,
								}
							};
							this.redirectTo(options);
						}
						if (res.checkModifyAudit == '-1') {
							uni.showModal({
								title: '提示',
								content: '您还未进行企业认证，请前去认证',
								// confirmColor: '#' + $storage.get('baseColor'),
								success(res) {
									let pages = getCurrentPages()
									if (res.confirm) {
										let currentPage = pages[pages.length - 1]
										let redirectUrl = currentPage.route.replace('pages/', '').replace('/main', '')
										let options = {
											url: 'register/b2bRegisterCom',
											query: {
												registerParams: JSON.stringify(that.registerParams),
												userPhone: that.userPhone,
											}
										};
										that.redirectTo(options);
									} else if (res.cancel) {
										// if (pages.length > 1) {
										// 	that.navigateBack()
										// }
									}
								}
							})
						}


					});

			},
			// 获取企业信息
			getComInfo() {
				let that = this
				let params = {}
				params.userPhone = this.$qj.storage.get('loginInfor').userPhone;
				http
					.get(userInfoApplyByPhone, params)
					.then(res => {
						if (res) {
							this.userinfoCompname = res.userinfoCompname;
							// this.userinfoCertNo = res.userinfoCertNo;
							this.userinfoCert2No = res.userinfoCert2No;
							this.city = res.provinceName + res.cityName + res.areaName;
							this.companyAddress = res.companyAddress;
							this.imgBusiness = this.$qj.domain + res.userinfoCertUrl;
							this.userinfoCorp = res.userinfoCorp;
							this.userinfoCon = res.userinfoCon;
							this.userinfoTel = res.userinfoTel;

							this.provinceCode = res.provinceCode;
							this.provinceName = res.provinceName;
							this.cityCode = res.cityCode;
							this.cityName = res.cityName;
							this.areaCode = res.areaCode;
							this.areaName = res.areaName;
							this.userinfoType = res.userinfoType;
							this.qualityQtypeCode = res.qualityQtypeCode;
							this.qualityQtypeName = res.qualityQtypeName;
							this.userinfoDischannelcode = res.userinfoDischannelcode;
							this.userinfoDischannelname = res.userinfoDischannelname;
							this.userinfoPhone = res.userinfoPhone;
							// this.failReason = res.umUserinfoapplyDomain.memo
							this.userInfoCode = res.userinfoCode;
							this.userinfoId = res.userinfoId
						
							this.memoauthFileurl = this.$qj.domain + res.userinfoCert1Url
							// this.memoauthFileurl = this.$qj.domain + res.userinfoCert1Url

							this.registerParams = {
								userinfoCompname: res.userinfoCompname,
								// userinfoCertNo: res.userinfoCertNo,
								userinfoCert2No: res.userinfoCert2No,
								city: res.provinceName + res.cityName + res.areaName,
								companyAddress: res.companyAddress,
								imgBusiness: res.userinfoCertUrl,
								userinfoCorp: res.userinfoCorp,
								userinfoCon: res.userinfoCon,
								userinfoTel: res.userinfoTel,

								provinceCode: res.provinceCode,
								provinceName: res.provinceName,
								cityCode: res.cityCode,
								cityName: res.cityName,
								areaCode: res.areaCode,
								areaName: res.areaName,
								userinfoType: res.userinfoType,
								qualityQtypeCode: res.qualityQtypeCode,
								qualityQtypeName: res.qualityQtypeName,
								userinfoDischannelcode: res.userinfoDischannelcode,
								userinfoDischannelname: res.userinfoDischannelname,
								userinfoPhone: res.userinfoPhone,
								// this.failReason = res.umUserinfoapplyDomain.memo
								userInfoCode: res.userinfoCode,
								userinfoId: res.userinfoId,
								memoauthFileurl: res.userinfoCert1Url
							}
						} else {
							this.$qj.message.alert(res.msg);
						}


						// if (res.success) {
						// 	// if (this.pageState == 0 || this.pageState == 2) {
						// 	// 	let options = {
						// 	// 		url: 'register/b2bRegisterCheck',
						// 	// 		query: {
						// 	// 			userPhone: this.userPhone || this.inputUserPhone
						// 	// 		}
						// 	// 	};
						// 	// 	this.redirectTo(options);
						// 	// } else {
						// 	// 	this.navigateBack();
						// 	// }
						// 	// userinfoCertUrl 不为空 datastate=0   认证通过

						// 	// userinfoCert1Url 不为空 datastate=0 授权通过
						// 	if (res.userinfoCertUrl) {
						// 		let options = {
						// 			url: 'register/b2bRegisterCheck',
						// 			query: {
						// 				userPhone: this.userPhone || this.inputUserPhone
						// 			}
						// 		};
						// 		this.redirectTo(options);
						// 	}
						// 	if (res.userinfoCert1Url) {
						// 		let options = {
						// 			url: 'register/checkSuccess',
						// 			query: {
						// 				userPhone: this.userPhone || this.inputUserPhone
						// 			}
						// 		};
						// 		this.redirectTo(options);

						// 	}
						// } 

					});

			},

			updateRegister() {
				let options = {
					url: 'register/b2bRegisterCom',
					query: {
						registerParams: JSON.stringify(this.registerParams)
					}
				};
				this.redirectTo(options);
			},


		}
	};
</script>

<style lang="less" scoped>
	@import '@/common/css/common.less';

	.b2b-register {
		width: 100%;
		height: 100%;
		background: @white-color;

		.inputLabel {
			width: 120px;
		}

		.imgBusiness {

			image {
				width: 40px;
				height: 40px;

			}
		}

		.distributor {
			width: 591rpx;
			height: 90rpx;
			margin: 0 auto;
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: @color-333;
			border-bottom: 1rpx solid #e5e5e5;

			input {
				flex: 1;
				width: 100%;
				height: 100%;
				background: none;
			}

			.iconfont {
				color: #cccccc;
			}
		}

		.channel {
			width: 591rpx;
			height: 90rpx;
			margin: 0 auto;
			display: flex;
			align-items: center;
			font-size: 26rpx;
			color: @color-333;
			border-bottom: 1rpx solid #e5e5e5;

			input {
				flex: 1;
				width: 100%;
				height: 100%;
				background: none;
			}

			.iconfont {
				color: #cccccc;
			}
		}

		.user-type {
			padding-left: 76rpx;
			padding-top: 30rpx;
			display: flex;
			align-items: center;

			text {
				padding-left: 10rpx;
				color: @color-333;
				font-size: 26rpx;
			}

			.personal {
				margin-left: 50rpx;
			}
		}

		.input-container {
			margin: 0 auto;
			width: 591rpx;
			margin-top: 30rpx;
			font-size: 26rpx;

			.iconfont {
				color: #cccccc;
				padding-right: 20rpx;
			}

			.company-or-personal {
				display: flex;
				align-items: center;
				width: 100%;
				height: 90rpx;

				input {
					width: 100%;
					height: 100%;
					background: none;
					border-bottom: 1rpx solid #e5e5e5;
					color: @color-333;
				}
			}

			.address-choose {
				display: flex;
				align-items: center;
				width: 100%;
				height: 90rpx;

				.container {
					display: flex;
					align-items: center;
					width: 100%;
					height: 100%;
					border-bottom: 1rpx solid #e5e5e5;

					input {
						flex: 1;
						width: 100%;
						height: 100%;
						background: none;
						color: @color-333;
					}

					.iconfont {
						padding: 20rpx;
					}
				}
			}

			.account {
				display: flex;
				align-items: center;
				width: 100%;
				height: 90rpx;

				input {
					width: 100%;
					height: 100%;
					background: none;
					border-bottom: 1rpx solid #e5e5e5;
					color: @color-333;
				}
			}

			.phone-code {
				display: flex;
				align-items: center;
				width: 100%;
				height: 90rpx;

				.container {
					display: flex;
					align-items: center;
					width: 100%;
					height: 100%;
					border-bottom: 1rpx solid #e5e5e5;

					input {
						flex: 1;
						width: 100%;
						height: 100%;
						background: none;
						color: @color-333;
					}
				}
			}

			.password {
				display: flex;
				align-items: center;
				width: 100%;
				height: 90rpx;

				.container {
					display: flex;
					align-items: center;
					width: 100%;
					height: 100%;
					border-bottom: 1rpx solid #e5e5e5;

					input {
						width: 100%;
						height: 100%;
						background: none;
						color: @color-333;
					}

					.iconfont {
						padding: 20rpx;
					}
				}
			}

			.again-password {
				display: flex;
				align-items: center;
				width: 100%;
				height: 90rpx;

				.container {
					display: flex;
					align-items: center;
					width: 100%;
					height: 100%;
					border-bottom: 1rpx solid #e5e5e5;

					input {
						width: 100%;
						height: 100%;
						background: none;
						color: @color-333;
					}

					.iconfont {
						padding: 20rpx;
					}
				}
			}
		}

		.register-btn {
			color: @white-color;
			font-size: 30rpx;
			margin: 0 auto;
			margin-top: 57rpx;
			width: 291rpx;
			height: 84rpx;
			line-height: 84rpx;
			text-align: center;
			// background: rgba(244, 163, 56, 1);
			border-radius: 42rpx;
			border: none;
			background: #374e80;
		}

		.user-agreement {
			display: flex;
			padding-left: 76rpx;
			align-items: center;
			padding-top: 30rpx;
		}

		.login {
			display: flex;
			justify-content: flex-end;
			margin-top: 20rpx;
			padding-right: 91rpx;
		}

		.Business {
			display: flex;
			justify-content: space-between;
			margin: 0 30rpx;
			height: 182rpx;
			align-items: center;
			border-bottom: 1rpx solid #e5e5e5;

			.left {
				h3 {
					font-size: 32rpx;
					margin-bottom: 13rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, 1);
				}

				h6 {
					font-size: 24rpx;
					color: #999999;
				}
			}

			.right {
				img {
					width: 132rpx;
					height: 132rpx;
					// width: 100%;
				}
			}
		}
	}
</style>
