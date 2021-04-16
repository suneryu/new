<template>
	<div class="user">
		<headerCenter :baseColor="baseColor" :message="message" :isShow="isShow" :nav="nav" :webmail="webmail"
			:userLevel="userLevel" />
		<!-- <button type="button" @click="loginOut()">退出当前账号</button> -->
		<div class="user-order">
			<div class="user-order-title">
				<span>我的报价单</span>
				<div @click="statusOrder('全部')">
					查看全部
					<i class="iconfont">&#xe61d;</i>
				</div>
			</div>
			<div class="user-order-my">
				<div @click="statusOrder(tabName[orderIndex])" v-for="(order, orderIndex) in myOrder"
					:key="orderIndex">
					<i class="iconfont" :class="order.menuSelectClass ? order.menuSelectClass : 'icon-wodedingdan'"
						:style="{ color: baseColor }"></i>
					<p>{{tabName[orderIndex]}}</p>
				</div>
			</div>
		</div>
		<div class="user-order-title">
			<span>我的预约合同</span>
			<div @click="statusOrder">
				查看全部
				<i class="iconfont">&#xe61d;</i>
			</div>
		</div>
		<!-- 我的发票，用户协议， 企业信息 -->
		<div class="showCla1">
			<div class="showCla" @click="myInfo(0)">
				<div style='width: 100%;height: 62px;'>
					<image :src="fapiap1" style="width: 50px;" mode="widthFix"></image>
				</div>
				<span>带接洽</span>
			</div>
			<div class="showCla" @click="myInfo(1)">
				<div style='width: 100%;height: 62px;'>
					<image :src="yhxy1" style="width: 50px;" mode="widthFix"></image>
				</div>
				<span>接洽中</span>
			</div>
			<div class="showCla" @click="myInfo(2)">
				<div style='width: 100%;height: 62px;'>
					<image :src="qyinfo1" style="width: 50px;" mode="widthFix"></image>
				</div>
				<span>已完成</span>
			</div>
		</div>
		<div class="user-order-title">
			<span>我的客户</span>
			<div @click="Myclients">
				查看全部
				<i class="iconfont">&#xe61d;</i>
			</div>
		</div>
		<div class="creatButton"
			style="display: flex; justify-content: space-between; margin: 40rpx 20rpx 10rpx 20rpx;">
			<button @click="add">创建报价单</button>
			<button>邀请签约洽谈</button>
		</div>
	</div>
</template>
<script>
	import getUserInfo from '@/components/communal/getUserInfo';
	import headerCenter from './indexHDB.vue';
	import {
		$storage,
		$router
	} from '@/utils/prototype/vue.js';
	import http from '@/api/http.js';
	import vueTabBar from './vueTabBarHDB.vue';
	import {
		queryGroupBuyerPageByAG,
	} from '@/api/interfaceHDB.js';
	import {
		clearTimeout,
		setTimeout
	} from 'timers';
	export default {
		data() {
			return {
				tabName:["待确认","已完成","已取消"],
				show: false,
				selectNavIndex: 3,
				appid: '',
				secret: '',
				state: 'wx',
				grant_type: '',
				domains: this.$domain,
				fapiap1: '', //发票
				yhxy1: "", // 用户协议
				qyinfo1: "", //企业信息
				jfsc1: "", //积分商城
				hyscCar1: "", //合约商城购物车
				baseColor: '',
				message: '',
				isShow: false,
				application: {}, //应用
				footerMenu: [], //底部菜单
				myOrder: [],
				userImgurl: require('../../../../static/img/mine/default_header.png'), //头像
				webmail: '',
				nav: [],
				// 多样式展示应用列表idnex 对应路由接口中的proappMenuOrder
				columnApplicationIndex: [],
				// 用户等级
				userLevel: '',
				userinfoType: "" //用户类型
			};
		},
		onLoad() {
			this.baseColor = `#${$storage.get('baseColor')}`;
			// wx.setNavigationBarTitle({
			// 	title: $storage.get('proappEnvName')
			// });
			// wx.setNavigationBarColor({
			// 	frontColor: '#ffffff',
			// 	backgroundColor: this.baseColor
			// });
		},

		onShow() {
			console.log('用户类型', $storage.get('loginInfor').userinfoType)
			this.userinfoType = $storage.get('loginInfor').userinfoType;
			console.log('个人中心onShow', $storage.get('userId'));
			if ($storage.get('userInfo')) this.message = $storage.get('userInfo');
			if ($storage.get('miniUserName') && $storage.get('userId')) {
				http.get(getPersonal, {
					userId: $storage.get('userId')
				}).then(res => {
					this.userLevel = res.userinfoLevel;
				});
			}
		},
		created() {
			this.yhxy1 = this.$domain + '/paas/shop/2020063000000001/2021-03-23/5f8e628099264f9b838b8588c6d15c87.png';
			this.jfsc1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/728f2dd8ba6c4d6e8a9df37ca7a51de0.png';
			this.fapiap1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/27251fe8602b4926b15f39e52f91f11a.png';
			this.hyscCar1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/277c0621c99a4e5a8fb96bbf360a5f01.png';
			this.qyinfo1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/b430fdd00a2947ed8ea99e4f11b9c9d1.png';
			// =this.$domain + '/paas/shop/2020063000000001/2021-03-25/27251fe8602b4926b15f39e52f91f11a.png'
			// console.log('这里是个人中心')
			// this.aaa();
		},
		mounted() {
			this.footerMenu = $storage.get('footerMenu'); //下面一行的按钮
			console.log('tableVar....', this.footerMenu)

			this.footerMenu.forEach(element => {
				if (element.menuName == '我的') {
					// if (element.menuAction == 'user') {
					this.settingMenu(element.children);
				}
			});
		},
		components: {
			headerCenter,
			getUserInfo,
			vueTabBar
		},
		methods: {
			add() {
			   $router.push("salesEnd/pages/contractCustomers",)
			},
			Myclients() {
				console.log("我的客户")
				$router.push("salesEnd/pages/myClients")
			},
			// myInfo(data) {
			// 	if (data == 0) {
			// 		console.log("跳转至我的发票")
			// 		$router.push("hdb/personCenter/myInvoice");
			// 	}

			// 	if (data == 1) {
			// 		console.log("跳转至用户协议")
			// 		$router.push("hdb/personCenter/userAgreement");
			// 	}

			// 	if (data == 2) {

			// 		if (this.userinfoType == '1') {
			// 			uni.showModal({
			// 				title: '提示',
			// 				content: '您还不是企业用户，请先去认证',
			// 				confirmColor: '#' + $storage.get('baseColor'),
			// 				success(res) {
			// 					let pages = getCurrentPages()
			// 					if (res.confirm) {
			// 						let currentPage = pages[pages.length - 1]
			// 						let redirectUrl = currentPage.route.replace('pages/', '').replace('/main', '')
			// 						$router.push('register/b2bRegisterCom')
			// 					} else if (res.cancel) {
			// 						if (pages.length > 1) {
			// 							$router.back()
			// 						}
			// 					}
			// 				}
			// 			})
			// 		} else {
			// 			console.log("跳转至企业信息")
			// 			$router.push("register/companyInfo");
			// 		}


			// 	}

			// 	if (data == 3) {
			// 		uni.showModal({
			// 			title: '提示',
			// 			content: '积分商城暂未开放！',
			// 			confirmColor: '#' + $storage.get('baseColor'),
			// 			success(res) {
			// 				let pages = getCurrentPages()
			// 				if (res.confirm) {
			// 					// let currentPage = pages[pages.length - 1]
			// 					// let redirectUrl = currentPage.route.replace('pages/', '').replace('/main', '')
			// 					// $router.push('authorization')
			// 				} else if (res.cancel) {

			// 				}
			// 			}
			// 		})
			// 		// console.log("跳转至积分商城")
			// 		// $router.push("user_modules/user/pointsMall");

			// 	}

			// 	if (data == 4) {
			// 		console.log("跳转至合约商城购物车")
			// 		$router.push("hdb/personCenter/contractCar");
			// 	}

			// },

			getPrivacy(data) {
				if (data == 0) {
					console.log("跳转至隐私详情")
					$router.push("hdb/personCenter/detailsHDB");
				}

				if (data == 1) {
					console.log("跳转至关于海德堡详情页")
					$router.push("hdb/personCenter/aboutHdb");
				}

			},
			onShareAppMessage(res) {
				return {
					title: '海德堡',
					path: '/pages/mine/main'
				};
			},
			// 子组件中获取到用户信息，通知父组件更新props中的message
			// updateUserInfo() {
			// 	this.message = $storage.get('userInfo');
			// },

			/**
			 * 根据“个人中心”children路由配置页面
			 * @param {Object} menuList
			 */
			settingMenu(menuList) {
				menuList.map((val, index) => {
					if (val.menuDefaultClass == 'columnList' || val.menuName == '应用') {
						console.log("应用。。。", val.children)
						this.columnApplicationIndex.push(val.proappMenuOrder);
						this.application[val.proappMenuOrder] = val.children.filter(v => v.menuShow === 0);
						// 还需要优化
						this.$state.set('application', val.children.filter(v => v.menuShow === 0));
						this.$state.set('columnList', val.children.filter(v => v.menuShow === 1));

						this.application[val.proappMenuOrder].map(v => {
							if (v.menuAction == 'webmail') {
								this.webmail = v.menuJspath;
							}
						});
					}
					if (val.menuDefaultClass == 'rowListNav' || val.menuName == '我的订单') {
						// 待付款，待发货，待收货，待评价，售后
						this.myOrder = val.children.filter(v => v.menuShow === 0).filter(vt => vt.menuAction !=
							'order').splice(0,3);
						// 全部订单
						let orderIndex = val.children.filter(v => v.menuShow === 0).filter(vt => vt.menuAction ==
							'order')
						this.$state.set('orderIndex', orderIndex);
						this.$state.set('myOrder', this.myOrder);
						this.$state.set('orderMenu', val.children.filter(v => v.menuShow === 1));
						// 订单搜索和订单搜索结果页
						orderIndex[0].routechildren.map(vc => {
							if (vc.menuAction == 'orderSearch') {
								this.$state.set('orderSearch', vc.menuJspath);
							}
							if (vc.menuAction == 'orderSearchResult') {
								this.$state.set('orderSearchResult', vc.menuJspath);
							}
						});
					}
					if (val.menuName == '导航') {
						console.log("导航。。。nav", val.children)
						this.nav = val.children;
						this.$state.set('nav', val.children);
					}
				});
				let moreToolsList = [];
				this.nav.map(val => {
					if (val.menuAction === 'collectionGoods' || val.menuAction === 'history') moreToolsList.push(
						val);
				});
				this.$state.set('moreToolList', moreToolsList);
			},

			// 退出当前账号
			loginOut() {
				http.get(loginOut).then(res => {});
			},

			// 订单
			statusOrder(dataState) {
				// console.log(dataState, order, '订单点击');
				$router.push("salesEnd/pages/quotationList",{state:dataState})
			},

			// 应用列表点击
			applicationList(app, index) {
				console.log(app);
				// 每次跳转将该节点下的路由存到本地存储，便于该节点下的子页面获取到自己的路由以及子级路由
				this.$state.set('currentRouter', app);
				$router.push(app.menuJspath);
			}
		}
	};
</script>
<style lang="less">
	@import '../../../../common/css/common.less';

	.lookDetail {
		position: absolute;
		right: 8%;
		color: #AAAAAA;
	}

	.showCla1 {
		height: 210rpx;
		display: flex;
		border-top: 0rpx solid #f5f5f5;
		border-bottom: 2rpx solid #f5f5f5;
		background: #fff;
	}

	.showCla {
		margin-left: 76rpx;
		width: 20%;
		height: 210rpx;
		text-align: center;
		// line-height: 240rpx;
	}

	.user {

		&-header {
			height: 270rpx;
			padding: @padding-lr;
			// background: url('../../static/img/mine/user_bg.jpg') no-repeat center center;
			background-size: 100% 100%;

			&-message {
				text-align: @t-right;
				height: 80rpx;
				line-height: 80rpx;

				i {
					color: @white-color;
				}
			}

			&-box {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				color: @white-color;
				font-size: @big-title;

				&-img {
					width: 130rpx;
					height: 130rpx;
					margin-right: @margin-right;

					img {
						width: 130rpx;
						height: 130rpx;
						border-radius: 50%;
					}
				}

				h3 {
					position: relative;
					text-align: center;

					i {
						width: 12rpx;
						height: 12rpx;
						border-radius: 50%;
						position: absolute;
						right: -16rpx;
						top: -23rpx;
						border: 4rpx solid #0070ac;
					}
				}

				p {
					margin-top: 5rpx;
					padding: 9rpx 12rpx;
					background: #0070ac;
					border-radius: 8rpx;
					display: inline-block;
					font-size: @middle-title;
				}
			}
		}

		&-collection {
			display: flex;
			background: @white-color;

			a {
				flex: 1;
				height: 80rpx;
				line-height: 80rpx;
				text-align: @t-center;

				h4 {
					font-size: @middle-title;
					color: @color-999;
				}
			}
		}

		&-order {
			// border-top: 20rpx solid #f5f5f5;
			// border-bottom: 20rpx solid #f5f5f5;
			background: @white-color;

			&-title {
				margin: @margin-lr;
				font-size: @big-title;
				padding: @padding-tb;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #f5f5f5;

				div {
					display: flex;
					align-items: center;
					font-size: @middle-title;
					color: @color-999;

					i {
						font-size: 32rpx;
						color: #9d9d9d;
					}
				}
			}

			&-my {
				display: flex;
				padding: @padding;

				div {
					flex: 1;
					text-align: @t-center;
					font-size: @middle-title;

					i {
						display: inline-block;
						// width: 72rpx;
						// height: 72rpx;
						// background: #ebdfdf;
						// border-radius: 50%;
						font-size: 44rpx;
						text-align: @t-center;
						line-height: 72rpx;
						margin-bottom: 5rpx;
					}
				}
			}
		}

		&-list {
			// margin-bottom:@margin-bottom;
			background: @white-color;
			border-bottom: 5rpx solid #f5f5f5;
			/* #ifdef MP-ALIPAY */
			margin-bottom: 100rpx;
			/* #endif */

			ul {
				margin: @margin-lr;

				li {
					border-bottom: 1rpx solid #f5f5f5;

					.user-list-item {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 30rpx 0;

						div {
							display: flex;
							align-items: center;

							i {
								font-size: 32rpx;
								color: #b79f77;
							}

							p {
								margin-left: 10rpx;
								font-size: @big-title;
								color: @color-666;
							}
						}

						.fr {
							font-size: 32rpx;
							float: right;
							color: #9d9d9d;
						}
					}
				}
			}
		}

		.user-list:last-of-type {
			border-bottom: none;
			margin-bottom: 102rpx;
		}
	}

	.creatButton button {
		font-size: 15px;
		color: #FFFFFF;
		width: 45%;
		background-color: #004178;
	}
</style>
