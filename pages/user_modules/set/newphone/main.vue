<template>
	<!--手机号-->
	<div class="set-newPhone">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon"></commonHeader>
		<div class="content">
			<div class="tips">请输入你需要绑定的新的手机号码</div>
			<ul>
				<li class="input-new-phone">
					<div>手机号码：</div>
					<input type="number" v-model="phones" placeholder="请输入手机号码" />
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
		<div class="btn" @click="isok" :style="{ backgroundColor: baseColor }">确认</div>
	</div>
</template>

<script>
import commonHeader from '@/components/communal/commonHeader.vue';
import http from '@/api/http.js';
import { changePhone } from '@/api/interface.js';
import { phoneValidation } from '@/utils/formatPhone.js';
export default {
	components: {
		commonHeader
	},
	data() {
		return {
			title: '修改手机号码',
			leftIcon: true,
			rightIcon: false,
			pass: true,
			aphones: '',
			phones: '',
			num: '',
			code: '获取验证码',
			baseColor: `#${this.$state.baseColor}`
		};
	},
	onLoad(options) {
		if(options && options.aphone) this.aphones = options.aphone
		wx.setNavigationBarTitle({
			title: this.$storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + this.$state.baseColor
		});
	},
	mounted() {
	},
	methods: {
		isok() {
		  if (phoneValidation(this.phones)) {
		    if (this.num.length === 6) {
		      http.post(changePhone.updatePhone, {
		        newUserPhone: this.phones,
		        oldUserPhone: this.aphones,
		        code: this.num
		      }).then(res => {
		        if (res.success) {
		          this.$message.alert("操作成功");
				  this.$router.back(3)
		        } else {
		          this.$message.alert(res.msg);
		        }
		      });
		    } else {
		      this.$message.alert("请输入6位验证码");
		    }
		  }
		},
		codes() {
		  if (phoneValidation(this.phones)) {
		    if (this.pass) {
		      this.pass = false;
		      http.post(changePhone.sendPhone, {
		        userPhone: this.phones
		      }).then(res => {
		        if (res.success) {
		          this.$message.alert(res.msg);
		          let time = 60;
		          const set = setInterval(() => {
		            this.code = "剩余" + time-- + "秒";
		            if (time < 0) {
		              clearInterval(set);
		              this.pass = true;
		              this.code = "获取验证码";
		            }
		          }, 1000);
		        }
		      });
		    } else {
		      this.$message.alert("请稍后点击获取");
		    }
		  }
		},
	}
};
</script>

<style lang="less" scoped>
.set-newPhone {
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
		.tips{
			padding: 20rpx 20rpx 0;
			background: #ffffff;
		}
		ul {
			background: #ffffff;
			li {
				margin: 0 20rpx;
			}
			.input-new-phone {
				padding: 34rpx 0;
				border-bottom: 1px solid #f5f5f5 !important;
				display: flex;
				align-items: center;
				div{
					padding-right: 20rpx;
				}
				input{
					flex: 1;
				}
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
