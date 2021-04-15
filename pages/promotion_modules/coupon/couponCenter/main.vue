<template>
	<qj-mini-coupon-center ref="couponCenter"></qj-mini-coupon-center>
</template>

<script>
export default {
	onShow() {
		this.$refs.couponCenter.commonMounted();
	},
	onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.$refs.couponCenter.loadMore();
	}
};
</script>

<style></style>
