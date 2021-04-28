<template>
	<view>
		<!-- <qj-mini-b2b-authorization
			@redirectTo="redirectTo"
			@navigateBack="navigateBack"
			@reLaunch="reLaunch"
			:propRedirectUrl="redirectUrl"
			:propInviteCode="inviteCode"
			:propIsInviteRegister="isInviteRegister"
			:propHtmlJson="htmlJson"
		></qj-mini-b2b-authorization> -->
		
		<view class="img-container"><image :src="imgUrl"></image></view>
		<view class="auth-prompt">
			<view>申请获得以下权限</view>
			<view>获取您的公开信息(昵称，头像等)</view>
		</view>
		<view class="auth-btn">
			<!-- #ifdef MP-WEIXIN -->
			<button :style="{ backgroundColor: '#' + baseColor }" @getuserinfo="bindGetUserInfo" open-type="getUserInfo">授权微信用户信息</button>
			<!-- #endif -->
			<!-- #ifdef MP-TOUTIAO -->
			<button :style="{ backgroundColor: '#' + baseColor }" @click="userAuth">授权获取用户信息</button>
			<!-- #endif -->
		
			<!-- #ifdef MP-ALIPAY -->
			<button open-type="getAuthorize" @getAuthorize="onGetAuthorize" @error="onAuthError" scope="userInfo" v-bind:style="{ backgroundColor: '#' + baseColor }">
				授权获取用户信息
			</button>
			<!-- #endif -->
			<button @click="cancel" type="default">取消</button>
		</view>
	</view>
</template>

<script>
	
import { getTopPerMenuListFPc, warrantyLogin } from '@/api/interface.js';
	
export default {
	props: {
		//
		// propRedirectUrl: {
		// 	type: String,
		// 	default: ''
		// },
		// 是否为邀请登录注册
		// propIsInviteRegister: {
		// 	type: Boolean,
		// 	default: false
		// },
		// propInviteCode: {
		// 	type: String,
		// 	default: ''
		// },
		// propHtmlJson: {
		// 	type: String,
		// 	default: ''
		// }
	},
	data() {
		return {
			redirectUrl: '',
			inviteCode: '',
			isInviteRegister: false,
			htmlJson: '',
			// 
			imgUrl: this.$qj.domain + '/paas/shop-master/c-static/images/wx/au.png',
			baseColor: this.$qj.storage.get('baseColor'),
			// redirectUrl: this.propRedirectUrl,
			// isInviteRegister: this.propIsInviteRegister,
			// inviteCode: this.propInviteCode,
			// 静态页跳转小程序传递的参数
			// htmlJson: this.propHtmlJson,
			// 商品详情静态页跳转登录需要回跳的路由
			skuCode: '',
			htmlPath: '',
			goodsDetailsUrl: ''
		};
	},
	onLoad(options) {
		this.redirectUrl = options.redirectUrl;
		this.isInviteRegister = options.isInviteRegister;
		this.inviteCode = options.code;
		this.htmlJson = options.json;
		console.log(this.htmlJson)
		
		if (this.htmlJson) {
			let json = JSON.parse(this.htmlJson);
			if (json.skuCode) this.skuCode = json.skuCode;
			if (json.path) this.htmlPath = json.path;
		}
		if (this.skuCode && this.htmlPath == 'goodsDetails') {
			this.goodsDetailsUrl = this.$qj.businessDomain + '/paas/shop/' + this.$qj.storage.get('hrefs') + this.skuCode + '.html';
		}
	},
	onShow() {},
	methods: {
		redirectTo(options) {
			this.$qj.router.replace(options.url, options.query ? options.query : '');
		},
		navigateBack() {
			this.$qj.router.back();
		},
		reLaunch(options) {
			this.$qj.router.reOpen(options.url, options.query ? options.query : '', { stay: 500 });
		},
		
		// =--------
		
		/**
		 * 获取服务提供商
		 * @param {Object} callback
		 */
		getProvider(callback) {
			uni.getProvider({
				service: 'oauth',
				success(res) {
					callback(res.provider[0]);
				}
			});
		},
		
		checkSetting() {
			return uni.getSetting();
		},
		
		// 服务端登录接口，前端将code传过去
		loginRequest(code, userInfo, encryptedData = '', iv = '') {
			this.$qj
				.http(this.$qj.domain)
				.get(warrantyLogin, {
					js_code: code,
					encryptedData: encryptedData,
					iv: iv
				})
				.then(res => {
					console.log(res);
					this.$qj.storage.set('userInfo', userInfo);
					this.$qj.storage.set('userOpenid', res.dataObj.userOpenid);
					switch (res.dataObj.register) {
						case 'true':
							if (this.inviteCode && this.isInviteRegister) {
								this.$emit('navigateBack');
							} else {
								let options = {
									url: 'authorizationPhone',
									query: {
										redirectUrl: this.redirectUrl || this.goodsDetailsUrl
									}
								};
								this.$emit('redirectTo', options);
							}
							break;
						case 'false':
							let loginInfor = JSON.parse(res.dataObj.userInfo);
							this.$qj.storage.set('loginInfor', loginInfor);
							this.$qj.storage.set('userId', loginInfor.userId);
							this.$qj.storage.set('sessionid', loginInfor.ticketTokenid);
							let miniToken = this.$qj.storage.get('miniToken');
							let cookie = loginInfor.ticketTokenid;
							let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$qj.domain.substring(8) + '; Path=/';
							this.$qj.storage.set('miniUserName', miniCookie);
							this.setLoginAfterRouter();
							break;
						case '2':
							let options = {
								url: 'login/loginPassword',
								query: {
									redirectUrl: this.redirectUrl || this.goodsDetailsUrl
								}
							};
							this.$emit('redirectTo', options);
							break;
						default:
							break;
					}
				});
		},
		
		setLoginAfterRouter() {
			this.$qj.http(this.$qj.domain).get(getTopPerMenuListFPc).then(res => {
				if (res) {
					this.$qj.storage.set('getTopPerMenuList', res.menuList);
					this.$qj.storage.set('footerMenu', res.menuList.filter(v => v.menuShow === 0));
					if (this.isInviteRegister && this.inviteCode) {
						let options = {
							url: 'mainindex'
						}
						this.$emit('reLaunch', options);
					} else if (this.goodsDetailsUrl) {
						let options = {
							url: 'web',
							query: {
								defaultUrl: this.goodsDetailsUrl
							}
						}
						this.$emit('redirectTo', options);
					} else {
						this.$emit('navigateBack')
					}
				}
			});
		},
		
		// 微信小程序授权登录逻辑
		bindGetUserInfo: function(e) {
			this.$qj.message.loading();
			let that = this;
			if (e.target.userInfo) {
				let userInfo = e.target.userInfo;
				wx.login({
					success(lo) {
						if (lo.code) {
							let loginCode = lo.code;
							that.$qj.storage.set('code', loginCode);
							wx.getUserProfile({
								// withCredentials: true,
								lang: 'zh_CN',
								success(res) {
									if (res.errMsg == 'getUserInfo:ok') {
										let encryptedData = res.encryptedData;
										let iv = res.iv;
										that.loginRequest(loginCode, userInfo, encryptedData, iv);
									}
								}
							});
						} else {
							that.$qj.message.alert('登录失败');
						}
					}
				});
			} else {
				that.$qj.message.alert('授权失败');
			}
		},
		
		onGetAuthorize() {
			$message.loading();
			my.getOpenUserInfo({
				fail: res => {},
				success: res => {
					let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
					console.log(userInfo);
					my.getAuthCode({
						scopes: 'auth_user',
						success: res => {
							if (res.authCode) {
								this.loginRequest(res.authCode, userInfo);
							}
						}
					});
				}
			});
		},
		
		onAuthError() {
			$message.alert('用户拒绝授权');
		},
		
		userAuth() {
			$message.loading();
			this.getProvider(provider => {
				let _this = this;
				console.log(provider);
				uni.login({
					provider: provider,
					scopes: 'auth_user',
					success(res) {
						console.log(res);
						let code = res.code;
						uni.getUserInfo({
							provider: provider,
							lang: 'zh_CN',
							success(res) {
								_this.loginRequest(code, res.userInfo);
								console.log(res);
							}
						});
					}
				});
			});
		},
		
		cancel() {
			// 从首页静态页到商品详情静态页，授权登录，此时页面栈里只剩授权登录页面。
			if (getCurrentPages().length > 1) {
				this.$emit('navigateBack');
			} else {
				let options = {
					url: 'mainindex'
				};
				this.$emit('redirectTo', options);
			}
		}
	},
	mounted() {},
	watch: {
		// propRedirectUrl(newValue, oldValue) {
		// 	this.redirectUrl = newValue;
		// },
		// propIsInviteRegister(newValue, oldValue) {
		// 	this.isInviteRegister = newValue;
		// },
		// propInviteCode(newValue, oldValue) {
		// 	this.inviteCode = newValue;
		// },
		// propHtmlJson(newValue, oldValue) {
		// 	this.htmlJson = newValue;
		// 	if (this.htmlJson) {
		// 		let json = JSON.parse(this.htmlJson);
		// 		if (json.skuCode) this.skuCode = json.skuCode;
		// 		if (json.path) this.htmlPath = json.path;
		// 	}
		// 	if (this.skuCode && this.htmlPath == 'goodsDetails') {
		// 		this.goodsDetailsUrl = this.$qj.businessDomain + '/paas/shop/' + this.$qj.storage.get('hrefs') + this.skuCode + '.html';
		// 	}
		// }
	},
};
</script>

<style lang="less" scoped>
	@import '@/common/css/common.less';
	.img-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	
	.auth-box {
		background: #fff;
		position: fixed;
		height: 100%;
		width: 100%;
	
		.auth-prompt {
			text-align: center;
	
			view {
				&:first-child {
					font-size: 32rpx;
					color: #333;
				}
	
				&:last-child {
					font-size: 26rpx;
					color: #999;
					margin-top: 6rpx;
				}
			}
		}
	
		.auth-btn {
			margin-top: 60rpx;
	
			button {
				font-size: 36rpx;
				width: 90%;
				margin: 20rpx 5%;
	
				&::after {
					border: none;
				}
	
				&:last-child {
					color: #999;
				}
	
				&:first-child {
					color: #fff;
				}
			}
		}
	}
</style>
