<template>
	<div class="security-page">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<div class="content">
			<div class="phone-bind bg-white" @click="goBindPhone()">
				<div class="left-text">绑定手机</div>
				<i class="iconfont icon-xiangyou"></i>
			</div>
		</div>
	</div>
</template>
<script>
import commonHeader from '@/components/communal/commonHeader';
export default {
	components: {
		commonHeader
	},
	data() {
		return {
			title: '设置',
			leftIcon: true,
			rightIcon: false,
			router: []
		};
	},
	onLoad() {
		wx.setNavigationBarTitle({
			title: this.$storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + this.$state.baseColor
		});
	},
	mounted() {
		console.log(this.$state.currentRouter);
		this.router = this.$state.currentRouter.routechildren;
	},
	methods: {
		goBindPhone() {
			let router = this.router.filter(v => v.menuAction === 'setPhone')[0].menuJspath;
			console.log(router);
			this.$router.push(router);
		}
	}
};
</script>
<style lang="less" scoped>
@import '../../../../common/css/common.less';

.security-page {
	width: 100%;
	height: 100%;
	background-color: #fafafa;

	.content {
		padding-top: 90rpx;
		.phone-bind {
			display: flex;
			align-items: center;
			padding: 40rpx 30rpx;

			.left-text {
				color: @color-333;
				flex: 1;
			}
		}
	}

	.icon-xiangyou {
		font-size: 36rpx;
	}
}

// .aS-box {
//   width: 100%;
//   height: 100%;
//   background-color: #fafafa;

//   .auto {
//     margin: 0 30px;
//     border-bottom: 1px solid #f6f6f8;
//   }
//   .borderN {
//     border-bottom: none;
//   }

//   a {
//     // padding: 2.9vh 0;
//     padding: 40px 0;
//   }
//   .icon-xiangyou {
//     font-size: 30px;
//   }
//   .line {
//     height: 20px;
//   }
//   .set-loginOut {
//     button {
//       height: 104px;
//       width: 100%;
//       font-size: 30px;
//       background-color: #fff;
//       border-radius: 5px;
//     }
//   }
// }
</style>
