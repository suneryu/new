<!-- 自定义导航栏带搜索框的商品列表页(有批量收藏和批量加入购物车的功能) -->
<template>
	<view class="goodsList" :style="{ height: items.length === 0 ? '100%' : 'auto' }">
		<!-- <qj-mini-search-nav-bar @getNavBarHeight="getNavBarHeight" :searchRouter="searchPath"></qj-mini-search-nav-bar> -->
		<div class="goodsList-title" v-bind:style="{ top: offsetTop + 'px' }">
			<div class="goodsList-title-left">
				<ul>
					<li v-for="(titles, titIndex) in titleList" :key="titIndex" @click="titleClick(titIndex)">
						<div class="container" :style="{ color: current == titIndex ? baseColor : '' }">
							{{ titles }}
							<div v-show="titIndex == 2">
								<div class="iconPosition">
									<i class="iconfont" :style="{ color: iconColor && iconColor != null ? baseColor : '' }">&#xe78f;</i>
									<i class="iconfont" :style="{ color: !iconColor && iconColor != null ? baseColor : '' }">&#xe791;</i>
								</div>
							</div>
							<i class="iconfont" v-show="titIndex == 3" :style="{ color: current == titIndex ? baseColor : '' }">&#xe60b;</i>
						</div>
					</li>
				</ul>
			</div>	
			<view class="address-choose" v-if='showArea'>
				<view class="iconfont icon-shouhuodizhi"></view>
				<view class="container" @click="chooseCity">
					<input type="text" :disabled="true" v-model="city" placeholder="请选择城市" />
					<view class="iconfont icon-jiantou12"></view>
				</view>
			</view>
		</div>
		<u-picker mode="region" v-model="cityPicker" :area-code="['11', '1101', '110101']" @confirm="cityPickerConfirm">
		</u-picker>
		<div class="goodsList-list"  v-if="items.length > 0" :style="{marginTop:showArea?'190rpx':'100rpx'}">
			<ul>
				<li v-for="(item, index) in items" :key="index">
					<div @click="goodsDetail(item.skuCode)">
					<!-- 	<view
							@click.stop="itemCheck(item)"
							class="iconfont checked"
							:class="{ 'icon-weixuanzhongkuang': !item.itemChecked, 'icon-xuanzhongkuang': item.itemChecked }"
							v-bind:style="{ color: baseColor }"
						></view> -->
						<img :src="item.dataPic || userImgurl" />
						<div class="list-box">
							<p>{{ item.goodsName }}</p>
							<span style='display: block'>{{ item.skuNo }}</span>
							<span class="originalPrice1" style='text-decoration: line-through;'>原价：{{ unitPrice.obpay }}{{ item.pricesetMakeprice }}{{ unitPrice.mapay }} </span>
							<span class="purchasePrice" :style="{ color: '#d66377' }"> 促销价：{{ unitPrice.obpay }}{{ item.pricesetNprice }}{{ unitPrice.mapay }}</span>
							</div>
						</div>
						<div style='display: flex;justify-content: space-around;height: 58rpx;width: 100%;overflow: hidden;padding: 10rpx;box-sizing: border-box;'>
							<div style='height:40rpx;width: 60%;display: flex;flex-direction: row;'>
								<div @click.stop="subtract(item, index)" style='margin-right: 10rpx;'>
									<i class="iconfont"
										:style="{ color: item.giftNum > 0 ? '#ccc' : '' }">
										&#xe755;
									</i>
								</div>
								<div style='z-index: 0;height: 40rpx;border: 1rpx solid #B6B8BB;line-height: 40rpx;'><input type="text" v-model="goodsNum<=0?1:goodsNum" @input="countInput($event,index)" /></div>
								<div @click.stop="add(item, index)" style='margin-left: 10rpx;'><i class="iconfont" style='font-size: 18px;'>&#xe756;</i></div>
							</div>
							<div @click.stop="addShoppingGoodsCode(item)" style='margin-right: 30rpx;border-radius: 50%;height: 40rpx;' ><i class="iconfont icon-gouwuche" style='color: #004178;font-size: 18px;'></i></div>
						</div>
						<!-- <view class="icon-container"> -->
							<!-- <view
								@click.stop="itemAddCollect(item)"
								class="iconfont"
								:class="{ 'icon-xihuan-xianxing': !item.itemCollectChecked, 'icon-xihuan': item.itemCollectChecked }"
								v-bind:style="{ color: baseColor }"
							></view> -->
							<!-- <view @click.stop="itemAddCart(item)" v-bind:style="{ color: baseColor }" style="text-align: right;padding-right: 30rpx;">
								<i class="iconfont icon-gouwuche" style='color: #004178;font-size: 18px;'></i>
							</view> -->
						<!-- </view> -->
				</li>
			</ul>
		</div>
		<div class="goodsList-nulls" v-else><img :src="nullImg" /></div>
		<view class="getCoupon-footer" @click="receiveCar" :prop="goodsBeanStr" >
			前往购物车
		</view>
		<!-- <view class="batch-container" v-if="items.length > 0"> -->
					
			<!-- <view @click="allCheck" class="iconfont" :class="{ 'icon-weixuanzhongkuang': !allChecked, 'icon-xuanzhongkuang': allChecked }" v-bind:style="{ color: baseColor }">
				<text>全选</text>
			</view> -->
			<!-- <view @click="addCollect" class="batch-btn batch-add-collect" v-bind:style="{ color: baseColor, borderColor: baseColor }">加入收藏</view> -->
			<!-- <view @click="addCart" class="batch-btn batch-add-cart" v-bind:style="{ borderColor: baseColor, backgroundColor: baseColor }">加入购物车</view> -->
			<!-- <view @click="" class="batch-btn batch-add-cart" v-bind:style="{ borderColor: baseColor, backgroundColor: baseColor }">去购物车</view> -->
		<!-- </view> -->
		<div class="goodsList-screenLeft" v-show="screenShow" @click="screenLeftClick"></div>
		<div class="goodsList-screen" v-show="screenShow">
			<div class="goodsList-screen-screens">
				<view class="placeholder-container" v-bind:style="{ height: offsetTop + 'px' ,paddingTop:'80rpx'}"></view>
				<div class="contents">
					<div class="box" v-bind:style="{ paddingBottom: 90 + offsetTop * 2 + 'rpx' }">
						<div class="pinpai">品牌</div>
						<div class="leftBox" v-for="(list, listIndex) in screenList" :key="listIndex" @click="listClick(list, listIndex)">
							<p :style="{ color: colorCurrent == listIndex ? baseColor : '' }">{{ list.brandName }}</p>
						</div>
						<div class="price-box">
							<p>价格区间</p>
							<div class="t-bob">
								<input type="text" placeholder="最低价" v-model="minPrice" />
								<span>-</span>
								<input type="text" placeholder="最高价" v-model="maxPrice" />
							</div>
						</div>
					</div>
					<div class="bottomBox">
						<p v-bind:style="{ backgroundColor: baseColor }" @click="reverseClick">重置</p>
						<p @click="saveClick">确定</p>
					</div>
				</div>
			</div>
		</div>
		<qj-mini-last-page-line :lastPageLine="lastPageLine"></qj-mini-last-page-line>
	</view>
</template>

<script>
	import {
		search,
		queryBrandPageForC,
		checkBatchCollectExit,
		saveCollect,
		collection,
		addShoppingGoodsBySpec,
		addShoppingGoods,
		saveCollectBatch,
		addBatchShoppingGoodsBySpec,
		addBatchShoppingGoods,
		checkSkuOne,
		userapplyStateAndAuth
	} from '@/api/interface.js';
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	export default {
		props: {
			propSearchParam: {
				type: String,
				default: ''
			},
			propClasstreeCode: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				title: '商品列表',
				showArea:false,
				leftIcon: true,
				rightIcon: false,
				titleList: ['综合', '销量', '价格', '筛选'],
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
				moneys: false,
				lastPageLine: false,
				screenShow: false,
				screenList: [],
				brandCode: '',
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
				userinfoType: '',
				userInfoCode: '',
				checkModifyAudit:'',
				cityPicker:false,
				city:'',
				promotionGoodList:[] , //促销商品
				skuNoList:[],
				skuNoString:'',
				temp:'',
				goodsNum:1
			};
		},
		onShow() {
			this.batchCheckCollect();
			this.batchGetSkuMinSaleMultiple();
		},
		onShow() {
			this.userinfoType = this.$qj.storage.get('loginInfor').userinfoType
			if(this.userinfoType == 2){
				this.showArea = false
			}else{
				this.showArea = true
			}
			// this.commonMounted();
		},

		onLoad(options) {
			console.log('options----',options)
			this.temp = options
			this.getGoodsList()
			// wx.setNavigationBarTitle({
			// 	title: "促销专区"
			// });
			// wx.setNavigationBarColor({
			//   frontColor: "#ffffff", // 必写项
			//   backgroundColor: "#" + this.$state.baseColor,
			//   backgroundColor: "#374e80"
			// });
			console.log(options, '111111111')
			console.log(this.$qj.storage.get('userInfo'))
			console.log(this.$qj.storage.get('userdetailsInfo'))
			this.userInfoCode = this.$qj.storage.get('userdetailsInfo').userInfoCode
			this.searchParams = options.searchParams;
			if (options.json && JSON.parse(options.json).classtreeCode) {
				this.classtreeCode = JSON.parse(options.json).classtreeCode;
				// this.searchParams.classtreeCode = JSON.parse(options.json).classtreeCode;
			}
		},
		onReachBottom() {
			this.loadMore();
		},
		watch: {
			propSearchParams(newValue, oldValue) {
				this.searchParams = newValue;
			},
			propClasstreeCode(newValue, oldValue) {
				this.classtreeCode = newValue;
				console.log(this.classtreeCode, 'watcher');
			}
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
			// this.initSearchParams();
			// this.commonMounted();
			this.searchStatus();
			this.$qj
				.http(this.$qj.domain)
				.get(queryBrandPageForC)
				.then(res => {
					this.screenList = res.rows;
				});
		},
		beforeDestroy() {
			this.page = 1;
			this.$qj.storage.set('searchParam', '');
		},
		methods: {
			// 输入数字实时监听
			countInput(e,index){
				console.log('ppppp=',e)
				this.goodsNum = e.detail.value; //输入的值		
			},
			receiveCar(){
				let options = {
					url: 'hdb/promotionClass/shopCar',
				};
				this.navigateTo(options)
			},
			//获取促销分类信息
			getGoodsList(){
				// let params ={
				// 	promotionName: "20210428测试"
				// }
				this.$qj
					.http(this.$qj.domain)//{promotionCode: this.temp.promotionCode}
					.get('/web/pm/promotionRangelist/queryPromotionRangelistPage.json',{promotionCode: this.temp.promotionCode})
					.then(res => {
						console.log('促销类型==',res)
						this.promotionGoodList = res.rows
						this.promotionGoodList.forEach( v =>{
							this.skuNoList.push(v.skuNo)
						})
						this.skuNoString = this.skuNoList.toString()
						this.initSearchParams();
					});
			},
			// 
			chooseCity() {
				this.cityPicker = true;
			},
			/**
			 * 地址选择器回调方法
			 */
			cityPickerConfirm(params) {
				console.log(params);
				this.city = params.province.label + params.city.label + params.area.label;
				// this.orderDisabled = false
				this.provinceCode = params.province.value;
				this.cityCode = params.city.value;
				this.areaCode = params.area.value;
				this.provinceName = params.province.label;
				this.cityName = params.city.label;
				this.areaName = params.area.label;
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
						if (res.checkModifyAudit == '3') {
							that.checkModifyAudit = "3"
						}

					});
			},

			getNavBarHeight(e) {
				this.offsetTop = e;
			},

		initSearchParams(goodsClassCode) {
			this.params = {
				goodsOrigin:0,
				skuNo:this.skuNoString
			};
			this.commonMounted()
			// console.log('当前的类型898--8--',this.userinfoType )
			// if(this.userinfoType == '2'){
			// 	this.params.channelCode = 'tempChannelCode'
			// 	this.params.temp = this.channelCode
			// 	// this.params.temp = 'SHA/SBB0/SB1S1'
			// 	// this.params.temp = 'SHA/SBB0/SB1S'  //上海
			// 	this.params.goodsOrigin = "13"
			// }
			// if(this.$qj.storage.get('loginInfor').userinfoQuality == 'sales'){
			// 	this.params.temp = 'SHA/SBB0/SB1S'
			// }
			// if (this.classtreeCode || classtreeCode) {
			// 	delete this.params.searchParam;
			// 	this.params.classtreeCode = this.classtreeCode || classtreeCode;
			// }
		},

			commonMounted() {
				console.log('列表')
				this.lastPageLine = false;
				this.$qj
					.http(this.$qj.domain)
					.get(search, this.params)
					.then(res => {
						if (res.rows.length > 0) {
							let batchCollectData = [];
							// 获取用户维度起订量倍数
							let skuMinSaleMultiple = [];
							this.items = res.rows;
							this.items.map(v => {
								if (!RegExp(/http/).test(v.dataPic)) {
									v.dataPic = this.$domain + v.dataPic;
								}
								v.itemChecked = false;
								batchCollectData.push({
									collectType: '0',
									collectOpcode: v.skuCode
								});
								skuMinSaleMultiple.push({
									skuNo: v.skuNo,
									goodsNo: v.goodsNo
								});
							});
							this.batchCheckCollect(batchCollectData, this.items);
							this.batchGetSkuMinSaleMultiple(skuMinSaleMultiple, this.items);
							this.total = res.total;
						}
					});
			},

			/**
			 *
			 */
			batchGetSkuMinSaleMultiple(data = [], items = this.items) {
				// onShow状态下需要再次调用接口检查收藏状态
				if (data.length == 0 && items.length > 0) {
					items.map(v => {
						data.push({
							skuNo: v.skuNo,
							goodsNo: v.goodsNo
						});
					});
				}
				if (data.length != 0) {
					this.$qj.message.loading();
					this.$qj
						.http(this.$qj.domain)
						.post(checkSkuOne, {
							rsSkuDomainListJson: JSON.stringify(data)
						})
						.then(res => {
							console.log(res);
							if (res.success && res.dataObj.length > 0) {
								res.dataObj.map(k => {
									items.map(v => {
										if (k.skuNo == v.skuNo) {
											v.skuOneNum = k.skuOneNum;
										}
									});
								});

								this.items = items;
							}
						});
				}
			},

			/**
			 * 批量检查商品收藏状态
			 * 在进行收藏操作之后必须调用
			 * data  要检查的商品
			 * items 目前的商品列表数组（包括上拉加载的）
			 */
			batchCheckCollect(data = [], items = this.items) {
				// onShow状态下需要再次调用接口检查收藏状态
				if (data.length == 0 && items.length > 0) {
					items.map(v => {
						data.push({
							collectType: '0',
							collectOpcode: v.skuCode
						});
					});
				}
				if (data.length != 0) {
					this.$qj.message.loading();
					this.$qj
						.http(this.$qj.domain)
						.post(checkBatchCollectExit, {
							collectListStr: JSON.stringify(data)
						})
						.then(res => {
							console.log(res);
							if (res.length > 0) {
								res.map(k => {
									items.map(v => {
										if (k.collectOpcode == v.skuCode) {
											v.collectObj = k;
											v.itemCollectChecked = true;
										}
									});
								});

								this.items = items;
								this.$forceUpdate();
								console.log('检查完收藏状态的数据', this.items);
							}
						});
				}
			},

			listClick(list, index) {
				this.colorCurrent = index;
				this.brandCode = list.brandCode;
			},
			reverseClick() {
				this.maxPrice = null;
				this.minPrice = null;
				this.colorCurrent = null;
			},
			saveClick() {
				this.screenShow = false;

				if (this.maxPrice !== null) {
					this.params.maxPrice = this.maxPrice;
				} else {
					delete this.params.maxPrice;
				}
				if (this.minPrice !== null) {
					this.params.minPrice = this.minPrice;
				} else {
					delete this.params.minPrice;
				}
				if (this.colorCurrent !== null) {
					this.params.brandCode = this.brandCode;
				} else {
					delete this.params.brandCode;
				}
				if (this.maxPrice == null && this.minPrice == null && this.colorCurrent == null) {
					this.current = -1;
				}

				this.commonMounted();
			},
			screenLeftClick() {
				this.screenShow = false;
				if (this.maxPrice == null && this.minPrice == null && this.colorCurrent == null) {
					this.current = -1;
				}
			},
			titleClick(index) {
				this.current = index;
				this.params.page = 1;
				this.page = 1;
				switch (index) {
					case 0:
						this.params.sortField = '';
						this.commonMounted();
						break;
					case 1:
						this.params.sortField = 'goodsSalesvolume';
						this.commonMounted();
						break;
					case 2:
						if (this.iconColor === true) {
							this.iconColor = false;
							this.params.order = 'desc';
						} else {
							this.iconColor = true;
							this.params.order = 'asc';
						}
						this.params.sortField = 'pricesetNprice';
						this.commonMounted();
						break;
					default:
						break;
				}
				if (index !== 2) {
					this.iconColor = null;
				}
				if (index === 3) {
					this.screenShow = true;
				}
			},

			loadMore() {
				let num = Math.ceil(this.total / 10);
				this.page++;
				let params = Object.assign(this.params, {
					page: this.page
				});
				if (params.page <= num) {
					this.$qj
						.http(this.$qj.domain)
						.get(search, params)
						.then(res => {
							let batchCollectData = [];
							let skuMinSaleMultiple = [];
							let list = res.rows;
							list.map(v => {
								if (!RegExp(/http/).test(v.dataPic)) {
									v.dataPic = this.$domain + v.dataPic;
								}
								v.itemChecked = false;
								batchCollectData.push({
									collectType: '0',
									collectOpcode: v.skuCode
								});
								skuMinSaleMultiple.push({
									skuNo: v.skuNo,
									goodsNo: v.goodsNo
								});
							});
							this.items = [...this.items, ...list];
							this.allChecked = false;
							this.batchCheckCollect(batchCollectData, this.items);
							this.batchGetSkuMinSaleMultiple(skuMinSaleMultiple, this.items);
						});
				} else {
					this.lastPageLine = true;
				}
			},
			goodsDetail(skuCode) {
				// let att = this.$qj.businessDomain + '/paas/shop/' + this.$qj.storage.get('hrefs') + skuCode + '.html';
				// let options = {
				// 	url: 'web',
				// 	query: {
				// 		defaultUrl: att
				// 	}
				// };
				// this.$emit('navigateTo', options);
				if(this.userinfoType == 1 && this.city == ''){
					this.$qj.message.alert('请先选择渠道地址')
				}else{
					let params = {
						skuCode: skuCode
					};
					this.$qj.router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail", params)
				}
				
			},

			goSearch() {
				let options = {
					url: this.searchPath
				};
				this.navigateTo(options);
			},

			itemCheck(item) {
				if (this.handling) {
					return;
				}
				this.handling = true;
				item.itemChecked = !item.itemChecked;
				this.$forceUpdate();
				if (item.itemChecked) {
					this.itemCheckedArr.push(item);
				} else {
					for (var i = 0; i < this.itemCheckedArr.length; i++) {
						if (this.itemCheckedArr[i] == item) {
							this.itemCheckedArr.splice(i, 1);
						}
					}
				}
				if (this.itemCheckedArr.length == this.items.length) {
					this.allChecked = true;
				} else {
					this.allChecked = false;
				}
				this.handling = false;
			},

			/**
			 * 商品列表中收藏和取消收藏操作
			 * @param {Object} item
			 */
			itemAddCollect(item) {
				// this.$qj.message.alert('收藏');
				//dataPic
				//goodsName
				//goodsOrigin
				//pricesetNprice
				//goodsProperty
				if (this.handling) {
					return;
				}
				this.handling = true;
				if (!item.itemCollectChecked) {
					console.log(item)
					console.log('item')
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
							collectOpnum: item.goodsMinnum ? item.goodsMinnum : 1,
							// 价格
							collectNum1: item.pricesetNprice,
							goodsOrigin: item.goodsOrigin,
							// 商品的url
							collectOpurl: '/paas/shop/' + this.$qj.storage.get('hrefs') + item.skuCode + '.html'
						})
						.then(res => {
							console.log(res);
							if (res.success && res.dataObj) {
								this.batchCheckCollect([{
									collectType: '0',
									collectOpcode: item.skuCode
								}]);
								this.$qj.message.alert('收藏成功');
							} else {
								this.$qj.message.alert(res.msg);
							}
							this.handling = false;
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
									item.itemCollectChecked = false;
									this.$forceUpdate();
									this.$qj.message.alert('取消成功');
								}
								this.handling = false;
							});
					}
				}
			},
				subtract(item,index){
					if(this.goodsNum > item.goodsMinnum){
						this.goodsNum -= 1;
					}else{
						this.$qj.message.alert('起订量不可小于1')
					}
					this.$forceUpdate()
				},
				add(item, index){
					this.goodsNum  = this.goodsNum + 1;
					this.$forceUpdate()
				},
			addShoppingGoodsCode(item){
				console.log('t添加购物车---',item)
				
				// 商品的限购数量
				let xianBuy = 0;
				let sunGoodsNum = 0;
				let cansole = 0;
				this.promotionGoodList.forEach( val =>{
					if(val.skuNo == item.skuNo){
						if(val.couponOnceUnum == 0){ //0表示不限购
							xianBuy = 2100000000;
						}else{
							xianBuy = val.couponOnceUnum;
						}
						
					}
				})
				console.log('商品限购数量---',xianBuy)
				
	
				this.$qj.http(this.$qj.domain).get('/web/oc/contract/queryContractGoodsPage.json',{skuNo:item.skuNo,dataState:'0'} ).then(res => {
					console.log('-----',res)
					
						if(res.rows.length>0){
							
							res.rows.forEach( v =>{
								// 查询用户对该商品下买了多少
								// this.$qj.http(this.$qj.domain).get('/web/oc/contract/queryContractPagePlat.json',{contractType:'00',memberBcode:'23101090393043',contractBillcode:v.contractBillcode} ).then(vk => {
									
								// 	console.log('res[[[[]]]]---',vk)
								// 	if(vk.rows.length>0){
								// 	if(vk.rows[0].dataState == -1){
								// 		cansole = cansole + vk.rows[0].goodsNum
									
								// 	}
										
								// 	}
								// })
								
								sunGoodsNum = sunGoodsNum + v.goodsNum	
							})
							sunGoodsNum = sunGoodsNum - cansole
						}	
					
					console.log('订单数量---',sunGoodsNum);
					
					let param= {
						skuNo:item.skuNo,
						shoppingType:'01',
						memberBcode:$storage.get('loginInfor').userInfoCode
					}
					//查看购物车里面已经添加该商品数量
					this.$qj.http(this.$qj.domain).get('/web/oc/shopping/queryShoppingGoodsPage.json',param).then(res => {
						console.log('购物车数量==',res)
						let goodsCamount = 0;
						if(res.rows.length > 0){
							goodsCamount = res.rows[0].goodsCamount
						}
							xianBuy = xianBuy - sunGoodsNum - goodsCamount;
							if(xianBuy >= this.goodsNum){
								console.log('[[[[]]]]',xianBuy)
								let goodsList = [{
									skuId:item.skuId,
									goodsNum:this.goodsNum,
									shoppingType:"01",
									
								}]
								let params = {
									memberBcode:$storage.get('loginInfor').userInfoCode,
									goodsBeanStr:JSON.stringify(goodsList)
								}
								this.$qj.http(this.$qj.domain).get('/web/oc/empshopping/addShoppingGoodsCode.json',params ).then(res => {
									if(res.success){
										this.$qj.message.alert('商品加入购物车成功！');
									}else{
										this.$qj.message.alert(res.msg);
									}
								})
							}else{
								this.$qj.message.alert('已超过该商品最大购买量！');
							}
					})
					
				})
				
	
			},	
			/**
			 * 商品列表加入购物车
			 * @param {Object} item
			 */
			itemAddCart(item) {
				console.log(item);
				if (this.handling) {
					return;
				}
				this.handling = true;
				let calGoodsNum;
				let goodsNum = item.goodsMinnum != 0 ? item.goodsMinnum : 1;
				calGoodsNum = goodsNum;
				if (item.skuOneNum && item.skuOneNum != 0) {
					calGoodsNum = goodsNum * item.skuOneNum;
				}
				this.$qj.message.loading();
				this.$qj
					.http(this.$qj.domain)
					.get(addShoppingGoods, {
						skuId: item.skuId,
						goodsNum: calGoodsNum
					})
					.then(res => {
						console.log(res);
						if (res.success && res.dataObj) {
							this.$qj.message.alert('购物车添加成功');
						} else {
							this.$qj.message.alert(res.msg);
						}
						this.handling = false;
					});
			},

			allCheck() {
				if (this.handling) {
					return;
				}
				this.handling = true;
				this.allChecked = !this.allChecked;
				this.itemCheckedArr = [];
				if (this.allChecked) {
					this.items.map(v => {
						v.itemChecked = true;
						this.itemCheckedArr.push(v);
					});
				} else {
					this.items.map(v => {
						v.itemChecked = false;
					});
				}
				this.$forceUpdate();
				this.handling = false;
			},

			addCollect() {
				if (this.handling) {
					return;
				}
				this.handling = true;
				let params = [];
				this.itemCheckedArr.forEach(element => {
					params.push({
						collectType: '0',
						collectOpcode: element.skuCode,
						// 图片
						collectOppic: element.dataPic,
						// 内容
						collectOpcont: element.goodsName,
						collectOpmark: element.goodsProperty,
						// 数量
						collectOpnum: element.goodsMinnum != 0 ? element.goodsMinnum : 1,
						// 价格
						collectNum1: element.pricesetNprice,
						goodsOrigin: element.goodsOrigin,
						// 商品的url
						collectOpurl: '/paas/shop/' + this.$qj.storage.get('hrefs') + element.skuCode + '.html'
					});
				});
				this.$qj
					.http(this.$qj.domain)
					.post(saveCollectBatch, {
						umCollectDomainList: JSON.stringify(params)
					})
					.then(res => {
						if (res.success) {
							this.$qj.message.alert('收藏成功');
							this.handling = false;
							this.batchCheckCollect(params);
						}
					});
			},

			addCart() {
				if (this.handling) {
					return;
				}
				this.handling = true;
				this.$qj.message.loading();
				this.requestAddCart(this.itemCheckedArr, '');
			},

			requestAddCart(data, alertMsg) {
				let params = [];
				data.forEach(e => {
					let minNum = e.goodsMinnum != 0 ? e.goodsMinnum : 1;
					params.push({
						skuId: e.skuId,
						goodsNum: e.skuOneNum && e.skuOneNum != 0 ? e.skuOneNum * minNum : minNum
					});
				});
				this.$qj
					.http(this.$qj.domain)
					.post(addBatchShoppingGoods, {
						goodsBeanListJson: JSON.stringify(params)
					})
					.then(res => {
						console.log(res);
						if (res.success) {
							this.$qj.message.alert('成功加入购物车');
						} else {
							// 选中的数量和返回的有问题的数量相等
							if (res.dataObj != null) {
								if (Object.keys(res.dataObj).length == data.length) {
									this.$qj.message.alert(res.msg);
								} else {
									this.$qj.message.alert('选中的商品部分库存不足，其余已加入购物车');
								}
							}
						}
						this.handling = false;
					});
			},
			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},
			onShareAppMessage(res) {
				return {
					title: '海德堡',
					path: '/pages/goodsList/main'
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	// @import '../../libs/css/common.less';
	@import '@/common/css/common.less';
	.getCoupon-footer {
		height: 90rpx;
		width: 100%;
		font-size: 26;
		font-weight: bold;
		letter-spacing: 2rpx;
		color: #ffffff;
		background-color: #004178;
		line-height: 90rpx;
		text-align: center;
		position: fixed;
		bottom: 0rpx;
	}
	.address-choose {
		display: flex;
		align-items: center;
		width: 100%;
		height: 90rpx;
		z-index: 999;
		.container {
			display: flex;
			align-items: center;
			width: 100%;
			height: 100%;
			border-bottom: 1rpx solid #e5e5e5;

			input {
				flex: 1;
				width: 100%;
				height: 100%;
				background: none;
				color: @color-333;
			}

			.iconfont {
				padding: 20rpx;
			}
		}
	}
	.goodsList {
		width: 100%;
		background: @white-color;

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
			flex-direction: column;
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
			margin-top: 200rpx;
			ul {
				width: 100%;
				overflow: hidden;
				zoom: 1;

				li {
					width: calc(50% - 2rpx);
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
							height: 80px;
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
								margin: 20rpx;
								// height: 70rpx;
								line-height: 30rpx;
							}

							.noPrice {
								color: #8a8989;
								padding: 0;
								margin: 0;
							}

							.purchasePrice {
								display: block;
								padding: 0 4px;
							}
							.purchasePrice1 {
								text-decoration:line-through;
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
									height: 30rpx;
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
