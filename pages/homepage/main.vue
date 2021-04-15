<template>
	<view class="homepage-content">
		<view class="search-box" >
			<view class="box-left">
				<image :src="titleImg"></image>
			</view>
			<view class="box-center" @click="search()">
				<u-search placeholder="输入商品名称" :show-action="false" disabled="false"></u-search>
			</view>
			<view class="box-right" @click="Minemsg()">
				<span class="iconfont icon-tishi"></span>
			</view>
		</view>
		
		<template v-for="data in dataList">
			<template v-if="data.htmltagCode == 'rotation'">
				<view class="banner">
					<swiper class="banner-swiper" :autoplay="true" :interval="3000" :duration="1000" circular :indicator-dots="true">
						<swiper-item v-for="item in data.cmsContlistReDomainList">
							<image :src="item.contlistPicurlNow" @click="onClickSwiperItem(data.conttitleUrlNow)" mode="scaleToFill"></image>
						</swiper-item>
					</swiper>
				</view>
				<view class="line" style="background-color: #FFFFFF;"></view>
			</template>
			<template v-else-if="data.htmltagCode == 'listjpg'">
				<view class="hp-nav">
					<view class="hp-goods-item" v-for="item in data.cmsContlistReDomainList">
						<view v-on:click="getGoods(item.contlistUrlNow)">
							<image :src="item.contlistPicurlNow" ></image>
						</view>
						<text>{{item.contlistNameNow}}</text>
					</view>
				</view>
				<view class="line" style="background-color: #FFFFFF;"></view>
			</template>
			<template v-else-if="data.htmltagCode=='fourjpg'">
				<view class="hp-brand">
					<view class="brand-title">
						<view class="advert-color">
							<image src="http://devmpb2b12020070700000006.xytest.qjclouds.com/paas/shop-master/c-static/images/B2B/20.png"></image>
						</view>
						<h3>{{data.conttitleNameNow}}</h3>
						<view class="advert-color">
							<image src="http://devmpb2b12020070700000006.xytest.qjclouds.com/paas/shop-master/c-static/images/B2B/20.png"></image>
						</view>
					</view>
					<view class="banner-cx" v-if="data.conttitlePicurlNow">
						<image :src="data.conttitlePicurlNow" @click="onClickSwiperItem(data.conttitleUrlNow)" mode="scaleToFill" class="img-height"></image>
					</view>
					<view class="line"></view>
					<view class="brand-image" v-for="item in data.cmsContlistReDomainList">
						<image :src="item.contlistPicurlNow" @click="getGoods(item.contlistUrlNow)" ></image>
					</view>
				</view>
				<view class="line" style="background-color: #FFFFFF;"></view>
			</template>
			<template v-else-if="data.htmltagCode=='fivejpg'">
				<view class="hp-brand">
					<view class="brand-title">
						<view class="advert-color">
							<image src="http://devmpb2b12020070700000006.xytest.qjclouds.com/paas/shop-master/c-static/images/B2B/20.png"></image>
						</view>
						<h3>{{data.conttitleNameNow}}</h3>
						<view class="advert-color">
							<image src="http://devmpb2b12020070700000006.xytest.qjclouds.com/paas/shop-master/c-static/images/B2B/20.png"></image>
						</view>
					</view>
					<view class="banner-cx" v-if="data.conttitlePicurlNow">
						<image :src="data.conttitlePicurlNow" @click="onClickSwiperItem(data.conttitleUrlNow)" mode="scaleToFill" class="img-height"></image>
					</view>
					<view class="line"></view>
					<view class="brand-image" v-for="(item,index) in data.cmsContlistReDomainList" :key="index">
						<image v-if="index >= 0 && index <= 3" :src="item.contlistPicurlNow" @click="getGoods(item.contlistUrlNow)" ></image>
					</view>
				</view>
				<view class="line" style="background-color: #FFFFFF;"></view>
			</template>
			<template v-if="data.htmltagCode=='sixjpg'">
				<view class="hp-floor">
					<view class="floor-title">
						<view class="advert-color">
							<image src="http://devmpb2b12020070700000006.xytest.qjclouds.com/paas/shop-master/c-static/images/B2B/20.png"></image>
						</view>
						<h3>{{data.conttitleNameNow}}</h3>
						<view class="advert-color">
							<image src="http://devmpb2b12020070700000006.xytest.qjclouds.com/paas/shop-master/c-static/images/B2B/20.png"></image>
						</view>
					</view>
					<view class="floor-master">
						<image :src="data.conttitlePicurlNow" mode="scaleToFill" class="img-height"></image>
					</view>
					<view class="floor-branch-all">
						<scroll-view scroll-x="true">
						<view class="floor-branch-child" v-for="item in data.cmsContlistReDomainList"  @click="getDetail(item)">
							<image :src="item.contlistPicurlNow" ></image>
							<view>{{item.contlistNameNow}}</view>
							<view>{{item.contlistRemarkNow}}</view>
							<view>{{item.contlistPriceNow}}元</view>
						</view>
						</scroll-view>
					</view>
				</view>
				<view class="line" style="background-color: #FFFFFF;"></view>
			</template>
			<template v-if="data.htmltagCode=='listgoods'">
				<view class="hp-like">
					<view class="like-title">
						<view class="advert-color">
							<image src="http://devmpb2b12020070700000006.xytest.qjclouds.com/paas/shop-master/c-static/images/B2B/20.png"></image>
						</view>
						<h3>{{like.conttitleNameNow}}</h3>
						<view class="advert-color">
							<image src="http://devmpb2b12020070700000006.xytest.qjclouds.com/paas/shop-master/c-static/images/B2B/20.png"></image>
						</view>
					</view>
				</view>
				<view class="like-goods">
					<view class="goods-detail" v-for="(item,index) in like.cmsContlistReDomainList" :key="index" @click="getDetail(item)">
						<image :src="item.contlistPicurlNow" ></image>
						<view>{{item.contlistPriceNow}}元</view>
						<view>{{item.contlistNameNow}}</view>
					</view>
				</view>
			</template>
		</template>
		<view class="line" style="margin-top:250rpx"></view>
		<vueTabBar :selectNavIndex="selectNavIndex" :baseColor="baseColor" :footerMenu="footerMenu" />
	</view>
	
</template>

<script>
	import vueTabBar from '@/components/communal/vueTabBar';
	import http from '@/api/http.js';
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		getHomePage
	} from '@/api/interface.js';
	export default {
		components: { vueTabBar },
		data() {
			return {
				picurl: "",
				titleImg: this.$qj.domain + '/paas/shop/2020063000000001/2021-03-27/325d43b6ceed4abebc71c2aa5a093eae.jpg',
				baseColor:"",
				footerMenu:[],
				bannerList: '',
				goods: '',
				shareOrgin:0,//0代表分享首页，1代表分享商品,
				brand: '',
				floor: '',
				like:'',
				selectNavIndex:0,
				picurlCx:"",
				dataList:[]
			}
		},
		onLoad() {
			// 初始化方法
			this.$qj.init(
				() => {
					this.baseColor = `#${$storage.get('baseColor')}`;
					this.footerMenu = $storage.get('footerMenu');
				},
				this.$domain,
				this
			);
			
		},
		
		
		mounted() {
			this.baseColor = `#${$storage.get('baseColor')}`;
			wx.setNavigationBarTitle({
				title: "商城首页"
			});
			wx.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.baseColor
			});
			this.getBanner(),
			this.footerMenu = $storage.get('footerMenu');
			
		},
		methods: {
		onShareAppMessage(res) {
			  return {
			   title: '海德堡',
			   path: '/pages/homepage/main'
			  }
			 
			
		},
		getBanner() {
			this.$qj
				.http(this.$qj.domain)
				.get(getHomePage, {
					tginfoMenuCode: "b2bindex"
				}).then(res => {
					// 处理数据 地址
					res.map(v => {
						if (!RegExp(/http/).test(v.conttitlePicurlNow)) {
							this.$set(v, 'conttitlePicurlNow', this.$domain + v.conttitlePicurlNow);
						}
						if (v.cmsContlistReDomainList != null && v.cmsContlistReDomainList.length > 0) {
							v.cmsContlistReDomainList.map(val => {
								if (!RegExp(/http/).test(val.contlistPicurlNow)) {
									this.$set(val, 'contlistPicurlNow', this.$domain + val.contlistPicurlNow);
								}
							});
						}
					});
					this.dataList = res;
				});
			},
			navigateTo(options) {
			    this.$qj.router.push(options.url, options.query ? options.query : '');
			   },
			search(){
				uni.navigateTo({
					url:'../search_modules/index/main'
				})
			},
			getGoods(url){
				console.log("url",url)
				// $router.push(url)
				let str = '';
				if (url.indexOf("?") != -1) {
					str = url.split("?")[1].split("=")[1];
					url = url.split("?")[0];
				}
				let options = {
					url: url,
					query: {
						goodsClass: str
					}
				}
				this.navigateTo(options);
			},
			onClickSwiperItem(url) {
				console.log()
				if(url == 'hdb/promotionZone'){
					this.$qj.router.push('hdb/promotionZone')
					}else{
						let options = {
							url: url
						}

						this.redirectTo(options);
					}

			},
			getDetail(item){
				let params = {
					skuCode:item.contlistPicurl3Now
				};
				this.$qj.router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail", params)
			},
			getGoodTree(url){
				let options = {
					url: url
				}
				this.redirectTo(options);
			},
			Minemsg(){
				this.$qj.router.push("user_modules/user/user-ui/webMail")
			},
			redirectTo(options) {
				this.$qj.router.replace(options.url, options.query ? options.query : '');
			}
		}
	}
</script>

<style lang="less" scoped>
	.homepage-content {
		.search-box {
			position: fixed;
			top: 0rpx;
			background-color: #ffffff;
			z-index: 1000;
			height: 100rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #F4F4F5;

			.box-left {
				height: 80rpx;
				width: 80rpx;
				padding: 10rpx;
				line-height: 80rpx;
				margin-left: 20rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.box-center {
				width: 500rpx;
				height: 100%;
				line-height: 100rpx;
			}

			.box-right {
				height: 80rpx;
				width: 80rpx;
				padding: 10rpx;
				margin-left: 10rpx;
				line-height: 80rpx;
				text-align: center;

				span {
					height: 100%;
					width: 100%;
					font-size: 38rpx;

				}
			}
		}
		
		.img-height {
		   width: 100%;
		   height: 100%;
		 }

		.banner {
			margin-top: 120rpx;
			height: 380rpx;
			width: 100%;

			.banner-swiper {
				height: 380rpx;
				width: 100%;

				swiper-item {
					image {
						width: 100%;
					}
				}
			}
		}
		
		.banner-cx {
			height: 380rpx;
			width: 100%;
		}

		.line {
			height: 20rpx;
			width: 100%;
			background-color: #fafafa;
		}

		.hp-nav {
			height: 210rpx;
			width: 100%;
			display: flex;
			justify-content: center;

			.hp-goods-item {
				height: 100%;
				width: 25%;
				line-height: 100%;
				text-align: center;

				view {
					height: 75rpx;
					width: 75rpx;
					text-align: center;
					margin: 40rpx 0rpx 21rpx 50rpx;

					image {
						height: 100%;
						width: 100%;
					}
				}

				text {
					font-size: 26rpx;
					color: #333333;
				}
			}
		}

		.hp-brand {
			width: 100%;
			display: flex;
			flex-wrap: wrap;

			.brand-title {
				height: 115rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;

				.advert-color {
					height: 25rpx;
					width: 30rpx;
					margin: 15rpx;
					padding: 5rpx;

					image {
						height: 100%;
						width: 100%;
					}
				}

				h3 {
					color: #333333;
					letter-spacing: 3rpx;
				}

			}

			.brand-image {
				height: 186rpx;
				width: 185rpx;
				border: 1rpx solid #fafafa;

				image {
					height: 100%;
					width: 100%;
				}
			}
		}

		.hp-floor {
			height: 500rpx;
			width: 100%;

			.floor-title {
				height: 115rpx;
				width: 100%;
				background-color: #f7f7f7;
				display: flex;
				align-items: center;
				justify-content: center;

				.advert-color {
					height: 25rpx;
					width: 30rpx;
					margin: 15rpx;
					padding: 5rpx;

					image {
						height: 100%;
						width: 100%;
					}
				}

				h3 {
					color: #333333;
					letter-spacing: 3rpx;
				}

			}

			.floor-master {
				height: 225rpx;
				width: 100%;
				image{
				height: 225rpx;
				width: 100%;
				background-repeat: no-repeat;
				}
			}

			.floor-branch-all {
				white-space: nowrap;
				display: flex;
				align-items: center;
				text-align: left;
				flex-wrap: wrap;

				.floor-branch-child {
					display: inline-block;
					height: 408rpx;
					width: 33%;
					border: 1rpx solid #f7f7f7;
					line-height: 40rpx;

					image {
						height: 200rpx;
						width: 200rpx;
						margin-top: 25rpx;
						text-align: center;
						margin-left: 23rpx;
					}

					view:nth-child(2) {
						font-size: 24rpx;
						color: #666;
						margin-left: 12rpx;
						font-weight: 500;
						letter-spacing: 3rpx;
						height:80rpx;
						width: 100%;
						white-space:pre-wrap;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						margin-right: 5rpx;
					}

					view:nth-child(3) {
						margin:10rpx 0rpx;
						font-size: 22rpx;
						color: #999999;
						margin-left: 12rpx;
					}

					view:nth-child(4) {
						font-size: 30rpx;
						color: #d66377;
						margin-left: 12rpx;
						letter-spacing: 5rpx;
						font-weight: 500;
					}

				}
			}
		}

		.hp-like {
			width: 100%;
			display: flex;

			.like-title {
				height: 115rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: #fafafa;

				.advert-color {
					height: 25rpx;
					width: 30rpx;
					margin: 15rpx;
					padding: 5rpx;

					image {
						height: 100%;
						width: 100%;
					}
				}

				h3 {
					color: #333333;
					letter-spacing: 3rpx;
				}

			}

		}

		.like-goods {
			display: flex;
			width: 100%;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			margin-bottom: 110rpx;
			.goods-detail {
				height: 600rpx;
				width: 370rpx;
				border: 1px solid #f7f7f7;
				text-align: center;
				image {
					height: 373rpx;
					width: 100%;
					margin-bottom: 35rpx;
					margin-top: 15rpx;
				}

				view:nth-child(2) {
					font-size: 32rpx;
					color: #d66377;

					letter-spacing: 5rpx;
					font-weight: 500;
				}

				view:nth-child(3) {
					font-size: 23rpx;
					color: #333333;
					margin-bottom: 35rpx;
					letter-spacing: 5rpx;
					font-weight: 500;
					padding: 24rpx 54rpx 32rpx 33rpx;
				}
			}
		}

	}
</style>
