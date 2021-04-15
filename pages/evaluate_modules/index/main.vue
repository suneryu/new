<template>
	<div class="evaluateList">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<ul v-for="(goods, goodsIndex) in query" :key="goodsIndex">
			<li class="evaluateList-img">
				<img :src="goods.dataPic" />
				<div>
					<h3>{{ templateTitle }}</h3>
					<p>
						<i
							class="iconfont"
							v-for="(template, teIndex) in goods.evaluateScopeList"
							:key="teIndex"
							@click="iconShow(teIndex, goodsIndex)"
							:style="{ color: template.baseColor ? baseColor : '' }"
							ref
						>
							&#xe610;
						</i>
					</p>
				</div>
			</li>
			<div class="evaluateList-text">
				<textarea placeholder="宝贝满足您的期待吗？说说您的使用心得，分享给想买的他们吧!" v-model="goods.evaluateGoodsContent"></textarea>
				<div class="evaluateList-text-img">
					<!-- <h4>上传凭证</h4> -->
					<div class="evaluateList-text-img-box">
						<dl class="show-apply-img">
							<dd v-for="(item, index) in goods.upImg" :key="index">
								<div class="dd-img">
									<i class="iconfont" @click="delImg(index, goodsIndex)">&#xe600;</i>
									<img :src="item" />
								</div>
							</dd>
							<dd v-show="goods.upImgLength">
								<form action class="apply-up-img">
									<div class="weui-uploader__input-box">
										<div class="weui-uploader__input" @click="chooseImage(goodsIndex)">
											<i class="iconfont">&#xe620;</i>
											<p>添加图片</p>
										</div>
									</div>
								</form>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</ul>
		<div class="evaluateList-addSubmit" :style="{ background: baseColor, 'border-color': baseColor }" @click="addSubmit">提交</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $router, $message } from '@/utils/prototype/vue.js';
import { refund, queryUseTemplate, saveEvaluateGoods, saveEvaluateShop } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
import Vue from 'vue';
export default {
	data() {
		return {
			title: '发表评价',
			leftIcon: true,
			rightIcon: false,
			baseColor: '',
			upImg: [],
			files: [],
			//upImgLength:true,
			evaluateGoodsContent: '', //评价内容
			//templateValuesReList:[],//星
			evaluateScopeList: [], //星
			templateTitle: '',
			evaluateGoodsImgs: [], //提交图片的数组
			current: 0,
			query: [], //上个路由携带参数
			userImgurl: require('../../../static/img/mine/default_header.png'),
			orderUrl: '' //订单列表路径
		};
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
	components: {
		commonHeader
	},
	mounted() {
		this.baseColor = '#' + this.$state.baseColor;
		this.$state.orderIndex.map(v => {
			if (v.menuAction == 'order') {
				this.orderUrl = v.menuJspath;
			}
		});
		this.query = this.$state.order;
		http.post(queryUseTemplate, { applyTarget: 'goods' }).then(res => {
			this.templateTitle = res[0].templateTitle;
			this.evaluateScopeList = res[0].templateValuesReList;
			this.query.map(val => {
				val.evaluateScopeList = res[0].templateValuesReList;
				val.upImgLength = true;
				val.upImg = [];
				val.evaluateGoodsImgs = [];
			});
			this.$state.set('order', this.query);
			$storage.set('evaluateScopeList', this.query);
		});
	},
	methods: {
		delImg(index, goodsIndex) {
			let attr,
				add,
				_up = [];
			attr = [...$storage.get('evaluateScopeList')];
			let evaled = [];
			let upImg = [];
			attr.map(val => {
				evaled.push(val.upImgLength);
				upImg.push(val.upImg);
			});
			evaled[goodsIndex] = true;
			upImg[goodsIndex].splice(index, 1);

			add = JSON.parse(JSON.stringify(evaled[goodsIndex]));
			evaled[goodsIndex] = add;
			_up = JSON.parse(JSON.stringify(upImg[goodsIndex]));
			upImg[goodsIndex] = _up;
			attr.map(val => {
				delete val.upImgLength;
				delete val.upImg;
				delete val.evaluateGoodsImgs;
			});
			attr.map((val, k) => {
				val.upImgLength = evaled[k];
				val.upImg = upImg[k];
				val.evaluateGoodsImgs = upImg[k];
			});
			this.query = attr;
			$storage.set('evaluateScopeList', this.query);
		},
		chooseImage(goodsIndex) {
			let i = 0; // 多图上传时使用到的index
			let that = this;
			let max = 6; //最大选择数
			let upLength; //图片数组长度
			let imgFilePaths; //图片的本地临时文件路径列表

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
					that.upLoad(imgFilePaths, i, upLength, goodsIndex); //上传操作

					let attr,
						add = [];
					attr = [...that.query];
					let evaled = [];
					attr.map(val => {
						evaled.push(val.upImgLength);
					});
					if (that.query[goodsIndex].upImg.length === 4) {
						evaled[goodsIndex] = false;
						add = JSON.parse(JSON.stringify(evaled[goodsIndex]));
						evaled[goodsIndex] = add;
						attr.map(val => {
							delete val.upImgLength;
						});
						attr.map((val, k) => {
							val.upImgLength = evaled[k];
						});
						that.query = attr;
					}
				},
				fail: function() {
					console.log('fail');
				},
				complete: function() {
					console.log('commplete');
				}
			});
		},
		upLoad(imgPath, i, upLength, goodsIndex) {
			console.log(imgPath[i]);
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
					cookie: wx.getStorageSync('miniToken') + '=' + wx.getStorageSync('sessionid'),
					'saas-Agent': getApp().globalData.saasAgent
				},
				success: function(res) {
					let attr,
						add = [];
					attr = [...that.query];
					let evaled = [];
					attr.map(val => {
						evaled.push(val.upImg);
					});
					evaled[goodsIndex].push(that.$domain + JSON.parse(res.data).fileUrl);

					add = JSON.parse(JSON.stringify(evaled[goodsIndex]));
					evaled[goodsIndex] = add;
					attr.map(val => {
						delete val.upImg;
					});
					attr.map((val, k) => {
						val.upImg = evaled[k];
					});
					that.query = attr;
					that.query[goodsIndex].evaluateGoodsImgs.push(JSON.parse(res.data).fileUrl);
					$storage.set('evaluateScopeList', that.query);
				},
				fail: function(res) {
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
						wx.hideLoading();
					} else {
						that.upLoad(imgPath, i, upLength);
					}
				}
			});
		},
		iconShow(index, goodsIndex) {
			let attr,
				add = [];
			attr = [...$storage.get('evaluateScopeList')];
			let evaled = [];
			attr.map(val => {
				evaled.push(val.evaluateScopeList);
			});

			add = JSON.parse(JSON.stringify(evaled[goodsIndex]));
			if (add[index].baseColor) {
				add.map((val, k) => {
					if (k > index) {
						val.baseColor = '';
					}
				});
			} else {
				add.map((val, k) => {
					if (k <= index) {
						val.baseColor = this.baseColor;
					}
				});
			}
			evaled[goodsIndex] = add;
			attr.map(val => {
				delete val.evaluateScopeList;
			});
			attr.map((val, k) => {
				val.evaluateScopeList = evaled[k];
			});
			this.query = attr;
			$storage.set('evaluateScopeList', this.query);
		},
		addSubmit() {
			this.query.map((val, k) => {
				val.evaluateGoodsImgs = val.evaluateGoodsImgs ? val.evaluateGoodsImgs.join(',') : '';
				val.contractAppraise = 1;
				this.query[k].evaluateScopeList = val.evaluateScopeList.filter(v => v.baseColor === this.baseColor);
			});
			let params = [];
			let shops = {
				contractBillcode: this.query[0].contractBillcode,
				memberBcode: this.query[0].memberBcode,
				memberBname: this.query[0].memberBname,
				memberCode: this.query[0].memberCode,
				memberName: this.query[0].memberName
			};
			console.log(this.query);
			console.log(shops);
			//params.push(this.query)
			let isNullResolve = false;
			new Promise((resolve, reject) => {
				resolve();
				this.query.map((val, k) => {
					if (this.query[k].evaluateScopeList.length > 0) {
						isNullResolve = true;
					}
				});
			}).then(() => {
				if (isNullResolve) {
					shops.paramStr = JSON.stringify(this.query);
					http.post(saveEvaluateShop, shops);

					http.post(saveEvaluateGoods, { paramStr: JSON.stringify(this.query) })
						.then(res => {
							$message.alert('评价成功');
							$router.back();
						})
						.then(() => {
							// $router.replace(this.orderUrl, { dataState: 0 });
							// $router.replace('order_modules/o2o_order/index', { dataState: 0 });
						});
				} else {
					$message.alert('商品星星评分要完整');
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import '../../../common/css/common.less';
.evaluateList {
	background: @white-color;
	width: 100%;
	padding-top: 90rpx;
	ul {
		li {
			display: flex;
			align-items: cener;
			justify-content: flex-start;
			padding: 34rpx 30rpx;
			border-bottom: 1rpx solid #eee;
			img {
				width: 110rpx;
				height: 110rpx;
				margin-right: 28rpx;
			}
			h3 {
				font-size: @big-title;
				color: #212121;
				margin-bottom: 30rpx;
			}
			p {
				i {
					float: left;
					margin-right: 26rpx;
					color: #efefef;
				}
			}
		}
	}
	&-text {
		padding: 30rpx 30rpx 40rpx;
		border-bottom: 1rpx solid #eee;
		textarea {
			height: 170rpx;
			width: 100%;
			color: #ccc;
		}
		&-img {
			h4 {
				margin: 30rpx 0;
				font-size: 28rpx;
				padding-left: 30rpx;
			}
			&-box {
				.show-apply-img {
					padding: 20rpx 0;
					overflow: hidden;
					zoom: 1;
					dd {
						position: relative;
						width: 154rpx;
						height: 154rpx;
						float: left;
						margin: 0 10rpx 30rpx;
						&:first-child {
							margin: 0 10rpx 30rpx 0;
						}
						&:nth-child(4) {
							margin: 0 0 30rpx 10;
						}
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
						border: 1px dashed #d2d2d2;
						display: flex;
						justify-content: center;
						align-items: center;
						text-align: center;
						i {
							font-size: 57rpx;
							color: #d2d2d2;
						}
						p {
							color: #d2d2d2;
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
	}
	&-addSubmit {
		width: 590rpx;
		height: 84rpx;
		margin: 132rpx auto 0;
		// background: #b79f77;
		line-height: 84rpx;
		text-align: center;
		color: @white-color;
		border-radius: 6rpx;
		font-size: 28rpx;
	}
}
</style>
