<template>
	<div class="wallet-box">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<div class="wallet-header">
			<div class="flex">
				<p class="flex-item1">
					我的佣金：
					<span>{{ unitPrice.obpay }}{{ accountObj.faccountPortion || 0 }}{{ unitPrice.mapay }}</span>
				</p>
				<button type="button" class="wallet-header--btn" @click="cashBtn">提现</button>
			</div>
			<div class="flex">
				<p class="flex-item1">可提现：{{ unitPrice.obpay }}{{ accountObj.faccountPortion || 0 }}{{ unitPrice.mapay }}</p>
			</div>
		</div>
		<div class="wallet-tab">
			<ul class="flex tab-ul">
				<li
					:class="['flex-item1', active == index ? 'active' : '']"
					v-for="(item, index) in tabItem"
					:key="index"
					:style="{ background: active == index ? baseColor : '' }"
					@click="tabHandler(index)"
				>
					{{ item }}
				</li>
			</ul>
			<div class="tab-main">
				<ul v-show="active == 0">
					<li class="flex align--center" v-for="(item, index) in shsettlList" :key="index">
						<div class="flex-item1 f-s24">
							<p>下单时间：{{ item.date }}</p>
							<p>订单编号：{{ item.shsettlOplistOp }}</p>
						</div>
						<h4 class="f-s30">
							<span>+{{ unitPrice.obpay }}{{ item.shsettlListAmt }}{{ unitPrice.mapay }}</span>
						</h4>
					</li>
					<p v-if="shsettlList.length == 0 && requestStaticlist" style="color:#999;text-align:center;padding:50rpx 0">暂无返佣</p>
				</ul>
				<ul v-show="active == 1">
					<li class="flex align--center" v-for="(item, index) in accountDtList" :key="index">
						<div class="flex-item1 f-s24">
							<p>提现时间：{{ item.date }}</p>
							<p>提现状态：{{ item.dataState == 0 ? '待审核' : item.dataState == 3 ? '提现完成' : item.dataState == -1 ? '提现失败' : ''}}</p>
						</div>
						<h4 class="f-s30">
							<span>-{{ unitPrice.obpay }}{{ item.withdrawMoney }}{{ unitPrice.mapay }}</span>
						</h4>
					</li>
					<p v-if="accountDtList.length == 0 && requestStatic" style="color:#999;text-align:center;padding:50rpx 0">暂无提现</p>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { queryAccountOuterByUser, myQueryShsettlListPage, queryWithdrawPageByMem } from '@/api/interface.js';
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
import { formatDate } from '@/utils/prototype/date.js';
import commonHeader from '@/components/communal/commonHeader';
export default {
	data() {
		return {
			title: '我的钱包',
			leftIcon: true,
			rightIcon: false,
			baseColor: '',
			tabItem: ['返佣记录', '提现记录'],
			accountObj: {},
			active: 0,
			page: 1,
			rows: 10,
			shsettlList: [],
			accountDtList: [],
			requestStatic: false,
			requestStaticlist: false,
		};
	},
	components: {
		commonHeader
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
		Object.assign(this, this.$options.data());
	},
	onReachBottom() {
		console.log('a');
		this.page++;
		if (this.active == 0) {
			this.queryShsettlList();
		}
		if (this.active == 1) {
			this.queryOuterFaccount();
		}
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || $storage.get('unitPrice') || {};
		}
	},
	mounted() {
		this.baseColor = '#' + this.$state.baseColor;
		// console.log(this.baseColor, "this.baseColor");
		this.queryShsettlList();
	},
	methods: {
		getAccount() {
			http.get(queryAccountOuterByUser).then(res => {
				this.accountObj = res.dataObj || {};
			});
		},
		queryShsettlList() {
			// 分佣记录
			this.shsettlList = [];
			http.get(myQueryShsettlListPage, {
				page: this.page,
				rows: this.rows
			}).then(res => {
				res.rows &&
					res.rows.forEach(el => {
						el.date = this.formatDate(el.gmtCreate);
						this.shsettlList.push(el);
					});
				this.requestStaticlist = true;
			});
		},
		queryOuterFaccount() {
			// 提现流水
			http.get(queryWithdrawPageByMem, {
				page: this.page,
				rows: this.rows
			}).then(res => {
				this.accountDtList = [];
				// 被逼无奈
				res.rows &&
					res.rows.forEach(el => {
						el.date = this.formatDate(el.gmtCreate);
						this.accountDtList.push(el);
					});
				this.requestStatic = true;
			});
		},
		tabHandler(index) {
			this.active = index;
			this.page = 1;
			if (this.active == 0) {
				this.queryShsettlList();
			}
			if (this.active == 1) {
				this.queryOuterFaccount();
			}
		},
		cashBtn() {
			this.$router.push('Wallet_modules/wallet/cash');
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@/common/css/common.less';
.wallet-box {
	background: #fff;
}
.wallet-header {
	background: #fff;
	padding: 110rpx 30rpx 30rpx;
	font-size: 26rpx;
	span {
		font-size: 40rpx;
		color: red;
	}
	&--btn {
		background: #fff;
		font-size: 26rpx;
		padding: 0rpx 28rpx;
	}
	.flex:first-child {
		margin-bottom: 20rpx;
	}
}
.wallet-tab {
	margin: 20rpx 30rpx 0;
	.tab-ul {
		height: 76rpx;
		line-height: 76rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 10rpx;
		text-align: center;
		font-size: 26rpx;
		li:first-child {
			border-right: 1rpx solid #e0e0e0;
			border-radius: 10rpx 0 0 10rpx;
		}
		li:last-child {
			border-radius: 0rpx 10rpx 10rpx 0rpx;
		}
		li.active {
			color: #fff;
			// background: #178d43;
		}
	}
}
.tab-main {
	ul {
		li {
			padding: 20rpx 0;
			p {
				line-height: 40rpx;
			}
			border-bottom: 1rpx solid #e0e0e0;
		}
	}
}
</style>
