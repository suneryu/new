<template>
	<view class="sales-promotion-list">
		<qj-mini-sales-promotion-list class="sales-promotion-list" ref="salesPromotionList"></qj-mini-sales-promotion-list>
	</view>
	
</template>

<script>
	export default{
		data() {
			return {
			}
		},
		onLoad(options) {
			
		},
		onReachBottom() {
			this.$refs.salesPromotionList.loadMore();
		},
		onShow() {
			this.$refs.salesPromotionList.getData(true);
		},
		mounted() {
			
		},
		methods:{
			
		}
	}
</script>

<style lang="less" scoped>
	.sales-promotion-list{
		height: 100%;
		background: #f7f7f7;
	}
</style>
