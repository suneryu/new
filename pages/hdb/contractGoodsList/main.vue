<template>
	<view class="getCoupon">
		<view class="getCoupon-top">
			<view class="left">
				<view>{{list.giftName}}</view>
				<view>剩余可领取<font>{{list.userRelNum}}</font>{{list.giftChange=='0'?'元':'件'}}</view>
				<view>领取方式:
					<span>{{list.giftCtype=='0'?"一次":"多次"}}</span>
					<span>{{list.giftChange=='0'?"按金额兑换":"按数量兑换"}}</span>
				</view> 
				<view>截止日期：{{list?list.memberCname:''}}</view>
			</view>
			<view class="right">
				<view @click="showCustomBtnTxt()" class="rigth-content">
					<span>兑换</span>
					<span>须知</span>
				</view>
				<u-popup v-model="isshowCustomBtnTxt" mode="center" height="320rpx" width="90%">
					<view style="
						height:80rpx;
						line-height: 80rpx;
						color:#333333;
						text-align: center;
						font-size: 32rpx;
						width: 100%;
						font-weight: bold;">兑换须知</view>
					<view style="
						height:160rpx;
						line-height: 80rpx;
						color:#999999;
						text-align: center;
						font-size: 28rpx; 
						width: 100%;">当订单金额超出合同可用抵扣额度，剩余货款以商品原价进行补足。运费不享受合同中的商品折扣。</view>
					<!-- <view v-else style="
							height:80rpx;
							line-height: 80rpx;
							color:#999999;
							text-align: center;
							font-size: 32rpx; 
							width: 100%;">暂无兑换需知</view> -->
					<view style="
						height:80rpx; 
						line-height: 80rpx;
						border-top:1rpx solid #999999;
						color:#EB2B27; 
						text-align: center;
						font-size: 32rpx; 
						width: 100%;"
					 @click="isshowCustomBtnTxt=false">确定</view>
				</u-popup>
			</view>
		</view>
		<view style="width: 100%;height: 100rpx;background: #fff;text-align: center;line-height: 100rpx;padding: 0 20rpx;box-sizing: border-box;" >
			<u-search placeholder="输入商品编号" :show-action="true" v-model='searchValue' bg-color='#f1f5f8' clearabled animation @blur='serarchGoods' ></u-search>
		</view>
		<view class="getCoupon-content">
			<view v-for="(item,index) in giftCoupon" :key="index">
				<p>
					<!-- <checkbox color="blue" style="transform:scale(0.7) " :checked="item.ischecked" @click.stop="singelCheck(item,itemIndex)" /> -->
				</p>
				<p  @click="goodsDetail(item)">
					<image :src="item.dataPic" mode="" :prop="skuCode"></image>
				</p>
				<p >
					<view style='overflow: hidden;white-space: nowrap;width: 98%;height: 30rpx;text-overflow: ellipsis;'>
						{{item.goodsName}}
					</view>
					<span style='color: #3B4246;margin-right: 10rpx;display: block;'>{{item.skuNo}}</span>
				</p>
				<!--  -->
				<p><span style='color: #3B4246;margin-right: 10rpx;'>原价:{{item.pricesetNprice}}元</span>合同价:{{item.pricesetBaseprice}}元</p>
				<!-- <p v-if='item.ischecked'><span>规格</span>
					<span @click.stop="showBox(index)">+</span>
				</p> -->
				<div style='display: flex;justify-content: space-around;height: 50rpx;width: 100%;overflow: hidden;padding: 10rpx;box-sizing: border-box;'>
					<div style='height:30rpx;width: 100%;display: flex;flex-direction: row;'>
						<div @click.stop="subtract(item, index)">
							<i class="iconfont"
								:style="{ color: item.giftNum > 0 ? '#ccc' : '' }">
								&#xe755;
							</i>
						</div>
						<div style='z-index: 0;height: 20rpx;'><input type="text" v-model="item.giftNum == null?1:item.giftNum" /></div>
						<div @click.stop="add(item, index)" style='margin-right: 20rpx;'><i class="iconfont" style='font-size: 18px;'>&#xe756;</i></div>
					</div>
					<div @click.stop="addShoppingGoodsCode(item)" style='margin-right: 10rpx;border-radius: 50%;height: 20rpx;' ><i class="iconfont icon-gouwuche" style='color: #004178;font-size: 18px;'></i></div>
				</div>
			</view>
			<u-popup v-model="show" mode="bottom">
				<view class="count" style="width: 100%;height:300rpx;">
					<view>
						<view class="number">数量:</view>
						<view>
							<span @click="reduce">-</span>
							<span>{{giftCoupon[isindex].giftNum}}</span>
							<span @click="add">+</span>
						</view>
					</view>

					<!-- <view>规格:{{giftCouponType.skuName}}</view> -->
					<view @click="showClick()">确定</view>
				</view>
			</u-popup>
		</view>
		<view class="getCoupon-footer" @click="receiveGift" :prop="goodsBeanStr" >
			前往购物车
		</view>
		<lastPageLine :lastPageLine="lastPageLine" />
	</view>
</template>

<script>
	import {
		formatDate
	} from '@/utils/prototype/date.js';
	import http from '@/api/http.js';
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		getMyCoupon,
	} from '@/api/interface.js';
	import lastPageLine from '@/components/communal/last-page-line';
	export default {
		// props: ["giftUserCode"],
		data() {
			return {
				skuCode:'',
				giftUserrelNum: 0,
				show: false,
				value: 0,
				isshowCustomBtnTxt: false,
				list: '',
				gmtModified: '',
				giftUrl: '',
				lastPageLine: false,
				// dataPic:'',
				giftCoupon: '',
				giftUserEnd: '',
				selectedAll: [],
				selected: 1,
				selectDataList: [],
				giftUserrelNum: 0,
				selectedSumNum: 0,
				remainingNum: 0,
				giftUserNmu: '',
				value: 0,
				totalPrice: 0,
				isAdd: false, //控制数量加减次数
				giftInfo: '',
				isischecked: '',
				isindex: null,
				giftCouponType: '', //表示点击的是哪条数据
				goodsBeanStr: '',
				price: '',
				total: 0,
				giftCode:'',
				giftUserId:'',
				wantList:[],  //勾选商品
				giftUserCode:'',
				searchValue:'',
			}
		},
		onShow() {
			wx.setNavigationBarTitle({
				title: '合同商品列表'
			});
			this.myCoupon()
		},
		onLoad(options) {
			this.giftUserCode = options.giftUserCode
		},
		components: {
			lastPageLine
		},
		methods: {
			subtract(item,index){
				if(item.giftNum > 1){
					item.giftNum -= 1
				}else{
					this.$qj.message.alert('起订量不可小于1')
				}
				this.$forceUpdate()
			},
			add(item, index){
				item.giftNum += 1
				this.$forceUpdate()
			},
			//直接输入商品数量
			// num(item){
				
			// 	console.log('========',giftNum)
			// },
			//添加购物车
			addShoppingGoodsCode(item){
				if(this.list.userRelNum == 0){
					this.$qj.message.alert('合同额度已使用完，无法加入购物车');
				}else{
					let goodsList = [{
						skuCode:item.skuCode,
						goodsNum:item.giftNum,
						shoppingType:"6",
						// channelCode:this.channelCode,
						goodsContract:item.pricesetBaseprice,
						warehouseCode: this.giftUserCode,
						warehouseName: this.list.giftName,
						giftCode:this.list.giftCode
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
				}
				
			},
			goodsDetail(skuCode) {
				$storage.set('pricesetBaseprice',skuCode.pricesetBaseprice)
				let params ={
					skuCode: skuCode.skuCode,
					isGift:false,
				};
				this.$qj.router.push("o2o/pages/goodsdetails_modules/o2o_goosDetail2", params)
			},
			serarchGoods(val){
				this.searchValue = val
				this.myCoupon()
			},
			showClick() {
				// if (this.total > this.list.userRelNum) {
				// 	$message.alert('最多可领取' + this.list.userRelNum + '商品');
				// 	this.isAdd = true
				// 	this.show = true
				// 	// this.giftCoupon[this.isindex].giftNum -=1
				// } else {
					this.show = false;
				// }

			},
			checkPrice(){
				this.total = 0
				for (let i = 0; i < this.giftCoupon.length; i++) {
					this.total += this.giftCoupon[i].pricesetBaseprice * this.giftCoupon[i].giftNum
				}
			},

			showCustomBtnTxt() {
				this.isshowCustomBtnTxt = true
			},
			reduce() {
				if (this.giftCoupon[this.isindex].giftNum == 0) {
					$message.alert('兑换数量不能小于零')

				} else {
					this.giftCoupon[this.isindex].giftNum -= 1
					this.checkPrice();

				}
				this.$forceUpdate()
			},

			showBox(index) {
					this.isindex = index
					this.show = true
					this.isAdd = false
			},
			// add() {
			// 	// if (this.total > this.list.userRelNum) {
			// 	// 	$message.alert('余额不足')
			// 	// } else {

			// 		this.giftCoupon[this.isindex].giftNum += 1
			// 		this.checkPrice();
			// 	// 	if (this.total > this.list.userRelNum) {
			// 	// 		$message.alert('余额不足')
			// 	// 		this.giftCoupon[this.isindex].giftNum -= 1
			// 	// 		this.checkPrice();
			// 	// 	}
			// 	// }

			// 	this.$forceUpdate()

			// },
			getDetail(item) {
				let params = {
					skuCode: item.skuCode
				}
				$router.push('my/giftBag/giftDetail', params)
			},

			myCoupon() {
				let params = {
					giftUserCode: this.giftUserCode,
					skuNo:this.searchValue
				}
				http.get('/web/gt/gift/queryRelToC.json', params).then(res => {
					if (res && res.length != 0) {
						this.giftCode = res.giftCode
						this.giftUserId = res.gtGiftUserDomain.giftUserId
						res.gtGiftUserDomain.userRelNum = res.gtGiftUserDomain.appmanageIcode || res.gtGiftUserDomain.userRelNum
						this.list = res.gtGiftUserDomain
						this.giftUserEnd = formatDate(res.gtGiftUserDomain.giftUserEnd)
						this.giftCoupon = res.gtGiftRelDomainList
						this.giftInfo = res.giftInfo
						this.giftCoupon.map(item => {
							item.ischecked = false //勾选状态，默认false
							item.giftNum = 1 //默认数量为0
						})
						res.gtGiftRelDomainList.map((v) => {
							if (!RegExp(/http/).test(v.dataPic)) {
								this.$set(v, 'dataPic', this.$domain + v.dataPic);
							}   
						});
					}
				})
			},
			//勾选
			singelCheck(item, index) {
				console.log(item,'--------------')
				this.giftCouponType = item
				let price = 0
				for (let i = 0; i < this.giftCoupon.length; i++) {
					price += this.giftCoupon[i].pricesetBaseprice * this.giftCoupon[i].giftNum
				}
				let remindPrice = this.list.userRelNum - price //判断兑换商品是否大于总金额
				// if (remindPrice >= item.pricesetBaseprice) {
					item.ischecked = !item.ischecked
					if (item.ischecked) {
						item.giftNum=1
						this.totalPrice += item.pricesetBaseprice * item.giftNum;
						console.log(this.totalPrice, '123')
					} else {
						this.totalPrice -= item.pricesetBaseprice * item.giftNum
						console.log(this.totalPrice, '12345')
					}

				// } else {
				// 	$message.alert('余额不足')
				// 	item.ischecked = false
				// 	this.$forceUpdate()
				// }


			},
			receiveGift() {
				$router.push('hdb/personCenter/contractCar')
				// let obj = []
				// for (let i = 0; i < this.giftCoupon.length; i++) {
				// 	if (this.giftCoupon[i].ischecked) {
				// 		obj.push({
				// 			skuCode: this.giftCoupon[i].skuCode,
				// 			goodsContract: this.giftUserCode,
				// 			goodsName: this.giftCoupon[i].goodsName,
				// 			goodsNum: this.giftCoupon[i].giftNum,
				// 			selected: this.giftCoupon[i].ischecked,
				// 			shoppingType: "08",
				// 			giftCode:this.giftCode
				// 		})
				// 	}
				// }
				// if (obj.length == 0) {  
				// 	$message.alert('请选择商品')
				// 	return
				// }else{
				// 	//新的
				// 	console.log(obj,'12121212121')
				// 	console.log(JSON.stringify(obj),'69+9+9+9+9+9+9')
				// 	// uni.navigateTo({
				// 	// 	// url:'/pages/settleAccounts/settleAccounts?goodsBeanStr=' + JSON.stringify(obj) + '&pageState=' + '2' 
				// 	// 	url:'pages/hdb/personCenter/contractCar?goodsBeanStr=' + JSON.stringify(obj) + '&pageState=' + '2' 
				// 	// });
				// 	$router.push('hdb/personCenter/contractCar',{goodsBeanStr:JSON.stringify(obj),pageState:'2',giftCode:this.giftCode,giftUserId:this.giftUserId,userRelNum:this.list.userRelNum })
				// 	// $router.push("hdb/personCenter/contractCar");
				// }
			},
		}
	}
</script>

<style lang="less" scoped>
	.getCoupon {
		width: 100%;
		background-color: #f5f5f5;
		.getCoupon-top {
			background-color: #FFFFFF;
			display: flex !important;
			justify-content: space-between;
			height: 280rpx;
			width: 100%;
			padding: 15rpx 0rpx 0rpx 0rpx;
			border-top: 1rpx solid #f5f5f5;

			.left {
				margin-top: 20rpx;
				height: 100%;
				width: 300rpx;
				margin-left: 10rpx;
				line-height: 40rpx;

				view:nth-child(1) {
					font-size: 26rpx;
					padding: 8rpx 0rpx 8rpx 0rpx;
					color: #000000;
					font-weight: bold;
				}

				view:nth-child(2) {
					font-size: 26rpx;
					padding: 8rpx 0rpx 8rpx 0rpx;
					color: #000000;
					font-weight: bold;

					font {
						color: #EB2B27;
					}
				}


				view:nth-child(3) {
					font-size: 21rpx;
					padding: 8rpx 0rpx 8rpx 0rpx;
					color: #666666;

					span {
						letter-spacing: 2rpx;
					}

					span:nth-child(2) {
						margin-left: 10rpx;
					}
				}

				view:nth-child(4) {
					font-size: 21rpx;
					padding: 8rpx 0rpx 8rpx 0rpx;
					color: #666666;
				}
			}

			.right {
				height: 100%;
				width: 200rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				// padding: 12rpx 20rpx 0rpx 0rpx;
				.rigth-content {
					height: 120rpx;
					width: 120rpx;
					border-radius: 60rpx;
					text-align: center;
					line-height: 80rpx;
					// line-height: 120rpx;
					border: 2rpx solid #EB2B27;

					span {
						display: block;
						height: 40rpx;
						font-size: 20rpx;
						color: #EB2B27;
					}

				}
			}
		}

		.getCoupon-content {
			// margin-top: 15rpx;
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 2%;
			margin-bottom: 100rpx;
			flex-wrap: wrap;
			overflow: hidden;
		
			view {
				height: 510rpx;
				width: 48%;
				background-color: #FFFFFF;
				margin-bottom: 10rpx;
				p:nth-child(1) {
					height: 20rpx;
					width: 100%
				}

				p:nth-child(2) {
					text-align: center;
					width: 95%;
					height: 280rpx;
					margin: 10rpx 0rpx 20rpx 0rpx;
					text-align: center;
					image {
						height: 280rpx;
						width: 290rpx;
					}
				}

				p:nth-child(3) {
					padding-left: 10rpx;
					text-align: left;
					width: 95%;
					line-height: 30rpx;
					height: 60rpx;
					margin: 10rpx 0rpx 10rpx 0rpx;
					font-size: 24rpx;

				}

				p:nth-child(4) {
					padding-left: 10rpx;
					text-align: left;
					width: 95%;
					line-height: 42rpx;
					height: 42rpx;
					margin: 5rpx 0rpx 0rpx 0rpx;
					font-size: 24rpx;
					color: #EB2B27;
				}

				p:nth-child(5) {
					padding-left: 10rpx;
					width: 95%;
					height: 42rpx;
					margin: 5rpx 0rpx 0rpx 0rpx;
					font-size: 24rpx;
					display: flex;

					span:nth-child(2) {
						display: block;
						height: 30rpx;
						width: 30rpx;
						border: 1rpx solid #EB2B27;
						border-radius: 30rpx;
						line-height: 25rpx;
						background-color: #EB2B27;
						text-align: center;
						margin-left: 15rpx;
						font-size: 24rpx;
						color: #FFFFFF;
						font-weight: bold;
						text-align: center;
					}
				}
			}
		}

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

		.count {
			view:nth-child(1) {
				display: flex;
				justify-content: center;
				height: 80rpx;
				line-height: 80rpx;
				width: 100%;
				text-align: center;
				.number {
					height: 80rpx;
					width: 60rpx;
				}

				view:nth-child(2) {
					height: 40rpx;
					width: 160rpx;
					border: 1rpx solid #999999;
					border-radius: 4rpx;
					line-height: 40rpx;
					text-align: center;
					margin: 20rpx 0rpx 0rpx 5rpx;
					display: flex;
					font-size: 24rpx;

					span:nth-child(1) {
						height: 100%;
						line-height: 40rpx;
						text-align: center;
						width: 50rpx;
						border-right: 1rpx solid #999999;
						display: block;
					}

					span:nth-child(2) {
						height: 100%;
						line-height: 40rpx;
						text-align: center;
						width: 50rpx;
						border-right: 1rpx solid #999999;
						display: block;
					}

					span:nth-child(3) {
						height: 100%;
						line-height: 40rpx;
						text-align: center;
						width: 50rpx;
						display: block;
					}
				}
			}

			view:nth-child(2) {
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				font-size: 24rpx;
				width: 100%;
			}

			view:nth-child(3) {
				background-color: #004178;
				height: 50rpx;
				width: 120rpx;
				line-height: 50rpx;
				color: #FFFFFF;
				text-align: center;
				margin: 0 auto;
				letter-spacing: 2rpx;
			}

		}
	}
</style>
