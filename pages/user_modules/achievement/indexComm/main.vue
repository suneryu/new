<template>
	<div class="performance">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon"></commonHeader>
		<div class="achievement-tab mar-t20">
			<ul class="t-box tab-ul">
				<li
					:class="['t-box-flex1', active == index ? 'active' : '']"
					:style="{ backgroundColor: active == index ? baseColor : '#ffffff' }"
					:key="index"
					@click="tabHandler(item, index)"
					v-for="(item, index) in tabItem"
				>
					{{ item.label }}
				</li>
			</ul>
			<div class="tab-cont mar-t20 pad-t20 pad-b20 mar-b20">
				<ul class="t-box mar-b20">
					<li class="t-box-flex1 t-center">
						<p>订单数量</p>
						<span class="mar-t20">{{ orderNumObj.orderNum || 0 }}</span>
					</li>
					<li class="t-box-flex1 t-center">
						<p>订单金额</p>
						<span class="mar-t20">{{ new Number(orderNumObj.volumeAmount || 0).toFixed(2) }}</span>
					</li>
					<li class="t-box-flex1 t-center">
						<p>下单客户</p>
						<span class="mar-t20">0</span>
					</li>
				</ul>
				<ul class="t-box mar-t20">
					<li class="t-box-flex1 t-center">
						<p>拉新用户</p>
						<span class="mar-t20">{{ orderNumObj.clientNum || 0 }}</span>
					</li>
					<li class="t-box-flex1 t-center">
						<p>佣金收益</p>
						<span class="mar-t20">{{ new Number(orderNumObj.incomeAmount || 0).toFixed(2) }}</span>
					</li>
				</ul>
			</div>
			<div class="tab-main">
				<ul>
					<li :key="index" class="t-box align--center" v-for="(item, index) in dataList">
						<div class="t-box-flex1 f-s24">
							<p>下单时间：{{ formatDate(item.gmtCreate) }}</p>
							<p>订单编号：{{ item.contractBillcode }}</p>
						</div>
						<h4 class="f-s30">
							<span>+{{ unitPrice.obpay }}{{ item.contractMoney }}{{ unitPrice.mapay }}</span>
						</h4>
					</li>
					<p style="color:#999;text-align:center;padding:50px 0" v-if="dataList.length == 0">暂无数据</p>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { queryContForGroup, getShsettlUserByStatistics } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader.vue';
export default {
	components: {
		commonHeader
	},
	data() {
		return {
			baseColor: '',
			title: '我的业绩',
			leftIcon: true,
			rightIcon: true,
			tabItem: [
				{ label: '今日', name: 'today' },
				{
					label: '昨日',
					name: 'yesterday'
				},
				{
					label: '本周',
					name: 'week'
				},
				{
					label: '本月',
					name: 'month'
				}
			],
			orderNum: 0, // 订单数量
			orderAmount: 0, //订单金额
			dataList: [],
			active: 0,
			page: 1,
			rows: 10,
			params: {
				startDate: null, //'2019 - 12 - 03',
				endDate: null //'2019 - 12 - 11'
			},
			orderNumObj: {}
		};
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || $storage.get('unitPrice') || {};
		}
	},
	onLoad() {
		this.baseColor = `#${this.$state.baseColor}`;
		this.$setTitle(this.$storage.get('proappEnvName'));
		wx.setNavigationBarColor({
			frontColor: '#FFFFFF',
			backgroundColor: this.baseColor
		});
	},
	mounted() {
		this.formatDate(false, 'today');
		this.getOrder();
		this.getOrderNum();
	},
	methods: {
		tabHandler(item, index) {
			this.active = index;
			this.formatDate(false, item.name);
			this.getOrder();
			this.getOrderNum();
		},
		getOrderNum() {
			http.get(getShsettlUserByStatistics, this.params).then(res => {
				this.orderNumObj = res.shsettlUserStatistics || {};
			});
		},
		getOrder() {
			http.get(queryContForGroup, this.params).then(res => {
				// this.orderNum = this.orderAmount = 0;
				this.dataList = res.rows;
				// this.orderNum = res.total;
				// res.rows.map(res => {
				//   this.orderAmount = this.accAdd(this.orderAmount, res.contractMoney);
				// });
			});
		},
		accAdd(num1, num2) {
			var r1, r2, m;
			try {
				r1 = num1.toString().split('.')[1].length;
			} catch (e) {
				r1 = 0;
			}
			try {
				r2 = num2.toString().split('.')[1].length;
			} catch (e) {
				r2 = 0;
			}
			m = Math.pow(10, Math.max(r1, r2));
			// return (num1*m+num2*m)/m;
			return Math.round(num1 * m + num2 * m) / m;
		},
		formatDate(stamp, name) {
			// shijianchuo是整数，否则要parseInt转换
			var time = stamp ? new Date(stamp) : new Date();
			var y = time.getFullYear();
			var m = time.getMonth() + 1;
			var d = time.getDate();
			var dy = time.getDate() - 1;
			var h = time.getHours();
			var mm = time.getMinutes();
			var s = time.getSeconds();
			var nowDayOfWeek = time.getDay();
			var weekStartDate = new Date(y, m, d - nowDayOfWeek)
			var weekEndDate = new Date(y, m, d + (7 - nowDayOfWeek))
			var sm = weekStartDate.getMonth()
			var sd = weekStartDate.getDate()
			var em = weekEndDate.getMonth()
			var ed = weekEndDate.getDate()

			if (name == 'today') {
				this.params.startDate = y + '-' + this.add0(m) + '-' + this.add0(d);
				this.params.endDate = y + '-' + this.add0(m) + '-' + this.add0(d);
			} else if (name == 'yesterday') {
				this.params.startDate = y + '-' + this.add0(m) + '-' + this.add0(dy);
				this.params.endDate = y + '-' + this.add0(m) + '-' + this.add0(dy);
			} else if (name == 'month') {
				this.params.startDate = y + '-' + this.add0(m) + '-01';
				this.params.endDate = y + '-' + this.add0(m) + '-' + this.getDay(y, m);
			} else if (name == 'week') {
				//本周 周一
				this.params.startDate = y + '-' + this.add0(sm) + '-' + this.add0(sd);
				this.params.endDate = y + '-' + this.add0(em) + '-' + this.add0(ed);
			} else {
				return y + '-' + this.add0(m) + '-' + this.add0(d) + '  ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
			}
		},
		add0(m) {
			return m < 10 ? '0' + m : m;
		},
		getDay(year, month) {
			var d = new Date(year, month, 0);
			return d.getDate();
		}
	}
};
</script>

<style lang="less" scoped>
.performance {
	background: #fff;
}
.achievement-tab {
	padding-top: 93rpx;
	margin: 20rpx 20rpx 0;
}
.tab-ul {
	display: flex;
	height: 76rpx;
	line-height: 76rpx;
	border: 2rpx solid #e0e0e0;
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
	}
	li {
		width: 0;
		flex: 1;
		border-right: 1rpx solid #e0e0e0;
	}
}
.tab-cont {
	margin: 20rpx;
	padding: 20rpx 0;
	ul {
		display: flex;
		margin-bottom: 20rpx;
		li {
			width: 0;
			flex: 1;
			text-align: center;
			span {
				color: red;
				font-size: 36rpx;
				display: block;
				margin-top: 20rpx;
			}
		}
	}
}
.tab-main {
	ul {
		li {
			display: flex;
			padding: 20rpx 0;
			.f-s24 {
				font-size: 24rpx;
				width: 0;
				flex: 1;
			}
			p {
				line-height: 40rpx;
			}
			.f-s30 {
				font-size: 30rpx;
			}
			border-bottom: 1rpx solid #e0e0e0;
			&:last-child {
				border-bottom: 0;
			}
		}
	}
}
</style>
