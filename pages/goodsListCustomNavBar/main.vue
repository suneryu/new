<template>
	<qj-mini-goods-list-custom-nav-bar
		ref="goodsList"
		@navigateTo="navigateTo"
		:propSearchParams="searchParams"
		:propClasstreeCode="classtreeCode"
	></qj-mini-goods-list-custom-nav-bar>
</template>

<script>
export default {
	data() {
		return {
			searchParams: '',
			classtreeCode: ''
		};
	},
	mounted() {},
	onShow() {},
	onPullDownRefresh() {
		this.$refs.goodsList.initSearchParams();
		this.$refs.goodsList.commonMounted();
	},
	onReachBottom() {
		this.$refs.goodsList.loadMore();
	},
	onLoad(options) {
		this.searchParams = options.searchParams;
		if (options.json && JSON.parse(options.json).classtreeCode) {
			this.classtreeCode = JSON.parse(options.json).classtreeCode;
		}
	},
	methods: {
		navigateTo(options) {
			this.$qj.router.push(options.url, options.query ? options.query : '');
		}
	}
};
</script>

<style></style>
