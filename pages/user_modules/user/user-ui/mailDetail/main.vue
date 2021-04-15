<template>
	<qj-mini-mail-detail :propMsgId="msgId"></qj-mini-mail-detail>
</template>
<script>
	export default {
		data(){
			return {
				msgId:0
			}
		},
		onLoad(options) {
			this.msgId = options.msgId;
		}
	};
</script>
<style lang='less' scoped>
	.mian-informDetail {
		background-color: #fff;
		width: 100%;
		height: 100%;

		.info {
			padding: 93px 24px 0 24px;

			h1 {
				font-size: 36rpx;
				line-height: 48rpx;
				color: #101010;
				margin-bottom: 15rpx;
			}

			.time {
				font-size: 24rpx;
				line-height: 36rpx;
				color: #333333;
			}

			p {
				font-size: 24rpx;
				line-height: 42rpx;
				color: #666666;
				margin-top: 12rpx;
			}
		}


	}
</style>
