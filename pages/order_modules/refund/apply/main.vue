<template>
	<div class="afterApply">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<div class="afterApply-box">
			<ul>
				<li>
					<a>
						<div class="list-img"><img :src="items.dataPic" /></div>
						<div class="list-r">
							<div class="list-con">
								<p>{{ items.goodsName }}</p>
								<div>{{ unitPrice.obpay }}{{ items.pricesetNprice }}{{ unitPrice.mapay }}</div>
							</div>
							<h3>{{ items.skuName }}</h3>
							<div class="list-add">
								<div @click="subtract(items)"><i class="iconfont">&#xe755;</i></div>
								<div><input type="text" v-model="items.goodsCamount" disabled /></div>
								<div @click="add(items)"><i class="iconfont">&#xe756;</i></div>
							</div>
						</div>
					</a>
				</li>
			</ul>
		</div>
		<div class="afterApply-con" v-if="items.dataState == '3' || items.dataState == '4'">
			<div>
				类型
				<p>
					<picker @change="afterPickerChange" :value="index" :range="afterArray" mode="selector">
						<view class="picker">{{ afterPickerValue }}</view>
					</picker>
					<!-- <picker :mode="selector" :option="array" @change-option="changeOption"/> -->
					<i class="iconfont">&#xe61d;</i>
				</p>
			</div>
		</div>
		<div class="afterApply-con">
			<div>
				退款原因
				<p>
					<picker @change="bindPickerChange" :value="index" :range="array" mode="selector">
						<view class="picker">{{ pickerValue }}</view>
					</picker>
					<!-- <picker :mode="selector" :option="array" @change-option="changeOption"/> -->
					<i class="iconfont">&#xe61d;</i>
				</p>
			</div>
		</div>
		<div class="afterApply-con">
			<div>
				退款金额
				<p>
					<input v-model="pricesetNprice" :style="{ color: baseColor }" />
					{{ unitPrice.mapay }}
				</p>
			</div>
		</div>
		<div class="afterApply-textarea">
			<p>详细描述：</p>
			<textarea placeholder="请描述您遇到的问题及详细的退换理由，不超过1000字" v-model="refundMeo"></textarea>
		</div>
		<div class="afterApply-img">
			<h4>上传凭证</h4>
			<div class="apply-img-box">
				<dl class="show-apply-img">
					<dd v-for="(item, index) in upImg" :key="index">
						<div class="dd-img">
							<i class="iconfont" @click="delImg(index)">&#xe600;</i>
							<img :src="item" />
						</div>
					</dd>
					<dd v-show="upImgLength">
						<form action class="apply-up-img">
							<div class="weui-uploader__input-box">
								<div class="weui-uploader__input" @click="chooseImage">
									<i class="iconfont">&#xe620;</i>
									<p>上传凭证</p>
								</div>
							</div>
						</form>
					</dd>
				</dl>
			</div>
		</div>
		<div class="afterApply-btn" @click="submitBtn" :style="{ background: baseColor }">提交</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
import { refund } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
// import picker from '@/components/communal/picker';
export default {
	data() {
		return {
			title: '申请退换货',
			leftIcon: true,
			rightIcon: false,
			items: {},
			pricesetNprice: 0, //退款总金额
			beforePrice: 0, // 退款原始金额
			newPrice: 0,
			array: [],
			pickerValue: '请选择',
			refundMeo: '', //描述
			refundType: '', //退款类型B01仅退款，B02退货退款
			baseColor: '',
			upImg: [],
			files: [],
			sumCont: 1, //该商品的购买数量
			upImgLength: true,
			afterPickerValue: '请选择',
			afterArray: ['仅退款', '退货退款'],
			userImgurl: require('../../../../static/img/mine/default_header.png'),
			menuJspath: '', //退货详情列表
			aaa:''
		};
	},
	components: {
		commonHeader
		// picker
	},
	onLoad(options) {
		
		console.log('传参',$storage.get('aaa'))
		this.aaa = $storage.get('aaa')
		console.log(this.$root.$mp.query, '参数212111111111');
		console.log(this.aaa, '参数212111111111');
		wx.setNavigationBarTitle({
			title: $storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + this.$state.baseColor
		});
		Object.assign(this, this.$options.data());
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || $storage.get('unitPrice');
		}
	},
	mounted() {
		this.baseColor = '#' + this.$state.baseColor;
		this.$state.orderMenu.map(v => {
			if (v.menuAction == 'refundInfor') {
				this.menuJspath = v.menuJspath;
			}
		});
		this.array = [];
		this.items = this.aaa
		// this.items = this.$root.$mp.query;
		this.sumCont = this.items.goodsCamount;
		if (this.items.dataState == '3' || this.items.dataState == '4') {
			this.refundType = '';
		} else {
			this.refundType = 'B01';
		}
		this.pricesetNprice = this.items.pricesetNprice * this.items.goodsCamount;
		this.beforePrice = this.items.pricesetNprice * this.items.goodsCamount;
		this.newPrice = this.items.pricesetNprice * this.items.goodsCamount;
		http.get(refund.queryRefCause).then(res => {
			res.map(val => {
				this.array.push(val.flagSettingInfo);
			});
		});
	},
	watch: {
		pricesetNprice(val) {
			console.log(this.pricesetNprice, 'val');
		}
	},
	methods: {
		bindPickerChange(e) {
			this.pickerValue = this.array[Number(e.target.value)];
		},
		afterPickerChange(e) {
			this.afterPickerValue = this.afterArray[Number(e.target.value)];
			if (e.target.value == '1') {
				this.refundType = 'B02';
			} else {
				this.refundType = 'B01';
			}
		},
		chooseImage(e) {
			let i = 0; // 多图上传时使用到的index
			let that = this;
			let max = 1; //最大选择数
			let upLength; //图片数组长度
			let imgFilePaths; //图片的本地临时文件路径列表
			if (that.upImg.length === 2) {
				this.upImgLength = false;
			}
			wx.chooseImage({
				count: max, //一次最多可以选择的图片张数
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					imgFilePaths = res.tempFilePaths;
					upLength = imgFilePaths.length;
					/**
					 * 上传完成后把文件上传到服务器
					 */
					wx.showLoading({
						title: '上传中...'
					});
					console.log(imgFilePaths, 'imgFilePaths');
					that.upLoad(imgFilePaths, i, upLength); //上传操作
				},
				fail: function() {
					console.log('fail');
				},
				complete: function() {
					console.log('commplete');
				}
			});
		},
		upLoad(imgPath, i, upLength) {
			console.log(getApp().globalData.saasAgent);
			let that = this;
			//上传文件
			wx.uploadFile({
				url: this.$domain + refund.uploadRefFile,
				filePath: imgPath[i],
				name: 'file',
				formData: {
					imgIndex: i
				},
				header: {
					'Content-Type': 'multipart/form-data',
					'cookie': wx.getStorageSync('miniToken') + '=' + wx.getStorageSync('sessionid'),
					'saas-Agent': getApp().globalData.saasAgent
				},
				success: function(res) {
					// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					that.upImg.push(that.$domain + JSON.parse(res.data).fileUrl);
				},
				fail: function(res) {
					console.log(res);
					wx.hideLoading();
					wx.showModal({
						//title: '提示',
						content: '上传图片失败',
						showCancel: false,
						success: function(res) {}
					});
				},
				complete: function() {
					i++;
					if (i == upLength) {
						wx.hideLoading(); //上传结束，隐藏loading
					} else {
						that.upLoad(imgPath, i, upLength);
					}
				}
			});
		},
		delImg(index) {
			this.upImg.splice(index, 1);
			this.upImgLength = true;
		},
		subtract(items) {
			let goodsCamount = items.goodsCamount;
			if (goodsCamount > 1) {
				items.goodsCamount--;
			}
			this.pricesetNprice = this.items.pricesetNprice * items.goodsCamount;
			this.newPrice = this.items.pricesetNprice * items.goodsCamount;
		},
		add(items) {
			let goodsCamount = items.goodsCamount;
			if (goodsCamount < this.sumCont) {
				items.goodsCamount++;
			}
			this.pricesetNprice = this.items.pricesetNprice * items.goodsCamount;
			this.newPrice = this.items.pricesetNprice * items.goodsCamount;
		},
		submitBtn() {
			let domainList = [];
			this.upImg.map(val => {
				domainList.push({ refundFileUrl: val });
			});
			let fund = {
				ocRefundGoodsBeanList: [
					{
						contractGoodsCode: this.items.contractGoodsCode,
						goodsCamount: this.items.goodsCamount,
						refundGoodsNum: this.items.goodsCamount,
						refundGoodsAmt: this.items.pricesetNprice
					}
				],
				contractBillcode: this.items.contractBillcode,
				refundMoney: this.pricesetNprice,
				refundEx: this.pickerValue,
				refundMeo: this.refundMeo,
				ocRefundFileDomainList: domainList,
				refundType: this.refundType
			};
			if (this.items.dataState == '3' || this.items.dataState == '4') {
				if (!this.refundType) {
					$message.alert('请选择类型');
				} else if (this.pickerValue == '请选择') {
					$message.alert('请选择退款原因');
				} else if (this.pricesetNprice > this.newPrice) {
					$message.alert('退款金额不能大于退款商品总金额');
				} else if (!this.pricesetNprice) {
					$message.alert('退款金额不能为空');
				} else {
					http.post(refund.saveRefund, { params: JSON.stringify(fund) }).then(res => {
						if (res.success) {
							let refundCode = JSON.parse(res.dataObj).code;
							$router.push(this.menuJspath, { refundCode: refundCode });
						} else {
							$message.alert(res.msg);
						}
					});
				}
			} else {
				if (this.pickerValue == '请选择') {
					$message.alert('请选择退款原因');
				} else if (this.pricesetNprice > this.newPrice) {
					$message.alert('退款金额不能大于退款商品总金额');
				} else if (!this.pricesetNprice) {
					$message.alert('退款金额不能为空');
				} else {
					http.post(refund.saveRefund, { params: JSON.stringify(fund) }).then(res => {
						if (res.success) {
							let refundCode = JSON.parse(res.dataObj).code;
							$router.replace(this.menuJspath, { refundCode: refundCode });
						} else {
							$message.alert(res.msg);
						}
					});
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '../../../../common/css/common.less';
.afterApply {
	width: 100%;
	height: 100%;
	background: @white-color;
	&-box {
		margin-top: 90rpx;
		border-bottom: 20rpx solid #fafafa;
		ul {
			li {
				padding: 20rpx 30rpx;
				.tit {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					height: 83rpx;
					i {
						margin-right: 15rpx;
					}
					span {
						color: @color-666;
						font-size: @big-title;
					}
				}
				a {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.list-img {
						width: 112rpx;
						height: 112rpx;
						margin-right: 20rpx;
						img {
							width: 100%;
							height: 100%;
						}
					}
					.list-r {
						flex: 1;
						.list-con {
							display: flex;
							align-items: center;
							justify-content: space-between;
							p {
								width: 380rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								font-size: @middle-title;
							}
						}

						h3 {
							font-size: 20rpx;
							color: @color-999;
							margin: 5rpx 0 0 0;
						}
						.list-add {
							display: flex;
							align-items: center;
							justify-content: flex-end;
							input {
								width: 50rpx;
								text-align: center;
								font-size: 22rpx;
							}
							div:last-child {
								i {
									font-size: 42rpx;
								}
							}
						}
					}
				}
			}
		}
	}
	&-con {
		padding: @padding-30;
		div {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			height: 107rpx;
			border-bottom: 1rpx solid #f6f6f8;
			p {
				display: flex;
				align-items: center;
				span {
					color: @color-999;
					margin-right: 10rpx;
				}
				input {
					text-align: right;
				}
			}
		}
	}
	&-textarea {
		height: 168rpx;
		padding: @padding-30;
		border-bottom: 1rpx solid #f6f6f8;
		p {
			margin: 30rpx 0;
			font-size: 28rpx;
		}
		textarea {
			font-size: @big-title;
			height: 80rpx;
			width: 100%;
		}
	}
	&-img {
		h4 {
			margin: 30rpx 0;
			font-size: 28rpx;
			padding-left: 30rpx;
		}
		.apply-img-box {
			.show-apply-img {
				dd {
					position: relative;
					width: 154rpx;
					height: 154rpx;
					border: 1rpx solid #f5f5f5;
					float: left;
					margin: 0 20rpx 30rpx;
					background: #f5f5f5;
					.dd-img {
						width: 150rpx;
						height: 150rpx;
						overflow: hidden;
						.icon-delete {
							position: absolute;
							right: -15rpx;
							top: -15rpx;
							z-index: 2;
						}
						img {
							width: 150rpx;
							height: 150rpx;
						}
					}
				}
				form {
					width: 150rpx;
					height: 150rpx;
					background: #fff;
					border: 1px dashed #666;
					display: flex;
					justify-content: center;
					align-items: center;
					text-align: center;
					i {
						font-size: 57rpx;
					}
					p {
						color: @color-999;
						font-size: 20rpx;
					}
					input[type='file'] {
						width: 150rpx;
						height: 150rpx;
						position: absolute;
						opacity: 0;
						top: 0;
						left: 0;
						z-index: 2;
					}
				}
			}
		}
	}
	&-btn {
		height: 98rpx;
		line-height: 98rpx;
		width: 100%;
		text-align: center;
		// background: #bfa676;
		font-size: 32rpx;
		color: @white-color;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 9999;
	}
}
</style>
