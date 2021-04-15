<template>
	<view class="shop-cart">
		<div class="shopcart">
			<!-- 循环遍历类购物车中商品类型 -->
			<div v-if="listItems.length > 0" v-for='(itemList,index1) in listItems'>
				<ul :class="{addmargin:index1 === dataLength}">
					<li>
						<div class="memberTit" @click="titCheckBox(itemList, index1)">
							<!-- 点击全选按钮-->
							<div>
								<!-- <span class="iconfont" v-if="titChecked"
										:style="{ color: baseColor,marginRight:'10rpx' }">&#xe671;</span>
									<span class="iconfont" v-else
										:style="{ color: '#ededed',marginRight:'10rpx' }">&#xe671;</span> -->
								{{ itemList.memberCname }}
							</div>
							<button class="buttonClass" @click.stop="cancleList(index1)">取消清单</button>
						</div>
						<div class="list_li">
							<div class="list_pm list_p">
								<div v-show="list.promotionCode">
									<div class="tit">
										<p :style="{ background: baseColor }" :key="pbIndex">{{ list.pbName }}</p>
										<span class="f-s22">
											{{ list.promotionName ? list.promotionName : '' }}{{ list.disMsg ? list.disMsg : '' }}{{ list.disNextMsg ? list.disNextMsg : '' }}
										</span>
									</div>
								</div>
								<!-- 遍历商品列表 -->

								<div class="itemGoods" v-for="(item, index) in itemList.goodsList" :key="index">
									<div style='height: 100%;position: relative;'>
										<div class="item-container">
											<div class="list-l" @click.stop="listCheckBox(index)">
												<i class="iconfont" :style="{ color: baseColor }"
													v-if="item.shoppingGoodsCheck == 0">&#xe671;</i>
												<i class="iconfont" :style="{ color: '#ededed' }" v-else>&#xe671;</i>
											</div>
											<div class="list-img">
												<img :src="(domain +item.dataPic) || userImgurl" /> <!-- 商品图片-->
												<span v-if="item.dataState == 2">已下架</span>
												<span v-if="item.dataState == 3">已失效</span>
												<span v-if="item.dataState == 1">库存不足</span>
											</div>
											<div class="list-r" :style="{ color: item.dataState !== 0 ? '#ccc' : '' }">
												<p>{{ item.goodsName }}</p>
												<h3 :style="{ color: item.dataState !== 0 ? '#ccc' : '' }">
													{{ item.skuName }}*{{ item.goodsCamount }}
												</h3>
												<div class="list-count">
													<div :style="{ color: item.dataState !== 0 ? '#ccc' : '#d66377' }"
														style='font-size: 12px;'>
														<span
															style='color: #000000;'>{{ unitPrice.obpay }}{{ item.pricesetNprice }}{{ unitPrice.mapay }}</span>
													</div>
													<view class="list-right-container">
														<div class="list-add">
															<div @click.stop="subtract(index)">
																<i class="iconfont"
																	:style="{ color: item.goodsNum && item.goodsNum > 0 && item.goodsNum <= item.goodsMinnum ? '#ccc' : '' }">
																	&#xe755;
																</i>
															</div>
															<div><input type="text" v-model="item.goodsNum" disabled />
															</div>
															<div @click.stop="add(index)"><i
																	class="iconfont">&#xe756;</i></div>
														</div>
													</view>
												</div>
											</div>
										</div>
										<div class='deleteItem' v-if='item.shoppingGoodsCheck == 0' :class="{'deleteItem-show':item.itemChecked}" @click='deleteItem(index)'>
											<span style='font-style: 16px;color: #fff;'>删除</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class='goodsPrice'>
							<div class='goodsPrice-item'>
								<span>商品金额：</span>
								<span>{{ unitPrice.obpay }}{{itemList.contractInmoney}}{{ unitPrice.mapay }}</span>
							</div>
							<div class='goodsPrice-item'>
								<span>运费：</span>
								<span>{{ unitPrice.obpay }}{{itemList.freight == null?0:itemList.freight}}{{ unitPrice.mapay }}</span>
							</div>
							<div class='goodsPrice-item'>
								<span>组合优惠：</span>
								<span>{{ unitPrice.obpay }}0{{ unitPrice.mapay }}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div class='totalPrice'>
				<div style='width: 70%;float: left;padding: 20rpx;box-sizing: border-box;'>应付金额：
					<span style='color: #ff557f;'>{{ unitPrice.obpay }}{{totalPrice}}{{ unitPrice.mapay }}</span>
				</div>
				<div class='goPay' @click='toSettle'>去结算</div>
			</div>
		</div>
	</view>
</template>

<script>
	import {
		getContractByContractBillcode,
		updateOcContractGoodsGoodNum,
		deleteOcContractGoods,
		cancelContractForAt
	} from '@/api/interface.js';
	import {
		$storage,
		$message,
		$router
	} from '@/utils/prototype/vue.js'
	export default {
		data() {
			return {
				sanci: [1, 2, 3],
				leftIcon: false,
				rightIcon: false,
				titChecked: false,
				countChecked: false,
				textShow:false,
				listItems: [],
				userImgurl: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
				nullImg: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noCar.png',
				baseColor: '',
				totalPointPrice: 0,
				totalPrice: 0,
				options: [], //点修改后的所有营销活动
				optionsIndex: -1, //当前默认的营销活动名称index
				shopIdAttr: [], //所有的商品id
				shopSetInfo: '',
				// 起送量
				shopSaleMinNum: '',
				totalGoodsWeight: 0,
				weightUnit: '',
				quotaPopup: false,
				quotaList: [],
				checkSkuMultipleData: [],
				batchCollectData: [],

				navIndex: 2,
				footerMenu: [],
				typeList: [], // 分好类的所有类型的商品
				domain: "",
				userinfoOcode: "", //权益值
				userinfoType: "", //用户类型
				userPhone: "", //手机号
				checkModifyAudit: "",
				userInfoCode: "",
				dataLength: "",
				contractBillcode: ''

			};
		},
		computed: {
			unitPrice() {
				// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
				return this.$qj.state.unitPrice || this.$qj.storage.get('unitPrice');
			}
		},
		onShow() {
			this.domain = this.$domain;
			// this.queryShopSet();
			// this.commonMounted(true, true);
		},
		onLoad(options) {
			this.getContract(options.code)
		},
		mounted() {
			this.userinfoType = $storage.get('loginInfor').userinfoType;
			this.userInfoCode = $storage.get('loginInfor').userInfoCode;
			this.userPhone = $storage.get('loginInfor').userPhone;
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			// this.commonMounted();
			this.dataLength = this.sanci.length - 1

		},
		methods: {
			// 查询 认证授权 状态
			searchStatus() {
				let that = this
				let paramsStatus = {}
				paramsStatus.userCode = this.userInfoCode
				this.$qj
					.http(this.$qj.domain)
					.get(userapplyStateAndAuth, paramsStatus)
					.then(res => {
						console.log("认证授权状态，", res)
						if (res.checkModifyAudit == '3') {
							that.checkModifyAudit = "3"
						}

					});
			},
			//查询合同单详情
			getContract(code) {
				this.contractBillcode = code
				this.$qj
					.http(this.$qj.domain)
					.post(getContractByContractBillcode, {
						contractBillcode: code
					}).then(res => {
						res.goodsList.forEach(item=>{
							item.itemChecked = false
						})
						this.listItems = []
						this.listItems.push(res)
						this.totalPrice = res.dataBmoney
					})
			},

			// 点击选择购物车在当前下的商品
			titCheckBox(list, liIndex) {
				this.titChecked = !this.titChecked
				this.listItems[liIndex].goodsList.forEach(item => {
					item.shoppingGoodsCheck == '0' ? item.shoppingGoodsCheck = '1' : item.shoppingGoodsCheck = '0'
				})
			},
			//对单个商品进行勾选操作
			listCheckBox(item) {
				this.listItems[0].goodsList[item].shoppingGoodsCheck == '0' ? this.listItems[0].goodsList[item]
					.shoppingGoodsCheck = '1' : this.listItems[0].goodsList[item].shoppingGoodsCheck = '0'
				setTimeout(()=>{
					if(this.listItems[0].goodsList[item].shoppingGoodsCheck == '0'){
					this.listItems[0].goodsList[item].itemChecked = true
				}else{
					this.listItems[0].goodsList[item].itemChecked = false
				}
				},50)
				
				// item.shoppingGoodsCheck == '0'? item.shoppingGoodsCheck='1':item.shoppingGoodsCheck='0'
			},
			//删除商品数量
			subtract(index) {
				let item = this.listItems[0].goodsList[index]
				let goodsCamount = item.goodsNum;
				if (item.goodsMinnum && item.goodsMinnum > 0) {
					if (item.goodsCamount <= item.goodsMinnum) {
						this.$qj.message.alert('购买数量不能小于起订量');
					} else if (item.goodsCamount > item.goodsMinnum && goodsCamount > 1) {
						// 用户维度的起订量倍数，优先级最高
						if (item.skuOneNum) {
							goodsCamount = goodsCamount - item.goodsMinnum * item.skuOneNum;
						} else {
							if (item.goodsTopnum == 1) {
								goodsCamount = goodsCamount - item.goodsMinnum;
							} else {
								goodsCamount--;
							}
						}

						item.goodsNum = goodsCamount;
						this.$qj
							.http(this.$qj.domain)
							.post(updateOcContractGoodsGoodNum, {
								occontractgoodsStr: JSON.stringify(item)
							})
							.then(res => {
								if (res && res.success) {
									this.getContract(this.contractBillcode);
								} else {
									if (res.errorCode == '-1') {
										item.goodsCamount = item.goodsSupplynum;
										//购买商品数量不能超过商品库存
									}
								}
							});
					}
				} else {
					if (goodsCamount > 1) {
						goodsCamount--;
						item.goodsNum = goodsCamount;
						this.$qj
							.http(this.$qj.domain)
							.post(updateOcContractGoodsGoodNum, {
								occontractgoodsStr: JSON.stringify(item)
							})
							.then(res => {
								if (res && res.success) {
									this.getContract(this.contractBillcode);
								} else {
									if (res.errorCode == '-1') {
										item.goodsCamount = item.goodsSupplynum;
										//购买商品数量不能超过商品库存
									}
								}
							});
					}
				}
			},
			add(index) {
				let item = this.listItems[0].goodsList[index]
				let goodsCamount = item.goodsNum;
				if (item.goodsMinnum && item.goodsMinnum > 0) {
					if (item.skuOneNum) {
						goodsCamount = goodsCamount + item.goodsMinnum * item.skuOneNum;
					} else {
						if (item.goodsTopnum == 1) {
							goodsCamount = goodsCamount + item.goodsMinnum;
						} else {
							goodsCamount++;
						}
					}

					item.goodsNum = goodsCamount;
				} else {
					if (goodsCamount < 1000) {
						goodsCamount++;
						item.goodsNum = goodsCamount;
					}
				}

				this.$qj
					.http(this.$qj.domain)
					.post(updateOcContractGoodsGoodNum, {
						occontractgoodsStr: JSON.stringify(item)
					})
					.then(res => {
						if (res && res.success) {
							this.getContract(this.contractBillcode);
						} else {
							if (res.errorCode == '-1') {
								this.$qj.message.alert(res.msg);
							}
						}
					});
			},
			//取消报价单
			cancleList(index) {
				let json = {
					contractId: parseInt(this.listItems[index].contractId),
					oldDataState: parseInt(this.listItems[index].dataState)
				}
				this.$qj
					.http(this.$qj.domain)
					.post(cancelContractForAt, json)
					.then(res => {
						if (res && res.success) {
							uni.navigateBack()
						} else {
							this.$qj.message.alert('清单取消失败');
						}
					});
			},
			//删除商品
			deleteItem(index){
				//deleteOcContractGoods
				let json = {
					contractGoodsId:this.listItems[0].goodsList[index].contractGoodsId
				}
				this.$qj
					.http(this.$qj.domain)
					.post(deleteOcContractGoods, json)
					.then(res => {
						if (res && res.success) {
							this.getContract(this.contractBillcode);
							this.$qj.message.alert('商品删除成功');
						} else {
							this.$qj.message.alert('商品删除失败');
						}
					});
			},
			//去结算
			toSettle(){
				let params = {
					contractBillcode:this.contractBillcode
				}
				$router.push("marketing_module/pages/quotation/orderline",params)
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '@/node_modules/qj-mini-pages/libs/css/common.less';

	.deleteItem {
		width: 0;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		align-items: center;
		background-color: red;
		display: flex;
		justify-content: center;
		z-index: 99999;
		transition:all .8s;
	}
	.deleteItem-show{
		width: 150rpx;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		align-items: center;
		background-color: red;
		display: flex;
		justify-content: center;
		z-index: 99999;
	}

	.buttonClass {
		height: 45rpx;
		width: 120rpx;
		line-height: 45rpx;
		background-color: #fff;
		font-size: 12px;
		font-weight: 500;
		border: 1px solid #555555;
	}

	.goodsPrice {
		width: 100%;
		height: 200rpx;
		display: flex;
		background-color: #fff;
		flex-direction: column;

		&-item {
			padding: 15rpx 30rpx;
			display: flex;
			justify-content: space-between;
			font-size: 12px;
		}
	}

	.totalPrice {
		width: 100%;
		height: 80rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		overflow: hidden;
	}

	.goPay {
		width: 28%;
		height: 100%;
		background: #004178;
		font-size: 16px;
		text-align: center;
		float: right;
		color: #FFF;
		line-height: 80rpx;
	}

	.shop-cart {
		height: 100%;
	}

	.shop-cart /deep/ .u-drawer {
		z-index: 999999 !important;
	}

	.shopcart {
		width: 100%;
		height: 100%;
		background: #fafafa;
		position: relative;

		&-save {
			position: fixed;
			z-index: 9999;
			height: 90rpx;
			line-height: 90rpx;
			text-align: right;
			right: 34rpx;
			top: 0;
			font-size: @big-title;
			width: 100%;
			background: #ffffff;
		}

		&-back {
			a {
				width: 70rpx;
				height: 90rpx;
				position: fixed;
				z-index: 9999;
				left: 30rpx;
				top: 0;
				display: inline-block;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.special-remind {
			position: fixed;
			top: 91rpx;
			z-index: 9999;
			width: 100%;
			background: @white-color;
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			height: 64rpx;

			text {
				font-size: 24rpx;
				flex: 1;
				display: -webkit-box;
				overflow: hidden;
				text-overflow: ellipsis;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
			}

			.iconfont {
				font-size: 24rpx;
			}
		}

		ul {

			// margin-bottom: 256rpx;
			// marg		        in-bottom: 256rpx;
			li {
				margin: 10rpx 30rpx 20rpx;

				// background: @white-color;
				// border-radius: 6rpx;
				.memberTit {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 68rpx;
					font-size: 28rpx;
					font-weight: bold;
					color: @color-333;

					i {
						padding-right: 15rpx;
					}
				}

				// .tit{
				//   display: flex;
				//   align-items: center;
				//   justify-content: flex-start;
				//   height: 68rpx;
				//   margin:0 22rpx;
				//   border-bottom: 1rpx solid #f6f6f8;
				//   i{
				//     margin-right: 15rpx;
				//   }
				// }
				.list_li {
					.list_p {
						border-bottom: 20rpx solid #fafafa;
					}

					.list_pm {
						background: @white-color;
						border-radius: 6rpx;

						.tit {
							display: flex;
							align-items: center;
							justify-content: flex-start;
							height: 68rpx;
							margin: 0 22rpx;
							font-size: 22rpx;
							color: @color-666;
							border-bottom: 1rpx solid #f6f6f8;

							p {
								padding: 5rpx 8rpx;
								font-size: 18rpx;
								color: @white-color;
								background: #b79f77;
								border-radius: 20rpx;
								margin-right: 10rpx;
							}
						}

						.updatePm {
							height: 66rpx;
							padding: 0 22rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;

							p {
								font-size: 22rpx;
								color: @color-666;
								display: flex;
								align-items: center;

								i {
									font-size: 20rpx;
									padding: 5rpx 10rpx;
									border-radius: 20rpx;
									text-align: center;
									border: 1rpx solid #b79f77;
									color: #b79f77;
									margin-right: 15rpx;
								}
							}

							span {
								width: 66rpx;
								text-align: right;
								font-size: 22rpx;
								color: @color-333;
							}
						}

						.itemGoods {
							.item-container {
								display: flex;
								align-items: center;
								justify-content: space-between;
								padding: 22rpx 22rpx 35rpx;
								border-bottom: 1rpx solid #f6f6f8;
								position: relative;

								.list-l {
									padding-right: 25rpx;
								}

								.list-img {
									position: relative;

									img {
										width: 160rpx;
										height: 160rpx;
										margin-right: 25rpx;
									}

									span {
										width: 160rpx;
										height: 44rpx;
										background: #b3b3b3;
										color: @white-color;
										font-size: 22rpx;
										text-align: center;
										line-height: 44rpx;
										position: absolute;
										bottom: 0;
										left: 0;
									}
								}

								.list-r {
									p {
										width: 380rpx;
										overflow: hidden;
										text-overflow: ellipsis;
										white-space: nowrap;
										font-size: @middle-title;
									}

									h3 {
										font-size: 22rpx;
										color: @color-999;
										margin: 10rpx 0 13rpx 0;
									}

									.list-count {
										display: flex;
										align-items: center;
										justify-content: space-between;

										.list-right-container {
											display: flex;
											align-items: center;

											.collect {
												font-size: 36rpx;
											}

											.list-add {
												margin-left: 20rpx;
												display: flex;
												align-items: center;

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
					}
				}
			}

		}

		.min-sale-num {
			display: flex;
			position: fixed;
			z-index: 99;
			width: 100%;
			font-size: 24rpx;
			color: @white-color;
			align-items: center;
			justify-content: center;
			height: 55rpx;
			bottom: 200rpx;
		}

		&-count {
			display: flex;
			width: 100%;
			position: fixed;
			z-index: 99;
			bottom: 102rpx;
			left: 0;
			align-items: center;
			justify-content: space-between;
			height: 98rpx;
			font-size: @middle-title;
			color: @color-666;
			background: #fff;

			.del {
				color: #b79f77;
				font-size: @big-title;
				width: 118rpx;
				height: 58rpx;
				border: 1rpx solid #b79f77;
				border-radius: 30rpx;
				text-align: center;
				line-height: 60rpx;
				margin-right: 30rpx;
			}

			div:first-child {
				display: flex;
				align-items: center;
				margin-left: 30rpx;
			}

			.addCount:last-child {
				display: flex;
				align-items: center;
				margin-right: 30rpx;

				.total-price {
					display: flex;
					align-items: center;
				}
			}

			i {
				padding-right: 15rpx;
			}

			.buy-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 206rpx;
				height: 60rpx;
				color: @white-color;
				border-radius: 5rpx;
				background: #b79f77;
				margin-left: 28rpx;
			}
		}

		&-nulls {
			height: calc(100% - 202rpx);
			text-align: center;

			img {
				width: 349rpx;
				height: 309rpx;
				margin: 280rpx auto 0;
			}
		}

		&-screenLeft {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			left: 0;
			background-color: rgba(0, 0, 0, 0.6);
			z-index: 99;
		}

		&-preferential {
			width: 100%;
			height: 488rpx;
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 99;

			&-con {
				background-color: #fff;
				height: 488rpx;
				position: absolute;
				width: 100%;
				bottom: 0;

				p {
					height: 92rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border-bottom: 1rpx solid #f5f5f5;
					padding: @padding-lr;
				}

				ol {
					height: 300rpx;
					overflow-y: auto;
					overflow-x: hidden;
					padding: @padding-30;

					li {
						border-bottom: 1rpx solid #f6f6f8;
						height: 106rpx;

						h3 {
							height: 106rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							font-size: @big-title;
							color: @color-333;

							h4 {
								display: flex;
								align-items: center;

								span {
									background: #b79f77;
									font-size: 22rpx;
									color: #fff;
									padding: 4rpx 10rpx;
									border-radius: 20rpx;
									margin-left: 10rpx;
								}
							}
						}
					}
				}

				.pre-btn {
					height: 96rpx;
					position: absolute;
					bottom: 0;
					width: 100%;
					text-align: center;
					line-height: 96rpx;
					color: @white-color;
					font-size: @top-title;
					background: #b79f77;
				}
			}
		}
	}

	.quota-popup {
		.popup-container {
			display: flex;
			flex-direction: column;
			height: 600rpx;

			.quota-title {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 84rpx;
				width: 100%;
				font-size: 30rpx;
				color: #333333;
			}

			.quota-info-list {
				flex: 1;
				overflow: auto;
				width: 580rpx;
				margin: 0 auto;
				margin-bottom: 25rpx;

				.quota-item {
					padding: 25rpx 0;
					border-bottom: 1rpx solid #f5f5f5;

					&:last-child {
						border-bottom: none;
					}

					.goods-name {
						font-size: 30rpx;
						color: #333333;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.quota-info {
						display: block;
						margin-top: 20rpx;
						font-size: 26rpx;
						color: #333333;

						text {
							padding: 0 10rpx;
						}
					}
				}
			}

			::-webkit-scrollbar {
				display: none;
			}
		}
	}
</style>
