<template>
	<div class="shopcart">
		<template v-if="listItems.length > 0">
			<div class="shopcart-save" @click="edited" v-if="delStatus">编辑</div>
			<div class="shopcart-save" @click="finished" v-else>完成</div>
		</template>
		<view v-if="listItems.length > 0 && shopSetInfo" class="special-remind" @click="specialRemind">
			<text v-bind:style="{ color: baseColor }">{{ shopSetInfo }}</text>
			<view class="iconfont icon-xiangyou" v-bind:style="{ color: baseColor }"></view>
		</view>
		<ul v-if="listItems.length > 0">
			<li v-for="(listItem, listIndex) in listItems" :key="listIndex">
				<div v-for="(list, liIndex) in listItem.shoppingpackageList" :key="liIndex">
					<div class="memberTit" @click="titCheckBox(list, liIndex)"  v-if = 'list.shoppingGoodsList.length>0'>
						<i class="iconfont" v-if="list.titChecked == 0" :style="{ color: baseColor }">&#xe671;</i>
						<i class="iconfont" v-else :style="{ color: '#ededed' }">&#xe671;</i>
						{{ list.memberCname }}  <span v-if='list.goodsClass==1 && list.disNextMsg == null'>-设备零件</span>
					<!-- 	<span v-if='list.goodsClass==1 && list.pbCode == "0009" '>包邮商品</span>
						<span v-if='list.goodsClass==1 && list.pbCode == "0022" '>特价商品</span> -->
						<span v-if='list.goodsClass=="2"'> -印刷耗品</span> 
						<span v-if='list.goodsClass=="3"'>-其他</span>
					</div>

					<div class="list_li">
						<div class="list_pm list_p">
							<div v-show="list.promotionCode">
								<div class="tit">
									<p :style="{ background: baseColor }" :key="pbIndex">{{ list.pbName }}</p>
									<span class="f-s22">
										<!-- {{ list.promotionName ? list.promotionName : '' }}{{ list.disMsg ? list.disMsg : '' }}{{ list.disNextMsg ? list.disNextMsg : '' }} -->
										{{ list.promotionName ? list.promotionName : '' }}
									</span>
								</div>
							</div>
							<div class="itemGoods" v-for="(item, index) in list.shoppingGoodsList" :key="index">
								<div class="item-container">
									<div class="list-l" @click.stop="listCheckBox(item)">
										<i class="iconfont" :style="{ color: baseColor }" v-if="item.shoppingGoodsCheck == 0">&#xe671;</i>
										<i class="iconfont" :style="{ color: '#ededed' }" v-else>&#xe671;</i>
									</div>
									<div class="list-img" @click.stop="goToGoodsDetail(item)">
										<img :src="item.dataPic || userImgurl" />
										<span v-if="item.dataState == 2">已下架</span>
										<span v-if="item.dataState == 3">已失效</span>
										<span v-if="item.dataState == 1">库存不足</span>
									</div>
									<div class="list-r" :style="{ color: item.dataState !== 0 ? '#ccc' : '' }">
										<p @click.stop="goToGoodsDetail(item)">{{ item.goodsName }}</p>
										<h3 :style="{ color: item.dataState !== 0 ? '#ccc' : '' }" @click.stop="goToGoodsDetail(item)">
											{{ item.skuNo }}
										</h3>
										<div class="list-count">
											<div :style="{ color: item.dataState !== 0 ? '#ccc' : '#d66377' }">
												<span style='color: #000000;margin-right: 10rpx;'>{{ unitPrice.obpay }}{{ item.pricesetNprice }}{{ unitPrice.mapay }}</span>
												<span style='margin-left: 5px;'
													v-if='list.goodsClass =="1" && userinfoType == "2" && checkModifyAudit == "3" && item.pbCode != "0022"'>采购价：{{ unitPrice.obpay }}{{ item.pricesetNprice1 }}{{ unitPrice.mapay }}</span>
											</div>
											<view class="list-right-container">
												<!-- <view
													class="collect iconfont"
													:class="{ 'icon-xihuan-xianxing': !item.isCollect, 'icon-xihuan': item.isCollect }"
													v-bind:style="{ color: baseColor }"
													@click="goodsItemCollect(item)"
												></view> -->
												<div class="list-add">
													<div @click.stop="subtract(item, index)">
														<i
															class="iconfont"
															:style="{ color: item.goodsCamount && item.goodsCamount > 0 && item.goodsCamount <= item.goodsMinnum ? '#ccc' : '' }"
														>
															&#xe755;
														</i>
													</div>
													<div><input type="text" v-model="item.goodsCamount" disabled /></div>
													<div @click.stop="add(item, index)"><i class="iconfont">&#xe756;</i></div>
												</div>
											</view>
										</div>
									</div>
								</div>
								<!-- <div v-show="list.promotionCode && item.pmPromotionList && item.pmPromotionList.length > 0">
									<div class="updatePm">
										<p>
											<i>促销</i>
											{{ list.promotionName }}
										</p>
										<span @click="updateAction(index, item, list.promotionName)">修改</span>
									</div>
								</div> -->
							</div>
						</div>
					</div>
				</div>
			</li>
		</ul>
		<div class="shopcart-nulls" v-else><img :src="nullImg" /></div>
		<view class="min-sale-num" v-if="listItems.length > 0 && shopSaleMinNum" v-bind:style="{ backgroundColor: baseColor }">{{ shopSaleMinNum }}</view>
		<div v-if="listItems.length > 0">
			<div class="shopcart-count">
				<div @click="countCheckBox">
					<i class="iconfont" :style="{ color: baseColor }" v-if="countChecked">&#xe671;</i>
					<i class="iconfont" :style="{ color: '#ededed' }" v-else>&#xe671;</i>
					全选
				</div>
				<div v-if="delStatus" class="addCount">
					<view class="total-price-and-weight">
						<view class="total-price">
							总计：
							<i :style="{ color: baseColor }" v-if="totalPointPrice > 0">{{ unitPrice.obpay }}{{ totalPrice.toFixed(2)==undefined?totalPrice:totalPrice.toFixed(2) }}{{ unitPrice.mapay }}</i>
							<!-- <i :style="{ color: baseColor }" v-if="totalPrice && totalPointPrice">+</i>
							<i :style="{ color: baseColor }" v-if="totalPrice > 0">{{ unitPrice.obpay }}{{ totalPrice }}{{ unitPrice.mapay }}</i>
							<i :style="{ color: baseColor }" v-if="totalPrice == 0 && totalPointPrice == 0">{{ unitPrice.obpay }}0.00{{ unitPrice.mapay }}</i> -->
						</view>
						<view class="total-weight" v-if="totalGoodsWeight && totalGoodsWeight > 0">
							总重：
							<text>{{ totalGoodsWeight }}{{ weightUnit }}</text>
						</view>
					</view>

					<div class="buy-btn" :style="{ background: baseColor }" @click="getTotalPrice">去结算</div>
				</div>
				<div class="del" v-else :style="{ color: baseColor, borderColor: baseColor }" @click="delCartShopping">删除</div>
			</div>
		</div>
		<div
			class="shopcart-screenLeft"
			v-show="isShow"
			@click="
				() => {
					isShow = false;
				}
			"
		></div>
		<div class="shopcart-preferential" v-show="isShow">
			<div class="shopcart-preferential-con">
				<p
					@click="
						() => {
							isShow = false;
						}
					"
				>
					修改促销
					<i class="iconfont">&#xe609;</i>
				</p>
				<ol>
					<li v-for="(op, opIndex) in options" :key="opIndex">
						<h3>
							{{ op.promotionName }}
							<i class="iconfont" @click="checkPmPromotion(op)" :style="{ color: optionsIndex === opIndex ? baseColor : '#c6c6c6' }">
								{{ optionsIndex === opIndex ? '&#xe671;' : '&#xe672;' }}
							</i>
						</h3>
					</li>
				</ol>
				<div
					class="pre-btn"
					:style="{ background: baseColor }"
					@click="
						() => {
							isShow = false;
						}
					"
				>
					确认
				</div>
			</div>
		</div>
		<u-popup class="quota-popup" v-model="quotaPopup" mode="center" length="90%" border-radius="20" :closeable="true">
			<view class="popup-container">
				<view class="quota-title">商品限额信息</view>
				<view class="quota-info-list">
					<view class="quota-item" v-for="(item, index) in quotaList" :key="index">
						<text class="goods-name">{{ item.salequotaSproname }}</text>
						<text class="quota-info">
							限额
							<text v-bind:style="{ color: baseColor }">{{ item.salequotaNuma }}</text>
							已用
							<text v-bind:style="{ color: baseColor }">{{ item.salequotaNumu }}</text>
							剩余
							<text v-bind:style="{ color: baseColor }">{{ item.salequotaNums }}</text>
						</text>
					</view>
				</view>
			</view>
		</u-popup>
			<qj-mini-bottom-nav-bar :selectNavIndex="navIndex" :footerMenu="footerMenu"></qj-mini-bottom-nav-bar>
	</div>

</template>

<script>
import {
	getTopPerMenuList,
	queryShoppingPage,
	updateShoppingGoodsCheckState,
	updateShoppingGoodsNum,
	deleteShoppingGoodsBatch,
	updateShoppingGoodsPmInfo,
	checkBatchCollectExit,
	saveCollect,
	collection,
	checkStSaleminnum,
	queryShopsetByTypemap,
	checkStSalequota,
	checkSkuOne
} from '@/node_modules/qj-mini-pages/libs/api/interface.js';
import {
		userapplyStateAndAuth
	} from '@/api/interface.js';
	import {
		queryShoppingPageNew,
		queryNewUserinfoPageByDealerqt
	} from '@/api/interfaceHDB.js';
import {
	$storage,
	$message,
	$router
} from '@/utils/prototype/vue.js'
export default {
	data() {
		return {
			title: '购物车',
			leftIcon: false,
			rightIcon: false,
			titChecked: false,
			countChecked: false,
			isShow: false,
			titCheckIndex: 0,
			listItems: [],
			userImgurl: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
			nullImg: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noCar.png',
			baseColor: '',
			delStatus: true, // 是编辑还是完成
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
			userinfoOcode: "", //权益值
			userinfoType: "", //用户类型
			userPhone: "", //手机号
			checkModifyAudit: "",
			userInfoCode: "",
			dataLength: "",
			navIndex: 2,
			footerMenu: [],
		};
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$qj.state.unitPrice || this.$qj.storage.get('unitPrice');
		}
	},
	onLoad(){
		this.footerMenu = this.$qj.storage.get('footerMenu');
		this.userinfoType = $storage.get('loginInfor').userinfoType;
		this.userInfoCode = $storage.get('loginInfor').userInfoCode;
		this.userPhone = $storage.get('loginInfor').userPhone;
		this.getQY();
		// this.dataLength = this.sanci.length - 1
		this.searchStatus()
		// this.commonMounted();
	},
	mounted() {
		this.baseColor = `#${this.$qj.storage.get('baseColor')}`;
		this.delStatus = true;
		
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
					this.commonMounted(true, true);
					console.log("认证授权状态，", res)
					if (res.checkModifyAudit == '3') {
						that.checkModifyAudit = "3"
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
					this.userinfoOcode = res.rows[0].userinfoOcode
					if (this.userinfoOcode == null || this.userinfoOcode == '') {
						this.userinfoOcode = 1;
					}
				})
		},
		queryShopSet() {
			this.$qj
				.http(this.$qj.domain)
				.get(queryShopsetByTypemap, {
					shopsetType: '1'
				})
				.then(res => {
					console.log(res);
					if (res.length > 0) {
						this.shopSetInfo = res[0].shopsetInfo;
					}
				});
		},

		commonMounted(isCheckCollect = false, isCheckSkuMultiple = false) {
			let that = this;
			let a = {
				shoppingType : '00',
				memberBcode:$storage.get('loginInfor').userInfoCode
			}
			this.$qj
				.http(this.$qj.domain)
				.get(queryShoppingPageNew,a)
				.then(res => {
					if (res && res.rows) {
						this.listItems = []
						let shopCartData = res.rows;
						let shopCartObj = [];
						shopCartObj = JSON.parse(JSON.stringify(shopCartData));
						shopCartObj[0].shoppingpackageList = [];
						console.log('[[[[[[]]]]]]',shopCartData)
						shopCartData.map(v => {
							if (v.shoppingpackageList) {
								v.shoppingpackageList.map((val,i) => {
									if (val.pbCode && val.promotionCode) {
										val.goodsClass = 1;
										if(val.shoppingGoodsList.length>0){
											val.shoppingGoodsList.forEach( s =>{
												s.pbCode = val.pbCode
											})
										}
										shopCartObj[0].shoppingpackageList.push(val);
									}else {
										if (val.areaCode) {
											let packageObj = JSON.parse(JSON.stringify(val));
											packageObj.shoppingGoodsList = JSON.parse(val.areaCode);
											packageObj.goodsClass = 1;
											shopCartObj[0].shoppingpackageList.push(packageObj);
										}
										if (val.areaName) {
											let packageObj = JSON.parse(JSON.stringify(val));
											packageObj.shoppingGoodsList = JSON.parse(val.areaName);
											packageObj.goodsClass = 2;
											shopCartObj[0].shoppingpackageList.push(packageObj);
										}
										if (val.warehouseName) {
											let packageObj = JSON.parse(JSON.stringify(val));
											packageObj.shoppingGoodsList = JSON.parse(val.warehouseName);
											packageObj.goodsClass = 3;
											shopCartObj[0].shoppingpackageList.push(packageObj);
										}
									}
								});
							}
						});
						console.log('组装好的购物车----',shopCartObj)
						shopCartData = shopCartObj;
						
						shopCartData.map(v => {
							if (v.shoppingpackageList) {
								v.shoppingpackageList.map((val,i) => {
									val.titChecked = 1;
									if (val.shoppingGoodsList.filter(vm => vm.shoppingGoodsCheck === 0).length === val.shoppingGoodsList.length) {
										val.titChecked = 0;
									}
									val.shoppingGoodsList.map(vk => {
											if (val.goodsClass == '1' && this.userinfoType == '2' && that.checkModifyAudit == '3' && vk.pbCode != '0022') {
												vk.pricesetNprice1 = (Number(vk.pricesetNprice) * this.userinfoOcode).toFixed(2)
											}
										vk.dataPic = this.$domain + vk.dataPic;
										if (this.checkSkuMultipleData.length > 0) {
											this.checkSkuMultipleData.forEach(item => {
												if (item.skuNo == vk.skuNo) {
													vk.skuOneNum = item.skuOneNum;
												}
											});
										}
										if (this.batchCollectData.length > 0) {
											this.batchCollectData.forEach(item => {
												if (item.collectOpcode == vk.skuCode) {
													vk.collectObj = item;
													vk.isCollect = true;
												}
											});
										}
									});
								});
							}
						});
						shopCartData.map(v => {
							if (v.shoppingpackageList) {
								v.rowsCheck = 1;
								if (v.shoppingpackageList.filter(vm => vm.titChecked === 0).length === v.shoppingpackageList.length) {
									v.rowsCheck = 0;
								}
							}
						});
						if (shopCartData.filter(val => val.rowsCheck === 0).length === shopCartData.length) {
							this.countChecked = true;
						} else {
							this.countChecked = false;
						}
						this.listItems = shopCartData;
						console.log('噢噢噢噢哦哦哦哦哦哦====',this.listItems)
						let totalPrice = 0;
						let totalPointPrice = 0;
						 this.totalPointPrice = 0;
						let productPresentPriceAll = 0;
						//计算总价
						// this.listItems.forEach(item=>{
							this.listItems[0].shoppingpackageList.forEach(val=>{
								if(val.shoppingGoodsList.length>0){
									val.shoppingGoodsList.forEach(v=>{
										if(v.shoppingGoodsCheck == 0){
											if(v.pricesetNprice1 != undefined){
											this.totalPointPrice += Number(v.pricesetNprice1) * v.goodsCamount
										}else{
											this.totalPointPrice += Number(v.pricesetNprice) * v.goodsCamount
											console.log('00000-----',this.totalPointPrice)
										}
									}
									})
								}
								
							})
								
						// })
						this.totalPrice = this.totalPointPrice
						console.log('this.totalPrice===',this.totalPrice)
						this.$forceUpdate();
						// 商品选择操作数组
						this.shopIdAttr = [];
						// 批量check商品收藏状态操作数组
						let batchCheckCollectArr = [];
						// check起送量操作数组
						let checkStSaleminnumObj = {
							packageList: []
						};
						// check商品起订量倍数
						let checkSkuMultipleArr = [];
						this.listItems.map(v => {
							if (v.shoppingpackageList) {
								v.shoppingpackageList.map((val, index) => {
									checkStSaleminnumObj.packageList[index] = {
										contractGoodsList: []
									};
									productPresentPriceAll += Number(val.disMoney);
									// this.productPresentPriceAll = productPresentPriceAll;
									// totalPointPrice += Number(val.sumMoney);
									// totalPrice += Number(val.pricesetRefrice);
									// this.totalPointPrice = totalPointPrice - productPresentPriceAll;
									// this.totalPrice = totalPrice;
									val.shoppingGoodsList.map(vk => {
										if (vk.shoppingGoodsCheck === 0) {
											checkStSaleminnumObj.packageList[index].contractGoodsList.push(vk);
										}
										this.shopIdAttr.push(vk.shoppingGoodsId);
										if (isCheckCollect) {
											batchCheckCollectArr.push({
												collectType: '0',
												collectOpcode: vk.skuCode
											});
										}
										if (isCheckSkuMultiple) {
											checkSkuMultipleArr.push({
												skuNo: vk.skuNo,
												goodsNo: vk.goodsNo
											});
										}
									});
								});
							}
						});
						this.checkSaleMinNum(data => {
							this.shopSaleMinNum = data;
						}, checkStSaleminnumObj);
						this.batchCheckCollect(batchCheckCollectArr);
						this.checkSkuMultiple(checkSkuMultipleArr);
					} else {
						this.listItems = [];
					}
				});
				// this.$forceUpdate(); //在这里，强制刷新之后，页面的结果变为'小红'
		},

		/**
		 * check商品起订量倍数（用户级）
		 */
		checkSkuMultiple(data = []) {
			if (data.length != 0) {
				this.$qj.message.loading();
				this.$qj
					.http(this.$qj.domain)
					.post(checkSkuOne, { rsSkuDomainListJson: JSON.stringify(data) })
					.then(res => {
						console.log(res);
						if (res.success) {
							this.checkSkuMultipleData = res.dataObj;
							this.checkSkuMultipleData.map(item => {
								this.listItems.map(vi => {
									vi.shoppingpackageList.map(vj => {
										vj.shoppingGoodsList.map(vk => {
											if (item.skuNo == vk.skuNo) {
												vk.skuOneNum = item.skuOneNum;
											}
										});
									});
								});
							});
						}
					});
			}
		},

		/**
		 * 批量检查商品收藏状态
		 * 在进行收藏操作之后必须调用
		 */
		batchCheckCollect(data = []) {
			if (data.length != 0) {
				this.$qj.message.loading();
				this.$qj
					.http(this.$qj.domain)
					.post(checkBatchCollectExit, { collectListStr: JSON.stringify(data) })
					.then(res => {
						console.log(res);
						if (res.length > 0) {
							this.batchCollectData = [...this.batchCollectData, ...res];
							res.map(k => {
								this.listItems.map(v => {
									v.shoppingpackageList.map(vi => {
										vi.shoppingGoodsList.map(vk => {
											if (k.collectOpcode == vk.skuCode) {
												vk.collectObj = k;
												vk.isCollect = true;
											}
										});
									});
								});
							});

							this.$forceUpdate();
						}
					});
			}
		},

		titCheckBox(list, liIndex) {
			console.log('ggggg======',list);
			let ids = [];
			list.shoppingGoodsList.map(v => {
				ids.push(v.shoppingGoodsId);
			});
			let params = {
				shoppingCode: list.shoppingCode,
				checkState: list.titChecked === 0 ? 1 : 0,
				shoppingGoodsIdStr: ids.join(','),
				channelCode: 'channelCode'
			};

			this.$qj
				.http(this.$qj.domain)
				.post(updateShoppingGoodsCheckState, params)
				.then(res => {
					if (res && res.success) {
						this.commonMounted();
					}
				});
		},
		listCheckBox(item) {
			let params = {
				shoppingGoodsIdStr: item.shoppingGoodsId,
				shoppingCode: item.shoppingCode,
				checkState: item.shoppingGoodsCheck === 0 ? 1 : 0,
				channelCode: 'channelCode'
			};
			this.$qj
				.http(this.$qj.domain)
				.post(updateShoppingGoodsCheckState, params)
				.then(res => {
					if (res && res.success) {
						this.commonMounted();
					}
				});
		},
		countCheckBox() {
			let params = {
				shoppingGoodsIdStr: this.shopIdAttr.join(','),
				channelCode: 'channelCode'
			};
			if (this.countChecked) {
				this.countChecked = false;
				params.checkState = 1;
			} else {
				this.countChecked = true;
				params.checkState = 0;
			}
			this.$qj
				.http(this.$qj.domain)
				.post(updateShoppingGoodsCheckState, params)
				.then(res => {
					if (res && res.success) {
						this.commonMounted();
					}
				});
		},
		subtract(item, index) {
			console.log(item.skuOneNum);
			let goodsCamount = item.goodsCamount;
			let params = {
				shoppingGoodsId: item.shoppingGoodsId,
				amount: goodsCamount,
				goodWeight: 0
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
						.post(updateShoppingGoodsNum, params)
						.then(res => {
							if (res && res.success) {
								this.commonMounted();
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
					params.amount = goodsCamount;
					this.$qj
						.http(this.$qj.domain)
						.post(updateShoppingGoodsNum, params)
						.then(res => {
							if (res && res.success) {
								this.commonMounted();
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
		add(item, index) {
			console.log(item.skuOneNum);
			let goodsCamount = item.goodsCamount;
			let params = {
				shoppingGoodsId: item.shoppingGoodsId,
				amount: goodsCamount,
				goodWeight: 0
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

			this.$qj
				.http(this.$qj.domain)
				.post(updateShoppingGoodsNum, params)
				.then(res => {
					if (res && res.success) {
						this.commonMounted();
					} else {
						if (res.errorCode == '-1') {
							this.$qj.message.alert(res.msg);
						}
					}
				});
		},
		goToGoodsDetail(item) {
			// this.$qj.router.push('web', {
			// 	defaultUrl: `${this.$qj.businessDomain}/paas/shop/${this.$qj.storage.get('hrefs')}${item.skuCode}.html`
			// });
			this.$emit('toGoodDetail', {skuCode: item.skuCode})
		},
		delCartShopping() {
			
			let attr = [];
			this.listItems.map((v, k) => {
				if (v.shoppingpackageList) {
					v.shoppingpackageList.map((val, index) => {
						val.shoppingGoodsList.map((vk, vt) => {
							if (vk.shoppingGoodsCheck === 0) {
								attr.push(vk.shoppingGoodsId);
							}
						});
					});
				}
			});
			if (attr.length === 0) {
				this.$qj.message.alert('你还未选择删除的商品');
			} else {
				let shoppingGoodsIdStr = JSON.stringify(attr);
				let params = {
					shoppingGoodsIdStr: shoppingGoodsIdStr
				};
				this.$qj
					.http(this.$qj.domain)
					.post(deleteShoppingGoodsBatch, params)
					.then(res => {
						if (res && res.success) {
							this.commonMounted();
							// this.$qj
							// 	.http(this.$qj.domain)
							// 	.post(updateShoppingGoodsCheckState, { checkState: 1 })
							// 	.then(res => {
							// 		if (res && res.success) {
							// 			this.commonMounted();
							// 		}
							// 	});
						}
					});
			}
		},
		async getTotalPrice() {
			let shoppingGoodsIdStr = [];
			let rsSkuListStr = [];
			let orderDomainStr = [...this.listItems];
			let shoppingType = [];
			let type= []
			let checkStSaleminnumObj = {
				packageList: []
			};
			this.listItems.map((v, k) => {
				if (v.shoppingpackageList) {
					v.shoppingpackageList.map((val, index) => {
						checkStSaleminnumObj.packageList[index] = {
							contractGoodsList: []
						};
						val.shoppingGoodsList.map(vk => {
							if (vk.shoppingGoodsCheck === 0) {
								checkStSaleminnumObj.packageList[index].contractGoodsList.push(vk);
								shoppingGoodsIdStr.push(vk.shoppingGoodsId);
								type.push(val.goodsClass)
								let params = {
									skuCode: vk.skuCode,
									pricesetAsprice: vk.pricesetAsprice,
									pricesetRefrice: vk.pricesetRefrice,
									pricesetNprice: vk.pricesetNprice,
									goodsNum: vk.goodsCamount
								};
								rsSkuListStr.push(params);
								shoppingType.push({
									shoppingType: this.listItems[k].shoppingType
								});
							}
						});
					});
				}
			});
			let a = []
			for (var i = 0; i < type.length; i++) {
				if (a.indexOf(type[i]) === -1) {
					a.push(type[i])
				}
			}
			console.log('aaaa==',a)
			if (a.length != 1) {
			
				this.$qj.message.alert('不能同时结算不同类型的订单');
				return;
			}
			if (shoppingGoodsIdStr.length == 0) {
				this.$qj.message.alert('您还未选择要结算的商品');
				return;
			}
			// 限额检查
			let checkSaleQuotaRes = await this.requestCheckSaleQuota(checkStSaleminnumObj);
			if (checkSaleQuotaRes.errorCode == 2) {
				if (checkSaleQuotaRes.dataObj.length > 0) {
					this.quotaList = checkSaleQuotaRes.dataObj;
					this.quotaPopup = true;
					return;
				}
			}
			this.checkSaleMinNum(data => {
				// 达到起送量
				this.shopSaleMinNum = data;
				this.$state.set('shoppingType', shoppingType);
				this.$state.set('shoppingGoodsIdStr', shoppingGoodsIdStr);
				this.$state.set('rsSkuListStr', rsSkuListStr);
				// this.$qj.state.set('shoppingType', shoppingType);
				// this.$qj.state.set('shoppingGoodsIdStr', shoppingGoodsIdStr);
				// this.$qj.state.set('rsSkuListStr', rsSkuListStr);
				// this.$qj.router.push('order/accounts');
				let b = a.toString()
				console.log('b------------', b)
				this.$qj.router.push('order/shopCar', b);
			}, checkStSaleminnumObj);
		},

		requestCheckSaleQuota(data) {
			return this.$qj.http(this.$qj.domain).post(checkStSalequota, { ocContractDomainJson: JSON.stringify(data) });
		},

		/**
		 * 检查起送量
		 * @param {Object} data
		 */
		checkSaleMinNum(callback, data) {
			// 检测是否达到起送量
			let saleMinNumType = ['kg', '元'];
			this.$qj
				.http(this.$qj.domain)
				.post(checkStSaleminnum, {
					ocContractDomainJson: JSON.stringify(data)
				})
				.then(res => {
					console.log(res);

					if (res.success) {
						if (res.errorCode == 2) {
							// 未达起送量
							this.shopSaleMinNum = `未达到${res.dataObj.saleminnumNum}起送量`;
							// this.$qj.message.alert(`起送量要求达到${res.dataObj.saleminnumNum}${saleMinNumType[Number(res.dataObj.saleminnumNumtype)]}`);
						} else {
							console.log('111');
							if (res.dataObj != null) {
								callback(`已达到${res.dataObj.saleminnumNum}起送量`);
							} else {
								callback('');
							}
						}
					} else {
						this.$qj.message.alert(res.msg);
					}
				});
		},

		edited() {
			this.delStatus = false;
		},
		finished() {
			this.delStatus = true;
		},
		updateAction(itemIndex, itemGood, promotionName) {
			this.options = [];
			this.isShow = true;
			this.options = itemGood.pmPromotionList; //当前商品的所有营销活动
			this.promotionName = promotionName;
			this.pmPromotionList = itemGood.pmPromotionList; //当前商品的所有营销活动
			this.shoppingGoodsId = itemGood.shoppingGoodsId; //当前的商品id
			this.optionsIndex = this.options.findIndex(op => op.promotionName == this.promotionName);
			// this.options.map(v => {
			//   v.value = v.promotionName;
			//   v.label = v.promotionName;
			// });

			//console.log( itemGood.pmPromotionList);
		},
		checkPmPromotion(op) {
			this.promotionName = op.promotionName; //当前选中的营销活动

			this.$qj
				.http(this.$qj.domain)
				.post(updateShoppingGoodsPmInfo, {
					shoppingGoodsId: this.shoppingGoodsId,
					promotionCode: op.promotionCode
				})
				.then(res => {
					this.isShow = false;
					this.commonMounted();
				});
		},

		specialRemind() {
			uni.showModal({
				showCancel: false,
				title: '提示',
				content: this.shopSetInfo,
				confirmText: '确定',
				confirmColor: this.baseColor
			});
		},

		goodsItemCollect(item) {
			console.log(item);
			if (!item.isCollect) {
				this.$qj
					.http(this.$qj.domain)
					.get(saveCollect, {
						collectType: '0',
						collectOpcode: item.skuCode,
						// 图片
						collectOppic: item.dataPic,
						// 内容
						collectOpcont: item.goodsName,
						collectOpmark: item.goodsProperty,
						// 数量
						collectOpnum: item.goodsMinnum != 0 ? item.goodsMinnum : 1,
						// 价格
						collectNum1:  item.pricesetNprice,
						goodsOrigin: item.goodsOrigin,
						// 商品的url
						collectOpurl: '/paas/shop/' + this.$qj.storage.get('hrefs') + item.skuCode + '.html'
					})
					.then(res => {
						console.log(res);
						if (res.success && res.dataObj) {
							this.batchCheckCollect([
								{
									collectType: '0',
									collectOpcode: item.skuCode
								}
							]);
							this.$qj.message.alert('收藏成功');
						} else {
							this.$qj.message.alert(res.msg);
						}
					});
			} else {
				if (item.collectObj) {
					this.$qj
						.http(this.$qj.domain)
						.get(collection.deleteCollectByCode, {
							collectCode: item.collectObj.collectCode,
							collectType: '0'
						})
						.then(res => {
							console.log(res);
							if (res.success) {
								item.isCollect = false;
								this.$forceUpdate();
								let len = this.batchCollectData.length;
								while (len--) {
									console.log(len, this.batchCollectData[len]);
									if (this.batchCollectData[len].collectOpcode == item.skuCode) {
										this.batchCollectData.splice(len, 1);
									}
								}
								this.$qj.message.alert('取消成功');
							}
						});
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '@/node_modules/qj-mini-pages/libs/css/common.less';
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
		margin-bottom: 256rpx;
		li {
			margin: 90rpx 30rpx 20rpx;
			// background: @white-color;
			// border-radius: 6rpx;
			.memberTit {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				height: 68rpx;
				font-size: 28rpx;
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
