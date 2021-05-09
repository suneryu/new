<template>
	<div class="paySelect">
		<view class="pay-count-down" v-if="payMessage && payMethods == 0">
			<view class="iconfont icon-shijian"></view>
			<text>支付时间剩余：</text>
			<u-count-down
				@end="payCountdownEnd"
				:timestamp="contractPaydate"
				:show-days="false"
				font-size="24"
				color="#fa4f4f"
				separator-color="#fa4f4f"
				separator-size="24"
			></u-count-down>
			<text>逾期订单将自动取消</text>
		</view>
		<div class="paySelect-tit" v-if="payMessage">
			<h2 :style="{ color: baseColor }">
				<i class="iconfont">&#xe69f;</i>
				{{ orderTip[payMethods] }}
			</h2>
			<p>订单号：{{ payMessage.contractBillcode }}&nbsp;&nbsp;|&nbsp;&nbsp;总金额：{{ unitPrice.obpay }}{{ payMessage.dataBmoney }}{{ unitPrice.mapay }}</p>
		</div>
		<div class="paySelect-payRadio" v-if="payChannelList.length > 0">
			<ul>
				<li v-for="(list, index) in payChannelList" :key="index">
					<div class="pay-method">
						<div>
							<i class="iconfont" :style="{ color: baseColor }">&#xe76d;</i>
							{{ list.fchannelName }}
						</div>
						<div @click="selectRadio(list, index)">
							<i class="iconfont" :style="{ color: baseColor }" v-if="current === index">&#xe671;</i>
							<i class="iconfont" :style="{ color: baseColor }" v-else>&#xe672;</i>
						</div>
					</div>
					<div class="base-account-info" v-if="list.fchannelCode == '01'">
						<div class="account-balance">账户余额：{{ list.faccountAmount }}{{ unitPrice.mapay }}</div>
						<div class="need-pay-money">本单抵扣：{{ payMessage.dataBmoney }}{{ unitPrice.mapay }}</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="paySelect-btn" v-if="payMessage" @click="paySubmit" :style="{ backgroundColor: baseColor }"> 立即支付 </div>
		<!-- #ifdef MP-WEIXIN -->
		<u-popup class="pwd-popup" v-model="pwdShow" mode="center" border-radius="16" length="90%">
			<view class="title">请输入支付密码</view>
			<view class="content"><u-message-input mode="box" :maxlength="inputLength" :dot-fill="true" @finish="pwdInputFinish" @change="pwdInputChange"></u-message-input></view>
			<view class="btn" v-bind:style="{ backgroundColor: baseColor }" @click="pwdPay">确认支付</view>
		</u-popup>
		<!-- #endif -->
	</div>
</template>

<script>
import { syncContractState, addContractSub, saveOrderSubToPay, paymentCommit, saveOrderToPay, syncContractPayState } from '../../../node_modules/qj-mini-pages/libs/api/interface.js';
export default {
	// props: {
	// 	propPayParams: {
	// 		type: Object,
	// 		default: ''
	// 	}
	// },
	data() {
		return {
			propPayParams: {
				type: Object,
				default: ''
			},
			box: 'box',
			inputLength: 6,
			baseColor: '',
			payMessage: '', //订单信息
			payChannelList: [], //支付方式
			contractBlance: '', // 结算方式 0 全款 1 订金 2 分次 3 分期    多个用,分割
			payJsons: [],
			ptradeSeqno: '',
			current: 0,
			pwdShow: false,
			pwd: '',
			// 支付方式 线上支付 0  线下支付 1
			payMethods: 0,
			buttonText: ['立即支付', '查看订单', '', '查看订单'],
			orderTip: ['订单提交成功，请去支付', '订单提交成功', '', '订单提交成功'],
			// 支付剩余时间倒计时，单位秒
			contractPaydate: 0,
			isGiftContract:false,
			userPhone:'',
			goodsNo:'',
			giftCode:'',
			giftUserId:'',
			accountsSumPrice:0,
			giftUserPhone:''
			
		};
	},
	watch: {
		propPayParams(newValue, oldValue) {
			this.payMessage = newValue;
		}
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || this.$qj.storage.get('unitPrice');
		}
	},
	onLoad(options) {
		// 未支付订单位置点击付款会携带参数
		if(options.isGiftContract != undefined){
			this.isGiftContract = true
			this.userPhone = options.userPhone
			this.goodsNo = options.goodsNo
		}
		if (options && options.contractBillcode) {
			this.propPayParams = options;
		}
	},
	mounted() {
		// if(this.isGiftContract){
		// 	this.$qj.http(this.$qj.domain).post('/web/gt/gift/updateContractAll.json',{giftCode:'442108161478885376',giftUserPhone:this.userPhone,orderPrice:0})
		// 	.then(res1=>{
		// 		console.log(res1)
		// 	})
		// }
		this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
		this.$qj.message.loading();
		// 如果是未支付订单跳转，则不需通过订单号获取订单信息
			this.$qj
				.http(this.$qj.domain)
				.post(syncContractState, {
					contractBillcode: this.$state.contractBillcode
				})
				.then(res => {
					if (res.success && res.dataObj != null) {
						if (res.dataObj.dataBmoney > 0) {
							this.payMessage = res.dataObj;
							this.payMethods = 0;
							if (this.payMethods === 0) {
								this.setPayChannelList();
							}
						} else {
							this.$qj.router.replace('pay/paySuccess', {
								contractBillcode: this.$state.contractBillcode
							});
						}
					} else {
						if (res.msg) {
							this.$qj.message.alert(res.msg);
						} else {
							this.$qj.message.alert('下单失败');
						}
						this.$qj.router.back(1, { stay: 1000 });
					}
				});
				this.getContarct()
		
	},
	methods: {
		// 支付有效期结束
		payCountdownEnd() {
			this.$qj.router.back();
		},
		getContarct(){
			this.$qj
				.http(this.$qj.domain)
				.post('web/oc/contract/queryContractPagePlat.json', {
					contractBillcode: this.$state.contractBillcode
				})
				.then(res=>{
					this.giftCode = res.list[0].contractEcurl || ''
					this.giftUserId = res.list[0].employeeCode || ''
					this.accountsSumPrice = Number(res.list[0].employeeName)|| 0
					this.giftUserPhone = res.list[0].areaName || ''
				})
		},
		// 设置支付方式，必须在syncContractState接口之后
		setPayChannelList() {
			this.$qj
				.http(this.$qj.domain)
				.post(saveOrderToPay, {
					contractBillcode: this.$state.contractBillcode
				})
				.then(res => {
					this.payChannelList = res.payChannelList;
					this.ptradeSeqno = res.ptradeSeqno;
					this.contractBlance = res.contractBlance;
					// 计算支付截止时间
					if (res.contractPaydate) {
						let currTimestamp = new Date().getTime();
						if ((res.contractPaydate - currTimestamp) / 1000 > 0) {
							this.contractPaydate = (res.contractPaydate - currTimestamp) / 1000;
						}
					}

					this.payJsons = [
						{
							faccountIdType: 'ACCOUNT',
							fchannelCode: res.payChannelList[0].fchannelCode,
							orderAmount: this.payMessage.dataBmoney,
							faccountId: res.payChannelList[0].faccountOuterNo || ''
						}
					];
				});
		},

		selectRadio(list, index) {
			this.current = index;
			this.payJsons = [
				{
					faccountIdType: 'ACCOUNT',
					fchannelCode: list.fchannelCode,
					orderAmount: this.payMessage.dataBmoney,
					faccountId: list.faccountOuterNo || ''
				}
			];
		},

		pwdInputFinish(val) {
			this.pwd = val;
		},

		pwdInputChange(val) {
			this.pwd = val;
		},

		pwdPay() {
			if (!this.pwd) {
				this.$qj.message.alert('请输入支付密码');
				return;
			}
			if (this.pwd.length < 6) {
				this.$qj.message.alert('请输入完整支付密码');
				return;
			}
			let payparams = JSON.stringify(this.payJsons);
			this.$qj.message.loading();
			this.$qj
				.http(this.$qj.domain)
				.post(paymentCommit, {
					ptradeSeqno: this.ptradeSeqno,
					payCommitStr: payparams,
					contractBlance: this.contractBlance,
					paywd: this.pwd
				})
				.then(res => {
					if (res && res.success) {
						this.$qj.message.loading();
						this.$qj
							.http(this.$qj.domain)
							.post(syncContractPayState, {
								contractBillcode: this.$state.contractBillcode
							})
							.then(res => {
								if (res.success) {
									http.post('/web/gt/gift/updateContract.json',{giftCode:this.giftCode,giftUserPhone:this.giftUserPhone,orderPrice:this.accountsSumPrice,giftUserId:this.giftUserId})
									.then(res4=>{
										this.$qj.router.replace('pay/paySuccess', {
											contractBillcode: this.$state.contractBillcode
										});
									})
									
								} else {
									this.$qj.message.alert('支付失败！');
								}
							})
							.catch(err => {
								this.$qj.message.alert('支付失败！');
							});
					} else {
						this.$qj.message.alert(res.msg);
					}
				});
		},

		paySubmit() {
			if (this.payMethods === 1 || this.payMethods === 3) {
				this.$qj.router.replace('order_modules/order/infor', {
					contractBillcode: this.payMessage.contractBillcode
				});
				return;
			}
			if (this.payJsons.length === 0) {
				this.$qj.message.alert('请选择支付方式');
				return;
			}

			if (this.payChannelList[this.current].fchannelCode == '01') {
				if (this.payChannelList[this.current].faccountAmount == 0) {
					this.$qj.message.alert('您的账户余额为零');
					return;
				}
				if (this.payChannelList[this.current].faccountAmount < this.payMessage.dataBmoney) {
					this.$qj.message.alert('您的账户余额不足');
					return;
				}
				// #ifdef MP-WEIXIN
				this.pwdShow = true;
				// #endif

				// #ifdef MP-ALIPAY || MP-TOUTIAO

				this.$qj.router.push('pay/payPassword', {
					ptradeSeqno: this.ptradeSeqno,
					payCommitStr: JSON.stringify(this.payJsons),
					contractBlance: this.contractBlance
				});
				// #endif
			}

			// 微信支付
			if (this.payChannelList[this.current].fchannelCode == 'wechatmini') {
				this.$qj.message.loading();
				let payparams = JSON.stringify(this.payJsons);
				this.$qj
					.http(this.$qj.domain)
					.post(paymentCommit, {
						ptradeSeqno: this.ptradeSeqno,
						payCommitStr: payparams,
						contractBlance: this.contractBlance
					})
					.then(res => {
						if (res && res.success) {
							let data = res.dataObj.requestData;
							this.$qj.message.loading();
							let that = this;
							wx.requestPayment({
								timeStamp: data.timeStamp,
								nonceStr: data.nonceStr,
								package: data.package,
								signType: data.signType,
								paySign: data.paySign,
								success: function(res) {
									console.log(res,6666666)
									that.$qj
										.http(that.$qj.domain)
										.post(syncContractPayState, {
											contractBillcode: that.$state.contractBillcode,
										})
										.then(res => {
											if (res.success) {
												that.$qj
													.http(that.$qj.domain)
													.post('web/oc/contract/updateContractNew.json', {
														contractBillcode: that.$state.contractBillcode,
														tempState:'payState'
													})
												.then(res6=>{
													
												})
												that.$qj.http(that.$qj.domain).post('/web/gt/gift/updateContract.json',{giftCode:that.giftCode,giftUserPhone:that.giftUserPhone,orderPrice:that.accountsSumPrice,giftUserId:that.giftUserId})
												.then(res4=>{
													that.$qj.router.replace('pay/paySuccess', {
														contractBillcode: that.$state.contractBillcode
													});
												})
												
											} else {
												that.$qj.router.replace('pay/payFail', {
													contractBillcode: that.$state.contractBillcode
												});
											}
										})
										.catch(err => {
											that.$qj.message.alert('支付失败！');
										});
								},
								fail: function(res) {
									console.log(res, '失败参数');
									that.$qj.message.alert('支付失败！');
								},
								complete: function(res) {}
							});
						}
					});
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '../../../node_modules/qj-mini-pages/libs/css/common.less';

/* #ifdef MP-WEIXIN */
.pwd-popup {
	height: 300rpx;
	background-color: @white-color;
	display: flex;
	flex-direction: column;

	.title {
		width: 100%;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		font-size: 28rpx;
		border-bottom: 1rpx solid #cccccc;
	}

	.content {
		flex: 1;
		width: 100%;
		padding: 30rpx 0;
	}

	.btn {
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		color: @white-color;
		font-size: 28rpx;
		width: 100%;
	}
}
/* #endif */

/* #ifdef MP-ALIPAY || MP-TOUTIAO */
.pwd-popup {
}
/* #endif */

.paySelect {
	width: 100%;
	height: 100%;
	background: @white-color;

	.pay-count-down {
		width: 100%;
		height: 67rpx;
		background: #fafafa;
		display: flex;
		align-items: center;
		justify-content: center;
		.iconfont {
			color: #333333;
			font-size: 30rpx;
		}
		text {
			margin-left: 16rpx;
			color: #333333;
			font-size: 24rpx;
		}
	}

	&-tit {
		padding: 49rpx 32rpx 45rpx;
		border-bottom: 20rpx solid #fafafa;

		h2 {
			display: flex;
			align-items: center;
			font-size: 36rpx;
			margin-bottom: 26rpx;

			i {
				font-size: 46rpx;
				margin-right: @margin-right;
			}
		}

		p {
			font-size: @middle-title;
			color: #7a7a7a;
		}
	}

	&-payRadio {
		ul {
			li {
				.pay-method {
					height: 112rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;

					padding: 0 32rpx;

					div:first-child {
						display: flex;
						align-items: center;

						i {
							margin-right: 16rpx;
							font-size: 40rpx;
						}
					}
				}

				.base-account-info {
					height: 112rpx;
					padding: 0 32rpx;
					padding-left: 80rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				border-bottom: 1rpx solid #f5f5f5;
			}
		}
	}

	&-btn {
		width: 556rpx;
		height: 78rpx;
		margin: 0 auto;
		background: #ffffff;
		text-align: center;
		line-height: 78rpx;
		font-size: @top-title;
		color: @white-color;
		position: fixed;
		bottom: 48rpx;
		left: 97rpx;
		z-index: 99;
		border-radius: 4rpx;
	}
}
</style>

