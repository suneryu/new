<template>
	<div class="orderList">
		<div class="orderList-tit" v-bind:style="{ top: topDistance + 'px' }">
			<ul>
				<li v-for="(item, index) in items" :key="index" @click="orderTitle(item, index)">
					<div :class="current === index ? 'active' : ''" :style="{ color: current === index ? baseColor : '' }">
						{{ item }}
						<span :style="{ background: baseColor}"></span>
					</div>
				</li>
			</ul>
		</div>
		<div class="orderList-info" v-if="orderList.length > 0">
			<ol>
				<li v-for="(order, index) in orderList" :key="index">
					<div class="order-item">
						<div class="order-status">
							<div class="order-info">
								<div>报价单编号：{{ order.contractBillcode }}</div>
							</div>
							<div v-if="order.dataState == -1">已取消</div>
							<div v-else-if="order.dataState == 2">待确认</div>
							<div v-else-if="order.dataState == 3">已完成</div>
						</div>
						<div class="order-status" style='justify-content: flex-start;'>
							<div class="order-info">确认有效期：</div>
							<u-count-down
								:timestamp='orderList[index].validPeriod'
								separator="zn"
								font-size="24"
								color="#fa4f4f"
								separator-color="#fa4f4f"
								separator-size="24"
							></u-count-down>
							<div style='color: #fa4f4f;margin-left: 5rpx;'>秒</div>
						</div>
						
						<div class="order-msg" v-for="(goods, goodsIndex) in order.goodsList" :key="goodsIndex">
							<img :src="goods.dataPic || userImgurl" />
							<div>
								<div>
									<p class="currentP">{{ goods.goodsName }}</p>
									<h6>{{ goods.skuName }}</h6>
								</div>
								<div style="text-align:right;">
									<!-- <p style="width:160rpx;color: #ff557f;">{{ unitPrice.obpay }}{{ goods.pricesetNprice }}{{ unitPrice.mapay }}</p> -->
									<p style="width:160rpx;color: #ff557f;">{{ goods.pricesetNprice }}</p>
									<h6>x{{ goods.goodsNum }}</h6>
								</div>
							</div>
						</div>
						<div style='display: flex;justify-content: space-between;height: 50rpx;align-items: center;color: #828282;'>
							<span>运费</span>
							<span style='color: #ff557f;'>{{Number(order.departShortname || 0)}} 元</span>
						</div>
						<div style='display: flex;justify-content: space-between;height: 50rpx;align-items: center;color: #828282;'>
							<span>咨询单总额</span>
							<span style='color: #ff557f;'>{{Number(order.contractInmoney) + Number(order.departShortname || 0)}} 元</span>
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
import http from '@/api/http.js';	
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
import { queryContractPageC} from '@/api/interface.js';
import { myOrder, refund, addShoppingGoods, addShoppingGoodsBySpec } from '@/node_modules/qj-mini-pages/libs/api/interface.js';
export default {
	data() {
		return {
			items: ['全部', '待确认','已完成', '已取消'],
			orderList: [], //订单列表
			myOrder: [], //菜单--》订单搜索路径
			current: 0,
			baseColor: '', //颜色
			page: 1, //分页
			total: 0, //列表数据总数
			rows: 10,
			//dataState//已取消（-1），初始化（0），待付款（1），待发货（2），待收货（3），成功（4）
			dataState: '', //table切换接口标示
			lastPageLine: false, //底部提示
			userImgurl: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noOrder.png',
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
		// console.log('跳转页面---',options)
		// console.log('------',JSON.parse(options)[0])
		if(options.state == '全部'){
			this.current = 0
			this.dataState = '';
			}
		if(options.state == '待确认'){
			this.current = 1
			this.dataState = 2;
		}
		if(options.state == '已完成'){
			this.current = 2
			this.dataState = 3;
		}
		if(options.state == '已取消'){
			this.current = 3
			this.dataState = -1;
		}
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || this.$qj.storage.get('unitPrice');
		}
	},

	destroyed() {
		this.page = 1;
	},
	mounted() {
		// this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
		this.baseColor = '#004178'
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
		},
	},
	methods: {
		getNavBarHeight(h) {
			this.topDistance = h;
		},

		commonMounted() {
			let params = {
					page: this.page,
					rows: this.rows,
					childFlag: true,
					contractType: '39',
					employeeCode: this.$qj.storage.get('loginInfor').userCode
					// memberBcode:this.$qj.storage.get('loginInfor').userInfoCode
				};
				if(this.dataState != ''){
					params.dataState=this.dataState
				}
			
				this.$qj
					.http(this.$qj.domain)
					// .get(queryContractPageC, params)
					.get('/web/oc/contract/queryContractPagePlat.json', params)
					.then(res => {
						// console.log(res,111111111111111111111)
						// this.orderList = res.list
						if (res && res.rows) {
							if (this.page === 1 && res.rows.length === 0) {
								this.orderList = [];
							} else {
								let list = res.rows.filter(({ contractType }) => {
									return contractType != '28';
								});
								
								list.map(v => {
									let date1 = new Date(v.gmtCreate);
									let date2 = new Date(date1);
									date2.setDate(date1.getDate() + 30);
									v.validPeriod = (date2.getTime()-new Date().getTime()) / 1000
									console.log(date2.getTime(),66666)
									if(v.goodsList != null){
										v.goodsList.map(val => {
										if (!RegExp(/http/).test(val.dataPic)) {
											val.dataPic = this.$domain + val.dataPic;
										}
										});
									}else{
										v.goodsList = []
									}
									
								});
								if (this.page === 1) {
									this.orderList = [];
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
			console.log('传来的---0',item,'====',index)
			this.current = index;
			this.$qj.state.set('orderTabIndex', index);
			if (index > 0) {
				this.dataState = index;
			}
			if(item == '全部'){
				this.dataState = '';
				}
			if(item == '待确认'){
				this.dataState = 2;
			}
			if(item == '已完成'){
				this.dataState = 3;
			}
			if(item == '已取消'){
				this.dataState = -1;
			}
			this.page = 1;
			this.rows = 10;
			this.commonMounted();
		},
		pay(order) {
			console.log('立即支付-----',order)
			this.$state.set('contractBillcode', order.contractBillcode);
			this.$qj.router.push('pay/paySelect', {
				dataBmoney: order.dataBmoney,
				contractBillcode: order.contractBillcode,
				contractPmode: order.contractPmode
			});
		},
		navigateTo(options) {
						this.$qj.router.push(options.url, options.query ? options.query : '');
					},
		refund(order){
			console.log('退款当前商品',order)
			let ocRefundGoodsBeanList = []
			let ocRefundGoodsBean = {};
			let price = 0;
			for(var i=0;i<order.goodsList.length;i++){
				ocRefundGoodsBean.contractGoodsCode = order.goodsList[i].contractGoodsCode;
				ocRefundGoodsBean.goodsCamount = order.goodsList[i].goodsCamount
				ocRefundGoodsBean.refundGoodsNum = order.goodsList[i].goodsCamount
				ocRefundGoodsBean.refundGoodsAmt = order.goodsList[i].pricesetNprice
				price +=order.goodsList[i].pricesetNprice
				ocRefundGoodsBeanList.push(ocRefundGoodsBean)
			
			}
	
			let fund = {
				ocRefundGoodsBeanList : ocRefundGoodsBeanList, 
				// ocRefundGoodsBeanList: [
				// 	{
				// 		contractGoodsCode: this.items.contractGoodsCode,
				// 		goodsCamount: this.items.goodsCamount,
				// 		refundGoodsNum: this.items.goodsCamount,
				// 		refundGoodsAmt: this.items.pricesetNprice
				// 	}
				// ],
				contractBillcode: order.contractBillcode,  //原合同单据号
				refundMoney: price,   //退款金额
				// refundEx: order.pickerValue,   //退货理由
				// refundMeo: order.refundMeo,  //退货说明
				// ocRefundFileDomainList: domainList,
				refundType: 'B01'  //退货类型
			};
			
			http.post(refund.saveRefund, { params: JSON.stringify(fund) }).then(res => {
						if (res.success) {
							let refundCode = JSON.parse(res.dataObj).code;
							$message.alert('退款申请成功');
							$router.replace(this.menuJspath, { refundCode: refundCode });
						} else {
							$message.alert(res.msg);
						}
			})
			
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
			console.log('查看物流---',order)
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
					console.log('res取消订单----',res)
					if (res.confirm) {
						that.$qj
							.http(that.$qj.domain)
							.post(myOrder.cancelContractC, { contractId: order.contractId })
							.then(res => {
								console.log('res取消接口----',res)
								if (res.success) {
									that.$qj.message.alert('取消成功!');
								}
							})
							.then(res => {
								console.log('这个是结果-',res)
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
