<template>
	<div class="classify">
		<div class="search" @click="this.$router.push('search_modules/index')">
			<i class="iconfont icon-sousuo"></i>
			搜你想要的
		</div>
		<div class="main">
			<div class="left">
				<div
					v-for="(item, index) in leftList"
					:key="index"
					:class="index == leftIndex ? 'leftList LeftIndex' : 'leftList'"
					:style="{ color: index == leftIndex ? baseColor : '' }"
					@click="changeLeft(index, item)"
				>
					<div class="nowIndex" :style="{ backgroundColor: index == leftIndex ? baseColor : '' }"></div>
					{{ item.goodsClassName }}
				</div>
				<div
					v-for="(item, index) in ['零配件预付款合同','固定价格合同','更多合同']"
					:key="index"
					:class="index == leftIndex ? 'leftList LeftIndex' : 'leftList'"
					@click="changeLeftBak(index)"
				>
					{{ item }}
				</div>
			</div>
			<div class="right">
				<div class="rightItem" v-for="(item, index) in rightList" :key="index">
					<div class="title">{{ item.goodsClassName }}</div>
					<div class="item" v-for="(item1, index1) in item.childList" @click="goTodetail(item1, index1)" :key="index1">
						<img :src="img + item1.goodsClassLogo" alt="" />
						<p>{{ item1.goodsClassName }}</p>
					</div>
				</div>
			</div>
		</div>
		<vueTabBar :selectNavIndex="selectNavIndex" :baseColor="baseColor" :footerMenu="footerMenu" />
	</div>
</template>

<script>
import vueTabBar from '@/components/communal/vueTabBar';
import { $storage, $router } from '@/utils/prototype/vue.js';
import { queryGoodsClassTree, search, addShoppingGoodsBySpec, addShoppingGoods } from '@/api/interface.js';
import {
	getUserservice
} from '@/api/interfaceHDB.js';
import http from '@/api/http.js';
export default {
	components: { vueTabBar },
	data() {
		return {
			footerMenu: [],
			baseColor: '',
			selectNavIndex: 1,
			leftList: [],
			leftIndex: 0,
			rightList: [],
			img: this.$imgDomain
		};
	},
	onLoad() {
		this.baseColor = `#${$storage.get('baseColor')}`;
		// wx.setNavigationBarTitle({
		// 	title: '商品分类'
		// });
		// wx.setNavigationBarColor({
		// 	frontColor: '#ffffff',
		// 	backgroundColor: this.baseColor
		// });
	},
	mounted() {
		this.getuserInfo()
		this.footerMenu = $storage.get('footerMenu');
		http.get(queryGoodsClassTree).then(res => {
			console.log("商品分类。。。",res)
			this.leftList = res;
			this.rightList = res[0].childList;
		});
	},
	onShow() {
		// uni.hideHomeButton();
	},
	methods: {
		getuserInfo() {
			http.get(getUserservice, {
				userId: $storage.get('userId')
			}).then(res => {
				console.log('线上商城----',res)

			let info = this.$qj.storage.get('loginInfor')			
			info.userinfoType = res.userinfoType;
			this.$qj.storage.set('loginInfor', info);
			});
		},
		onShareAppMessage(res) {
			return {
				title: '海德堡',
				path: '/pages/classify_modules/index/main'
			};
		},
		changeLeft(index, item) {
			if (this.leftIndex == index) {
				return;
			}
			this.leftIndex = index;
			this.rightList = item.childList;
		},
		navigateTo(options) {
		    this.$qj.router.push(options.url, options.query ? options.query : '');
		   },
		changeLeftBak(index) {
			let options = {
				url: "hdb/contractsListHDB",
				query:{
					id:index
				}
			}
			if(index != 2){
				this.navigateTo(options);
			}else{
				let companyList = [{goodsClassName:'培训',childList:[{goodsClassName:'培训',goodsClassLogo:'/paas/shop/2020063000000001/2021-03-31/49e862ececc141ff86ac7c4e7fcaae1c.png',}]},
				{goodsClassName:'咨询',childList:[{goodsClassName:'咨询',goodsClassLogo:'/paas/shop/2020063000000001/2021-03-31/49e862ececc141ff86ac7c4e7fcaae1c.png'}]},
				{goodsClassName:'服务/零备件合同',childList:[{goodsClassName:'服务/零备件合同',goodsClassLogo:'/paas/shop/2020063000000001/2021-03-31/49e862ececc141ff86ac7c4e7fcaae1c.png'}]},
				{goodsClassName:'设备升级/改造',childList:[{goodsClassName:'设备升级/改造',goodsClassLogo:'/paas/shop/2020063000000001/2021-03-31/49e862ececc141ff86ac7c4e7fcaae1c.png'}]},
				{goodsClassName:'服务与零备件套餐',childList:[{goodsClassName:'服务与零备件套餐',goodsClassLogo:'/paas/shop/2020063000000001/2021-03-31/49e862ececc141ff86ac7c4e7fcaae1c.png'}]}]
				this.rightList=[...companyList]
			}
			
		},
		goTodetail(item1, index1) {
			console.log(item1.classtreeCode);
			if(item1.goodsClassCode != undefined){
				let json = {
					classtreeCode: item1.classtreeCode,
					goodsClassCode:item1.goodsClassCode
				};
				this.$router.push('goodsList', {
					json: JSON.stringify(json)
				});
			}else{
				let options = {
					url: "hdb/contractsListHDB",
					query:{
						id:2,
						contractName:item1.goodsClassName
					}
				}
				this.navigateTo(options);
			}
			
		}
	}
};
</script>

<style lang="less" scoped>
.classify {
	background-color: #fff;
	height: 100vh;
	overflow: hidden;
	.search {
		width: 700rpx;
		height: 60rpx;
		margin: 15rpx auto 7rpx;
		background-color: #fafafa;
		text-align: center;
		line-height: 60rpx;
		color: #666;
		i {
			display: inline-block;
			font-size: 28rpx;
		}
	}
	.main {
		display: flex;
		border-top: 1rpx solid #eee;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		padding-bottom: 180rpx;
		.left {
			border-right: 1rpx solid #ddd;
			width: 172rpx;
			height: 100%;
			overflow-y: scroll;
			.leftList {
				position: relative;
				color: #666;
				font-size: 24rpx;
				text-align: center;
				margin: 30rpx auto;
				.nowIndex {
					position: absolute;
					top: 0;
					left: 0;
					width: 5rpx;
					height: 100%;
				}
			}
		}
		.right {
			padding: 0 30rpx 30rpx 30rpx;
			overflow-x: hidden;
			overflow-y: scroll;
			flex: 1;
			.rightItem {
				width: 100%;
				.title {
					font-weight: 550;
					text-decoration: underline;
					color: #333;
					font-size: 26rpx;
					padding: 25rpx 0;
				}
				.item {
					display: inline-block;
					width: 33%;
					height: 255rpx;
					overflow: hidden;
					img {
						width: 175rpx;
						height: 175rpx;
					}
					p {
						margin-top: 12rpx;
						text-align: center;
						text-overflow: -o-ellipsis-lastline;
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						line-clamp: 2;
						-webkit-box-orient: vertical;
					}
				}
			}
		}
	}
}
</style>
