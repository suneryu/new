<template>
	<div class="collectionGoods">
		<div v-if="items.length > 0" class="collectionGoods-head" :style="{ backgroundColor: '#' + baseColor }">
			<div class="collectionGoods-edit" @click="edited" v-if="delStatus">编辑</div>
			<div class="collectionGoods-edit" @click="finished" v-else>完成</div>
		</div>

		<div class="collectionGoods-con" v-if="items.length > 0">
			<!-- #ifndef MP-ALIPAY -->
			<u-swipe-action
				class="list"
				v-for="(item, index) in items"
				:key="item.collectId"
				:options="swipeActionOptions"
				:index="index"
				:show="item.swipeActionShow"
				@click="swipeActionClick"
				@open="swipeActionOpen"
				btn-width="150"
			>
				<div class="cont" @click="toGoodsDetail(item)">
					<div class="tit" @click.stop="titCheckBox(item, index)" :style="{ marginRight: isChecked ? '25rpx;' : '0px' }">
						<i class="iconfont" v-if="isChecked" :style="{ color: baseColor }">{{ item.checked == 0 ? '&#xe672;' : '&#xe671;' }}</i>
					</div>
					<div class="userImg">
						<img :src="item.collectOppic || userImgurl" />
						<span v-if="item.dataState == 2">已下架</span>
						<span v-if="item.dataState == 3">已失效</span>
						<span v-if="item.dataState == 1">库存不足</span>
					</div>
					<div class="right-container">
						<p :style="{ color: item.dataState !== 0 ? '#ccc' : '' }">{{ item.collectOpcont }}</p>
						<view class="price-and-btn">
							<h3 :style="{ color: item.dataState !== 0 ? '#ccc' : '#d66377' }">{{ unitPrice.obpay }}{{ item.collectOpnum }}{{ unitPrice.mapay }}</h3>
							<view class="add-cart" v-bind:style="{backgroundColor: baseColor}" @click.stop="itemAddCart(item)">加入购物车</view>
						</view>
					</div>
				</div>
			</u-swipe-action>
			<!-- #endif -->
			<!-- #ifdef MP-ALIPAY -->
			<view v-for="(item, index) in items" :key="index">
				<div class="cont">
					<div class="tit" @click="titCheckBox(item, index)" :style="{ marginRight: isChecked ? '25rpx;' : '0px' }">
						<i class="iconfont" v-if="isChecked" :style="{ color: baseColor }">{{ item.checked == 0 ? '&#xe672;' : '&#xe671;' }}</i>
					</div>
					<div class="userImg">
						<img :src="item.collectOppic || userImgurl" @click="toGoodsDetail(item)" />
						<span v-if="item.dataState == 2">已下架</span>
						<span v-if="item.dataState == 3">已失效</span>
						<span v-if="item.dataState == 1">库存不足</span>
					</div>
					<div class="right-container">
						<p :style="{ color: item.dataState !== 0 ? '#ccc' : '' }">{{ item.collectOpcont }}</p>
						<view class="price-and-btn">
							<h3 :style="{ color: item.dataState !== 0 ? '#ccc' : '#d66377' }">{{ unitPrice.obpay }}{{ item.collectNum1 }}{{ unitPrice.mapay }}</h3>
							<view class="add-cart" v-bind:style="{backgroundColor: baseColor}" @click.stop="itemAddCart(item)">加入购物车</view>
						</view>
					</div>
				</div>
			</view>

			<!-- #endif -->
		</div>
		<div class="collectionGoods-nulls" v-else><img :src="nullImg" /></div>
		<qj-mini-last-page-line :lastPageLine="lastPageLine"></qj-mini-last-page-line>
		<div v-show="!delStatus">
			<div class="collectionGoods-count">
				<div @click="countCheckBox">
					<i class="iconfont" :style="{ color: baseColor }">{{ allChecked ? '&#xe671;' : '&#xe672;' }}</i>
					全选
				</div>
				<div><div class="del-btn" :style="{ background: baseColor }" @click="delCartShopping">删除</div></div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	import http from '@/api/http.js';
import { collection, addShoppingGoodsCode, getSkuInfoByCode, checkSkuOne } from '@/node_modules/qj-mini-pages/libs/api/interface.js';
export default {
	data() {
		return {
			baseColor: '',
			delStatus: true,
			isChecked: false,
			tChecked: true,
			allChecked: false,

			touchIndex: -1, //初始状态的index
			clientX1: '', //滑动开始位置
			clientX2: '',
			del: 0, //内容初始的right距离
			btnWidth: 160, //删除按钮宽度
			comLeft: 0,

			total: 0,
			page: 1,
			rows: 10,
			items: [],
			lastPageLine: false,
			userImgurl: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noCollection.png',
			swipeActionOptions: [
				{
					text: '取消收藏',
					style: {
						backgroundColor: '#' + this.$state.baseColor
					}
				}
			],
			handling: false
		};
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || $storage.get('unitPrice');
		}
	},
	onShow() {
		this.commonMounted();
	},
	onLoad() {
		uni.setNavigationBarTitle({
			title:'我的收藏'
		})
	},
	onReachBottom() {
		console.log('到了底部')
		this.loadMore();
	},
	mounted() {
		this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
	},
	methods: {
		commonMounted() {
			this.$qj
				.http(this.$qj.domain)
				.post(collection.queryCollectPage, {
					page: 1,
					rows: 10,
					collectType: '0'
				})
				.then(res => {
					console.log('qwwwww',res)
					let list = JSON.parse(JSON.stringify(res.rows));

					list.map(v => {
						if (!RegExp(/http/).test(v.collectOppic)) {
							v.collectOppic = this.$domain + v.collectOppic;
						}
						v.checked = 0;
						v.swipeActionShow = false;
					});
					this.page = 1;
					this.total = res.total;
					this.items = list;
					if (this.items.length === 0) {
						this.lastPageLine = false;
					}
				});
		},
		finished() {
			this.delStatus = true;
			this.isChecked = false;
		},
		edited() {
			this.delStatus = false;
			this.isChecked = true;
			this.items.map(v => {
				v.checked = 0;
			});
		},
		titCheckBox(item, index) {
			if (item.checked == 0) {
				this.items[index].checked = 1;
			} else {
				this.items[index].checked = 0;
			}
			if (this.items.filter(v => v.checked === 1).length === this.items.length) {
				this.allChecked = true;
			} else {
				this.allChecked = false;
			}

			if (this.tChecked == true) {
				this.tChecked = false;
			} else {
				this.tChecked = true;
			}
		},
		countCheckBox() {
			if (this.allChecked) {
				this.items.map(v => {
					v.checked = 0;
				});
				this.allChecked = false;
			} else {
				this.items.map(v => {
					v.checked = 1;
				});
				this.allChecked = true;
			}
		},
		goodsDel(item) {
			console.log(item);
			this.$qj
				.http(this.$qj.domain)
				.post(collection.deleteCollectByCode, {
					collectCode: item.collectCode,
					collectType: item.collectType
				})
				.then(res => {
					if (res && res.success) {
						this.$qj.message.alert('取消收藏成功！');
						this.commonMounted();
						this.touchIndex = -1;
					}
				});
		},
		delCartShopping() {
			let str = this.items.filter(v => v.checked === 1);
			console.log(str);
			if (str.length == 0) {
				this.$qj.message.alert('请勾选您要删除的商品');
				return;
			}
			let collectStr = [];
			str.map(val => {
				collectStr.push(val.collectCode);
			});
			//console.log(collectStr);
			this.$qj
				.http(this.$qj.domain)
				.post(collection.deleteCollectByCodeStr, {
					collectCodeStr: collectStr.join(',')
				})
				.then(res => {
					if (res.success) {
						this.delStatus = true;
						this.isChecked = false;
						this.commonMounted();
					}
				});
		},
		toGoodsDetail(item) {
			console.log('list-----列表页',item)
			let params = {
				// goodsClass:goodsClass ? goodsClass : '1',
				// skuCode: skuCode
			};
			this.$qj.router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail2", params)
			// this.$qj.router.push('web', {
			// 	defaultUrl: this.$qj.domain + '/paas/shop/' + this.$qj.storage.get('hrefs') + item.collectOpcode + '.html'
			// });
		},
		loadMore() {
			let num = Math.ceil(this.total / 10);
			this.page++;
			if (this.page <= num) {
				this.$qj
					.http(this.$qj.domain)
					.post(collection.queryCollectPage, {
						page: this.page,
						rows: this.rows
					})
					.then(res => {
						let list = res.rows;
						list.map(v => {
							if (!RegExp(/http/).test(v.collectOppic)) {
								v.collectOppic = this.$domain + v.collectOppic;
							}
							v.checked = 0;
							v.swipeActionShow = false;
						});

						this.items = [...this.items, ...list];
					});
			} else {
				this.lastPageLine = true;
			}
		},

		swipeActionOpen(index) {
			this.items[index].swipeActionShow = true;
			this.items.map((val, idx) => {
				if (index != idx) this.items[idx].swipeActionShow = false;
			});
		},

		swipeActionClick(propsIndex, optsIndex) {
			let item = this.items[propsIndex];
			this.$qj
				.http(this.$qj.domain)
				.post(collection.deleteCollectByCode, {
					collectCode: item.collectCode,
					collectType: item.collectType
				})
				.then(res => {
					if (res && res.success) {
						this.$qj.message.alert('取消收藏成功！');
						this.commonMounted();
					}
				});
		},
		async itemAddCart(item){
			console.log('item----',item)
			if(this.handling){
				return
			}
			this.handling = true;
			let skuInfoRes = await this.requestGetSkuInfoBySkuCode(item.collectOpcode);
			if(skuInfoRes.skuNo && skuInfoRes.goodsNo){
				let skuMultipleRes = await this.requestGetSkuMultiple(skuInfoRes.skuNo, skuInfoRes.goodsNo);
				let multipleNum = 0
				if(skuMultipleRes.errorCode == 2 && skuMultipleRes.dataObj.length > 0){
					multipleNum = skuMultipleRes.dataObj[0].skuOneNum;
				}
				let minNum = item.collectOpnum >= 1 ? item.collectOpnum : 1;
				let params = [{
					skuCode: item.collectOpcode,
					// goodsNum: (multipleNum && multipleNum > 0) ? (multipleNum * minNum) : minNum
					goodsNum: 1
				}]
				this.$qj.message.loading();
				this.$qj
					.http(this.$qj.domain)
					.get(addShoppingGoodsCode, {
						goodsBeanStr: JSON.stringify(params)
					})
					.then(res => {
						console.log(res);
						if (res.success && res.dataObj) {
							this.$qj.message.alert('购物车添加成功');
						} else {
							this.$qj.message.alert(res.msg);
						}
						this.handling = false;
					});
			}
			
		},
		
		requestGetSkuInfoBySkuCode(skuCode){
			return this.$qj.http(this.$qj.domain).get(getSkuInfoByCode, {skuCode: skuCode});
		},
		
		requestGetSkuMultiple(skuNo, goodsNo){
			let params = [{
				skuNo: skuNo,
				goodsNo: goodsNo
			}]
			return this.$qj.http(this.$qj.domain).get(checkSkuOne, {rsSkuDomainListJson: JSON.stringify(params)})
		}
	}
};
</script>

<style lang="less" scoped>
@import '@/node_modules/qj-mini-pages/libs/css/common.less';

.collectionGoods {
	width: 100%;
	.collectionGoods-head {
		position: fixed;
		z-index: 9999;
		width: 100%;
		height: 90rpx;
		.collectionGoods-edit {
			position: absolute;
			height: 90rpx;
			width: 70rpx;
			line-height: 90rpx;
			color: @white-color;
			text-align: right;
			right: 30rpx;
			top: 0;
			font-size: @big-title;
		}
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
	&-con {
		.cont {
			height: 249rpx;
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			background: @white-color;
			.tit {
				margin-left: 25rpx;
				margin-right: 25rpx;
				i {
					padding-right: 15rpx;
				}
			}
			.userImg {
				position: relative;
				width: 185rpx;
				height: 185rpx;
				margin-right: 30rpx;
				img {
					width: 185rpx;
					height: 185rpx;
				}
				span {
					width: 185rpx;
					height: 44rpx;
					background: #b3b3b3;
					color: @white-color;
					font-size: 22rpx;
					text-align: center;
					line-height: 44rpx;
					position: absolute;
					bottom: 0;
					left: 0;
				}
			}
			.right-container{
				flex: 1;
				margin-right: 35rpx;

				p {
					font-size: @big-title;
					color: @color-333;
					margin-bottom: 96rpx;
					padding-right: 25rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					text-overflow: ellipsis;
					overflow: hidden;
				}
				.price-and-btn{
					display: flex;
					align-items: center;
					justify-content: space-between;
					h3 {
						font-size: @middle-title;
						color: #d66377;
					}
					.add-cart{
						width:197rpx;
						height:56rpx;
						text-align: center;
						border-radius:4rpx;
						font-size: 26rpx;
						color: @white-color;
						line-height: 56rpx;
						border: none;
					}
				}
				
			}
			
		}
	}
	&-count {
		display: flex;
		// width: calc(100% - 30rpx);
		width: 100%;
		position: fixed;
		z-index: 9999;
		padding-left: 15rpx;
		bottom: 0;
		left: 0;
		align-items: center;
		justify-content: space-between;
		height: 96rpx;
		font-size: @middle-title;
		color: @color-666;
		background: #fff;
		border-top: 1rpx solid #eee;
		div:first-child {
			display: flex;
			align-items: center;
		}
		div:last-child {
			display: flex;
			align-items: center;
		}
		i {
			padding: 0 15rpx;
		}
		.del-btn {
			width: 246rpx;
			height: 96rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: @white-color;
			font-size: 32rpx;
			background: #b79f77;
		}
	}
	&-nulls {
		height: calc(100% - 202rpx);
		text-align: center;
		img {
			width: 407rpx;
			height: 310rpx;
			margin: 280rpx auto 0;
		}
	}
}
</style>
