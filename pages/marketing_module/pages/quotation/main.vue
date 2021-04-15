<template>
	<div class="orderList">
		<div class="orderList-info">
			<ol>
				<li v-for="(order, index) in orderList" :key="index">
					<div class="order-item">
						<div class="order-status">
							<div class="order-info">
								<div>报价单编号：{{ order.contractBillcode }}</div>
							</div>
							<div v-if="order.dataState == -1">已取消</div>
							<!-- <div v-else-if="order.dataState == 1 && order.dataStatestr == '2' ">待审核</div> -->
							<!-- <div v-else-if="order.dataState == 1 && order.dataStatestr == '1' ">待确认</div> -->
							<div v-else-if="order.dataState == 2">待确认</div>
							<!-- <div v-else-if="order.dataState == 3">待收货</div> -->
							<div v-else-if="order.dataState == 3">已完成</div>
							<button class="buttonClass" @click="toQuotaDetail(order.contractBillcode)" v-if="order.dataState != -1">查看编辑</button>
						</div>
						<div class="order-msg" v-for="(goods, goodsIndex) in order.goodsList" :key="goodsIndex">
							<img :src="goods.dataPic || userImgurl" />
							<div>
								<div>
									<p class="currentP">{{ goods.goodsName }}</p>
									<h6>{{ goods.skuName }}</h6>
								</div>
								<div style="text-align:right;">
									<p style="width:160rpx;color: #ff557f;">{{ unitPrice.obpay }}{{ goods.pricesetNprice }}{{ unitPrice.mapay }}</p>
									<h6>x{{ goods.goodsNum }}</h6>
									<!-- <button class="buttonClass" @click="toQuotaDetail(order.contractBillcode)" v-if="order.dataState != -1">查看编辑</button> -->
								</div>
							</div>
						</div>
					</div>
				</li>
			</ol>
		</div>
	</div>
</template>

<script>
import { queryContractPageC } from '@/api/interface.js';
import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
export default {
	data() {
		return {
			orderList: [], //订单列表
			baseColor: '', //颜色
			page: 1, //分页
			total: 0, //列表数据总数
			rows: 10,
			userImgurl: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noOrder.png',
			searchPath: '',
			topDistance: 0,
		};
	},
	onLoad(options) {
		// console.log('跳转页面---',options)
		// console.log('------',JSON.parse(options)[0])
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
	destroyed() {
		this.page = 1;
	},
	mounted() {
		this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
		this.searchPath = this.$state.orderSearch;
	},
	onShow() {
		this.commonMounted();
	},
	onReachBottom() {
		this.loadMore();
	},
	methods: {
		toQuotaDetail(item){
			let params = {
				code: item
			}
			$router.push("marketing_module/pages/quotation/quotationDetail",params)
		},
		getNavBarHeight(h) {
			this.topDistance = h;
		},

		commonMounted() {
			let params = {
				page: this.page,
				rows: this.rows,
				childFlag: true,
				contractType: 39,
				// memberBcode:this.$qj.storage.get('loginInfor').userInfoCode
				// memberBcode:'10000210376054'
			};
		
			this.$qj
				.http(this.$qj.domain)
				.get(queryContractPageC, params)
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
	background: #f5f5f5;
	&-info {
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
						padding: 15rpx 0 15rpx 0;
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
}
.buttonClass {
		width: 150rpx;
		height: 40rpx;
		line-height: 40rpx;
		color: #fff;
		background-color: #004178;
		font-size: 12px;
		float: right;
		// margin-top: 15rpx;
	}
</style>
