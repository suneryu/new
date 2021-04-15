<template>

	<div class="homepage-content">
		<div class="search-box">
			<div class="box-center">
				<u-search placeholder="输入合同名称" :show-action="false" disabled="false"></u-search>
			</div>
		</div>
		<div style="    height: 82px;
    border-bottom: 1px solid #E0E0E0;
    margin-top: 5px;
    padding: 0 10px 0 10px">
			<div style="display: flex;">
				<div style="width: 80%; font-size: 17px; color: #004178;">上海电商测试有限公司</div>
				<div style="width: 20%; position: relative;">
					<i class="iconfont" style="color: #03BF16;    top: -9px;
    position: absolute;
    right: -8px;
    z-index: 999;
    color: #03BF16;">&#x3bf16;</i>
					<button class="buttonClass">企业</button>
				</div>
			</div>
			<div style="display: flex; margin: 5px 0;">
				<div style="width: 80%; font-size: 12px;">企业编码：
					<span>12weewrwerewr3</span>
				</div>
				<div style="width: 20%; font-size: 12px;text-align: right;">
					<div class="authorization">未授权</div>
				</div>
			</div>
			<div style="display: flex;font-size: 12px;margin: 10px 0;">
				<div style="width: 40%;">联系人：
					<span>123</span>
				</div>
				<div style="width: 50%;font-size: 12px;">
					<div class="phone">电话：
						<span>17835757271</span>
					</div>
				</div>
			</div>
		</div>
	</div>

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
		getHomePage,
		queryScontractPageNew,
		queryScontractFilePage
	} from '@/api/interfaceHDB.js';
	export default {
		config: {
			enablePullDownRefresh: true
		},
		data() {
			return {

			}
		},

	}
</script>

<style lang="less" scoped>
	@import '@/node_modules/qj-mini-pages/libs/css/common.less';

	.search-box {
		background-color: #ffffff;
		z-index: 1000;
		height: 100rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #F4F4F5;
	}

	.box-center {
		padding: 0 20rpx;
		width: 100%;
		height: 100%;
		line-height: 100rpx;
	}

	.buttonClass {
		float: right;
		font-size: 12px;
		height: 30rpx;
		line-height: 30rpx;
		color: #fff;
		background-color: #004178;
		width: 50px;
		border-radius: 10px;
	}
</style>
