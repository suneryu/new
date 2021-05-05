<template>
	<header class="headers" :style="{ background: baseColor }">
		<div class="headers-message">
			<p>
				<i class="iconfont" @click="goCustomService(1)">&#xe622;</i>
			</p>
			<i class="iconfont" @click="handleClose = !handleClose">&#xe623;</i>
		</div>
		<div class="headers-box">
			<div class="headers-box-img">
				<img :src="message.avatarUrl || message.avatar || userImgurl" @click="toPersonal" />
				<h3>
					{{infoPage.employeeName}}
				</h3>
				<h2>{{infoPage.userinfoCompname}}
					<span>企业员工</span>
				</h2>
			</div>

		</div>
		<div class="hd" v-if="handleClose">
			<div class="handleClose">
				<div style='display: flex; justify-content: space-between;margin: 10px 10px;width: 95%;'>
					<!-- <span>1</span> -->
					<span>员工信息</span>
				</div>
				<div
					style=" width: 90%;display: flex; flex-direction: column; justify-content: center;align-items: center">
					<div>
						<span>公司名称：</span>
						<input type="text" v-model="infoPage.userinfoCompname" disabled="disabled" />
					</div>
					<div>
						<span>销售员姓名：</span>
						<input type="text" v-model="infoPage.employeeName" disabled="disabled" />
					</div>
					<div>
						<span>工号：</span>
						<input type="text" v-model="infoPage.employeeCode" disabled="disabled" />
					</div>
					<div>
						<span>岗位职称：</span>
						<input type="text" v-model="infoPage.userinfoMap" disabled="disabled" />
					</div>
					<div>
						<span>身份证号：</span>
						<input type="text" v-model="infoPage.userinfoCertNo" disabled="disabled" />
					</div>
					<div>
						<span>联系邮箱：</span>
						<input type="text" v-model="infoPage.userinfoEmail" disabled="disabled" />
					</div>
					<div>
						<span>联系电话：</span>
						<input type="text" v-model="infoPage.userinfoConPhone" disabled="disabled" />
					</div>
					<div>
						<span>联系地址：</span>
						<input type="" v-model="infoPage.provinceName" placeholder="请选择省" style="width: 20%;" disabled="disabled" />
						<input type="" v-model="infoPage.cityName" placeholder="请选择市" style="width: 20%; margin-left: 5px" disabled="disabled" />
						<input type="" v-model="infoPage.areaName" placeholder="请选择区" style="width: 20%; margin-left: 5px" disabled="disabled" />
					</div>
					<div>
						<span></span>
						<input type="text" placeholder="请输入详细地址" v-model="infoPage.companyAddress" disabled="disabled" />
					</div>
					<div>
						<span>登录手机号：</span>
						<input type="text" v-model="infoPage.userinfoConPhone" disabled="disabled" />
					</div>
				</div>
				<div class="creatButton" style="display: flex; justify-content: center; margin: 40rpx 20rpx 10rpx 20rpx; position: absolute;
				bottom: 0">
					<button @click="handleClose1">关闭</button>
				</div>
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
		// getPersonal,
		getUserservice,
		queryScontractPageC,
		getUpmupointsPageByPC,
		queryCollectPage,
		userapplyStateAndAuth,
		queryUserinfoPageBySales,
	} from '@/api/interfaceHDB.js';
	export default {
		props: ['baseColor', 'message', 'isShow', 'nav', 'webmail', 'userLevel'],
		data() {
			return {
				infoPage:'',
				handleClose: false,
				userImgurl: require('../../../../static/img/mine/default_header.png'),
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
				isToSub: false
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
				http.get(queryUserinfoPageBySales, {
				// userinfoPhone: 18154177826,
				userinfoPhone: $storage.get('loginInfor').userPhone
			}).then(res => {
				this.infoPage = res.list[0]
				let loginInfor = $storage.get('loginInfor')
				loginInfor.employeeName = res.list[0].employeeName
				 $storage.set('loginInfor',loginInfor)
			});
			// this.getUpmupointsPageByPC();
		},

		methods: {
			handleClose1(){
				this.handleClose = false
			},
			getuserInfo() {
				http.get(getUserservice, {
					userId: $storage.get('userId')
				}).then(res => {
					this.userinfoType = res.userinfoType;
					if (res.userType == '0' && res.userinfoType == '2') {
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
			// loginOrRegister() {
			// 	$router.push('authorization');
			// },

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
			// navClick(item) {
			// 	console.log(item);
			// 	// menuJspath: "integral_modules/index"
			// 	// $router.push(item.menuJspath);
			// 	if (item == 0) {
			// 		console.log("跳转至我的积分页面")
			// 		$router.push("integral_modules/index");

			// 	}
			// 	if (item == 1) {
			// 		console.log("跳转至我的合同")
			// 		$router.push("hdb/personCenter/myContract");
			// 	}
			// 	if (item == 2) {
			// 		console.log("跳转至我的报价单页面")
			// 		$router.push("marketing_module/pages/quotation");
			// 	}
			// 	if (item == 3) {
			// 		console.log("跳转至我的预约页面")
			// 		$router.push("");
			// 	}
			// 	if (item == 4) {
			// 		console.log("跳转至我的收藏页面")
			// 		$router.push("collection_modules/goods");
			// 	}
			// },

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
	@import '../../../../common/css/common.less';

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
		
		.hd{
			    position: absolute;
			    /* z-index: 999; */
			    top: 0;
			    left: 0;
			    bottom: 0;
			    right: 0;
			    margin: auto;
			    width: 100%;
			    height: 100%;
			    background:rgba(0,0,0, .5);
		}
		.handleClose {
			position: absolute;
			z-index: 999;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			margin: auto;
			width: 90%;
			height: 80%;
			background-color: #FFFFFF;
			border-radius: 30rpx;

			div {
				width: 93%;
				margin: 30rpx 0 0 0;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}

			input {
				width: 65%;
				border: 1px solid;
			}
		}

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
					border-radius: 15px;
				}
			}
		}

		&-box {
			margin-bottom: 15rpx;
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
					justify-content: center;
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

				h2 {
					display: flex;
					color: @white-color;

					span {
						color: #589CCB;
						font-size: @middle-title;
						padding: 2rpx 16rpx 0 10rpx;
						background: #052D4E;
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
