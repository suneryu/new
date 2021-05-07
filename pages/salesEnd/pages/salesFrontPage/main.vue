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
			<div @click="myInfo(0)">
				查看全部
				<i class="iconfont">&#xe61d;</i>
			</div>
		</div>
		<!-- 我的发票，用户协议， 企业信息 -->
		<div class="showCla1">
			<div class="showCla" @click="myInfo(1)">
				<div style='width: 100%;height: 62px;'>
					<image :src="djq" style="width: 50px;" mode="widthFix"></image>
				</div>
				<span>待接洽</span>
			</div>
			<div class="showCla" @click="myInfo(2)">
				<div style='width: 100%;height: 62px;'>
					<image :src="jqz" style="width: 50px;" mode="widthFix"></image>
				</div>
				<span>接洽中</span>
			</div>
			<div class="showCla" @click="myInfo(3)">
				<div style='width: 100%;height: 62px;'>
					<image :src="ywc" style="width: 50px;" mode="widthFix"></image>
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
			<button @click="invitation">邀请签约洽谈</button>
		</div>
		<div class="hd"  v-if='closeShow'>
			<div class="handleClose">
				<view class="qr-code" style="text-align: center;line-height: 340px;">
					<view class="box">
						<!-- <canvas canvas-id='canvas-demo' class='demo' style="width:100%;height:60vh" @click="saveimg"></canvas> -->
						<img  :src="miniQRCode" alt="图片Base64编码" style="max-width:90%; max-height:2000px;" mode="widthFix"/>
					</view>
					<!-- <div class='img_box'>
						<i class="cancel iconfont icon-shanchu2" @click="cancelCode" style="color: #ffffff;margin-top: -100rpx;font-size: 24px;"></i>
					</div> -->
				</view>
				<div class="creatButton" style="display: flex; justify-content: center; margin: 40rpx 20rpx 10rpx 20rpx; position: absolute;
				bottom: 0">
					<button @click="handleClose1">关闭</button>
				</div>
			</div>
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
		getWxMiniQRCode,
		getPersonal
	} from '@/api/interfaceHDB.js';
	import {
		clearTimeout,
		setTimeout
	} from 'timers';
	export default {
		data() {
			return {
				closeShow:false,
				tabName:["待确认","已完成","已取消"],
				show: false,
				selectNavIndex: 3,
				appid: '',
				secret: '',
				state: 'wx',
				grant_type: '',
				domains: this.$domain,
				djq: '', //待接洽
				jqz: "", // 接洽中
				ywc: "", //已完成
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
				userinfoType: "", //用户类型
				miniQRCode:''
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
			this.djq = this.$domain + '/paas/shop/2020063000000001/2021-04-28/5bd23eec2edc494588836f7820eb2412.png';
			this.jqz = this.$domain + '/paas/shop/2020063000000001/2021-04-29/7cad91913672419fb074e90f1fcbda7f.png';
			this.ywc = this.$domain + '/paas/shop/2020063000000001/2021-04-29/6094f8a21b8645ebbd683ec22071959c.png';

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
			// 跳转到我的预约里面
			myInfo(data){
				console.log('datappppp-',data)
				let params={
						info:data
					}
				
					 
				
				console.log(params,'params---')
				this.$qj.router.push("salesEnd/pages/salesConstractList", params)	
				
		
				
			},
			handleClose1(){
				this.closeShow = false;
			},
			// 邀请洽谈二维码
			invitation(){
				this.closeShow = true
				let params = {
				
				};
					params.page = 'pages/hdb/contractsListHDB/main';
					//params.scene = "i=2&p="+'15234496108';
					params.scene = "15234496108";
					params.mode = 0;
					// params.id = 2;
					// params.type = 'c';
					
				
				this.getErWeiMa(params)
			},
			getErWeiMa(params) {
			
				http.post(getWxMiniQRCode, params).then(res => {
					console.log('图片编码----',res)
					if (res.success) {
						this.miniQRCode = 'data:image/png;base64,' + res.dataObj.dataObj.toString('base64');
						// console.log('66666666-',this.miniQRCode)
						// this.getImg()
					}
				});
			},
			add() {
			   $router.push("salesEnd/pages/contractCustomers",)
			},
			Myclients() {
				console.log("我的客户")
				$router.push("salesEnd/pages/myClients")
			},
	

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
		height: 65%;
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
</style>
