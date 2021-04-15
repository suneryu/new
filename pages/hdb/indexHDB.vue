<template>
	<header class="headers" :style="{ background: baseColor }">
		<div class="headers-message">
			<p>
				<i class="iconfont" @click="goCustomService(1)">&#xe69d;</i>
				<span></span>
			</p>
			<i v-if='isToSub' class="iconfont" @click="goCustomService(2)">&#xe610;</i>
		</div>
		<div class="headers-box">
			<div class="headers-box-img">
				<img :src="message.avatarUrl || message.avatar || userImgurl" @click="toPersonal" />
				<h3 v-if="message.nickName">
					{{ message.nickName }}
					<span v-if="userLevel">
						<i class="iconfont">&#xe771;</i>
						{{userLevel}}
					</span>
					<div style='display: flex;'>
						<div>
							<div v-if='userinfoType == "2"' class='renzheng'>√</div>
							<div><span>企业</span></div>
						</div>
						<div>
							<span style="background: none;font-size: 12px;color: #D9001B;"
								v-if='userinfoType == "1"'>未认证</span>
							<span style="background: none;font-size: 12px;color:#D9001B;"
								v-if='userinfoType == "2" && checkModifyAudit != "3" '>未授权</span>
							<span style="background: none;font-size: 12px;color: #03BF16;"
								v-if='userinfoType == "2" && checkModifyAudit == "3"'>已授权</span>
						</div>
					</div>
				</h3>
				<button @click="loginOrRegister" v-else>登录/注册</button>
				<!-- #ifdef MP-WEIXIN -->
				<!-- <button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" v-else>登录/注册</button> -->
				<!-- #endif -->
				<!-- #ifdef MP-TOUTIAO -->
				<!-- <button @click="userAuth" v-else>登录/注册</button> -->
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<!-- <button open-type="getAuthorize" @getAuthorize="onGetAuthorize" @error="onAuthError" scope="userInfo" v-else>登录/注册</button> -->
				<!-- #endif -->

			</div>

		</div>
		<div class="headers-sum">
			<!-- 	<div v-for="(item, index) in nav" :key="index" @click="navClick(item)">
				<p>10</p>
				<p>{{ item.menuName }}</p>
			</div> -->
			<div @click="navClick(0)">
				<p>{{integralTotal}}</p>
				<p>我的积分</p>
			</div>
			<div @click="navClick(1)">
				<p>{{contractTotal}}</p>
				<p>我的合同</p>
			</div>
			<div @click="navClick(2)">
				<p>{{quotationTotal}}</p>
				<p>我的报价单</p>
			</div>
			<div @click="navClick(3)">
				<p>{{appointmentTotal}}</p>
				<p>我的预约</p>
			</div>
			<div @click="navClick(4)">
				<p>{{collectionTotal}}</p>
				<p>我的收藏</p>
			</div>
		</div>
	</header>
</template>
<script>
	import getUserInfo from '@/components/communal/getUserInfo';
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	import http from '@/api/http.js';
	import {
		getProappinfo,
		loginIn,
		getTopPerMenuListFPc,
		thirdLogin,
		loginMicroMessenger,
		loginMiniProgram,
		warrantyLogin,
		getPersonal,
		getUserservice,
		queryScontractPageC,
		getUpmupointsPageByPC,
		queryCollectPage,
		userapplyStateAndAuth
	} from '@/api/interfaceHDB.js';
	export default {
		props: ['baseColor', 'message', 'isShow', 'nav', 'webmail', 'userLevel'],
		data() {
			return {
				userImgurl: require('../../static/img/mine/default_header.png'),
				userinfoType: "", //用户类型
				userPhone: "", //手机号
				showIf: false, //用户类型，1个人 2 企业
				contractTotal: 0, //我的合同数量
				integralTotal: 0, //我的積分
				quotationTotal: 0, //報價單
				appointmentTotal: 0, //我的預約
				collectionTotal: 0, // 我的收藏
				checkModifyAudit: "",
				userInfoCode: "",
				isToSub:false
			};
		},
		mounted() {
			console.log('$storage.get()', $storage.get('loginInfor'))
			console.log('$storage.get(userInfoCode)', $storage.get('loginInfor').userInfoCode)

			// this.userinfoType = $storage.get('loginInfor').userinfoType;
			this.userInfoCode = $storage.get('loginInfor').userInfoCode;
			this.userPhone = $storage.get('loginInfor').userPhone;
			if (this.userinfoType == "1") {
				this.showIf = false;
			} else {
				this.showIf = true;
			}
			
			this.getMycontract(this.userPhone);
			this.searchStatus();
		},

		created() {
			// this.getuserInfo();
			// this.getMycontract();
			// 获取信息
			this.getuserInfo();

			this.getUpmupointsPageByPC();
			this.queryCollectPage();

			// this.getUpmupointsPageByPC();
		},

		methods: {
			getuserInfo() {
				http.get(getUserservice, {
					userId: $storage.get('userId')
				}).then(res => {
					this.userinfoType = res.userinfoType;
					if(res.userType == '0' && res.userinfoType == '2'){
						this.isToSub = true
					}


				});
			},
			// 查询 认证授权 状态
			searchStatus() {
				let that = this
				let paramsStatus = {}
				paramsStatus.userCode = this.userInfoCode
				this.$qj
					.http(this.$qj.domain)
					.get(userapplyStateAndAuth, paramsStatus)
					.then(res => {
						console.log("认证授权状态，", res)
						if (res.checkModifyAudit == '3') {
							that.checkModifyAudit = "3"
						}

					});
			},
			// 获取信息
			// getuserInfo(){
			// 	http.get(getUserservice, {
			// 		userId: $storage.get('userId')
			// 	}).then(res => {
			// 		console.log("res",res)
			// 		// this.userinfoType= res.userinfoType;
			// 		if(res.userinfoType == "1"){
			// 			this.showIf=false;
			// 		}else{
			// 			this.showIf=true;			
			// 		}

			// 		this.getMycontract(res.userinfoPhone);	

			// 	});
			// },
			//获取我的合同
			getMycontract(data) {
				http.get(queryScontractPageC, {
					goodsSupplierName: data,
					contractInvstate: "1"
				}).then(res => {
					console.log("getmyContract...", res.total)
					this.contractTotal = res.total;

				});
				//获取我的預約合同
				http.get(queryScontractPageC, {
					goodsSupplierName: data,
					contractInvstate: "2"
				}).then(res => {
					console.log("appointmentTotal...", res.total)
					this.appointmentTotal = res.total;

				});
			},

			//獲取我的積分	
			getUpmupointsPageByPC(data) {
				http.get(getUpmupointsPageByPC, {
					userId: $storage.get('userId')
				}).then(res => {
					console.log("integralTotal...", res)
					this.integralTotal = res.total;

				});
			},

			// 我的收藏
			queryCollectPage() {
				http.get(queryCollectPage, {
					userId: $storage.get('userId')
				}).then(res => {
					console.log("integralTotal...", res)
					this.collectionTotal = res.total;

				});
			},
			/**
			 * 统一登录注册流程
			 */
			loginOrRegister() {
				$router.push('authorization');
			},

			// 微信小程序授权登录逻辑
			bindGetUserInfo: function(e) {
				$message.loading();
				let that = this;
				if (e.target.userInfo) {
					let userInfo = e.target.userInfo;
					wx.login({
						success(lo) {
							if (lo.code) {
								$storage.set('code', lo.code);

								that.loginRequest(lo.code, userInfo);
							} else {
								$message.alert('登录失败');
								console.log('登录失败！' + res.errMsg);
							}
						}
					});
				} else {
					console.log('用户按了取消授权');
				}
			},


			// 服务端登录接口，前端将code传过去
			loginRequest(code, userInfo) {
				http.get(warrantyLogin, {
					js_code: code
				}).then(res => {
					console.log(res);
					$storage.set('userInfo', userInfo);
					$storage.set('userOpenid', res.dataObj.userOpenid);
					this.$emit('isShowFalse', false);
					this.$emit('updateUserInfo');
					if (res.dataObj.register == 'true') {
						$router.push('my/bindPhone');
					} else {
						let loginInfor = JSON.parse(res.dataObj.userInfo);
						$storage.set('loginInfor', loginInfor);
						$storage.set('userId', loginInfor.userId);
						$storage.set('sessionid', loginInfor.ticketTokenid);
						let miniToken = $storage.get('miniToken');
						let cookie = loginInfor.ticketTokenid;
						let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$domain.substring(8) +
							'; Path=/';
						$storage.set('miniUserName', miniCookie);

						this.setLoginAfterRouter();
					}
				});
			},

			setLoginAfterRouter() {
				// http.get(getPersonal, {
				// 	userId: $storage.get('userId')
				// }).then(res => {
				// 	this.userLevel = res.userinfoLevel;
				// })
				http.get(getTopPerMenuListFPc).then(res => {
					if (res) {
						$storage.set('getTopPerMenuList', res.menuList);
						$storage.set('footerMenu', res.menuList.filter(v => v.menuShow === 0));
						$message.hide();
					}
				});
			},

			/**
			 * 支付宝授权获取用户信息
			 */
			onGetAuthorize() {
				$message.loading();
				my.getOpenUserInfo({
					fail: res => {},
					success: res => {
						let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
						console.log(userInfo);
						my.getAuthCode({
							scopes: 'auth_user',
							success: (res) => {
								if (res.authCode) {
									this.loginRequest(res.authCode, userInfo);
								}
							}
						})
					}
				});
			},

			/**
			 * 
			 */
			onAuthError() {
				$message.alert('用户拒绝授权')
			},

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

			userAuth() {
				$message.loading();
				this.getProvider(provider => {
					let _this = this;
					uni.login({
						provider: provider,
						scopes: 'auth_user',
						success(res) {
							console.log(res);
							let code = res.code
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

			cancelUserInfo() {},

			toPersonal() {
				$storage.get('getTopPerMenuList').map(v => {
					if (v.menuAction == 'user') {
						v.children[0].children.map(val => {
							if (val.menuAction == 'personal') {
								$router.push(val.menuJspath);
							}
						});
					}
				});
			},
			//个人中心导航点击事件
			navClick(item) {
				console.log(item);
				// menuJspath: "integral_modules/index"
				// $router.push(item.menuJspath);
				if (item == 0) {
					console.log("跳转至我的积分页面")
					$router.push("integral_modules/index");

				}
				if (item == 1) {
					console.log("跳转至我的合同")
					$router.push("hdb/personCenter/myContract");
				}
				if (item == 2) {
					console.log("跳转至我的报价单页面")
					$router.push("marketing_module/pages/quotation");
				}
				if (item == 3) {
					console.log("跳转至我的预约页面")
					$router.push("");
				}
				if (item == 4) {
					console.log("跳转至我的收藏页面")
					$router.push("collection_modules/goods");
				}
			},

			goCustomService(index) {
				if (index == 1) {
					$router.push(this.webmail);
				} else {
					$router.push('marketing_module/pages/subaccount')
				}

			}
		}
	};
</script>
<style lang="less" scoped>
	@import '../../common/css/common.less';

	.renzheng {
		background-color: #4CD964;
		width: 10px;
		height: 10px;
		text-align: center;
		font-size: 10px;
		line-height: 10px;
		border-radius: 10px;
		position: absolute;
		right: 50px
	}

	.headers {
		width: 100%;
		background: #374e80;
		padding-bottom: 36rpx;

		&-message {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 35rpx 30rpx 30rpx 0;

			i {
				color: #212121;
			}

			p {
				position: relative;
				margin-right: 38rpx;

				span {
					position: absolute;
					display: inline-block;
					width: 10rpx;
					height: 10rpx;
					border-radius: 50%;
					background: #c21b39;
					top: 5rpx;
					right: 4rpx;
				}
			}
		}

		&-box {
			margin-bottom: 91rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			&-img {
				text-align: center;
				position: relative;

				img {
					width: 160rpx;
					height: 160rpx;
					margin-bottom: 20rpx;
					border-radius: 50%;
					position: absolute;
					left: 50%;
					margin-left: -80rpx;
					top: 0;
				}

				button {
					font-size: @top-title;
					color: @white-color;
					height: 256rpx;
					margin: 0;
					padding-top: 180rpx;
					outline: none;
					background: transparent;
				}

				button::after {
					border: none;
				}

				h3 {
					font-size: @top-title;
					color: @white-color;
					display: flex;
					align-items: center;
					height: 76rpx;
					padding-top: 180rpx;

					span {
						font-size: @middle-title;
						padding: 2rpx 16rpx 0 10rpx;
						background: #7e7158;
						display: flex;
						align-items: center;
						border-radius: 26rpx;
						margin-left: 10rpx;

						i {
							margin-right: -9rpx;
							margin-top: -5rpx;
						}
					}
				}
			}
		}

		&-sum {
			margin: 0 30rpx;
			display: flex;

			div {
				flex: 1;
				text-align: center;
				color: @white-color;
				border-right: 1rpx solid #c7baa1;
				font-size: @middle-title;

				&:last-child {
					border-right: 0;
				}
			}
		}
	}
</style>
