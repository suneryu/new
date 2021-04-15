<template>
	<qj-mini-integration-goods-list ref="integrationGoodsList" :pointsCount="pointsCount" :goodsClassCode="goodsClassCode" ></qj-mini-integration-goods-list>
</template>

<script>
	export default{
		data() {
			return {
				pointsCount: 0,
				goodsClassCode: '',
			}
		},
		onLoad(options) {
			console.log(options,'123')
			this.$qj.setTitle(options.classifyName)
			this.pointsCount = options.pointsCount
			this.goodsClassCode = options.goodsClassCode;
		},
		
		onShow() {
			this.$refs.integrationGoodsList.getPointsMallGoodsInClassify(this.goodsClassCode)
		},
		
		onReachBottom() {
			
		}
	}
</script>

<style>
</style>
