<!-- 自定义导航栏带搜索框的商品列表页(有批量收藏和批量加入购物车的功能) -->
<template>
	<view style="height: 100%;">
		<view class="goodsList" :style="{ bottom:'100rpx',height:'calc(100% - 110rpx)' }">
			<div class="itemGoods" v-if="items.length > 0">
				<ul>
					<div class="memberTit" >
						<!-- 点击全选按钮-->
						<div>
							<!-- <span class="iconfont" v-if="titChecked"
									:style="{ color: baseColor,marginRight:'10rpx' }">&#xe671;</span>
								<span class="iconfont" v-else
									:style="{ color: '#ededed',marginRight:'10rpx' }">&#xe671;</span> -->
							海德堡B2B商城
						</div>
						<button class="buttonClass" @click.stop="cancleList()">删除报价单</button>
					</div>
					<li v-for="(item, index) in items" :key="index">
						<div class="item-container" style='position: relative;'>
							<div class="list-l" @click.stop="listCheckBox(item,index)">
								<i class="iconfont" :style="{ color: baseColor }"
									v-if="item.itemChecked">&#xe671;</i>
								<i class="iconfont" :style="{ color: '#ededed' }" v-else>&#xe671;</i>
							</div>
							<div class="list-img" @click.stop="goToGoodsDetail(item)">
								<img :src="item.dataPic || userImgurl" /> <!-- 商品图片-->
								<!-- <span v-if="item.dataState == 0">已下架</span> -->
							</div>
							<div class="list-r" >
								<p @click.stop="goToGoodsDetail(item)">{{ item.goodsName }}</p>
								<h3 
									@click.stop="goToGoodsDetail(item)">
									{{ item.skuName }}
								</h3>
								<div class="list-count">
									<div :style="{ color: '#d66377'}"
										style='font-size: 14px;'>
										<span v-if='goodsClass =="1" && userinfoType == "2" && checkModifyAudit == "3" && scontractCode == ""'>采购价：{{ item.pricesetMakeprice }} 元</span>
										<span v-if='checkModifyAudit != "3" && scontractCode == ""'>{{ item.pricesetNprice }} 元</span>
										<span v-if='scontractCode != ""'>合同价：{{ item.pricesetMakeprice }} 元</span>
									</div>
									<view class="list-right-container">
										<div class="list-add">
											<div @click.stop="subtract(item, index)">
												<i class="iconfont"
													:style="{ color: item.goodsNum && item.goodsNum > 0 && item.goodsNum <= item.goodsMinnum ? '#ccc' : '' }">
													&#xe755;
												</i>
											</div>
											<div style='z-index: 0;'><input type="text" v-model="item.goodsNum == null?0:item.goodsNum" disabled /></div>
											<div @click.stop="add(item, index)"><i class="iconfont">&#xe756;</i></div>
										</div>
									</view>
								</div>
							</div>
							<div class='deleteItem' v-if='item.itemChecked' :class="{'deleteItem-show':item.itemCheckedDelete}" >
								<span style='font-style: 16px;color: #fff;' @click='deleteQuotation(item.shoppingGoodsId)'>删除</span>
							</div>
						</div>
						
					</li>
				</ul>
			</div>
			<div class="goodsList-nulls" v-else><img :src="nullImg" /></div>
		</view>
		<view style="width: 100%;height: 150rpx;bottom: 0;position: fixed;padding: 20rpx 20rpx 70rpx 20rpx;background: #fff;box-sizing: border-box;font-size: 16px;">
			<div style='background-color: #004178;color: #fff;text-align: center;padding: 20rpx;border-radius: 5px;' @click='createQuotation'>
				<span type='primary'>推送报价单</span>
			</div>
		</view>
	</view>
</template>

<script>
	import {
		updateShoppingGoodsNum,
	} from '@/node_modules/qj-mini-pages/libs/api/interface.js';
	import {
		search,
		queryBrandPageForC,
		userapplyStateAndAuth,
	} from '@/api/interface.js';
	import {
		queryNewUserinfoPageByDealerqt,
		// queryLabelPageForC
	} from '@/api/interfaceHDB.js';
	
	import {
		$storage,
		$message,
		$router
	} from '@/utils/prototype/vue.js'
	export default {
		data() {
			return {
				searchValue:'',
				textShow:false,
				title: '商品列表',
				leftIcon: true,
				rightIcon: false,
				baseColor: '',
				userImgurl: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
				nullImg: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noSearchResult.png',
				params: {},
				items: [],
				total: 0,
				page: 1,
				rows: 10,
				current: 0,
				colorCurrent: null,
				brandCode: '',
				labelCurrent: null,
				moneys: false,
				lastPageLine: false,
				screenShow: false,
				screenList: [],
				labelList: [],
				maxPrice: null,
				minPrice: null,
				iconColor: null,
				classtreeCode: '',
				searchPath: '',
				searchParams: this.propSearchParam,
				// 批量加入收藏和购物车
				allChecked: false,
				itemCheckedArr: [],
				// 数据处理中防止用户多次点击
				handling: false,
				offsetTop: 0,
				goodsOrigin: 0,
				userInfoCode: '',

				channelCode: '',
				searchParam: "",
				goodsClassCode: "",
				userinfoOcode: "", //权益值
				userinfoType: "", //用户类型
				userPhone: "", //手机号
				checkModifyAudit: "",
				userInfoCode: "",
				rtagCode: "",
				userInfoCode: "",
				goodsClass: "",
				scontractCode:''
			};
		},
		onShow() {
			this.getPersonal()
		},
		onLoad(options) {
			this.userPhone = options.userPhone
			this.scontractCode = options.scontractCode
		},
		computed: {
			unitPrice() {
				// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
				return this.$qj.state.unitPrice || this.$qj.storage.get('unitPrice');
			}
		},
		mounted() {
			this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
			this.$qj.storage.get('getTopPerMenuList').map(v => {
				if (v.menuAction == 'search' && v.menuCode == '00000222') {
					this.searchPath = v.menuJspath;
				}
			});
		},
		beforeDestroy() {
			this.page = 1;
			this.$qj.storage.set('searchParam', '');
		},
		methods: {
			//获取详情
			getGoodsDetial(skuCode){
				this.$qj
					.http(this.$qj.domain)
					.post('/web/rs/resourceGoods/getResourceGoodsInfoBySkuCode.json', {skuCode}).then(res => {
						this.goodsClass = res.goodsClass
					})
			},
			//取消报价单
			cancleList(){
				let shoppingGoodsList =[]
				this.items.forEach(item=>{
					shoppingGoodsList.push(item.shoppingGoodsId)
				})
				this.$qj.http(this.$qj.domain).get('/web/oc/empshopping/deleteShoppingGoods.json', {
					shoppingGoodsId: shoppingGoodsList.toString(),
				}).then(res => {
					if(res.success){
						uni.navigateBack()
					}else{
						this.$qj.message.alert(res.msg);
					}
				})
			},
			//删除报价单商品
			deleteQuotation(goosId){
				this.$qj.http(this.$qj.domain).get('/web/oc/empshopping/deleteShoppingGoods.json', {
					shoppingGoodsId: goosId,
				}).then(res => {
					if(res.success){
						this.commonMounted()
						this.$qj.message.alert('商品删除成功！');
					}else{
						this.$qj.message.alert(res.msg);
					}
					
				})
			},
			//获取用户信息
			getPersonal(){
				this.$qj.http(this.$qj.domain).get('/web/um/userserviceinfo/queryUserinfoservicePage.json', {
					userinfoPhone: this.userPhone,
					userinfoBtateBlak: 0
				}).then(res => {
					this.userinfoType = res.list[0].userinfoType
					this.userInfoCode = res.list[0].userinfoCode;
					this.searchStatus();
					this.getQY();
				})
			},
			//推送报价单
			createQuotation(){
				let shoppingGoodsList =[]
				this.items.forEach(item=>{
					shoppingGoodsList.push(item.shoppingGoodsId)
				})
				if(shoppingGoodsList.length>0){
					this.$qj.http(this.$qj.domain).get('/web/oc/empshopping/queryShoppingToContract.json', {
						memberBcode:this.userInfoCode,
						shoppingGoodsIdStr:JSON.stringify(shoppingGoodsList)
					}).then(res=>{
						 let orderDomainStr = [
						        {
						          contractType: "39",
						          contractProperty: "0",
						          contractTypepro: "0",
						          contractBlance: "0",
						          contractPmode: "3",
						          contractPumode: "4",
						          channelCode: this.channelCode,
						          packageList: [
						            {
						              contractGoodsList: this.items,
						              shoppingGoodsIdList: shoppingGoodsList,
						            },
						          ],
						          contractInmoney: res[0].goodsMoney,
						          contractMoney: Number(res[0].goodsMoney)*Number(this.userinfoOcode),
						          goodsPmbillno: res[0].goodsPmbillno,
						          // contractRemark: "cccccc",
						        },
							];
						let params = {
							orderDomainStr:JSON.stringify(orderDomainStr),
							memberBcode: this.userInfoCode
						}
						this.$qj.http(this.$qj.domain).get('/web/oc/empcontract/saveContract.json', params).then(res=>{
							if(res.success){
								// this.$qj.http(this.$qj.domain).get('/web/oc/contractEngine/sendContractNext.json', {contractBillcode:res.dataObj.contractBillcode}).then(res1=>{
									$router.replace('salesEnd/pages/quotationList')
								// })
							}else{
								this.$qj.message.alert('报价单推送失败！');
							}
					})
				})
				}
			},
			goToGoodsDetail() {},
			//商品数量减少
			// subtract(item,index) {
			// 	if(item.goodsNum != null && item.goodsNum > item.goodsMinnum){
			// 		item.goodsNum -= 1*item.goodsMinnum
			// 	}
			// },
			// //商品数量减少
			// add(item,index) {
			// 	item.goodsNum += 1*item.goodsMinnum
			// },
			//删除商品数量
			//删除商品数量
			subtract(item, index) {
				let goodsCamount = item.goodsNum;
				let params = {
					shoppingGoodsId: item.shoppingGoodsId,
					amount: goodsCamount,
					goodWeight: 0,
					memberBcode:this.userInfoCode
				};
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
			
						params.amount = goodsCamount;
						this.$qj
							.http(this.$qj.domain)
							.post('/web/oc/empshopping/updateShoppingGoodsNum.json', params)
							.then(res => {
								if (res && res.success) {
									this.commonMounted();
								} else {
									if (res.errorCode == '-1') {
										item.goodsNum = item.goodsSupplynum;
										//购买商品数量不能超过商品库存
									}
								}
							});
					}
				} else {
					if (goodsCamount > 1) {
						goodsCamount--;
						params.amount = goodsCamount;
						this.$qj
							.http(this.$qj.domain)
							.post('/web/oc/empshopping/updateShoppingGoodsNum.json', params)
							.then(res => {
								if (res && res.success) {
									this.commonMounted();
								} else {
									if (res.errorCode == '-1') {
										item.goodsNum = item.goodsSupplynum;
										//购买商品数量不能超过商品库存
									}
								}
							});
					}
				}
			},
			add(item, index) {
				let goodsCamount = item.goodsNum;
				let params = {
					shoppingGoodsId: item.shoppingGoodsId,
					amount: goodsCamount,
					goodWeight: 0,
					memberBcode:this.userInfoCode,
				};
				// goodsTopnum
				console.log(item);
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

					params.amount = goodsCamount;
				} else {
					if (goodsCamount < 1000) {
						goodsCamount++;
						params.amount = goodsCamount;
					}
				}
				// item.goodsNum = goodsCamount;
				this.$qj
					.http(this.$qj.domain)
					.post('/web/oc/empshopping/updateShoppingGoodsNum.json', params)
					.then(res => {
						console.log('购物车加商品--', res)
						if (res && res.success) {
							this.commonMounted();
						} else {
							if (res.errorCode == '-1') {
								this.$qj.message.alert(res.msg);
							}
						}
					});
			},
			//查询权益
			getQY() {
				this.$qj
					.http(this.$qj.domain)
					.get(queryNewUserinfoPageByDealerqt, {
						userinfoPhone: this.userPhone
					})
					.then(res => {
						console.log('权益值', res.rows[0].userinfoOcode)
						this.userinfoOcode = res.rows[0].userinfoOcode
						if (this.userinfoOcode == null || this.userinfoOcode == '') {
							this.userinfoOcode = 1
						}
					})
			},
			// 查询 认证授权 状态
			searchStatus() {
				let that = this
				let paramsStatus = {}
				paramsStatus.userCode = this.userInfoCode
				this.$qj
					.http(this.$qj.domain)
					.get(userapplyStateAndAuth, paramsStatus)
					.then(res => {
						this.channelCode = res.userinfoChannelcode
						if (res.checkModifyAudit == '3') {
							that.checkModifyAudit = "3"
						}
						this.initSearchParams();
						this.commonMounted();
					});
			},

			getNavBarHeight(e) {
				this.offsetTop = e;
			},

			initSearchParams(goodsClassCode) {
				this.params = {
					// sortField: '',
					// order: 'desc',
					page: 1,
					rows: this.rows,
					// goodsClassCode:'2020072100000145',
					// classtreeShopcode:  this.goodsClassCode || goodsClassCode,
					// goodsOrigin:"0",
					// // goodsClassCode:this.classtreeCode || classtreeCode,
					// goodsType: "00",
					// searchParam: this.searchParam,
					// // classtreeCode:"2020072100000130",
					channelCode: "1526",
					// searchParam: this.searchParam || this.$qj.storage.get('searchParam')
				}
				if (this.userinfoType == '2') {
					this.params.channelCode = 'tempChannelCode'
					this.params.temp = this.channelCode
					// this.params.temp = 'SHA/SBB0/SB1S1'
					// this.params.temp = 'SHA/SBB0/SB1S'  //上海
					this.params.goodsOrigin = "13"
				}

				// if (this.classtreeCode || classtreeCode) {
				// 	delete this.params.searchParam;
				// 	this.params.classtreeCode = this.classtreeCode || classtreeCode;
				// }
			},

			commonMounted() {
				this.$qj.http(this.$qj.domain).get('/web/oc/empshopping/queryShoppingPage.json', {
					memberBcode:this.userInfoCode,
					shoppingType: 5
				}).then(res => {
					let batchCollectData = [];
					// 获取用户维度起订量倍数
					let skuMinSaleMultiple = [];
					this.items = []
					this.getGoodsDetial(res.list[0].shoppingpackageList[0].shoppingGoodsList[0].skuCode)
					res.list.forEach(item=>{
						item.shoppingpackageList.forEach(item1=>{
							item1.shoppingGoodsList.forEach(v=>{
								if (!RegExp(/http/).test(v.dataPic)) {
									v.dataPic = this.$domain + v.dataPic;
								}
								if (this.userinfoType == "2" && this.checkModifyAudit == "3") {
									// 获取权益价格
									v.pricesetMakeprice = Number(v.pricesetNprice) * this.userinfoOcode
									console.log("获取权益的价格-------", v.pricesetMakeprice)
								}
													
								v.itemChecked = false;
								v.itemCheckedDelete = false;
								v.goodsNum = v.goodsCamount
								batchCollectData.push({
									collectType: '0',
									collectOpcode: v.skuCode
								});
								skuMinSaleMultiple.push({
									skuNo: v.skuNo,
									goodsNo: v.goodsNo
								});
								this.items.push(v)
							})
						})
					})
					
					this.total = res.total;			
				})
			},

			/**
			 *
			 */
			listCheckBox(item,index){
				item.itemChecked = !item.itemChecked
				setTimeout(()=>{
					// if(item.itemChecked){
						item.itemCheckedDelete = !item.itemCheckedDelete
				// 	}else{
				// 		this.textShow = false
				// }
				},50)
			},
			screenLeftClick() {
				this.screenShow = false;
				if (this.maxPrice == null && this.minPrice == null && this.colorCurrent == null) {
					this.current = -1;
				}
			},
			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},

		}
	}
</script>

<style lang="less" scoped>
	// @import '../../libs/css/common.less';
	@import '@/common/css/common.less';
	.buttonClass {
		height: 45rpx;
		width: 70px;
		line-height: 45rpx;
		background-color: #fff;
		font-size: 12px;
		font-weight: 500;
		border: 1px solid #555555;
	}
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
	.memberTit {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 68rpx;
		font-size: 28rpx;
		font-weight: bold;
		padding-left: 20rpx;
		color: @color-333;
		border-bottom: 1px #fafafa solid;
		i {
			padding-right: 15rpx;
		}
	}
.itemGoods{
	margin-bottom:110rpx ;
	padding: 20rpx;
	background-color: #fafafa;
	ul{
		background-color: #fff;
	}
	.item-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 22rpx 22rpx 10rpx;
		border-bottom: 1rpx solid #f6f6f8;

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
			width: 60%;
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
	.goodsList {
		width: 100%;
		background: #fafafa;

		&-save {
			position: fixed;
			z-index: 9999;
			height: 90rpx;
			width: 70rpx;
			line-height: 90rpx;
			text-align: right;
			right: 30rpx;
			top: 0;
			font-size: @big-title;
		}

		&-left {
			position: fixed;
			z-index: 9999;
			height: 90rpx;
			width: 70rpx;
			line-height: 90rpx;
			text-align: left;
			left: 30rpx;
			top: 0;
		}

		&-title {
			display: flex;
			position: fixed;
			top: 90rpx;
			left: 0;
			padding: @padding;
			z-index: 2;
			width: 710rpx;
			background: #ffffff;
			padding: @padding;
			border-bottom: 1rpx solid #eee;

			&-left {
				flex: 1;
				-webkit-box-flex: 1;
				height: 100%;
				line-height: 58rpx;

				ul {
					display: -moz-box;
					display: -webkit-box;
					display: box;

					li {
						-webkit-box-flex: 1;
						box-flex: 1;
						width: 0;
						height: 100%;
						position: relative;

						.container {
							width: 100%;
							height: 100%;
							display: flex;
							position: relative;
							align-items: center;
							font-size: @big-title;
							justify-content: center;
							z-index: 99999;

							.iconPosition {
								display: flex;
								flex-direction: column;
								position: absolute;
								top: -8rpx;
								right: 28rpx;

								i {
									font-size: 14rpx;
									margin-bottom: -40rpx;
								}
							}

							i {
								font-size: @big-title;
								margin-left: 4rpx;
								color: #434343;
								z-index: 9999;
							}
						}
					}
				}
			}

			// &-right{
			//   height: 58rpx;
			//   display:flex;
			//   align-items:center;
			//   span{
			//     &:first-child{
			//       margin-right:@margin-right;
			//     }
			//   }
			// }
		}

		&-list {
			width: 100%;
			margin-top: 100rpx;

			ul {
				width: 100%;
				overflow: hidden;
				zoom: 1;

				li {
					width: 100%;
					float: left;
					border-right: 2rpx solid #f5f5f5;
					border-bottom: 2rpx solid #f5f5f5;

					&:nth-child(2n) {
						border-right: 0;
					}

					div {
						// width: 100%;
						height: 100%;
						font-size: @middle-title;
						text-align: center;

						.checked {
							display: flex;
							justify-content: flex-start;
							padding-left: 20rpx;
							align-items: center;
						}

						img {
							width: 374.5rpx;
							height: 374.5rpx;
						}

						.list-box {
							padding: 0 30rpx;
							height: 67px;

							h3 {
								font-size: 32rpx;
								padding: 16rpx 0;
							}

							p {
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								overflow: hidden;
								text-overflow: ellipsis;
								margin: 26rpx;
								// height: 70rpx;
								line-height: 35rpx;
							}

							.noPrice {
								color: #8a8989;
								padding: 0;
								margin: 0;
							}

							.purchasePrice {
								padding: 0 4px;
							}
						}

						.icon-container {
							display: flex;
							align-items: center;
							justify-content: flex-end;
							padding-right: 20rpx;

							.iconfont {
								padding: 15rpx;

								&.cart {
									font-size: 36rpx;
								}
							}
						}
					}
				}
			}
		}

		&-screenLeft {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			left: 0;
			background-color: rgba(0, 0, 0, 0.3);
			z-index: 9999;
		}

		&-screen {
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			left: 20%;
			z-index: 10000;

			&-screens {
				position: fixed;
				right: 0;
				left: 20%;
				height: 100%;
				background-color: #fff;

				.contents {
					overflow: scroll;
					height: 100%;

					.box {
						display: -webkit-box;
						display: -ms-flexbox;
						display: flex;
						display: -webkit-flex;
						-ms-flex-wrap: wrap;
						flex-wrap: wrap;

						// padding-bottom: 200rpx;
						.pinpai {
							margin-left: 30rpx;
							width: 100%;
						}

						.leftBox {
							margin: 20rpx 0 0 2.5%;
							width: 30%;
							height: 60rpx;
							line-height: 60rpx;
							text-align: center;
							background-color: #f5f5f5;
							border-radius: 4rpx;

							p {
								font-size: @middle-title;
								text-align: center;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}

						.price-box {
							padding: 50rpx 30rpx 34rpx;

							p {
								font-size: @big-title;
								color: @color-333;
								margin-bottom: 28rpx;
							}

							.t-bob {
								display: flex;
								justify-content: flex-start;
								align-items: center;

								input {
									width: 200rpx;
									height: 60rpx;
									background-color: #f5f5f5;
									font-family: PingFangSC-Regular;
									font-size: @middle-title;
									text-align: center;
									border-radius: 50rpx;
								}
							}
						}
					}

					.bottomBox {
						background-color: #fff;
						position: fixed;
						width: 80%;
						-webkit-box-sizing: border-box;
						box-sizing: border-box;
						bottom: 0;
						right: 0;
						height: 10.667vw;
						line-height: 10.667vw;
						text-align: center;
						display: -moz-box;
						display: -webkit-box;
						display: box;

						p {
							-webkit-box-flex: 1;
							box-flex: 1;
							width: 0;
							color: #fff;
							font-size: 28rpx;
							background-color: #333;

							&:first-child {
								// background: #b79f77;
							}
						}
					}
				}
			}
		}

		&-nulls {
			width: 100%;
			margin-top: 400rpx;
			text-align: center;

			img {
				width: 402rpx;
				height: 337rpx;
				margin: 0 auto;
			}
		}

		.batch-container {
			position: fixed;
			bottom: 0;
			z-index: 9999;
			background: @white-color;
			width: 100%;
			height: 90rpx;
			display: flex;
			align-items: center;
			padding-left: 33rpx;

			.iconfont {
				text {
					padding-left: 10rpx;
					color: @color-333;
					font-size: 24rpx;
				}
			}

			.batch-btn {
				margin-left: 20rpx;
				border-width: 2rpx;
				border-radius: 4rpx;
				border-style: solid;
				width: 145rpx;
				height: 51rpx;
				text-align: center;
				line-height: 51rpx;
				font-size: 24rpx;

				&.batch-add-collect {
					background: @white-color;
				}

				&.batch-add-cart {
					color: @white-color;
				}
			}
		}
	}
</style>
