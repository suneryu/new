<template>
	<div class="addInvoice">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<div class="addInvoice-info">
			<ul>
				<li>
					<div>
						发票抬头
						<p>
							<view @click="classifyClick('personal')">
								<i class="iconfont" v-if="classify == 'personal'" :style="{ color: baseColor }">&#xe671;</i>
								<i class="iconfont" v-else>&#xe672;</i>
								个人
							</view>
							<view @click="classifyClick('company')">
								<i class="iconfont" v-if="classify == 'company'" :style="{ color: baseColor }">&#xe671;</i>
								<i class="iconfont" v-else>&#xe672;</i>
								单位
							</view>
						</p>
					</div>
				</li>
				<li v-show="classify == 'personal'">
					<div>
						开票名称
						<input placeholder="请输入开票名称" v-model="userinvMember" />
					</div>
				</li>
				<li v-show="classify == 'company'">
					<div>
						单位名称
						<input placeholder="请输入单位名称" v-model="userinvMember" />
					</div>
				</li>
				<li class="borderBt" v-show="classify == 'company'">
					<div>
						纳税人识别号
						<input placeholder="请输入纳税人识别号" v-model="userinvNo" />
					</div>
				</li>
				<li>
					<div>
						收票人姓名
						<input placeholder="请输入收票人姓名" v-model="userinvUname" />
					</div>
				</li>
				<li>
					<div>
						收票人手机
						<input placeholder="请输入收票人手机" v-model="userinvUphone" />
					</div>
				</li>
				<li>
					<div>
						收票人邮箱
						<input placeholder="请输入收票人邮箱" v-model="userinvUeamil" />
					</div>
				</li>
				<li>
					<!-- #ifdef MP-WEIXIN -->
					<div>
						收票人地址
						<picker @change="changeRegin" mode="region" :value="region">
							<view class="tui-picker-detail">{{ region[0] }} - {{ region[1] }} - {{ region[2] }}</view>
						</picker>
					</div>
					<!-- #endif -->
					<!-- #ifdef MP-ALIPAY || MP-TOUTIAO -->
					<div @click="selectRegion">
						收票人地址
						<view class="tui-picker-detail">{{ region[0] }} - {{ region[1] }} - {{ region[2] }}</view>
					</div>
					<!-- #endif -->
				</li>
				<li>
					<div>
						<span></span>
						<input placeholder="请输入详细地址" v-model="userinvUadd" />
					</div>
				</li>
			</ul>
		</div>
		<div class="addInvoice-btn" :style="{ background: baseColor }" @click="saveInfo">确认</div>
		<!-- #ifdef MP-ALIPAY || MP-TOUTIAO -->
		<u-picker mode="region" v-model="alipayRegionShow" :area-code="['11', '1101', '110101']" @confirm="uRegionPicker"></u-picker>
		<!-- #endif -->
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
import { invoice } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
export default {
	data() {
		return {
			title: '新增发票信息',
			leftIcon: true,
			rightIcon: false,
			baseColor: '', //颜色
			classify: 'personal',
			region: ['北京市', '北京市', '东城区'],
			code: ['110000', '110100', '110101'],
			provinceCode: '11000', //省code
			provinceName: '北京市', //省名称
			cityCode: '110100', //市code
			cityName: '北京市', //市名称
			areaCode: '110101', //区code
			areaName: '东城区', //区名称
			userinvMember: '',
			userinvUname: '',
			userinvUphone: '',
			userinvUeamil: '',
			userinvUadd: '',
			userinvNo: '',
			userinvType: '1',
			userinvSort: '2',
			addInfo: '' ,//菜单路径
			alipayRegionShow: false
		};
	},
	components: {
		commonHeader
	},
	onLoad() {
		wx.setNavigationBarTitle({
			title: $storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + this.$state.baseColor
		});
	},
	mounted() {
		this.baseColor = '#' + this.$state.baseColor;
		this.$state.moreToolList.map(v => {
			if (v.menuAction == 'myInvoice') {
				v.children.map(val => {
					if (val.menuAction == 'addInfo') {
						this.addInfo = val.menuJspath;
					}
				});
			}
		});
	},
	methods: {
		
		// #ifdef MP-ALIPAY || MP-TOUTIAO
		selectRegion() {
			this.alipayRegionShow = true;
		},
		// #endif
		
		/**
		 * 支付宝小程序地址选择器
		 * @param {Object} params
		 */
		uRegionPicker(params) {
			console.log(params);
			this.provinceCode = params.province.value.joinEnd(6, '0');
			this.provinceName = params.province.label;
			this.cityCode = params.city.value.joinEnd(6, '0');
			this.cityName = params.city.label;
			this.areaCode = params.area.value;
			this.areaName = params.area.label;
			this.region = [this.provinceName, this.cityName, this.areaName];
			this.code = [this.provinceCode, this.cityCode, this.areaCode];
			console.log(this.region, this.code);
		},
		
		changeRegin(e) {
			// console.log('picker发送选择改变，携带值为', e.mp.detail)
			this.region = e.mp.detail.value;
			this.code = e.mp.detail.code;
			this.provinceCode = e.mp.detail.code[0];
			this.provinceName = e.mp.detail.value[0];
			this.cityCode = e.mp.detail.code[1];
			this.cityName = e.mp.detail.value[1];
			this.areaCode = e.mp.detail.code[2];
			this.areaName = e.mp.detail.value[2];
		},
		classifyClick(classify) {
			if (classify == 'company') {
				this.classify = 'company';
				this.userinvSort = '1';
			} else {
				this.classify = 'personal';
				this.userinvSort = '2';
			}
		},
		saveInfo() {
			let userinvUeamil = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			let userinvNo = /^[A-Za-z0-9]+$/;
			let params = {
				userinvType: this.userinvType,
				userinvSort: this.userinvSort,
				userinvMember: this.userinvMember,
				userinvUname: this.userinvUname,
				userinvUphone: this.userinvUphone,
				userinvUeamil: this.userinvUeamil,
				userinvUadd: this.userinvUadd,
				provinceCode: this.provinceCode,
				provinceName: this.provinceName,
				areaCode: this.areaCode,
				areaName: this.areaName,
				cityCode: this.cityCode,
				cityName: this.cityName
			};
			if (this.classify == 'company') {
				params.userinvNo = this.userinvNo;
			} else {
				delete params.userinvNo;
			}
			if (this.classify == 'company') {
				if (this.userinvMember == '' || this.userinvUname == '' || this.userinvUphone == '' || this.userinvUeamil == '' || this.userinvUadd == '' || this.userinvNo == '') {
					$message.alert('请填写必填项！');
				} else if (!/^1[34578]\d{9}$/.test(this.userinvUphone)) {
					$message.alert('手机号格式不正确');
				} else if (!userinvUeamil.test(this.userinvUeamil)) {
					$message.alert('请输入正确邮箱号');
				} else if (!userinvNo.test(this.userinvNo)) {
					$message.alert('请输入正确纳税人识别号');
				} else {
					http.get(invoice.increasedinvoice, params).then(res => {
						if (res && res.success) {
							$message.alert(res.msg);
							// $router.replace(this.addInfo)
							$router.back(1, {
								success: '',
								fail: '',
								complete: '',
								stay: 1500
							});
						}
					});
				}
			} else {
				if (this.userinvMember == '' || this.userinvUname == '' || this.userinvUphone == '' || this.userinvUeamil == '' || this.userinvUadd == '') {
					$message.alert('请填写必填项！');
				} else if (!/^1[34578]\d{9}$/.test(this.userinvUphone)) {
					$message.alert('手机号格式不正确');
				} else if (!userinvUeamil.test(this.userinvUeamil)) {
					$message.alert('请输入正确邮箱号');
				} else {
					http.get(invoice.increasedinvoice, params).then(res => {
						if (res && res.success) {
							$message.alert(res.msg);
							// $router.replace(this.addInfo)
							$router.back(1, {
								success: '',
								fail: '',
								complete: '',
								stay: 1500
							});
						}
					});
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '../../../common/css/common.less';
.addInvoice {
	width: 100%;
	height: 100%;
	background: #fafafa;
	&-info {
		padding-top: 90rpx;
		background: @white-color;
		ul {
			li {
				border-bottom: 1rpx solid #f6f6f8;
				height: 104rpx;
				font-size: @big-title;
				color: #333;
				padding: @padding-30;
				div {
					height: 104rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					p {
						display: flex;
						align-items: center;
						view {
							display: flex;
							align-items: center;
							i {
								margin-right: 10rpx;
								color: #8d8d8d;
							}
							&:first-child {
								margin-right: 38rpx;
							}
						}
					}
					input {
						width: 450rpx;
						text-align: right;
					}
					input::-webkit-input-placeholder {
						color: #ccc;
					}
					input::-moz-placeholder {
						/* Mozilla Firefox 19+ */
						color: #ccc;
					}
					input:-moz-placeholder {
						/* Mozilla Firefox 4 to 18 */
						color: #ccc;
					}
					input:-ms-input-placeholder {
						/* Internet Explorer 10-11 */
						color: #ccc;
					}
				}
			}
			.borderBt {
				border-bottom: 20rpx solid #fafafa;
			}
		}
	}
	&-btn {
		font-size: 32rpx;
		height: 96rpx;
		width: 100%;
		color: #fff;
		line-height: 96rpx;
		text-align: center;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 100;
		background: #b79f77;
	}
}
</style>
