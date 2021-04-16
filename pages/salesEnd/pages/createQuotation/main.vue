<!-- 自定义导航栏带搜索框的商品列表页(有批量收藏和批量加入购物车的功能) -->
<template>
	<view style="height: 100%;">
		<view class="goodsList" :style="{ bottom:'100rpx',height:'calc(100% - 110rpx)' }">
			<!-- <qj-mini-search-nav-bar :isBack='false' @getNavBarHeight="getNavBarHeight" :isSearch="true"
				:searchRouter="searchPath"></qj-mini-search-nav-bar> -->
				<view style="width: 100%;z-index: 99999;position: fixed;top: 0;height: 100rpx;background: #fff;text-align: center;line-height: 100rpx;" >
					<u-search placeholder="输入商品名称" :show-action="true" v-model='searchValue' bg-color='#f1f5f8' clearabled animation @blur='serarchGoods' ></u-search>
				</view>
			<div class="goodsList-title" >
				<div class="goodsList-title-left">
					<ul>
						<li v-for="(titles, titIndex) in titleList" :key="titIndex" @click="titleClick(titIndex)">
							<div class="container" :style="{ color: current == titIndex ? baseColor : '' }">
								{{ titles }}
								<div v-show="titIndex == 2">
									<div class="iconPosition"> 
										<i class="iconfont"
											:style="{ color: iconColor && iconColor != null ? baseColor : '' }">&#xe78f;</i>
										<i class="iconfont"
											:style="{ color: !iconColor && iconColor != null ? baseColor : '' }">&#xe791;</i>
									</div>
								</div>
								<i class="iconfont" v-show="titIndex == 3"
									:style="{ color: current == titIndex ? baseColor : ''}">&#xe60b;</i>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="itemGoods" v-if="items.length > 0">
				<ul 
					<li v-for="(item, index) in items" :key="index">
						<div class="item-container">
							<div class="list-img" @click.stop="goToGoodsDetail(item)">
								<img :src="item.dataPic || userImgurl" /> <!-- 商品图片-->
							</div>
							<div class="list-r" >
								<p @click.stop="goToGoodsDetail(item)">{{ item.goodsName }}</p>
								<h3 
									@click.stop="goToGoodsDetail(item)">
									{{ item.skuName }}
								</h3>
								<h3 
									@click.stop="goToGoodsDetail(item)">
									起订量：{{ item.goodsMinnum }}
								</h3>
								<div class="list-count">
									<div :style="{ color: item.dataState !== 0 ? '#d66377' : '#d66377' }"
										style='font-size: 14px;'>
										<span>{{ unitPrice.obpay }}{{ item.pricesetNprice }}{{ unitPrice.mapay }}</span>
										<!-- <span style='margin-left: 5px;'
											v-if='item.goodsClass =="1" && userinfoType == "2" && checkModifyAudit == "3"'>{{ unitPrice.obpay }}{{ item.pricesetNprice1 }}{{ unitPrice.mapay }}</span> -->
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
											<div @click.stop="add(item, index)" style='margin-right: 20rpx;'><i class="iconfont">&#xe756;</i></div>
											<div @click.stop="addShoppingGoodsCode(item)" style='margin-right: 10rpx;border-radius: 50%;' ><i class="iconfont icon-gouwuche" style='color: #004178;font-size: 16px;'></i></div>
										</div>
									</view>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="goodsList-nulls" v-else><img :src="nullImg" /></div>

			<div class="goodsList-screenLeft" v-show="screenShow" @click="screenLeftClick"></div>
			<div class="goodsList-screen" v-show="screenShow" style='z-index: 99999999999;'>
				<div class="goodsList-screen-screens">
					<view class="placeholder-container" v-bind:style="{ height: offsetTop + 'px' }"></view>
					<div class="contents">
						<div class="box" v-bind:style="{ paddingTop: 80+ 'rpx' }">
							<div class="pinpai">品牌</div>
							<div class="leftBox" v-for="(list, listIndex) in screenList" :key="listIndex"
								@click="listClick(list, listIndex)">
								<p :style="{ color: colorCurrent == listIndex ? baseColor : '' }">{{ list.brandName }}
								</p>
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
		<view style="width: 100%;height: 150rpx;bottom: 0;position: fixed;padding: 20rpx 20rpx 70rpx 20rpx;background: #fff;box-sizing: border-box;font-size: 16px;">
			<div style='background-color: #409eff;color: #fff;text-align: center;padding: 20rpx;border-radius: 5px;' @click='createQuotation'>
				<span type='primary'>创建报价单</span>
			</div>
		</view>
	</view>
</template>

<script>
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
				title: '商品列表',
				leftIcon: true,
				rightIcon: false,
				titleList: ['综合', '销量', '价格', '筛选'],
				baseColor: '',
				userImgurl: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
				nullImg: this.$qj.imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noSearchResult.png',
				params: {},
				items: [],
				itemsBak:[],
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
			this.userPhone = options.userinfoPhone
			// this.userPhone = '15234496108'
			if(options.scontractCode != undefined){
				this.scontractCode = options.scontractCode
				// this.scontractCode = '2020120300000001'
			}
		},
		onReachBottom() {
			this.loadMore();
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
			//查询商品
			serarchGoods(value){
				if(value != ''){
					this.items = this.itemsBak.filter(item=>item.goodsName.indexOf(value) != -1)
				}else{
					this.items = this.itemsBak
				}
				this.params.page = 1;
				this.page = 1;
				// this.commonMounted()
			},
			//添加购物车
			addShoppingGoodsCode(item){
				let goodsList = [{
					skuId:item.skuId,
					goodsNum:item.goodsNum,
					shoppingType:"5",
					channelCode:this.channelCode
				}]
				let params = {
					memberBcode:this.userInfoCode,
					goodsBeanStr:JSON.stringify(goodsList)
				}
				this.$qj.http(this.$qj.domain).get('/web/oc/empshopping/addShoppingGoodsCode.json',params ).then(res => {
					if(res.success){
						this.$qj.message.alert('商品加入购物车成功！');
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
			//创建报价单
			createQuotation(){
				this.$qj.http(this.$qj.domain).get('/web/oc/empshopping/queryShoppingPage.json',{memberBcode:this.userInfoCode,shoppingType: 5}).then(res => {
					if(res.list && res.list.length>0){
						$router.push('salesEnd/pages/quotationDetail',{userPhone:this.userPhone})
					}else{
						this.$qj.message.alert('请先添加商品到购物车');
					}
				})
			},
			goToGoodsDetail() {},
			//数量删减
			subtract(item,index) {
				if(item.goodsNum != null && item.goodsNum > 0){
					item.goodsNum -= 1*item.goodsMinnum
				}
			},
			//数量增加
			add(item,index) {
				item.goodsNum += 1*item.goodsMinnum
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
			//初始化请求信息
			initSearchParams(goodsClassCode) {
				this.params = {
					page: 1,
					rows: this.rows,
					// channelCode: "1526",
				}
				if (this.userinfoType == '2') {
					this.params.channelCode = 'tempChannelCode'
					this.params.temp = this.channelCode
					this.params.goodsOrigin = "13"
				}

				// if (this.classtreeCode || classtreeCode) {
				// 	delete this.params.searchParam;
				// 	this.params.classtreeCode = this.classtreeCode || classtreeCode;
				// }
			},
			//查询商品数据
			commonMounted() {
				this.lastPageLine = false;
				if(this.scontractCode == ''){
					this.$qj
					.http(this.$qj.domain)
					.get(search, this.params)
					.then(res => {
						console.log('商品列表----', res)
						if (res.rows.length > 0) {
							let batchCollectData = [];
							// 获取用户维度起订量倍数
							let skuMinSaleMultiple = [];
							this.items = res.rows;
							this.items.map(v => {
								if (!RegExp(/http/).test(v.dataPic)) {
									v.dataPic = this.$domain + v.dataPic;
								}
								if (this.userinfoType == "2" && this.checkModifyAudit == "3") {
									// 获取权益价格
									v.pricesetMakeprice = Number(v.pricesetNprice) * this.userinfoOcode
									console.log("获取权益的价格-------", v.pricesetMakeprice)
								}

								v.itemChecked = false;
								 if (v.goodsMinnum) {
								     v.goodsNum = v.goodsMinnum;
								 } else {
								    v.goodsMinnum = 1;
								    v.goodsNum = 1;
								}
								batchCollectData.push({
									collectType: '0',
									collectOpcode: v.skuCode
								});
								skuMinSaleMultiple.push({
									skuNo: v.skuNo,
									goodsNo: v.goodsNo
								});
							});
							this.itemsBak = this.items
							this.total = res.total;
						}
					});
				}else{
					this.$qj
					.http(this.$qj.domain)
					.get('/web/sp/scontract/queryScontractGoodsPage.json', {scontractCode:this.scontractCode})
					.then(res=>{
						if (res.rows.length > 0) {
								let batchCollectData = [];
								// 获取用户维度起订量倍数
								let skuMinSaleMultiple = [];
								this.items = res.rows;
								this.items.map(v => {
									if (!RegExp(/http/).test(v.dataPic)) {
										v.dataPic = this.$domain + v.dataPic;
									}
									if (this.userinfoType == "2" && this.checkModifyAudit == "3") {
										// 获取权益价格
										v.pricesetMakeprice = Number(v.pricesetNprice) * this.userinfoOcode
										console.log("获取权益的价格-------", v.pricesetMakeprice)
									}
						
									v.itemChecked = false;
									v.skuId = v.goodsSpec5
									 if (v.goodsMinnum) {
									     v.goodsNum = v.goodsMinnum;
									 } else {
									    v.goodsMinnum = 1;
									    v.goodsNum = 1;
									}
									batchCollectData.push({
										collectType: '0',
										collectOpcode: v.skuCode
									});
									skuMinSaleMultiple.push({
										skuNo: v.skuNo,
										goodsNo: v.goodsNo
									});
								});
								this.itemsBak = this.items
								this.total = res.total;
							}
						});
				}
				
			},

			listClick(list, index) {
				this.colorCurrent = index;
				this.brandCode = list.brandCode;
			},
			//重置
			reverseClick() {
				this.maxPrice = null;
				this.minPrice = null;
				this.colorCurrent = null;
			},
			//保存
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
			//排序查询
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
						});
				} else {
					this.lastPageLine = true;
				}
			},

			navigateTo(options) {
				this.$qj.router.push(options.url, options.query ? options.query : '');
			},

		}
	};
</script>

<style lang="less" scoped>
	// @import '../../libs/css/common.less';
	@import '@/common/css/common.less';
.itemGoods{
	margin-top: 190rpx;
	margin-bottom:110rpx ;
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
