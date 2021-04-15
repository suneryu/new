<template>
	<qj-mini-sales-promotion-detail :propPromotionCode="promotionCode" @navigateTo="navigateTo"></qj-mini-sales-promotion-detail>
</template>

<script>
export default {
	data() {
		return {
			promotionCode: ''
		};
	},
	onLoad(options) {
		this.promotionCode = options.promotionCode;
	},
	onShow() {},
	onReachBottom() {
		console.log('滑到了底部')
	},
	mounted() {
		
	},
	methods:{
		navigateTo(options){
			this.$qj.router.push(options.url, options.query ? options.query : '')
		}
	}
};
</script>

<style></style>
