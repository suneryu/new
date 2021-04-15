<template>
	<!--手机号-->
	<div class="set-phone">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon"></commonHeader>
		<div class="content" v-if="havePhone">
			<ul>
				<li class="already-bind-phone">
					<div class="already-bind-phone-container-text">已绑定手机号码：{{ phone }}</div>
				</li>
				<li class="input-code">
					<div class="input-code-container">
						<view>输入验证码：</view>
						<input type="number" class="inputs" v-model="num" placeholder="请输入验证码" />
						<view class="code" :style="{ color: baseColor }" @click="codes">{{ code }}</view>
					</div>
				</li>
			</ul>
		</div>
		<div class="btn" @click="next" :style="{ backgroundColor: baseColor }">下一步</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import commonHeader from '@/components/communal/commonHeader.vue';
import { indexMem, changePhone } from '@/api/interface.js';
import { asterisk } from '@/utils/formatPhone.js';
export default {
	components: {
		commonHeader
	},
	data() {
		return {
			title: '修改手机号码',
			leftIcon: true,
			rightIcon: false,
			phone: '',
			aphone: '',
			code: '获取验证码',
			pass: true,
			havePhone: true,
			num: '',
			userInfor: {},
			baseColor: `#${this.$state.baseColor}`
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
		http.get(indexMem).then(res => {
			console.log(res);
			if (res.userInfo.userPhone) {
				this.phone = asterisk(res.userInfo.userPhone);
				this.aphone = res.userInfo.userPhone;
			} else {
				this.havePhone = false;
				this.$message.alert('您暂未绑定手机号！');
			}
		});
	},
	methods: {
		next() {
			// this.$router.push('user_modules/set/newphone', {
			// 	aphone: '17621680404'
			// });
			if (this.num.length === 6) {
				http.post(changePhone.checkVerificationMa, {
					userPhone: this.aphone,
					code: this.num
				}).then(res => {
					if (res.success) {
						this.$router.push('user_modules/set/newphone', {
							aphone: this.aphone
						});
					} else {
						this.$message.alert(res.msg);
					}
				});
			} else {
				this.$message.alert('请输入6位验证码');
			}
		},
		codes() {
			if (this.pass) {
				this.pass = false;
				http.post(changePhone.sendPhone, {
					userPhone: this.aphone
				}).then(res => {
					if (res.success) {
						this.$message.alert(res.msg);
						let time = 60;
						const set = setInterval(() => {
							this.code = '剩余' + time-- + '秒';
							this.pass = false;
							if (time < 0) {
								clearInterval(set);
								this.pass = true;
								this.code = '获取验证码';
							}
						}, 1000);
					} else {
						this.pass = true;
						this.$message.alert('验证码获取失败');
					}
				});
			} else {
				this.$message.alert('请稍后点击获取');
			}
		}
	}
};
</script>

<style lang="less" scoped>
.set-phone {
	width: 100%;
	height: 100%;
	background: #fafafa;
	display: flex;
	flex-direction: column;
	.content {
		flex: 1;
		margin-top: 110rpx;
		font-size: 26rpx;
		color: #333333;
		ul {
			background: #ffffff;
			li {
				margin: 0 20rpx;
			}
			.already-bind-phone {
				padding: 34rpx 0;
				border-bottom: 1px solid #f5f5f5 !important;
			}
			.input-code {
				padding: 34rpx 0;
				&-container {
					display: flex;
					align-items: center;
					.inputs {
						flex: 1;
					}
					.code {
						padding-left: 30rpx;
						border-left: 1px solid #efefef;
					}
				}
			}
		}
	}
	.btn {
		height: 80rpx;
		width: 100%;
		text-align: center;
		line-height: 80rpx;
		font-size: 30rpx;
		color: #ffffff;
	}
}
</style>
