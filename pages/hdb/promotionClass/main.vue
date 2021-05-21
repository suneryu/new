<!-- 自定义导航栏带搜索框的商品列表页(有批量收藏和批量加入购物车的功能) -->
<template>
	<view class="goodsList" :style="{ height: items.length === 0 ? '100%' : 'auto' }">
		
		<div v-if='items.length > 0'>
		<div  v-for='(item,index) in items' :key="index" style='width: 85%;height: 300rpx;;margin: 20rpx auto;border-radius: 20px;background: #F1F1F1;display: flex;'>
			<div style='width: 50%;height: 300rpx;line-height: 300rpx;margin-left: 15rpx;'>
				
				<div style='margin-top: 80rpx;'>
					<p style='height: 60rpx;line-height: 60rpx;'>活动名称： {{item.promotionName}}</p>
					<p style='height: 20rpx;line-height: 60rpx;'></p>
					
					<div style='height: 60rpx;width: 100%;margin-top: 20rpx;'>
						<button class='butClass' @click="goGoodsInfo(item)">去逛逛</button>
					</div>
				</div>
				
				  
			</div>
			
			<div style='width: 35%;height: 300rpx;margin-left: 20rpx;line-height: 300rpx;'>
				<img  :src="item.promotionUrl || userImgurl" mode="widthFix" />
			</div>
		</div>
		</div>
		
		<div class="goodsList-nulls" v-else><img :src="nullImg" /></div>	
		<qj-mini-last-page-line :lastPageLine="lastPageLine"></qj-mini-last-page-line>
	</view>
</template>

<script>
	import {
		search,
		queryBrandPageForC,
		checkBatchCollectExit,
		saveCollect,
		collection,
		addShoppingGoodsBySpec,
		addShoppingGoods,
		saveCollectBatch,
		addBatchShoppingGoodsBySpec,
		addBatchShoppingGoods,
		checkSkuOne,
		userapplyStateAndAuth
	} from '@/api/interface.js';
	export default {
		data() {
			return {
				title: '商品列表',
				showArea:false,
				leftIcon: true,
				rightIcon: false,
				titleList: ['综合', '销量', '价格', '筛选'],
				baseColor: '',
				userImgurl: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
				nullImg: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noSearchResult.png',
				params: {},
				items: [],
				total: 0,
				page: 1,
				rows: 10,
				current: 0,
				colorCurrent: null,
				moneys: false,
				lastPageLine: false,
				screenShow: false,
				screenList: [],
				brandCode: '',
				maxPrice: null,
				minPrice: null,
				iconColor: null,
				classtreeCode: '',
				searchPath: '',
				// searchParams: this.propSearchParam,
				// 批量加入收藏和购物车
				allChecked: false,
				itemCheckedArr: [],
				// 数据处理中防止用户多次点击
				handling: false,
				offsetTop: 0,
				goodsOrigin: 0,
				userinfoType: '',
				userInfoCode: '',
				checkModifyAudit:'',
				cityPicker:false,
				city:''
			};
		},
		onShow() {
		},
		onLoad(options) {
				this.getPromotionClass()
		},
		onReachBottom() {
			this.loadMore();
		},
		watch: {
			propSearchParams(newValue, oldValue) {
				this.searchParams = newValue;
			},
			propClasstreeCode(newValue, oldValue) {
				this.classtreeCode = newValue;
				console.log(this.classtreeCode, 'watcher');
			}
		},
		computed: {
			unitPrice() {
				// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
				return this.$qj.state.unitPrice || this.$qj.storage.get('unitPrice');
			}
		},
		mounted() {
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			this.$qj.storage.get('getTopPerMenuList').map(v => {
				if (v.menuAction == 'search' && v.menuCode == '00000222') {
					this.searchPath = v.menuJspath;
				}
			});
		},
		methods: {
			//获取促销分类信息
			getPromotionClass(){
				let params ={
					page: this.page,
					rows: this.rows,
					dataState:1
				}
				this.$qj
					.http(this.$qj.domain)
					.get('/web/pm/promotionuser/queryPromotionBargainPriceHdbs.json',params)
					.then(res => {
						console.log('促销类型res------',res)
						this.items = res.rows;
						this.items.map(v => {
							if (!RegExp(/http/).test(v.promotionUrl)) {
								v.promotionUrl = this.$domain + v.promotionUrl;
							}
						});
					});
			},

			//点击去逛逛跳活动下的商品页面
			goGoodsInfo(info){
				console.log('跳转促销商品页--',info)
				let options = {
					url: 'hdb/promotionClass/goodsList',
					query: {
						promotionCode:info.promotionCode
					}
				};
				this.navigateTo(options)
			},

			getNavBarHeight(e) {
				this.offsetTop = e;
			},

			listClick(list, index) {
				this.colorCurrent = index;
				this.brandCode = list.brandCode;
			},
			reverseClick() {
				this.maxPrice = null;
				this.minPrice = null;
				this.colorCurrent = null;
			},
			
			

			loadMore() {
				let num = Math.ceil(this.total / 10);
				this.page++;
				let params = Object.assign(this.params, {
					page: this.page
				});
				if (params.page <= num) {
					this.getPromotionClass()
				} else {
					this.lastPageLine = true;
				}
			},



			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},
			onShareAppMessage(res) {
				return {
					title: '海德堡',
					path: '/pages/goodsList/main'
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	// @import '../../libs/css/common.less';
	@import '@/common/css/common.less';
	img {
		width: 280rpx;
		height: 374.5rpx;
	}
	.butClass{
		    width: 40%;
		    height: 50rpx;
		    line-height: 50rpx;
		    font-size: 22rpx;
		    background: #6F9DF7;
			margin: 0 auto;
			border-radius: 20rpx;
	}
	.address-choose {
		display: flex;
		align-items: center;
		width: 100%;
		height: 90rpx;
		z-index: 999;
		.container {
			display: flex;
			align-items: center;
			width: 100%;
			height: 100%;
			border-bottom: 1rpx solid #e5e5e5;

			input {
				flex: 1;
				width: 100%;
				height: 100%;
				background: none;
				color: @color-333;
			}

			.iconfont {
				padding: 20rpx;
			}
		}
	}
	.goodsList {
		width: 100%;
		background: #fff;

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

		&-title {
			display: flex;
			flex-direction: column;
			position: fixed;
			top: 90rpx;
			left: 0;
			padding: @padding;
			z-index: 2;
			width: 710rpx;
			background: #ffffff;
			padding: @padding;
			border-bottom: 1rpx solid #eee;

			&-left {
				flex: 1;
				-webkit-box-flex: 1;
				height: 100%;
				line-height: 58rpx;

				ul {
					display: -moz-box;
					display: -webkit-box;
					display: box;

					li {
						-webkit-box-flex: 1;
						box-flex: 1;
						width: 0;
						height: 100%;
						position: relative;

						.container {
							width: 100%;
							height: 100%;
							display: flex;
							position: relative;
							align-items: center;
							font-size: @big-title;
							justify-content: center;

							.iconPosition {
								display: flex;
								flex-direction: column;
								position: absolute;
								top: -8rpx;
								right: 28rpx;

								i {
									font-size: 14rpx;
									margin-bottom: -40rpx;
								}
							}

							i {
								font-size: @big-title;
								margin-left: 4rpx;
								color: #434343;
							}
						}
					}
				}
			}

			// &-right{
			//   height: 58rpx;
			//   display:flex;
			//   align-items:center;
			//   span{
			//     &:first-child{
			//       margin-right:@margin-right;
			//     }
			//   }
			// }
		}

		&-list {
			width: 100%;
			margin-top: 200rpx;
			ul {
				width: 100%;
				overflow: hidden;
				zoom: 1;

				li {
					width: calc(50% - 2rpx);
					float: left;
					border-right: 2rpx solid #f5f5f5;
					border-bottom: 2rpx solid #f5f5f5;

					&:nth-child(2n) {
						border-right: 0;
					}

					div {
						// width: 100%;
						height: 100%;
						font-size: @middle-title;
						text-align: center;

						.checked {
							display: flex;
							justify-content: flex-start;
							padding-left: 20rpx;
							align-items: center;
						}

						img {
							width: 374.5rpx;
							height: 374.5rpx;
						}

						.list-box {
							padding: 0 30rpx;
							height: 67px;
							h3 {
								font-size: 32rpx;
								padding: 16rpx 0;
							}

							p {
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								overflow: hidden;
								text-overflow: ellipsis;
								margin: 26rpx;
								// height: 70rpx;
								line-height: 35rpx;
							}

							.noPrice {
								color: #8a8989;
								padding: 0;
								margin: 0;
							}

							.purchasePrice {
								padding: 0 4px;
							}
							.purchasePrice1 {
								text-decoration:line-through;
								padding: 0 4px;
								  
							}
						}

						.icon-container {
							display: flex;
							align-items: center;
							justify-content: flex-end;
							padding-right: 20rpx;

							.iconfont {
								padding: 15rpx;

								&.cart {
									font-size: 36rpx;
								}
							}
						}
					}
				}
			}
		}

		&-screenLeft {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			left: 0;
			background-color: rgba(0, 0, 0, 0.3);
			z-index: 9999;
		}

		&-screen {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			left: 20%;
			z-index: 10000;

			&-screens {
				position: fixed;
				right: 0;
				left: 20%;
				height: 100%;
				background-color: #fff;

				.contents {
					overflow: scroll;
					height: 100%;
					
					.box {
						display: -webkit-box;
						display: -ms-flexbox;
						display: flex;
						display: -webkit-flex;
						-ms-flex-wrap: wrap;
						flex-wrap: wrap;

						// padding-bottom: 200rpx;
						.pinpai {
							margin-left: 30rpx;
							width: 100%;
						}

						.leftBox {
							margin: 20rpx 0 0 2.5%;
							width: 30%;
							height: 60rpx;
							line-height: 60rpx;
							text-align: center;
							background-color: #f5f5f5;
							border-radius: 4rpx;

							p {
								font-size: @middle-title;
								text-align: center;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}

						.price-box {
							padding: 50rpx 30rpx 34rpx;

							p {
								font-size: @big-title;
								color: @color-333;
								margin-bottom: 28rpx;
							}

							.t-bob {
								display: flex;
								justify-content: flex-start;
								align-items: center;

								input {
									width: 200rpx;
									height: 60rpx;
									background-color: #f5f5f5;
									font-family: PingFangSC-Regular;
									font-size: @middle-title;
									text-align: center;
									border-radius: 50rpx;
								}
							}
						}
					}

					.bottomBox {
						background-color: #fff;
						position: fixed;
						width: 80%;
						-webkit-box-sizing: border-box;
						box-sizing: border-box;
						bottom: 0;
						right: 0;
						height: 10.667vw;
						line-height: 10.667vw;
						text-align: center;
						display: -moz-box;
						display: -webkit-box;
						display: box;

						p {
							-webkit-box-flex: 1;
							box-flex: 1;
							width: 0;
							color: #fff;
							font-size: 28rpx;
							background-color: #333;

							&:first-child {
								// background: #b79f77;
							}
						}
					}
				}
			}
		}

		&-nulls {
			width: 100%;
			margin-top: 400rpx;
			text-align: center;

			img {
				width: 402rpx;
				height: 337rpx;
				margin: 0 auto;
			}
		}

		.batch-container {
			position: fixed;
			bottom: 0;
			z-index: 9999;
			background: @white-color;
			width: 100%;
			height: 90rpx;
			display: flex;
			align-items: center;
			padding-left: 33rpx;

			.iconfont {
				text {
					padding-left: 10rpx;
					color: @color-333;
					font-size: 24rpx;
				}
			}

			.batch-btn {
				margin-left: 20rpx;
				border-width: 2rpx;
				border-radius: 4rpx;
				border-style: solid;
				width: 145rpx;
				height: 51rpx;
				text-align: center;
				line-height: 51rpx;
				font-size: 24rpx;

				&.batch-add-collect {
					background: @white-color;
				}

				&.batch-add-cart {
					color: @white-color;
				}
			}
		}
	}
</style>
