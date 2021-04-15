<template>
	<qj-mini-good-detail class="good-detail" ref="goodDetail" :propSkuNo="skuNo" :propSkuCode="skuCode" @getGoodDetail="getGoodDetail"></qj-mini-good-detail>
</template>

<script>
export default {
	data() {
		return {
			skuNo: '',
			skuCode: '',
			shareTitle: '',
			shareImgSrc: '',
			sharePrice: '',
			currentRouter: ''
		};
	},
	onLoad(options) {
		/**
		 * 目前有三种进入详情场景
		 * 1. 商品列表传skuCode， 小程序分享卡片进入传skuCode
		 * 2. 直播商品列表进入传skuNo
		 * 3. 商品详情分享海报识别小程序码进入获取scene值
		 */
		if (options.skuCode) {
			this.skuCode = options.skuCode;
		}
		if (options.skuNo) {
			this.skuNo = options.skuNo;
		}
		if (options.scene) {
			this.skuCode = decodeURIComponent(options.scene).split('=')[1];
		}
		let pages = getCurrentPages();
		this.currentRouter = pages[pages.length - 1].route;
	},
	onShow() {
		this.$refs.goodDetail.getGoodDetail(this.skuCode, this.skuNo);
	},
	mounted() {},
	onShareAppMessage() {
		return {
			title: this.shareTitle,
			path: `${this.currentRouter}?skuCode=${this.skuCode}`,
			imageUrl: this.shareImgSrc
		};
	},
	methods: {
		getGoodDetail(goodsObj) {
			console.log(goodsObj.title);
			console.log(goodsObj.src);
			this.shareTitle = goodsObj.title;
			this.shareImgSrc = goodsObj.src;
		}
	}
};
</script>

<style lang="less" scoped>
.good-detail {
	height: 100%;
}
</style>
