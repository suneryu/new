<template>
	<div class="cash-box">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<!-- header -->
		<div class="cash-header">
			<div class="flex">
				<p class="flex-item1 flex justify--center">
					<span class="f-s26">可提现：</span>
					<span class="f-s30" style="color:red">{{ unitPrice.obpay }}{{ accountObj.faccountPortion }}{{ unitPrice.mapay }}</span>
				</p>
			</div>
		</div>
		<div class="cash-main">
			<h3 class="cash-title">提现金额</h3>
			<div class="cash-input">
				<input type="text" v-model="money" placeholder="请输入提现金额" />
				<button type="button" :style="{ background: baseColor }" @click="cashBtn">申请提现</button>
			</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
import { refund } from '@/api/interface.js';
import { queryAccountOuterByUser, saveWithdrawByAgDt } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
// import picker from '@/components/communal/picker';
export default {
	data() {
		return {
			title: '我的钱包',
			leftIcon: true,
			rightIcon: false,
			baseColor: '',
			accountObj: {},
			money: null
		};
	},
	components: {
		commonHeader
		// picker
	},
	onShow() {
		this.getAccount();
	},
	onLoad() {
		wx.setNavigationBarTitle({
			title: $storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + this.$state.baseColor
		});
		this.baseColor = '#' + this.$state.baseColor;
		Object.assign(this, this.$options.data());
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || $storage.get('unitPrice') || {};
		}
	},
	mounted() {
		this.baseColor = '#' + this.$state.baseColor;
	},
	methods: {
		getAccount() {
			http.get(queryAccountOuterByUser).then(res => {
				this.accountObj = res.dataObj || {};
			});
		},
		cashBtn() {
			if (this.accountObj.faccountPortion <= 0) {
				wx.showToast({
					title: '你的额度为' + this.accountObj.faccountPortion + ',不可提现',
					icon: 'none',
					duration: 3000
				});
				return;
			}
			if (this.money && this.money > 0) {
				http.get(saveWithdrawByAgDt, { withdrawMoney: this.money }).then(res => {
					console.log(res);
					if (res.success) {
						wx.showToast({
							title: '申请成功',
							icon: 'none',
							duration: 3000
						});
					}
				});
			} else {
				this.$message.alert('请输入提现金额');
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@/common/css/common.less';
.cash-box {
	.cash-header {
		padding: 120rpx 30rpx 30rpx;
		background: #fff;
		margin-bottom: 20rpx;
	}
	.cash-main {
		text-align: center;
		padding: 30rpx 100rpx 60rpx;
		background: #fff;
		.cash-title {
			margin-bottom: 30rpx;
		}
		input {
			height: 78rpx;
			line-height: 78rpx;
			border: 1rpx solid #e0e0e0;
			border-radius: 78rpx;
			margin: 20rpx 0 20rpx;
			font-size: 26rpx;
		}
		button {
			height: 78rpx;
			line-height: 78rpx;
			color: #fff;
			border-radius: 78rpx;
			font-size: 28rpx;
		}
	}
}
</style>
