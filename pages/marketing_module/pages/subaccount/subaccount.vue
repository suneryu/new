<template>
	<header class="headers" :style="{ background: baseColor }">
		<div class="headers-box">
			<div class="headers-box-img">
				<img :src="message.avatarUrl || message.avatar || userImgurl" @click="toPersonal" />
				<div v-if="message.nickName">
				<h3>
					{{ message.nickName }}
					<span v-if="userLevel">
						<i class="iconfont">&#xe771;</i>
						{{userLevel}}
					</span>
					<div style='display: flex;'>
						<div>
							<div  v-if='showIf' class='renzheng'>√</div>
							<div><span>企业</span></div>
						</div>
						<div >
							<span style="background: none;font-size: 12px;color: #D9001B;" v-if='userinfoType == "1"'>未认证</span>
							<span style="background: none;font-size: 12px;color:#D9001B;" v-if='userinfoType == "2" && checkModifyAudit != "3" '>未授权</span>
							<span style="background: none;font-size: 12px;color: #03BF16;" v-if='userinfoType == "2" && checkModifyAudit == "3"'>已授权</span>
						</div>
					</div>
					
				</h3>
				<h2>
					<span>企业认证账号：{{userPhone}}</span>
					<span>真实姓名：{{userName}}</span>
				</h2>
				</div>
				
				<button @click="loginOrRegister" v-else>登录/注册</button>
				
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
		props: ['baseColor', 'message', 'isShow', 'userLevel'],
		data() {
			return {
				userImgurl: require('../../../../static/img/mine/default_header.png'),
				userinfoType:"",   //用户类型
				userPhone:"" ,  //手机号
				showIf:false,//用户类型，1个人 2 企业
				contractTotal:0,  //我的合同数量
				integralTotal:0,  //我的積分
				quotationTotal:0,  //報價單
				appointmentTotal: 0, //我的預約
				collectionTotal:0 , // 我的收藏
				checkModifyAudit:"",
				userInfoCode:"",
				userName:'',
				companyCode:''
			};
		},

		mounted() {
			// this.userinfoType = $storage.get('loginInfor').userinfoType;
			this.userInfoCode = $storage.get('loginInfor').userInfoCode;
			this.userPhone = $storage.get('loginInfor').userPhone;
			this.userName = $storage.get('loginInfor').userName;
			this.companyCode = $storage.get('loginInfor').companyCode;
			if(this.userinfoType == "1"){
				this.showIf=false;
			}else{
				this.showIf=true;			
			}
			this.getMycontract(this.userPhone);	
			this.searchStatus();
		},
		
		created(){
			// this.getuserInfo();
			// this.getMycontract();
			// 获取信息
			this.getuserInfo();
				
			this.getUpmupointsPageByPC();
			this.queryCollectPage();
			
			// this.getUpmupointsPageByPC();
		},

		methods: {
			getuserInfo(){
				http.get(getUserservice, {
					userId: $storage.get('userId')
				}).then(res => {
					this.userinfoType = res.userinfoType;
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
						console.log("认证授权状态，",res)
						if (res.checkModifyAudit == '3') {
							that.checkModifyAudit = "3"
						}

					});
			},
			//获取我的合同
			getMycontract(data){
				http.get(queryScontractPageC, {
					goodsSupplierName: data,
					contractInvstate:"1"
				}).then(res => {
					console.log("getmyContract...",res.total)
					this.contractTotal= res.total;
				
				});
				//获取我的預約合同
				http.get(queryScontractPageC, {
					goodsSupplierName: data,
					contractInvstate:"2"
				}).then(res => {
					console.log("appointmentTotal...",res.total)
					this.appointmentTotal= res.total;
				
				});
			},
			
			//獲取我的積分	
			getUpmupointsPageByPC(data){
				http.get(getUpmupointsPageByPC, {
					userId: $storage.get('userId')
				}).then(res => {
					console.log("integralTotal...",res)
					this.integralTotal= res.total;
				
				});
			},
			
			// 我的收藏
			queryCollectPage(){
				http.get(queryCollectPage, {
					userId: $storage.get('userId')
				}).then(res => {
					console.log("integralTotal...",res)
					this.collectionTotal= res.total;
				
				});
				},
			/**
			 * 统一登录注册流程
			 */
			loginOrRegister(){
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
						let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$domain.substring(8) + '; Path=/';
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
			onGetAuthorize(){
				$message.loading();
				my.getOpenUserInfo({
					fail: res => {},
					success: res => {
						let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
						console.log(userInfo);
						my.getAuthCode({
							scopes:'auth_user',
							success: (res) => {
								if(res.authCode){
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
			onAuthError(){
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
			goCustomService() {
				$router.push(this.webmail);
			}
		}
	};
</script>
<style lang="less" scoped>
	@import '../../../../common/css/common.less';
	.renzheng{
		background-color: #4CD964;
		width:10px;
		height:10px;
		text-align: center;
		font-size: 10px;
		line-height: 10px;
		border-radius: 10px;
		 position: absolute;
		 right: 70px
	}

	.headers {
		width: 100%;
		background: #374e80;
		padding-bottom: 36rpx;


		&-box {
			margin-bottom: 30rpx;
			padding-top: 50rpx;
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
					font-size: @middle-title;
					color: @white-color;
					display: flex;
					align-items: center;
					height: 76rpx;
					padding-top: 180rpx;
					padding-left: 80rpx;
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
				h2{
					font-size: @middle-title;
					color: @white-color;
					text-align: center;
					display: flex;
					flex-direction: column;
					margin-top: 20rpx;
					span{
						font-size: @top-title;
						padding: 20rpx 0 0 0;
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
