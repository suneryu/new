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
		loginOrChoice,
		loginOrSell
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
				subscribeMes:true
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
						}
					});
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
					.get(loginOrSell, {
						userinfoConPhone: this.inputUserPhone,
						code: this.phoneCode,
						userOpenid: this.$qj.storage.get('userOpenid') || this.userOpenid
					})
					.then(res => {
						//定义that下面也没有使用
						console.log('销售员手机验证码登录，，，，',res)
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
							
						}
						else {
							this.$qj.message.alert(res.msg);
							return;
						}
					});
					this.messageSubscription()
					//跳转到销售员首页
			},
			messageSubscription(){
				const that = this;
				// if (compareVersion(global.globalData.SDKVersion, "2.8.2") >= 0) {
				wx.requestSubscribeMessage({
					tmplIds: ["c1kKxRSrGSb_qx0KDOeCBceWS0qPKh0vhWHl8PlEJwQ"], //需要订阅的消息模板的id的集合，一次调用最多可订阅3条消息
					// 消息模板id在[微信公众平台(mp.weixin.qq.com)-功能-订阅消息]中配置
					success(res) { // 接口调用成功的回调函数
						if (
							res["c1kKxRSrGSb_qx0KDOeCBceWS0qPKh0vhWHl8PlEJwQ"] == "accept"
							// Object res   [TEMPLATE_ID]是动态的键，即模板id，值包括'accept'、'reject'、'ban'。
							// 'accept'表示用户同意订阅该条id对应的模板消息，'reject'表示用户拒绝订阅该条id对应的模板消息，'ban'表示已被后台封禁。
						) {
							if (that.subscribeMes) {
								console.log("订阅成功")
								wx.showToast({
									title: "订阅成功！",
									duration: 1500,
									icon: "success",
									success(data) {
										that.subscribeMes = false;
									}
								});
								 let options = {
								 	url: 'salesEnd/pages/salesFrontPage'
								 };
								 that.redirectTo(options);
					
							}
							
						} else {
							console.log("失败")
							 let options = {
							 	url: 'salesEnd/pages/salesFrontPage'
							 };
							 that.redirectTo(options);
						}
					},
					fail(res) { // 接口调用失败的回调函数
					console.log('模板调用失败',res)
						if (res.errCode === 20004) {
							wx.showModal({
								title: "温馨提示",
								content: "您已拒绝授权，将无法在微信中收到回复通知！",
								showCancel: false,
								success: res => {
									if (res.confirm) {
										let options = {
											url: 'salesEnd/pages/salesFrontPage'
										};
										that.redirectTo(options);
									}
								}
							});
						}
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
					url: 'salesEnd/pages/salesLoginPassword',
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
