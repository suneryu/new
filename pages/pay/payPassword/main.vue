<template>
	<view class="pay-password">
		<commonHeader title="支付密码" :leftIcon="true" :rightIcon="true"></commonHeader>
		<view class="content">
			<input type="number" v-model="password" :password="true" maxlength="6" placeholder="请输入六位数支付密码" />
			<button type="default" v-bind:style="{ backgroundColor: baseColor }" @click="paySubmit">确认支付</button>
		</view>
	</view>
</template>

<script>
import commonHeader from '@/components/communal/commonHeader.vue';
import http from '@/api/http.js';
import { paymentCommit, syncContractPayState } from '@/api/interface.js';
export default {
	components: {
		commonHeader
	},
	data() {
		return {
			ptradeSeqno: '',
			payCommitStr: '',
			contractBlance: '',
			baseColor: '',
			password: ''
		};
	},
	onLoad(options) {
		if (options) {
			this.ptradeSeqno = options.ptradeSeqno;
			this.payCommitStr = options.payCommitStr;
			this.contractBlance = options.contractBlance;
			console.log(this.ptradeSeqno, this.payCommitStr, this.contractBlance);
		}
	},
	onShow() {
		this.baseColor = `#${this.$state.baseColor}`;
		this.$setTitle(this.$storage.get('proappEnvName'));
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.baseColor
		});
	},
	mounted() {},
	methods: {
		paySubmit() {
			if (!this.password) {
				this.$message.alert('请输入支付密码');
				return;
			}
			if (this.password.length < 6) {
				this.$message.alert('请输入完整支付密码');
				return;
			}
			this.$message.loading();
			http.post(paymentCommit, {
				ptradeSeqno: this.ptradeSeqno,
				payCommitStr: this.payCommitStr,
				contractBlance: this.contractBlance,
				paywd: this.password
			}).then(res => {
				if (res && res.success) {
					http.post(syncContractPayState, {
						contractBillcode: this.$state.contractBillcode
					})
						.then(res => {
							if (res.success) {
								this.$router.replace('pay/paySuccess', {
									contractBillcode: this.$state.contractBillcode
								});
							} else {
								this.$message.alert('支付失败！');
							}
						})
						.catch(err => {
							this.$message.alert('支付失败！');
						});
				} else {
					this.$message.alert(res.msg);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.pay-password {
	width: 100%;
	height: 100%;
	background-color: #ffffff;
	.content {
		padding-top: 91rpx;
		input {
			width: 80%;
			height: 91rpx;
			font-size: 30rpx;
			color: #333333;
			margin: 0 auto;
			margin-top: 30rpx;
			border-bottom: 1rpx solid #cccccc;
		}
		button {
			width: 80%;
			margin: 0 auto;
			margin-top: 50rpx;
			color: #ffffff;
		}
	}
}
</style>
