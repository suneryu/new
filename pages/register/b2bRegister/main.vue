<template>
	<view class="b2b-register">
		<view class="logo">
			<!-- <image :src="logoImg" mode="aspectFit"></image> -->
			<image :src="logoImg" mode="aspectFit"></image>
		</view>

		<view class="input-container">
			<view class="account">
				<view class="iconfont icon-shouji"></view>
				<view class="getPhoneClass">
					<input class="account-input" type="number" maxlength="11" v-model="inputUserPhone" placeholder="请输入手机号" />
					<button type="default" v-bind:style="{ color: baseColor }" open-type="getPhoneNumber" :disabled="btnSwitch" @getphonenumber="getPhoneNumber">
						获取本地手机号
					</button>
				</view>
				
			</view>
			<view class="phone-code">
				<view class="iconfont icon-yanzhengma"></view>
				<view class="container">
					<input placeholder="请输入验证码" v-model="phoneCode" type="number" maxlength="6" />
					<view class="code getCodeBtn" v-bind:style="{ color: baseColor }" v-if="code == '获取验证码'" @click="getPhoneCode">{{ code }}</view>
					<view class="code" v-bind:style="{ color: baseColor }" v-else>{{ code }}</view>
				</view>
			</view>
			<view class="password">
				<view class="iconfont icon-mima"></view>
				<view class="container">
					<input class="password-input" type="text" :password="passwordSwitch" v-model="userPassword" placeholder="请设置登录密码" />
					<view :class="{ iconfont: true, 'icon-bukejian': passwordSwitch, 'icon-1': !passwordSwitch }" @click="pwdSwitch"></view>
				</view>
			</view>
			<!-- 企业名称 -->
			<view class="company-or-personal">
				<view class="iconfont icon-city"></view>
				<input class="company-personal-input" type="text" v-model="userinfoCompname" placeholder="请输入企业名称" />
			</view>
			<view class="company-or-personal">
				<view class="iconfont icon-name-10"></view>
				<input class="company-personal-input" type="text" v-model="userinfoCorp" placeholder="请输入真实姓名" />
			</view>

		</view>
		<view class="user-agreement">
			<view @click="chooseAgreement" class="iconfont" :class="{ 'icon-weixuanzhongkuang': !userAgreementSwitch, 'icon-xuanzhongkuang': userAgreementSwitch }"
			 v-bind:style="{ color: baseColor }"></view>
			<text>已阅读并同意</text>
			<view class="agreement-link" v-bind:style="{ color: baseColor }" @click="userAgreement">用户协议</view>
			<text>和</text>
			<view class="agreement-link" v-bind:style="{ color: baseColor }" @click="userPrivacy">隐私政策</view>
		</view>
		<button type="default" class="register-btn" v-bind:style="{ backgroundColor: baseColor }" @click="register">注册</button>
		<view class="login">
			已有账号？
			<text @click="login" v-bind:style="{ color: baseColor }">去登录</text>
		</view>

		<!-- <u-picker mode="selector" v-model="distributorPicker" :default-selector="[0]" :range="distributorArray" range-key="qtypeQtypeName"
		 @confirm="distributorPickerConfirm"></u-picker>

		<u-picker mode="selector" v-model="channelPicker" :default-selector="[0]" :range="channelArray" range-key="channelName"
		 @confirm="channelPickerConfirm"></u-picker> -->
		<!-- <u-picker mode="region" v-model="cityPicker" :area-code="['11', '1101', '110101']" @confirm="cityPickerConfirm"></u-picker> -->
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
		saveUserDealerByWechat,
		savePhone
	} from '@/api/interface.js';
	import http from '@/api/http.js';
	export default {

		data() {
			return {
				// userPhone: '',
				// 页面状态
				// 从审核失败页面或者授权手机号页面：1
				// 从账号密码登录界面：2
				pageState: 0,
				// 上次注册填写的信息
				registerParams: {},
				// pageState: this.propPageState,
				// 新add
				// registerParams: this.propRegisterParams,
				logoImg: this.$imgDomain + '/paas/shop/2020063000000001/2021-03-29/5a4dd4f98cf7478ca522cf443e60e1ab.png',
				userType: 1,
				userAgreementSwitch: true,
				code: '获取验证码',
				baseColor: '',
				// distributor: '',
				// distributorCode: '',
				// channel: '',
				// channelCode: '',
				userName: '',
				userinfoCorp: '',
				userinfoCompname: '',
				// city: '',
				userPhone: '',
				phoneCode: '',
				passwordSwitch: true,
				userPassword: '',
				// userAgainPassword: '',
				userAgreementSwitch: true,
				// distributorPicker: false,
				// channelPicker: false,
				// distributorArray: [],
				// channelArray: [],
				// cityPicker: false,
				// provinceCode: '',
				// cityCode: '',
				// areaCode: '',
				// provinceName: '',
				// cityName: '',
				// areaName: '',
				userInfoCode: '',
				inputUserPhone: '',
				jscode:''
			};
		},
		onLoad(options) {
			this.userPhone = options.userPhone;
			this.pageState = options.pageState ? options.pageState : 0;
			if (options.registerParams) this.registerParams = JSON.parse(options.registerParams);
			if (this.registerParams != {}) {
				this.userType = this.registerParams.userinfoType;
				// this.distributor = this.registerParams.qualityQtypeName;
				// this.distributorCode = this.registerParams.qualityQtypeCode;
				// this.channel = this.registerParams.userinfoDischannelname;
				// this.channelCode = this.registerParams.userinfoDischannelcode;
				this.userinfoCorp = this.registerParams.userinfoCorp || this.registerParams.userName;
				this.userinfoCompname = this.registerParams.userinfoCompname;

				this.userInfoCode = this.registerParams.userinfoCode;
			}
		},
		onShow() {},
		mounted() {
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			let that = this;
						// #ifdef
						wx.login({
							success(response) {
								that.jscode = response.code;
								
							}
						});
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
			 * 地址选择器回调方法
			 */
			// cityPickerConfirm(params) {
			// 	this.city = params.province.label + params.city.label + params.area.label;
			// 	this.provinceCode = params.province.value;
			// 	this.cityCode = params.city.value;
			// 	this.areaCode = params.area.value;
			// 	this.provinceName = params.province.label;
			// 	this.cityName = params.city.label;
			// 	this.areaName = params.area.label;
			// },

			/**
			 * 获取手机验证码
			 */
			getPhoneCode() {
				if (!this.$qj.phoneValidation(this.userPhone || this.inputUserPhone)) {
					return;
				}
				this.$qj
					.http(this.$qj.domain)
					.post(changePhone.sendPhone, {
						userPhone: this.userPhone || this.inputUserPhone
					})
					.then(res => {
						if (res && res.success) {
							this.$qj.message.alert('验证码发送成功');
							let time = 60;
							const set = setInterval(() => {
								this.code = time-- + 's重新获取';
								this.pass = false;
								if (time < 0) {
									clearInterval(set);
									this.pass = true;
									this.code = '获取验证码';
								}
							}, 1000);
						}
					});
			},

			/**
			 * 密码是否可见控制开关
			 */
			pwdSwitch() {
				this.passwordSwitch = !this.passwordSwitch;
			},

			/**
			 * 勾选协议和政策
			 */
			chooseAgreement() {
				this.userAgreementSwitch = !this.userAgreementSwitch;
			},

			/**
			 * 跳转用户协议
			 */
			userAgreement() {
				let options = {
					url: 'hdb/personCenter/userAgreement',
					query: {
						agreementType: 'xieyi'
					}
				};
				this.navigateTo(options);
			},

			/**
			 * 跳转隐私政策
			 */
			userPrivacy() {
				let options = {
					url: 'hdb/personCenter/userAgreement',
					query: {
						agreementType: 'yinsi'
					}
				};
				this.navigateTo(options);
			},
			/**
			 * 注册按钮
			 */
			register() {
				if (!this.userinfoCorp) {
					this.$qj.message.alert('请输入真实姓名');
					return;
				}
				if (!this.$qj.phoneValidation(this.userPhone || this.inputUserPhone)) {
					return;
				}
				if (!this.phoneCode) {
					this.$qj.message.alert('请输入验证码');
					return;
				}

				if (!this.userPassword) {
					this.$qj.message.alert('请输入密码');
					return;
				}
				
				if (!this.userAgreementSwitch) {
					this.$qj.message.alert('您未同意用户协议和隐私政策');
					return;
				}
				//  注册接口
				let params = {
					// 个人名称
					userinfoCorp: this.userinfoCorp,
					userName: this.userinfoCorp,
					// 公司名称
					userinfoCompname: this.userinfoCompname,
					// 公司或者个人type
					userinfoType: this.userType,
					// provinceCode: this.provinceCode + '0000',
					// cityCode: this.cityCode + '00',
					// areaCode: this.areaCode,
					// provinceName: this.provinceName,
					// cityName: this.cityName,
					// areaName: this.areaName,
					userPwsswd: this.userPassword,
					userPhone: this.userPhone || this.inputUserPhone,
					userinfoOcode: '1' ,
					userOpenid: this.$qj.storage.get('userOpenid')
				};
				if (this.userInfoCode) {
					params.userinfoCode = this.userInfoCode;
				}
				let httpUrl = [saveUserDealerByQuality, saveDealerUserinfoapply, saveUserDealerByQuality];

				let paramsArr = [{
						userinfoJosn: JSON.stringify(params),
						code: this.phoneCode

					},
					{
						paramStr: JSON.stringify(params),
						code: this.phoneCode
					},
					{
						userinfoJosn: JSON.stringify(params),
						code: this.phoneCode
					}
				];
				
				http
					// .get(httpUrl[0], paramsArr[0])saveUserDealer
					.get(saveUserDealerByWechat, paramsArr[0])
					.then(res => {
						// if (res.success && res.dataObj) {
						if (res.success) {
							// if (this.pageState == 0 || this.pageState == 2) {
							let options = {
								url: 'register/b2bRegisterSuccess',
								query: {
									userPhone: this.userPhone || this.inputUserPhone
								}
							};
							this.redirectTo(options);
							// } else {
							// this.navigateBack();
							// }
						} else {
							this.$qj.message.alert(res.msg);
						}
					});
			},

			/**
			 * 跳转登录
			 */
			login() {
				let options = {
					url: 'login/loginPassword',
					query: {
						redirectUrl: this.redirectUrl
					}
				}
				this.redirectTo(options);
			},
			// 微信获取手机号回调
			getPhoneNumber(e) {
				let that = this;
				wx.checkSession({
					success() {
						console.log('未过期');
						that.phoneDataHandle(e.detail);
					},
					fail() {
						console.log('已过期');
						wx.login({
							success(loginRes) {
								that.jscode = loginRes.code;
								that.phoneDataHandle(e.detail);
							}
						});
					}
				});
				console.log(e);
			},

			phoneDataHandle(phoneData) {
				if (phoneData.errMsg == 'getPhoneNumber:ok') {
					let encryptedData = phoneData.encryptedData;
					let iv = phoneData.iv;
					this.$qj
						.http(this.$qj.domain)
						.get(savePhone, {
							code: this.jscode,
							encryptedData: encryptedData,
							iv: iv,
							userOpenid: this.$qj.storage.get('userOpenid') || this.userOpenid
						})
						.then(res => {
							if (res && res.success) {
								this.inputUserPhone = res.dataObj.userPhone
								if (res.dataObj.userInfo) {
									// this.$qj.message.alert('绑定成功！');
									let loginInfor = JSON.parse(res.dataObj.userInfo);
									// if (loginInfor.dataState == 0) {
									this.$qj.storage.set('loginInfor', loginInfor);
									this.$qj.storage.set('userId', loginInfor.userId);
									this.$qj.storage.set('sessionid', loginInfor.ticketTokenid);
									let miniToken = this.$qj.storage.get('miniToken');
									let cookie = loginInfor.ticketTokenid;
									let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$qj.domain.substring(8) + '; Path=/';
									this.$qj.storage.set('miniUserName', miniCookie);
									// this.setLoginAfterRouter();
									// } else {
									// 	var options = {
									// 		url: 'register/b2bRegisterCheck',
									// 		query: {
									// 			userPhone: res.dataObj.userPhone,
									// 			redirectUrl: this.redirectUrl
									// 		}
									// 	};
									// 	this.redirectTo(options);
								} else {
									// var options = {
									// 	url: 'register/b2bRegister',
									// 	query: {
									// 		userPhone: res.dataObj.userPhone,
									// 		pageState: 0
									// 	}
									// };
									// this.redirectTo(options);
									this.inputUserPhone = res.dataObj.userPhone
								}
							} else if (!res.success) {
								this.$qj.message.alert(res.msg);
							}
						});
				} else if (phoneData.errMsg == 'getPhoneNumber:fail user deny') {
					// let options = {
					// 	url: 'my/bindPhone',
					// 	query: {
					// 		redirectUrl: this.redirectUrl
					// 	}
					// };
					// this.redirectTo(options);
				}
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

		.logo {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 36rpx;

			image {
				width: 201rpx;
				height: 166rpx;
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
				// border-bottom:1px solid #e5e5e5;
                 .getPhoneClass{
					     width: 100%;
					     display: flex;
					     border-bottom: 1px solid #e5e5e5;
					 
				 }
				input {
					width: 100%;
					height: 100%;
					background: none;
					// border-bottom: 1rpx solid #e5e5e5;
					color: @color-333;
				}
				button {
					font-size: 26rpx;
					border: none;
					width: 160px;
					background-color: #fff;
					color: #374e80;
					padding: 0;
					margin: 0;
					line-height: 1;
					text-align: right;
				}
				
				button::after {
					border: none;
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
					.getCodeBtn{
						color: #374e80;
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
			width: 591rpx;
			height: 84rpx;
			line-height: 84rpx;
			text-align: center;
			// background: rgba(244, 163, 56, 1);
			background: #374e80;
			border-radius: 42rpx;
			border: none;
		}

		.user-agreement {
			display: flex;
			padding-left: 76rpx;
			align-items: center;
			padding-top: 30rpx;
		}
		.agreement-link{
			color: #374e80;
		}

		.login {
			display: flex;
			justify-content: flex-end;
			margin-top: 20rpx;
			padding-right: 91rpx;
		}

		
	}
</style>
