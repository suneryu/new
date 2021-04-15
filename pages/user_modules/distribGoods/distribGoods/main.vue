<template>
	<div class="distrib-goods">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon"></commonHeader>
		<div class="content">
			<!-- <div class="top-nav-bar">
				<span
					class="nav-bar-item"
					:class="{ active: navIndex == index }"
					v-bind:style="{ color: navIndex == index ? baseColor : '#333333', borderColor: navIndex == index ? baseColor : '' }"
					v-for="(item, index) in navBar"
					:key="index"
					@click="navClick(index)"
				>
					{{ item }}
				</span>
			</div> -->
			<div class="goods-list" v-if="goodsList.length > 0">
				<div class="goods-item" v-for="(item, index) in goodsList" :key="index">
					<img class="goods-img" :src="item.dataPic || userImgurl" />
					<div class="info">
						<p class="name-price">
							<span class="name">{{ item.goodsName }}</span>
							<span class="price">{{ item.pricesetNprice }}{{ unitPrice.mapay }}</span>
						</p>
						<p class="dis-rule">
							<span>佣金比例{{ item.shsettlRate1 }}%</span>
							<span>预计可赚{{ willEarn(item) }}{{ unitPrice.mapay }}</span>
						</p>
						<div class="btn-share"><span v-bind:style="{ backgroundColor: baseColor, borderColor: baseColor }" @click="goShare(item)">分享</span></div>
					</div>
				</div>
			</div>
			<div class="empty" v-if="goodsList.length === 0"><img :src="emptyImg" /></div>
		</div>
	</div>
</template>

<script>
import commonHeader from '@/components/communal/commonHeader.vue';
import http from '@/api/http.js';
import { getShsettlRateconGoods } from '@/api/interface.js';
export default {
	components: {
		commonHeader
	},

	data() {
		return {
			userImgurl: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
			title: '商品列表',
			leftIcon: true,
			rightIcon: false,
			emptyImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noGoods.png',
			baseColor: '',
			navIndex: 0,
			navBar: ['营销', '佣金', '最新', '销量', '价格'],
			goodsList: [],
			detailsHref: '',
			page: 1,
			loadMoreOn: true,
			isLastPage: false
		};
	},
	computed: {
		unitPrice() {
			return this.$storage.get('unitPrice');
		},
		willEarn() {
			return function(item) {
				return Math.round((item.shsettlRate1 / 100) * item.pricesetNprice * 100) / 100;
			};
		}
	},
	onLoad() {
		this.baseColor = `#${this.$state.baseColor}`;
		this.$setTitle(this.$storage.get('proappEnvName'));
		wx.setNavigationBarColor({
			frontColor: '#FFFFFF',
			backgroundColor: this.baseColor
		});
	},
	onShow() {},
	onReachBottom() {
		console.log('上拉加载');

		if (this.loadMoreOn && !this.isLastPage) {
			this.page++;
			this.getGoodsList(
				data => {
					this.goodsList.push(...data.rows);
					this.isLastPage = this.page > data.pageTools.pageCount;
				},
				this.page,
				10
			);
		}
	},
	mounted() {
		this.getGoodsList(
			data => {
				this.goodsList = data.rows;
			},
			1,
			10
		);
	},
	methods: {
		getGoodsList(callback, currPage, num) {
			this.loadMoreOn = false;
			let params = {
				page: currPage,
				rows: num
			};
			http.get(getShsettlRateconGoods, params)
				.then(res => {
					if (res.rows.length > 0) {
						res.rows.map(v => {
							if (!RegExp(/http/).test(v.dataPic)) {
								v.dataPic = this.$domain + v.dataPic;
							}
						});
						this.loadMoreOn = true;
						callback(res);
					}
				})
				.catch(err => {});
		},

		navClick(index) {
			this.navIndex = index;
		},

		goShare(item) {
			console.log(item);
			let att = this.$businessDomain + '/paas/shop/' + this.$storage.get('hrefs') + item.skuCode + '.html';
			console.log(att);
			this.$router.push('web', {
				defaultUrl: att
			});
			// location.href = process.env.API_ROOT + process.env.PNSTATIC + this.detailsHref + item.skuCode + '.html';
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@/common/css/common.less';
.distrib-goods {
	height: 100%;
	background-color: @white-color;
	.content {
		height: 100%;
		padding-top: 93rpx;
		background: #fafafa;
		// .top-nav-bar {
		// 	background-color: @white-color;
		// 	position: fixed;
		// 	width: 100%;
		// 	display: flex;
		// 	z-index: 2;
		// 	justify-content: space-around;
		// 	.nav-bar-item {
		// 		font-size: 28rpx;
		// 		color: #333333;
		// 		padding: 36rpx 36rpx 26rpx 36rpx;
		// 		&.active {
		// 			border-bottom: 1rpx solid;
		// 		}
		// 	}
		// }
		.goods-list {
			// margin-top: 126px;
			// padding-top: 100rpx;
			background-color: #fafafa;
			.goods-item {
				background-color: @white-color;
				margin-top: 24rpx;
				height: 244rpx;
				width: 100%;
				display: flex;
				align-items: center;
				.goods-img {
					width: 180rpx;
					height: 180rpx;
					margin-left: 20rpx;
					object-fit: cover;
				}
				.info {
					flex: 1;
					margin: 0 30rpx;
					.name-price {
						margin-bottom: 35rpx;
						color: #333333;
						display: flex;
						align-items: center;
						.name {
							font-size: 26rpx;
							display: -webkit-box;
							overflow: hidden;
							text-overflow: ellipsis;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							margin-right: 20rpx;
							flex: 1;
						}
						.price {
							font-size: 26rpx;
						}
					}
					.dis-rule {
						color: #999999;
						font-size: 24rpx;
					}
					.btn-share {
						display: flex;
						justify-content: flex-end;
						margin-top: 26rpx;
						span {
							color: @white-color;
							width: 128rpx;
							height: 49rpx;
							border: 1rpx solid;
							border-radius: 24rpx;
							text-align: center;
							line-height: 49rpx;
						}
					}
				}
			}
		}
		.empty {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			img {
				width: 320rpx;
				height: 240rpx;
				object-fit: cover;
			}
		}
	}
}
</style>
