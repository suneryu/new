<template>
	<view class="login-password">

		<view class="logo">
			<!-- <image :src="logoImg" mode="aspectFit"></image> -->
			<image :src="logoImg" mode="aspectFit"></image>
		</view>
		<view class="input-container">
			<view class="account">
				<view class="iconfont icon-shouji"></view>
				<view class="container">
					<input class="account-input" type="number" maxlength="11" v-model="inputUserPhone" placeholder="请输入手机号" />
					<!-- <view class="code" v-bind:style="{ color: baseColor }" v-if="codeTxt == '获取本地手机号'" @click="getPhoneCode">
						 {{ codeTxt }} -->
					<button type="default" open-type="getPhoneNumber" :disabled="btnSwitch" @getphonenumber="getPhoneNumber">
						获取本地手机号
					</button>
				</view>
				<!-- <view class="code" v-bind:style="{ color: baseColor }" v-else>{{ codeTxt }}</view> -->
			</view>
			<view class="phone-code">
				<view class="iconfont icon-yanzhengma"></view>
				<view class="container">
					<input placeholder="请输入验证码" v-model="phoneCode" type="number" maxlength="6" />
					<view class="code" v-bind:style="{ color: baseColor }" v-if="codeTxt == '获取验证码'" @click="getPhoneCode">{{ codeTxt }}</view>
					<view class="code" v-bind:style="{ color: baseColor }" v-else>{{ codeTxt }}</view>
				</view>
			</view>
		</view>

		<button type="default" class="login-btn" v-bind:style="{ backgroundColor: baseColor }" @click="login">登录</button>
		<view class="register-btn" @click="register">新用户注册</view>
		<!-- <view class="register-btn" @click="comBind">企业账号绑定</view> -->
		<view style="margin-right: 80rpx;">
			<view class="forget-password-btn" @click="loginPassword">账号密码登录</view>
		</view>
		<view class="user-agreement">
			<view @click="chooseAgreement" class="iconfont" :class="{ 'icon-weixuanzhongkuang': !userAgreementSwitch, 'icon-xuanzhongkuang': userAgreementSwitch }"
			 v-bind:style="{ color: baseColor }"></view>
			<view>
				<text>登录即代表同意</text>
				<view class="agreement-link" v-bind:style="{ color: baseColor }" @click="userAgreement">服务协议</view>
				<text>和</text>
				<view class="agreement-link" v-bind:style="{ color: baseColor }" @click="userPrivacy">隐私政策</view>
				<text>对我的个人信息进行收集和使用</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		$storage,
		$router
	} from '@/utils/prototype/vue.js';
	import {
		warrantyLoginIn,
		getTopPerMenuListFPc,
		changePhone,
		savePhone,
		loginOrChoice
	} from '@/api/interface.js';
	// import { phoneValidation } from '../../libs/util/formatPhone.js';
	export default {
		props: {
			propRedirectUrl: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				logoImg: this.$imgDomain + '/paas/shop/2020063000000001/2021-03-29/5a4dd4f98cf7478ca522cf443e60e1ab.png',
				baseColor: '',
				userPhone: '',
				redirectUrl: this.propRedirectUrl,
				inputUserPhone: '',
				phoneCode: '',
				codeTxt: '获取验证码',
				userAgreementSwitch: true,
				btnSwitch: true,
				code: '',
				userOpenid: "",
				indexGotoUrl: '',
			};
		},
		onLoad(options) {
			if (options.userOpenid) {
				this.userOpenid = options.userOpenid
			}
			this.indexGotoUrl = options.indexGotoUrl || $storage.get('gotoUrl');
		},
		watch: {
			propRedirectUrl(newValue, oldValue) {
				this.redirectUrl = newValue;
			}
		},
		mounted() {
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			let that = this;
			// #ifdef
			wx.login({
				success(response) {
					that.code = response.code;
					that.btnSwitch = false;
				}
			});
			// #ifndef
		},
		methods: {
			/**
			 * 勾选协议和政策
			 */
			chooseAgreement() {
				this.userAgreementSwitch = !this.userAgreementSwitch;
			},
			/**
			 * 获取手机验证码
			 */
			getPhoneCode() {
				if (!this.$qj.phoneValidation(this.userPhone || this.inputUserPhone)) {
					return;
				}
				this.codeTxt = '验证码发送中...'
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
								this.codeTxt = time-- + 's重新获取';
								this.pass = false;
								if (time < 0) {
									clearInterval(set);
									this.pass = true;
									this.codeTxt = '获取验证码';
								}
							}, 1000);
						}else{
							this.$qj.message.alert('验证码发送失败');
							this.codeTxt = '获取验证码';
						}
					});
			},
			// 前往用户注册
			register() {
				let options = {
					url: 'register/b2bRegister',
					query: {
						redirectUrl: this.redirectUrl,
						pageState: 2
					}
				};
				this.redirectTo(options);
			},
			// 企业账号绑定 
			comBind(){ 
				let options = {
					url: 'bindCom/pages/bindRegister',
					query: {
						redirectUrl: this.redirectUrl,
						// pageState: 2
					}
				};
				this.redirectTo(options);
			},
			// 点击登录按钮
			login() {
				if (!this.$qj.phoneValidation(this.inputUserPhone)) {
					return;
				}
				if (!this.phoneCode.trim()) {
					this.$qj.message.alert('请输入验证码');
					return;
				}
				if (!this.userAgreementSwitch) {
					this.$qj.message.alert('请同意协议');
					return;
				}
				// this.userChoicePopup = true;
				this.$qj.message.loading();
				this.$qj
					.http(this.$qj.domain)
					.get(loginOrChoice, {
						userinfoConPhone: this.inputUserPhone,
						code: this.phoneCode,
						userOpenid: this.$qj.storage.get('userOpenid') || this.userOpenid
					})
					.then(res => {
						//定义that下面也没有使用
						let that = this
						if (res.success) {
							
						    if (res.dataObj.userInfo) {
								let loginInfor = JSON.parse(res.dataObj.userInfo);
								this.$qj.storage.set('loginInfor', loginInfor);
								this.$qj.storage.set('userId', loginInfor.userId);
								this.$qj.storage.set('sessionid', loginInfor.ticketTokenid);
								let miniToken = this.$qj.storage.get('miniToken');
								let cookie = loginInfor.ticketTokenid;
								let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$qj.domain.substring(8) + '; Path=/';
								this.$qj.storage.set('miniUserName', miniCookie);

								getApp().globalData.isShowingLoginModal = false
								this.$qj.storage.set('nologin', '')
							}
						    if (res.dataObj.loginState == '-1') {
								uni.showModal({
									title: '提示',
									content: '您还不是我们的会员，请先完成注册！',
									confirmColor: '#' + this.$qj.storage.get('baseColor'),
									success(res) {
										let pages = getCurrentPages()
										if (res.confirm) {
											let currentPage = pages[pages.length - 1]
											let redirectUrl = currentPage.route.replace('pages/', '').replace('/main', '')
											that.$qj.router.push('register/b2bRegister')
										} else if (res.cancel) {
											if (pages.length > 1) {
												that.$qj.router.back()
											}
										}
									}
								})
							}else{
								this.setLoginAfterRouter();
							}
						}
						else {
							this.$qj.message.alert(res.msg);
						}
					});
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
								that.code = loginRes.code;
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
							code: this.code,
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
									this.$qj.storage.set('loginInfor', loginInfor);
									this.$qj.storage.set('userId', loginInfor.userId);
									this.$qj.storage.set('sessionid', loginInfor.ticketTokenid);
									let miniToken = this.$qj.storage.get('miniToken');
									let cookie = loginInfor.ticketTokenid;
									let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$qj.domain.substring(8) + '; Path=/';
									this.$qj.storage.set('miniUserName', miniCookie);

								} else {
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

			// 设置登录后路由
			setLoginAfterRouter() {
				this.$qj
					.http(this.$qj.domain)
					.get(getTopPerMenuListFPc)
					.then(res => {
						if (res) {
							this.$qj.storage.set('getTopPerMenuList', res.menuList);
							this.$qj.storage.set('footerMenu', res.menuList.filter(v => v.menuShow === 0));
							let options = {
								url: this.indexGotoUrl || 'homepage',
								query: {
									defaultUrl: this.redirectUrl,
									
								}
							};
							this.redirectTo(options);
						}
					});
			},
			// 切换密码登录
			loginPassword() {
				let options = {
					url: 'login/loginPassword',
					query: {
						userOpenid: this.userOpenid,
						indexGotoUrl:this.indexGotoUrl
					}
				};
				// this.navigateTo(options);
				this.redirectTo(options);
			},
			userAgreement() {
				let options = {
					url: 'hdb/personCenter/userAgreement',
					query: {
						agreementType: 'xieyi'
					}
				};
				this.navigateTo(options);
			},
			userPrivacy() {
				let options = {
					url: 'hdb/personCenter/userAgreement',
					query: {
						agreementType: 'yinsi'
					}
				};
				this.navigateTo(options);
			},

			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},
			redirectTo(options) {
				this.$qj.router.replace(options.url, options.query ? options.query : '');
			},
			navigateBack() {
				this.$qj.router.back();
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '@/common/css/common.less';

	.login-password {
		width: 100%;
		height: 100%;
		background-color: @white-color;

		.register-btn {
			color: #2fa9ff;
			font-size: 26rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			padding-top: 15rpx;
			padding-right: 20rpx;
		}

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

		.input-container {
			margin: 0 auto;
			width: 591rpx;
			margin-top: 140rpx;
			font-size: 26rpx;

			.iconfont {
				color: #cccccc;
				padding-right: 20rpx;
			}

			.account {
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
				}

				input {
					width: 100%;
					height: 100%;
					background: none;
					border-bottom: 1rpx solid #e5e5e5;
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

					.code {
						color: #374e80;
					}
				}
			}

			.password {
				margin-top: 20rpx;
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
						flex: 1;
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

		.login-btn {
			color: @white-color;
			font-size: 30rpx;
			margin: 0 auto;
			margin-top: 77rpx;
			width: 591rpx;
			height: 84rpx;
			line-height: 84rpx;
			text-align: center;
			background: #374e80;
			border-radius: 42rpx;
			border: none;
		}

		.forget-password-btn {
			margin-top: 12rpx;
			font-size: 24rpx;
			color: @color-999;
			display: flex;
			width: 100%;
			justify-content: flex-end;
			// padding-right: 86rpx;
		}

		.login-agreement {
			margin-top: 66rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 24rpx;
			color: #b3b3b3;


		}

		.user-agreement {
			display: flex;
			padding-left: 76rpx;
			align-items: center;
			padding-top: 60rpx;

			.agreement-link {
				display: inline-block;
				color: #374e80;
			}
		}
	}
</style>
