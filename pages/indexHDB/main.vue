<template>
	<div class="contact">
		<image :src="checkImgUrl('/paas/shop/2020063000000001/2021-03-25/769ae77fd87d4cd1b8dd0f72f31fbcfd.jpg')" style="width: 100%;height: 100%;z-index: -1;position: fixed;"></image>
		<!-- <div :style="{background: 'url('+imageURL+')';backgroundSize:100%}" class="contact"> -->
		<image class="logoImg" :src="logoImg" mode="widthFix"></image>
		<div class="index_info">
			<div class="index_content">
				<div class="listLeft">
					<div class="listItem height-220" @click="gotoComInfo">
						<image class="imageItem" :src="infoImg" mode="widthFix"></image>
						<div class="margTop-20">企业信息</div>
					</div>
					<div class="listItem height-300 margTop-34 padding-30" style="position: relative;"  @click="gotoOnChat">

						<image class="imageshop" :src="checkImgUrl('/paas/shop/2020063000000001/2021-03-25/5f2eb1e2d642418f9361ad1a2f1be46f.png')"
						 mode="widthFix"></image>
						<div class="margTop-70">在线客服</div>
						<button open-type="contact" class="detail--purchase--warp--kfBtn onlineBtn" v-if="showOnlineBtn"></button>
						<!-- <button  class="detail--purchase--warp--kfBtn onlineBtn" v-if="!showOnlineBtn"></button> -->
					</div>
					<div class="listItem height-220 margTop-34" @click="gotoSales">
						<image class="imageXs" :src="salesImg" mode="widthFix"></image>
						<div class="margTop-20">销售端</div>
					</div>
				</div>
				<div class="listLeft">
					<div class="listItem height-300 padding-30" @click="goShopOnline">
						<image class="imageshop" :src="checkImgUrl('/paas/shop/2020063000000001/2021-03-25/d232bc9805884452a67106141120a819.png')"
						 mode="widthFix"></image>
						<div class="margTop-70">线上商城</div>
					</div>
					<div class="listItem height-220 margTop-34" @click="gotoProblem">
						<image class="imageItem" :src="FAQImg" mode="widthFix"></image>
						<div class="margTop-20">常见问题</div>
					</div>
					<div class="listItem height-220 margTop-34" @click="gotoScopShop">
						<image class="imageItem" :src="checkImgUrl('/paas/shop/2020063000000001/2021-03-25/728f2dd8ba6c4d6e8a9df37ca7a51de0.png')"
						 mode="widthFix"></image>
						<div class="margTop-20">积分商城</div>
					</div>
				</div>

			</div>

		</div>

		<view class="popup" v-show="show">
			<view class="popup-info">
				<view class="popup-title">提示</view>
				<view class="popup-log">请先登录!</view>
				<view class="popup-btn">
					<!-- <view class="btn"><button  type="default" @tap="cancel">取消</button></view> -->
					<!-- <view class="btn"> -->

					<button style="border-right: 1rpx solid #e6e5e5;" @click="cancel" type="default">取消</button>
					<!-- <button style="color:#6184c3" type="default"  @getuserinfo="bindGetUserInfo" open-type="getUserInfo">授权登录</button> -->
					<button @getuserinfo="bindGetUserInfo" open-type="getUserInfo" @click="affirm">授权登录</button>

					<!-- </view> -->

				</view>
			</view>
		</view>

		<view class="popup" v-show="show1">
			<view class="popup-info">
				<view class="popup-title">提示</view>
				<view class="popup-log">请先登录!</view>
				<view class="popup-btn">
					<!-- <view class="btn"><button  type="default" @tap="cancel">取消</button></view> -->
					<!-- <view class="btn"> -->

					<button style="border-right: 1rpx solid #e6e5e5;" @click="cancel" type="default">取消</button>
					<!-- <button style="color:#6184c3" type="default"  @getuserinfo="bindGetUserInfo" open-type="getUserInfo">授权登录</button> -->
					<button @getuserinfo="bindGetUserInfo1" open-type="getUserInfo" @click="affirm1">授权登录</button>

					<!-- </view> -->

				</view>
			</view>
		</view>
	</div>


</template>

<script>
	import {
		checkImgUrl
	} from '@/utils/checkImg.js';
	import {
		$storage,
		$router
	} from '@/utils/prototype/vue.js';
	import http from '@/api/http.js';
	// import { getTopPerMenuListFPc, warrantyLogin } from '@/api/interface.js';
	import vueTabBar from '@/components/communal/vueTabBar';
	import {
		loginOut,
		getProappinfo,
		loginIn,
		getTopPerMenuList,
		getTopPerMenuListFPc,
		thirdLogin,
		loginMicroMessenger,
		loginMiniProgram,
		getPersonal,
		userapplyStateAndAuth,
		warrantyLogin,
		queryUserinfoPageBySales
	} from '@/api/interface.js';
	import {
		getUserservice
	} from '@/api/interfaceHDB.js';

	import {
		clearTimeout,
		setTimeout
	} from 'timers';

	export default {
		data() {
			return {
				logoImg: this.$imgDomain + '/paas/shop/2020063000000001/2021-03-29/5a4dd4f98cf7478ca522cf443e60e1ab.png',
				infoImg: this.$imgDomain + '/paas/shop/2020063000000001/2021-03-29/4921647b4c2c46feb551c3410c8a560c.png',
				salesImg: this.$imgDomain + '/paas/shop/2020063000000001/2021-03-29/24f7b406e6d64543b3331597bbb0ac2b.png',
				FAQImg: this.$imgDomain + '/paas/shop/2020063000000001/2021-03-29/d5513ea091364a52a00ee52990678999.png',
				temp: 0,
				checkImgUrl,
				show1:false,
				show: false,
				message: '',
				// 用户等级
				userLevel: '',

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
				goodsDetailsUrl: '',
				userOpenid: '',
				indexGotoUrl: '',
				checkModifyAudit: '',
				showOnlineBtn:false,
				salesLogin:'',
				userinfoType:''
				

			};
		},
		onLoad(options) {
			this.redirectUrl = options.redirectUrl;
			this.isInviteRegister = options.isInviteRegister;
			this.inviteCode = options.code;
			this.htmlJson = options.json;

			if (this.htmlJson) {
				let json = JSON.parse(this.htmlJson);
				if (json.skuCode) this.skuCode = json.skuCode;
				if (json.path) this.htmlPath = json.path;
			}
			if (this.skuCode && this.htmlPath == 'goodsDetails') {
				this.goodsDetailsUrl = this.$qj.businessDomain + '/paas/shop/' + this.$qj.storage.get('hrefs') + this.skuCode + '.html';
			}
		},

		onShow() {
		},
		created() {
			this.getAuthState()
			let that = this;
			if ($storage.get('nologin') === 'nologin') {
				console.log($storage.get('nologin'),'----------------')
					that.tapPopup();

				that.temp++; //记录第一次 登陆 不然一直弹出未登录  
			}
		},
		mounted() {
			
		},
		components: {
			vueTabBar
		},
		methods: {
			getuserInfo() {
				http.get(getUserservice, {
					userId: $storage.get('userId')
				}).then(res => {
					console.log('线上商城----',res)
					this.userinfoType = res.userinfoType;
				let info = this.$qj.storage.get('loginInfor')			
				info.userinfoType = this.userinfoType
				this.$qj.storage.set('loginInfor', info);
				});
			},

			// 弹窗
			tapPopup() {
				this.show = true;
			},
			// 弹窗1
			tapPopup1() {
				this.show1 = true;
			},
			// 我的客服
			gotoOnChat() {
				if (this.temp === 0 && $storage.get('nologin') === 'nologin') {
					this.tapPopup();
					this.showOnlineBtn = false
					return;
				}
				
				$storage.set('gotoUrl', "indexHDB")
				this.indexGotoUrl = "indexHDB"
				
				http.get(getPersonal, {
					//userId login sucess must exist 
					userId: this.$storage.get('userId')
				}).then(res => {
					if(res.errorCode == 'nologin'){
						this.tapPopup();
					}else if(res) {
						this.showOnlineBtn = true
					}
				});
			},
			// 常见问题
			gotoProblem() {
				if (this.temp === 0 && $storage.get('nologin') === 'nologin') {
					this.tapPopup();
					return;
				}
				$storage.set('gotoUrl', "hdb/personCenter/trouble")
				this.indexGotoUrl = "hdb/personCenter/trouble"
				http.get(getPersonal, {
					//userId login sucess must exist 
					userId: this.$storage.get('userId')
				}).then(res => {
					if(res.errorCode == 'nologin'){
						this.tapPopup();
					}else if(res) {
						let options2 = {
							url: 'hdb/personCenter/trouble',
						};
						this.redirectTo(options2);
					}
				});

			},
			// 点击弹窗取消
			cancel() {
				console.log('取消=-----')
				this.show = false;
				this.show1 = false;
				this.temp = 0;
				// 从首页静态页到商品详情静态页，授权登录，此时页面栈里只剩授权登录页面。
			},
			// 点击弹窗取消
			cancel1() {
				console.log('取消=-----')
				this.show = false;
				this.show1 = false;
				this.temp = 1;
				// 从首页静态页到商品详情静态页，授权登录，此时页面栈里只剩授权登录页面。
			},
			// 点击弹窗确认
			affirm() {
				this.show = false;
			},
			// 点击弹窗确认
			affirm1() {
				this.show1 = false;
			},
			// 销售
			gotoSales() {
				this.salesLogin = '1'
				if ($storage.get('nologin') === 'nologin') {
					this.tapPopup1();
					return;
				}
				$storage.set('gotoUrl', "indexHDB")
				this.indexGotoUrl = "indexHDB"
				http.get(getPersonal, {
					userId: this.$storage.get('userId')
				}).then(res => {
					console.log('销售端校验-----',res)
					if(res.errorCode == 'nologin'){
						this.tapPopup1();
					}else {
						if(res.userinfoQuality == 'sales'){
							//销售员首页
							let options2 = {
								url: 'salesEnd/pages/salesFrontPage',
							};
							this.redirectTo(options2);
						}else{
						uni.showModal({
								title: '提示',
								content: '您不是销售员资质，无法进入！',
								confirmColor: '#' + $storage.get('baseColor'),
								success(res) {
									let pages = getCurrentPages()
									if (res.confirm) {} else if (res.cancel) {
							
									}
								}
							})

						}
						
					}
				});
				
			},
			// 积分商城 TODO 接口
			gotoScopShop() {
				if (this.temp === 0 && $storage.get('nologin') === 'nologin') {
					this.tapPopup();
					return;
				}
				$storage.set('gotoUrl', "indexHDB")
				this.indexGotoUrl = "indexHDB"
				
				http.get(getPersonal, {
					userId: this.$storage.get('userId')
				}).then(res => {
					if(res.errorCode == 'nologin'){
						this.tapPopup();
					}else {
						uni.showModal({
							title: '提示',
							content: '积分商城暂未开放！',
							confirmColor: '#' + $storage.get('baseColor'),
							success(res) {
								let pages = getCurrentPages()
								if (res.confirm) {} else if (res.cancel) {
						
								}
							}
						})
					}
				});
				
			},
			goShopOnline() {
				if (this.temp === 0 && $storage.get('nologin') === 'nologin') {
					this.tapPopup();
					return;
				}

				$storage.set('gotoUrl', "homepage")
				this.indexGotoUrl = "homepage"
				http.get(getPersonal, {
					userId: this.$storage.get('userId')
				}).then(res => {
					console.log('点击进去线上商城',res)
					if(res.errorCode == 'nologin'){
						this.tapPopup();
					}else {
						if(res.userinfoQuality == "dealer"){
							//查询用户类型，set缓存
							this.getuserInfo()
							

							// userinfoType
							let options = {
								url: 'homepage'
							}
							this.redirectTo(options);
						}else{
							uni.showModal({
									title: '提示',
									content: '您不是用户资质，无法进入！',
									confirmColor: '#' + $storage.get('baseColor'),
									success(res) {
										let pages = getCurrentPages()
										if (res.confirm) {} else if (res.cancel) {
								
										}
									}
								})
						}
						
						
					}
				});
			},

			//点击企业信息 
			gotoComInfo() {
				let that = this
				if (this.temp === 0 && $storage.get('nologin') === 'nologin') {
					this.tapPopup();
					return;
				}

				let userPhone = this.$qj.storage.get('userPhone')
				$storage.set('gotoUrl', "register/companyInfo");
				this.indexGotoUrl = "register/companyInfo"
				http.get(getPersonal, {
					userId: this.$storage.get('userId')
				}).then(res => {
					if(res.errorCode == 'nologin'){
						this.tapPopup();
					}else{
						if(res.userinfoQuality == "dealer"){
							//查询用户类型，set缓存
							this.getuserInfo()
							let info = this.$qj.storage.get('loginInfor')
							info.userinfoType = this.userinfoType
							this.$qj.storage.set('loginInfor', info);
							console.log('22222222222--',this.checkModifyAudit)
							if (this.checkModifyAudit == '0') {
								let options = {
									url: 'register/b2bRegisterCheck',
									query: {
										userPhone: userPhone || this.inputUserPhone,
										checkModifyAudit: this.checkModifyAudit,
									}
								};
								this.redirectTo(options);
							} else if (this.checkModifyAudit == '-1') {
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
													userPhone: userPhone,
												}
											};
											
											that.redirectTo(options);
										} else if (res.cancel) {}
									}
								})
							}else if(this.checkModifyAudit == '2'){
								// 企业资质认证失败
								let options = {
									url: 'register/b2bRegisterCheck',
									query: {
										userPhone: userPhone || this.inputUserPhone,
										checkModifyAudit: res.checkModifyAudit,
									}
								};
								
								that.redirectTo(options);
							} else {
								let options = {
									url: 'register/companyInfo'
								}
								this.redirectTo(options);
							}
						}else{
							uni.showModal({
									title: '提示',
									content: '您不是用户资质，无法进入！',
									confirmColor: '#' + $storage.get('baseColor'),
									success(res) {
										let pages = getCurrentPages()
										if (res.confirm) {} else if (res.cancel) {
								
										}
									}
								})
						}
						
						
					}
					

				});
			},

			redirectTo(options) {
				this.$qj.router.replace(options.url, options.query ? options.query : '');
			},
			navigateBack() {
				this.$qj.router.back();
			},
			reLaunch(options) {
				this.$qj.router.reOpen(options.url, options.query ? options.query : '', {
					stay: 500
				});
			},
			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},
			// 微信小程序授权登录逻辑---销售端
			bindGetUserInfo1: function(e) {
				console.log('微信授权登录----',e)
				this.$qj.message.loading();
				let that = this;
				if (e.target.userInfo) {
					let userInfo = e.target.userInfo;
					wx.login({
						success(lo) {
							console.log('销售端微信---',lo)
							if (lo.code) {
								let loginCode = lo.code;
								that.$qj.storage.set('code', loginCode);
								wx.getUserInfo({
									withCredentials: true,
									lang: 'zh_CN',
									success(res) {
										console.log('销售端获取用户信息，，，，',res)
										if (res.errMsg == 'getUserInfo:ok') {
											let encryptedData = res.encryptedData;
											let iv = res.iv;
											console.log('销售端的跳转-----')
											that.loginRequest1(loginCode, userInfo, encryptedData, iv);
											// $storage.set('nologin', '');
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
			// 服务端登录接口，前端将code传过去 --销售端
			loginRequest1(code, userInfo, encryptedData = '', iv = '') {
				console.log('info-----',code,'----',userInfo)
				this.$qj
					.http(this.$qj.domain)
					.get(warrantyLogin, {
						js_code: code,
						encryptedData: encryptedData,
						iv: iv
					})
					.then(res => {
						console.log('销售端服务登录========',res)
						let that = this
						if (res.success && res.dataObj) {
							this.$qj.storage.set('userInfo', userInfo); //微信授权 返回的用户信息
							this.$qj.storage.set('userOpenid', res.dataObj.userOpenid);

							if (res.dataObj.userInfo) {
								let loginInfor = JSON.parse(res.dataObj.userInfo);
								this.$qj.storage.set('userdetailsInfo', JSON.parse(res.dataObj.userInfo));
								this.$qj.storage.set('userPhone', res.dataObj.userPhone);
								this.$qj.storage.set('loginInfor', loginInfor);

								this.$qj.storage.set('userId', loginInfor.userId);
								this.$qj.storage.set('sessionid', loginInfor.ticketTokenid);
								let cookie = loginInfor.ticketTokenid;
								let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$qj.domain.substring(8) + '; Path=/';
								this.$qj.storage.set('miniUserName', miniCookie);
							}

							let miniToken = this.$qj.storage.get('miniToken');
								// this.setLoginAfterRouter();
								let options1 = {
									url: 'salesEnd/pages/salesLoginPassword',
									query: {
										// redirectUrl: this.redirectUrl || this.goodsDetailsUrl
										userOpenid: res.dataObj.userOpenid || this.userOpenid,
										// indexGotoUrl: this.indexGotoUrl
									}
								};
								this.redirectTo(options1)



						} else {
							that.$qj.message.alert('登录失败');
						}
					});
			},
			// 微信小程序授权登录逻辑
			bindGetUserInfo: function(e,loginType) {
				console.log('微信授权登录----',e)
				this.$qj.message.loading();
				let that = this;
				if (e.target.userInfo) {
					let userInfo = e.target.userInfo;
					wx.login({
						success(lo) {
							if (lo.code) {
								let loginCode = lo.code;
								that.$qj.storage.set('code', loginCode);
								wx.getUserInfo({
									withCredentials: true,
									lang: 'zh_CN',
									success(res) {
										if (res.errMsg == 'getUserInfo:ok') {
											let encryptedData = res.encryptedData;
											let iv = res.iv;
											that.loginRequest(loginCode, userInfo, encryptedData, iv,loginType);
											// $storage.set('nologin', '');
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

			// 服务端登录接口，前端将code传过去
			loginRequest(code, userInfo, encryptedData = '', iv = '',loginType) {
				console.log('info-----',code,'----',userInfo)
				this.$qj
					.http(this.$qj.domain)
					.get(warrantyLogin, {
						js_code: code,
						encryptedData: encryptedData,
						iv: iv
					})
					.then(res => {
						console.log('========',res)
						let that = this
						if (res.success && res.dataObj) {
							this.$qj.storage.set('userInfo', userInfo); //微信授权 返回的用户信息
							this.$qj.storage.set('userOpenid', res.dataObj.userOpenid);

							if (res.dataObj.userInfo) {
								let loginInfor = JSON.parse(res.dataObj.userInfo);
								this.$qj.storage.set('userdetailsInfo', JSON.parse(res.dataObj.userInfo));
								this.$qj.storage.set('userPhone', res.dataObj.userPhone);
								this.$qj.storage.set('loginInfor', loginInfor);

								this.$qj.storage.set('userId', loginInfor.userId);
								this.$qj.storage.set('sessionid', loginInfor.ticketTokenid);
								let cookie = loginInfor.ticketTokenid;
								let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$qj.domain.substring(8) + '; Path=/';
								this.$qj.storage.set('miniUserName', miniCookie);
							}

							let miniToken = this.$qj.storage.get('miniToken');

								// this.setLoginAfterRouter();
								let options1 = {
									url: 'login/loginVerification',
									query: {
										// redirectUrl: this.redirectUrl || this.goodsDetailsUrl
										userOpenid: res.dataObj.userOpenid || this.userOpenid,
										indexGotoUrl: this.indexGotoUrl
									}
								};
								this.redirectTo(options1)


						} else {
							that.$qj.message.alert('登录失败');
						}
					});
			},
			// 
			getAuthState() {
				let that = this
				let paramsStatus = {}
				paramsStatus.userCode = this.$qj.storage.get('loginInfor').userInfoCode
				this.$qj
					.http(this.$qj.domain)
					.get(userapplyStateAndAuth, paramsStatus)
					.then(res => {
						console.log('22222222---',res)
						this.checkModifyAudit = res.checkModifyAudit

					});

			},
		}
	};
</script>

<style lang="less" scoped>
	.logoImg {
		width: 290rpx;
		position: absolute;
	}

	.onlineBtn {
		text-align: left;
		// margin-left: 3px;
		// margin-top: 22px;
		color: #004178;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		opacity: 0;
		
		
	}



	.c_wx {}

	.popup {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9998;
	}

	.popup-title {
		font-size: 14px;
		font-weight: 700;

	}

	.popup-log {
		font-size: 15px;
		font-weight: 500;
		color: #666666;
		margin: 24rpx;

	}

	.popup-btn {
		display: flex;
		border-top: 1rpx solid #e6e5e5;
		margin-top: 100rpx;
	}

	.popup-btn .btn {
		width: 50%;
		padding: 10px;
	}


	button {
		font-size: 30rpx;
		width: 90%;
		margin: 10rpx;
		background: #fff;

		&::after {
			border: none;
		}
	}

	.popup-info {
		position: fixed;
		width: 550upx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 30upx;
		padding: 40upx 0 10rpx 0;
		border-radius: 20upx;
		background-color: #fff;
		z-index: 9999;
		text-align: center;
	}

	.contact {
		// background-size: 100% 100%;
		width: 100%;
		height: 100%;
	}

	.margTop-20 {
		// margin-top: 10rpx;
	}

	.margTop-34 {
		margin-top: 34rpx;
	}

	.margTop-70 {
		margin-top: 70rpx;
	}

	.padding-30 {
		padding: 30rpx;
	}

	.imageshop {
		width: 140rpx;
	}

	.imageItem {
		width: 120rpx;
	}

	.imageXs {
		width: 100rpx;
		// margin-bottom: 16rpx;
		margin: 14rpx 0rpx 12rpx 0;
	}

	.index_info {
		display: flex;
		width: 100%;
		height: 100%;
		align-items: center;
	}

	.index_content {
		width: 100%;
		margin: 280rpx 10rpx 0 10rpx;
		display: flex;
		// text-align: center;
		justify-content: space-evenly;
		margin-top: 30px;

		.listLeft {
			width: 41%;

			.listItem {
				box-shadow:
					0px -5px 10px #f3f3f3,
					/*上边阴影  红色*/
					// -10px 0px 0px 0px #f3f3f3,   /*左边阴影  绿色*/
					10px 0px 10px #f3f3f3,
					/*右边阴影  蓝色*/
					0px 5px 10px #f3f3f3;
				/*下边阴影  黄色*/

				border-radius: 40rpx;
				padding: 15rpx 30rpx;
				font-size: 32rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #004178;


			}

			.height-220 {
				height: 220rpx
			}

			.height-300 {
				height: 300rpx;
			}
		}


	}
</style>
