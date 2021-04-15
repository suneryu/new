<template>
	<div class="shopList">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<div class="shopList-left" @click="replaceBack"><i class="iconfont">&#xe62d;</i></div>
		<div class="shopList-con">
			<ul>
				<li v-for="(item, index) in items" :key="index">
					<a @click="toShopList(item)">
						<img :src="item.shopdeLogo ? item.shopdeLogo : userImgurl" />
						<div>
							<h2>
								{{ item.shopdeName }}
								<i class="iconfont">&#xe61d;</i>
							</h2>
							<p>{{ item.shopdeDecription ? item.shopdeDecription : '' }}</p>
						</div>
					</a>
				</li>
			</ul>
		</div>
		<lastPageLine :lastPageLine="lastPageLine" />
	</div>
</template>
<script>
import http from '@/api/http.js';
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
import { shopList } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
import lastPageLine from '@/components/communal/last-page-line';
export default {
	data() {
		return {
			title: '优选商家',
			leftIcon: false,
			rightIcon: false,
			lastPageLine: false,
			page: 1,
			rows: 10,
			total: 0,
			items: [],
			userImgurl: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/shop_default.png'
		};
	},
	onLoad(options) {
		Object.assign(this, this.$options.data());
		wx.setNavigationBarTitle({
			title: $storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + this.$state.baseColor
		});
	},
	components: {
		commonHeader,
		lastPageLine
	},
	onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.loadMore();
	},
	mounted() {
		this.commonMounted();
	},
	methods: {
		commonMounted() {
			http.get(shopList, { page: this.page, rows: this.rows }).then(res => {
				if (res) {
					this.items = res.rows;
					this.items.map(v => {
						if (v.shopdeLogo && !RegExp(/http/).test(v.shopdeLogo)) {
							v.shopdeLogo = this.$domain + v.shopdeLogo;
						}
					});
					this.total = res.total;
				}

				if (this.items.length === 0) {
					this.lastPageLine = false;
				}
			});
		},
		replaceBack() {
			$router.replace('web', { defaultUrl: this.$domain + '/paas/shop/' + this.$state.homeUrl });
		},
		toShopList(item) {
			$storage.set('skuMemberCode', { memberCode: item.memberCode });
			$router.push('myStore/shop');
		},
		loadMore() {
			let num = Math.ceil(this.total / 10);
			this.page++;
			if (this.page <= num) {
				http.post(shopList, { page: this.page, rows: this.rows }).then(res => {
					let list = res.rows;
					list.map(v => {
						if (v.shopdeLogo && !RegExp(/http/).test(v.shopdeLogo)) {
							v.shopdeLogo = this.$domain + v.shopdeLogo;
						}
					});

					this.items = [...this.items, ...list];
				});
			} else {
				this.lastPageLine = true;
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '../../../../common/css/common.less';
.shopList {
	width: 100%;
	background: #f9f9f9;
	height: auto;
	&-left {
		position: fixed;
		z-index: 9999;
		height: 90rpx;
		width: 70rpx;
		line-height: 90rpx;
		text-align: left;
		left: 30rpx;
		top: 0;
	}
	&-con {
		margin: 30rpx 30rpx 0;
		padding-top: 90rpx;

		ul {
			li {
				margin-bottom: 20rpx;
				width: 690rpx;
				height: 158rpx;
				background: @white-color;
				border-radius: 8rpx;
				a {
					width: 690rpx;
					height: 158rpx;
					display: flex;
					align-items: center;
					img {
						width: 77rpx;
						height: 77rpx;
						border-radius: 50%;
						margin: 0 16rpx 0 20rpx;
					}
					div {
						width: 545rpx;
						h2 {
							font-size: @top-title;
							color: #252525;
							margin-bottom: 12rpx;
							display: flex;
							align-items: center;
							i {
								font-size: 30rpx;
								color: #707070;
								padding-left: 10rpx;
							}
						}
						p {
							width: 545rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							font-size: 24rpx;
							color: #676767;
						}
					}
				}
			}
		}
	}
}
</style>
