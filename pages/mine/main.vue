<template>
	<div class="user">
		<headerCenter :baseColor="baseColor" :message="message" :isShow="isShow" :nav="nav" :webmail="webmail" :userLevel="userLevel" />
		<!-- <button type="button" @click="loginOut()">退出当前账号</button> -->
		<div class="user-order">
			<div class="user-order-title">
				<span>我的订单</span>
				<div @click="statusOrder(0, 1)">
					全部订单
					<i class="iconfont">&#xe61d;</i>
				</div>
			</div>
			<div class="user-order-my">
				<div @click="statusOrder(orderIndex + 1, order)" v-for="(order, orderIndex) in myOrder" :key="orderIndex">
					<i class="iconfont" :class="order.menuSelectClass ? order.menuSelectClass : 'icon-wodedingdan'" :style="{ color: baseColor }"></i>
					<p>{{ order.menuName }}</p>
				</div>
			</div>
		</div>
		<div class="user-list" v-for="(colItem, colIndex) in columnApplicationIndex" :key="colIndex">
			<ul>
				<li v-for="(app, index) in application[colItem]" :key="index">
					<div class="user-list-item" @click="applicationList(app, index)">
						<div>
							<i class="iconfont" :class="app.menuSelectClass ? app.menuSelectClass : 'icon-wodedingdan'" :style="{ color: baseColor }"></i>
							<p>{{ app.menuName }}</p>
						</div>
						<i class="iconfont fr">&#xe61d;</i>
					</div>
				</li>
			</ul>
		</div>
		<vueTabBar :selectNavIndex="selectNavIndex" :baseColor="baseColor" :footerMenu="footerMenu" />
	</div>
</template>
<script>
import getUserInfo from '@/components/communal/getUserInfo';
import headerCenter from '@/components/personal/index';
import { $storage, $router } from '@/utils/prototype/vue.js';
import http from '@/api/http.js';
import vueTabBar from '@/components/communal/vueTabBar';
import { loginOut, getProappinfo, loginIn, getTopPerMenuList, getTopPerMenuListFPc, thirdLogin, loginMicroMessenger, loginMiniProgram, getPersonal } from '@/api/interface.js';
import { clearTimeout, setTimeout } from 'timers';
export default {
	data() {
		return {
			show: false,
			selectNavIndex: 3,
			appid: '',
			secret: '',
			state: 'wx',
			grant_type: '',
			domains: this.$domain,
			baseColor: '',
			message: '',
			isShow: false,
			application: {}, //应用
			footerMenu: [], //底部菜单
			myOrder: [],
			userImgurl: require('../../static/img/mine/default_header.png'), //头像
			webmail: '',
			nav: [],
			// 多样式展示应用列表idnex 对应路由接口中的proappMenuOrder
			columnApplicationIndex: [],
			// 用户等级
			userLevel: '',
		};
	},
	onLoad() {
		this.baseColor = `#${$storage.get('baseColor')}`;
		wx.setNavigationBarTitle({
			title: $storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.baseColor
		});
	},

	onShow() {
		// console.log('个人中心onShow');
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
		// console.log('这里是个人中心')
	},
	mounted() {
		this.footerMenu = $storage.get('footerMenu');

		this.footerMenu.forEach(element => {
			if (element.menuAction == 'user') {
				this.settingMenu(element.children);
			}
		});
	},
	components: { headerCenter, getUserInfo, vueTabBar },
	methods: {
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
					this.myOrder = val.children.filter(v => v.menuShow === 0).filter(vt => vt.menuAction != 'order');
					// 全部订单
					let orderIndex = val.children.filter(v => v.menuShow === 0).filter(vt => vt.menuAction == 'order');
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
					this.nav = val.children;
					this.$state.set('nav', val.children);
				}
			});
			let moreToolsList = [];
			this.nav.map(val => {
				if (val.menuAction === 'collectionGoods' || val.menuAction === 'history') moreToolsList.push(val);
			});
			this.$state.set('moreToolList', moreToolsList);
		},

		// 退出当前账号
		loginOut() {
			http.get(loginOut).then(res => {});
		},

		// 订单
		statusOrder(dataState, order) {
			console.log(dataState, order, '订单点击');

			if (order.menuCode == '00000200') {
				this.myOrder.map(v => {
					if (v.menuAction == 'refundList') {
						$router.push(v.menuJspath);
					}
				});
			} else {
				$router.push(this.myOrder[0].menuJspath, { dataState: dataState });
			}
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
@import '../../common/css/common.less';
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
		border-top: 20rpx solid #f5f5f5;
		border-bottom: 20rpx solid #f5f5f5;
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
		border-bottom: 20rpx solid #f5f5f5;
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
</style>
