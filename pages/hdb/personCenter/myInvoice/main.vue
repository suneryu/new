<template>
	<div class="orderList">
		<!-- <qj-mini-search-nav-bar inputPlaceholder="输入商品名称搜索订单" @getNavBarHeight="getNavBarHeight" :isSearch="true" @search="toSearch"></qj-mini-search-nav-bar> -->
		<div class="orderList-tit" v-bind:style="{ top: topDistance + 'px' }">
			<ul>
				<!-- <li v-for="(item, index) in items" :key="index" @click="orderTitle(item, index)">
					<div :class="current === index ? 'active' : ''" :style="{ color: current === index ? baseColor : '' }">
						{{ item }}
						<span :style="{ background: baseColor }"></span>
					</div>
				</li> -->
			</ul>
		</div>
		<div class="orderList-info" v-if="orderList.length > 0">
			<ol>
				<li v-for="(order, index) in orderList" :key="index">
					<div class="order-item">
						<div class="order-status">
							<div class="order-info">
								<div class="order-tag" v-if="order.contractType == '30' || order.contractType == '06'" v-bind:style="[orderTag[order.contractType]]">
									{{ orderTagText[order.contractType] }}
								</div>
								<div>订单编号：{{ order.contractBillcode }}</div>
							</div>
						<!-- 	<div v-if="order.dataState == -1">已取消</div>
							<div v-else-if="order.dataState == 1">待付款</div>
							<div v-else-if="order.dataState == 2">待发货</div>
							<div v-else-if="order.dataState == 3">待收货</div>
							<div v-else-if="order.dataState == 4">交易成功</div> -->
						</div>
						<div class="order-msg" v-for="(goods, goodsIndex) in order.goodsList" :key="goodsIndex" @click="orderDetail(order)">
							<img :src="goods.dataPic || userImgurl" />
							<div>
								<div>
									<p class="currentP">{{ goods.goodsName }}</p>
									<h6>{{ goods.skuName }}</h6>
								</div>
								<div style="text-align:right;">
									<p style="width:160rpx;">{{ unitPrice.obpay }}{{ goods.pricesetNprice }}{{ unitPrice.mapay }}</p>
									<h6>x{{ goods.goodsNum }}</h6>
								</div>
							</div>
						</div>

						<div class="order-btn">
							<!-- <div class="left">
								实付:
								<i :style="{ color: '#d66377' }">{{ unitPrice.obpay }}{{ order.dataBmoney }}{{ unitPrice.mapay }}</i>
							</div> -->
							<!-- <div class="right" v-if="order.dataState == 1">
								<div class="btn" @click="cancelOrder(order)">取消订单</div>
								<div class="btn" @click="pay(order)" :style="{ borderColor: baseColor, color: baseColor }">立即支付</div>
							</div>
							<div class="right" v-else-if="order.dataState == 2">
							</div>
							<div class="right" v-else-if="order.dataState == 3">
								<div class="btn" @click="queryExpressInfo(order)">查看物流</div>
								<div v-if="order.contractPmode != 3" class="btn" @click="confirmReceive(order)" :style="{ borderColor: baseColor, color: baseColor }">确认收货</div>
							</div>
							<div class="right" v-else-if="order.dataState == 4">
								<div v-if="order.contractAppraise == 1"></div>
								<div class="btn" v-else @click="evaluate(order.goodsList)" :style="{ borderColor: baseColor, color: baseColor }">去评价</div>
							</div> -->
						</div>
					</div>
				</li>
			</ol>
		</div>
		<div class="orderList-nulls" v-else><img :src="nullImg" /></div>
		<qj-mini-last-page-line :lastPageLine="lastPageLine"></qj-mini-last-page-line>
	</div>
</template>

<script>
import { myOrder, refund, addShoppingGoods, addShoppingGoodsBySpec } from '@/node_modules/qj-mini-pages/libs/api/interface.js';
export default {
	props: {
		propPageOptions: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			pageOptions: '',
			items: ['我的发票'],
			orderList: [], //订单列表
			myOrder: [], //菜单--》订单搜索路径
			current: 0,
			baseColor: '', //颜色
			page: 1, //分页
			total: 0, //列表数据总数
			rows: 10,
			//dataState//已取消（-1），初始化（0），待付款（1），待发货（2），待收货（3），成功（4）
			dataState: 1, //table切换接口标示
			lastPageLine: false, //底部提示
			userImgurl: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noOrder.png', // 暂无发票的图片
			pageOptions: '',
			searchPath: '',
			topDistance: 0,
			orderTag: {
				'30': {
					backgroundColor: 'rgba(0, 166, 230, 0.2)',
					borderColor: '#00A3E0',
					color: '#00A3E0'
				},
				'06': {
					backgroundColor: 'rgba(250, 79, 79, 0.2)',
					borderColor: '#FA4F4F',
					color: '#FA4F4F'
				}
			},
			orderTagText: {
				'30': '预售订单',
				'06': '积分订单'
			}
		};
	},
	onLoad(options) {
		if (options) {
			this.pageOptions = options;
		}
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || this.$qj.storage.get('unitPrice');
		}
	},
	watch: {
		propPageOptions(newValue, oldValue) {
			this.pageOptions = newValue;
			this.dataState = this.pageOptions.dataState;
			this.current = Number(this.pageOptions.dataState);
		}
	},

	destroyed() {
		this.page = 1;
	},
	mounted() {
		console.log("我的发票----")
		this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
		this.searchPath = this.$state.orderSearch;
	},
	onShow() {
		this.commonMounted();
	},
	onReachBottom() {
		this.loadMore();
	},
	watch: {
		current(val) {
			this.lastPageLine = false;
			this.orderList = [];
		}
	},
	methods: {
		getNavBarHeight(h) {
			this.topDistance = h;
		},

		commonMounted(dataState = '4') {
			if (dataState) {
				this.dataState = dataState;
				this.current = Number(dataState);
			}
			let params = {
				page: this.page,
				rows: this.rows,
				childFlag: true,
				contractInvstate:"1"
			};
			if (this.current !== 0) {
				params.dataState = this.dataState;
			} else {
				delete params.dataState;
			}
			if (this.current == 4) {
				params.dataStateBuy = 1;
				params.contractAppraise = 0;
			} else {
				delete params.dataStateBuy;
				delete params.contractAppraise;
			}

			this.$qj
				.http(this.$qj.domain)
				.get(myOrder.queryContractPage, params)
				.then(res => {
					if (res && res.rows) {
						if (this.page === 1 && res.rows.length === 0) {
							this.orderList = [];
						} else {
							let list = res.rows.filter(({ contractType }) => {
								return contractType != '28';
							});
							list.map(v => {
								v.goodsList.map(val => {
									if (!RegExp(/http/).test(val.dataPic)) {
										val.dataPic = this.$domain + val.dataPic;
									}
								});
							});
							if (this.page === 1) {
								this.orderList = list;
							} else {
								this.orderList = [...this.orderList, ...list];
							}
						}

						this.total = res.total;
					}
				});
		},
		orderTitle(item, index) {
			this.current = index;
			this.$qj.state.set('orderTabIndex', index);
			if (index > 0) {
				this.dataState = index;
			}
			this.page = 1;
			this.rows = 10;
			this.commonMounted();
		},
		pay(order) {
			this.$state.set('contractBillcode', order.contractBillcode);
			this.$qj.router.push('pay/paySelect', {
				dataBmoney: order.dataBmoney,
				contractBillcode: order.contractBillcode,
				contractPmode: order.contractPmode
			});
		},
		evaluate(order) {
			this.$state.set('order', order);
			this.$state.orderMenu.map(v => {
				if (v.menuAction == 'evaluate') {
					this.$qj.router.push(v.menuJspath);
				}
			});
		},
		queryExpressInfo(order) {
			let params = {
				expressType: order.packageList[0].expressCode,
				expressNo: order.packageList[0].packageBillno,
				expressName: order.packageList[0].expressName,
				address: order.goodsReceiptArrdess,
				img: order.goodsList[0].dataPic,
				num: order.goodsList.length
			};
			this.$qj.router.push('logistics_modules/infor', params);
		},
		confirmReceive(order) {
			let that = this;
			wx.showModal({
				content: '确认收货',
				success(res) {
					if (res.confirm) {
						that.$qj
							.http(that.$qj.domain)
							.post(myOrder.confirmReceive, {
								contractBillcode: order.contractBillcode
							})
							.then(res => {
								if (res && res.success) {
									that.$qj.message.success('确认收货成功');
								}
							})
							.then(() => {
								that.page = 1;
								that.commonMounted();
							});
					}
				}
			});
		},
		cancelOrder(order) {
			let that = this;
			wx.showModal({
				content: '取消订单',
				success(res) {
					if (res.confirm) {
						that.$qj
							.http(that.$qj.domain)
							.post(myOrder.cancelContractC, { contractId: order.contractId })
							.then(res => {
								if (res.success) {
									that.$qj.message.alert('取消成功!');
								}
							})
							.then(res => {
								that.page = 1;
								that.commonMounted();
							});
					}
				}
			});
		},

		/**
		 * 再次加入购物车
		 * 暂时弃用
		 * @param {Object} order
		 */
		addShoppingGoods(order) {
			//该方法暂时不用
			let goodsCode = [];
			let specStr = [];
			order.goodsList.map(val => {
				goodsCode.push(val.goodsCode);
				specStr.push(val.skuName);
			});
			let params = {
				goodsCode: goodsCode.join(','),
				specStr: JSON.stringify(specStr)
			};

			http.post(addShoppingGoodsBySpec, params).then(res => {
				http.post(addShoppingGoods, { skuId: res.dataObj.skuId, goodsNum: 1 }).then(res => {
					if (res.success) {
						$router.push('shopcart');
					}
				});
			});
		},

		orderDetail(order) {
			let params = {
				contractBillcode: order.contractBillcode,
				expressType: order.packageList[0].expressCode,
				expressNo: order.packageList[0].packageBillno
			};
			this.$state.orderMenu.map(v => {
				if (v.menuAction == 'orderInfor') {
					this.$qj.router.push(v.menuJspath, params);
				}
			});
		},
		toSearch(value) {
			if (!value) {
				this.$qj.message.alert('请输入商品名称');
				return;
			}
			let query = {
				goodsName: value
			};
			this.$qj.router.push(this.$state.orderSearchResult, query);
		},
		loadMore() {
			let num = Math.ceil(this.total / 10);
			this.page++;
			if (this.page <= num) {
				this.commonMounted();
			} else {
				this.lastPageLine = true;
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '@/node_modules/qj-mini-pages/libs/css/common.less';
.orderList {
	width: 100%;
	&-save {
		position: fixed;
		z-index: 9999;
		height: 90rpx;
		width: 70rpx;
		line-height: 90rpx;
		text-align: right;
		right: 30rpx;
		top: 0;
		font-size: @big-title;
	}
	&-tit {
		width: 100%;
		position: fixed;
		top: 90rpx;
		left: 0;
		z-index: 999;
		background: @white-color;
		padding-top: 10rpx;
		ul {
			display: flex;
			justify-content: space-between;
			padding: @padding-30;
			height: 90rpx;
			li {
				height: 90rpx;
				div {
					width: 100%;
					height: 100%;
					line-height: 90rpx;
					display: inline-block;
					position: relative;
					font-size: 28rpx;
					color: @color-333;
				}
				.active {
					span {
						position: absolute;
						height: 3rpx;
						width: 100%;
						bottom: 0;
						left: 0;
					}
				}
			}
		}
	}
	&-info {
		margin-top: 100rpx;
		ol {
			li {
				border-bottom: 20rpx solid #fafafa;
				padding: @padding-30;
				background: @white-color;
				&:first-child {
					border-top: 20rpx solid #fafafa;
				}
				&:last-child {
					border-bottom: 0;
				}
				.order-item {
					.order-status {
						height: 79rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						border-bottom: 1rpx solid #f6f6f8;
						> div {
							font-size: @big-title;
						}
						.order-info {
							display: flex;
							align-items: center;
							.order-tag {
								font-size: 20rpx;
								border-radius: 18rpx;
								border-width: 1rpx;
								border-style: solid;
								width: 105rpx;
								height: 34rpx;
								line-height: 34rpx;
								text-align: center;
								margin-right: 14rpx;
							}
						}
					}
					.order-msg {
						padding: 15rpx 0 48rpx 0;
						border-bottom: 1rpx solid #f6f6f8;
						display: flex;
						justify-content: space-between;
						img {
							width: 130rpx;
							height: 130rpx;
							margin-right: @margin-right;
						}
						> div {
							display: flex;
							justify-content: space-between;
							p {
								font-size: @big-title;
								color: @color-333;
								margin: 12rpx 0 25rpx 0;
							}
							.currentP {
								width: 380rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
							h6 {
								font-size: 24rpx;
								color: @color-999;
							}
						}
					}
					.order-btn {
						height: 88rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.left {
							display: flex;
							align-items: center;
							i {
								margin-left: 10rpx;
							}
						}
						.right {
							display: flex;
							align-items: center;
							.btn {
								display: inline-block;
								border: 1rpx solid #d4d4d4;
								line-height: 46rpx;
								border-radius: 26rpx;
								padding: 0 20rpx;
								font-size: 22rpx;
								color: @color-666;
								margin-right: @margin-right;
								&:last-child {
									margin-right: 0;
								}
							}
						}
					}
				}
			}
		}
	}
	&-nulls {
		height: calc(100% - 202rpx);
		text-align: center;
		img {
			width: 424rpx;
			height: 311rpx;
			margin: 380rpx auto 0;
		}
	}
}
</style>
