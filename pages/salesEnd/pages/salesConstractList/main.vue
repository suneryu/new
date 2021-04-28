<template>
	
	<div  class="orderList" >

	<!-- 	<div style="display: flex;background-color: #fff;">
			<div class='constractName0' @click='parts("0")' :style="{ color: fontColor1 }">全部</div>
			<div class='constractName1' @click='parts("1")' :style="{ color: fontColor2 }">待接洽</div>
			<div class='constractName2' @click='parts("2")'  :style="{ color: fontColor3 }">接洽中</div>
			<div class='constractName2' @click='parts("3")'  :style="{ color: fontColor4 }">已完成</div>
		</div> -->
		<div class="orderList-tit" v-bind:style="{ top: topDistance + 'px' }">
			<ul>
				<li v-for="(item, index) in items" :key="index" @click="parts(item, index)">
					<div :class="current === index ? 'active' : ''" :style="{ color: current === index ? '#004178' : '' }">
						{{ item }}
						<span :style="{ background: '#004178' }"></span>
					</div>
				</li>
			</ul>
		</div>
		<div style='margin-top: 55px;'>
			
			<div v-for='items in contractData'>
				<div style='width: 100%;height: 150px;padding: 0 8px 0 8px;border-top: 10rpx solid #fafafa;border-bottom: 10rpx solid #fafafa;'>
					<div style='width: 100%;height: 40px;display: flex;border-bottom: 1rpx solid #E0E0E0;font-size: 11px;'>
						<div style='width:80%;line-height: 20px;'>
							<div>服务单编号：<span>{{items.scontractId}}</span></div>
							<div style='color: #169BD5;'>企业预约时间：<span>{{items.goodsPmbillno}}</span></div>
						</div>
						<div style='width:20%;line-height: 40px;text-align: center;color: red;' v-if='items.dataState == 0'>待接洽</div>
						<div style='width:20%;line-height: 40px;text-align: center;color: #169BD5;' v-if='items.dataState == 1'>接洽中</div>
						<div style='width:20%;line-height: 40px;text-align: center;' v-if='items.dataState == 2'>已接洽</div>
					</div>
					<div style='width: 100%;height: 100px;border-bottom: 1rpx solid #E0E0E0;'>
						<div style='height: 25px;width: 100%;font-size: 14px; sans-serif;font-weight: 400;font-style: normal;line-height: 25px;display: flex;'>
							<div style='width: 70%;'>{{items.scontractName}}</div>
							<div style='width: 30%;text-align: center;font-size: 11px;' v-if='items.memberGcode =="2-1"'>培训</div>
							<div style='width: 30%;text-align: center;font-size: 11px;' v-if='items.memberGcode =="2-2"'>咨询</div>
							<div style='width: 30%;text-align: center;font-size: 11px;' v-if='items.memberGcode =="2-3"'>服务/零备件合同</div>
							<div style='width: 30%;text-align: center;font-size: 11px;' v-if='items.memberGcode =="2-4"'>设备升级/改造</div>
							<div style='width: 30%;text-align: center;font-size: 11px;' v-if='items.memberGcode =="2-5"'>服务与零备件套餐</div>
					
						</div>
						<div style='height: 25px;width: 100%;font-size: 12px;rgba(153, 153, 153, 0.619607843137255);line-height: 25px;'>合同描述： <span>{{items.contractRemark}}</span></div>
						<div style='height: 25px;width: 100%;display: flex;'>
							<div style='height: 25px;width: 80%;font-size: 12px;color: line-height: 25px;'>{{items.contractUserurl}}</div>
							<div  class='lookconstr' style='height: 25px;width: 20%;text-align: center;'><u style='text-decoration:underline' @click='preview(items)'>合同预览</u></div>
						</div>
						<div style='height: 25px;width: 100%;display: flex;'>
							<div style='height: 25px;width: 50%;font-size: 12px;line-height: 25px;'>企业编号：<span>{{items.contractInvoice}}</span></div>
							<div style='height: 25px;width: 50%;display: flex;padding: 0 10px 0 10px;'>
								<button class="buttonClass" @click="contactPerson(items,'2','1')" v-if='items.dataState == 1'>已接洽</button>
								<button class="buttonClass" @click="contactPerson(items,'1','0')" v-if='items.dataState == 0'>立即接洽</button>
								<button :class="[items.dataState !=2 ? 'buttonClass':'buttonClass1']" @click="salesperson(items)" v-if='items.dataState != 2'>查看联系方式</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			
		</div>
		<view class="popup" v-show="htImg">

		   <view class="htImage">
			<div style='text-align: right;font-size: 18px; color: azure;font-weight: 800;'><span @click='htImg = false'>关闭</span></div>
		   <img class="htImg" :src="img + fileUrl" @click='savePhoto(img + fileUrl)'/>
			<div style='font-size: 16px;font-weight: 900;color: #fff;'>点击图片进行下载</div>
		   </view>
		 </view>

	</div>

</template>		

<script>
	import vueTabBar from '@/components/communal/vueTabBar';
	import http from '@/api/http.js';
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		getHomePage,
		queryScontractPageNew,
		queryBuyerScontractPage,
		queryScontractFilePage,
		talkOverWithSell
	} from '@/api/interfaceHDB.js';
	export default {
		data() {
			return {
				current:0,				
				items: ['全部', '待接洽','接洽中', '已完成'],
				now: new Date().getTime(),
				fileUrl:"",  // 图片的url
				htImg:false,  //图片点击展示
				img: this.$imgDomain,   // 域名
				selectValue:false,
				imgDefalut:"icon-arrfill_l",
				contractData:[
					{
						"scontractName":"千匠",
						"goodsMoney":"1000.00",
						"scontractNbcode":"1年",
						"contractValidate":"2020/11/02",
						"contractPaydate":"2021/02/24",
						"contractRemark":"合同的描述。。。。。",
						"memberCcode":"25",
						"memberCname":"12032"
					},
					{
						"scontractName":"千禧",
						"goodsMoney":"2000.00",
						"scontractNbcode":"2年",
						"contractValidate":"2022/11/02",
						"contractPaydate":"2023/02/24",
						"contractRemark":"千禧合同的描述。。。。。",
						"memberCcode":"25",
						"memberCname":"12032"
					}
				],
				iconShow1:true,  //线下合同弹出层
				iconShow2:false,
				fontColor1:"#004178",   //字体颜色
				fontColor2:"#000000", //字体颜色
				fontColor3:"#000000",   //字体颜色
				fontColor4:"#000000",   //字体颜色
				page:1,
				info:{},  //登录人信息
				userPhone : "",  //当前登录人的手机号
				userinfoType:"",  // 用户类型
				xihx:''
			}
		},
		onLoad(options) {
			console.log(options,'---ppp---ppp--')
			this.userinfoType= $storage.get('loginInfor').userinfoType
			console.log($storage.get('loginInfor'),"$storage.get('loginInfor')")
			console.log($storage.get('loginInfor').userPhone,"$storage.get('loginInfor').userPhone")
			this.info = $storage.get('loginInfor');
			
			console.log("userPhone",this.info.userPhone)
			
			let parmas = {
				contractInvstate:2,
				rows: 10,
				page: 1,
				contractTypepro:$storage.get('loginInfor').userPhone
				// goodsSupplierName:this.info.userPhone
			};
			let that = this
			this.current = Number(options.info)
			// this.$qj.state.set('orderTabIndex', options.info);
			
			if(options.info == 1 ){
				parmas.dataState = 0
			}
			if(options.info == 2 ){
				parmas.dataState = 1
			}
			if(options.info == 3 ){
				parmas.dataState = 2
			}
			this.getData(parmas);
			// this.parts(data,options.info)
			this.baseColor = `#${$storage.get('baseColor')}`;
			wx.setNavigationBarTitle({
				title: "预约任务列表"
			});
			wx.setNavigationBarColor({
				frontColor: '#ffffff',
				// backgroundColor: this.baseColor,
				backgroundColor: "#374e80"
			});
		},
		created(){
		
			// this.userinfoType= $storage.get('loginInfor').userinfoType
			// console.log($storage.get('loginInfor'),"$storage.get('loginInfor')")
			// console.log($storage.get('loginInfor').userPhone,"$storage.get('loginInfor').userPhone")
			// this.info = $storage.get('loginInfor');
			
			// console.log("userPhone",this.info.userPhone)
			// let parmas = {
			// 	contractInvstate:2,
			// 	rows: 10,
			// 	page: 1,
			// 	contractTypepro:'17835757271'
			// 	// goodsSupplierName:this.info.userPhone
			// };
			// this.getData(parmas);
		},
		onReachBottom() {
		  // 到这底部在这里需要做什么事情
		  console.log("this.contractData[0]",this.contractData[0].memberGcode)
		  this.loadMore(this.contractData[0].memberGcode);
		},
		methods: {
			
			contactPerson(data,state,oldState){
				//更新合同状态将待接洽换成已接洽
				console.log('立即接洽，',data)
				let parmas = {
					scontractId: data.scontractId,
					contractInvstate:2,
					dataState: state,
					oldDataState: oldState,
					// goodsSupplierName:this.info.userPhone
				};
				http.get(talkOverWithSell, parmas)
					.then(res => {
						console.log("更改预约合同结果....",res)	
						
						let parmas = {
							contractInvstate:2,
							rows: 10,
							page: 1,
							contractTypepro:$storage.get('loginInfor').userPhone
							// goodsSupplierName:this.info.userPhone
						};
						if(this.current == 1 ){
							parmas.dataState = 0
						}
						if(this.current == 2 ){
							parmas.dataState = 1
						}
						if(this.current == 3 ){
							parmas.dataState = 2
						}
						this.getData(parmas);
						
					});
			},
			salesperson(data) {
				console.log('查看联系方式--',data)
				let showHtml = ""
				wx.showModal({
					title: "企业信息",
					content: data.contractUserurl + '企业编码:'+data.contractInvoice+'\r\n企业联系人：'+data.mschannelName+	'\r\n电话：'+data.goodsPbillno,
					cancelText: '关闭',
					confirmText:'一键拨号',
					success: res => {
						if (res.confirm) {
							this.gocall(data.goodsPbillno)
						}
					}
				});
			},
			gocall(phoneNumber) {
				console.log(1111)
				uni.makePhoneCall({
			
					// 手机号
					phoneNumber: phoneNumber,
			
					// 成功回调
					success: (res) => {
						console.log('调用成功!')
					},
			
					// 失败回调
					fail: (res) => {
						console.log('调用失败!')
					}
			
				});
			},
			//保存图片
			savePhoto (data) {
				console.log('data',data)
			        const _this = this;
			        wx.getImageInfo({
			            src: data,
			            success: function (res) {
			                wx.saveImageToPhotosAlbum({
			                    filePath: res.path,
			                    success (result) {
			
			                        // _this.setData({ show: false });
			                        wx.showToast({
			                            title: '保存成功',
			                            icon: 'success',
			                            duration: 2000
			                        })
			                    },
			                    fail (err) {
			                        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
			                            wx.openSetting({
			                                success (settingdata) {
			                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
			                                        _this.savePhoto()
			                                    } else {
			                                        wx.showToast({
			                                            title: '获取权限失败,无法保存图片',
			                                            icon: 'success',
			                                            duration: 2000
			                                        })
			                                    }
			                                }
			                            })
			                        }
			                    }
			                })
			            }
			        })
			    },
			//点击使用合同
			useContract(items){
				console.log("点击使用合同,跳转到合同列表页",items)
				$router.push("hdb/personCenter/myContractGoodsList",items)

			},
			//查询合同附件的接口
			queryScontractFilePage(item){
				let data = item

				console.log("合同信息code",data.dataStatestr)
				http.get(queryScontractFilePage, {
					 scontractCode:data.dataStatestr
				})
					.then(res => {
						console.log("合同附件",res)
						console.log("合同附件",this.userinfoType)
						res.rows.forEach(element => {

							if (element.memo =="1") {
							 console.log("scontractFileUrl...",element.scontractFileUrl)
							 this.fileUrl =element.scontractFileUrl
								}
						// this.contractData = res.rows;
					});
			})
			},
			//合同预览
			preview(items){
				this.htImg=true;
				console.log('合同预览，，，',items)
				this.queryScontractFilePage(items);
				if(this.fileUrl== null || this.fileUrl =="" ){

					//this.tankuang();
				}else{
					console.log("有信息")
				}
				console.log(this.fileUrl);

			},

			// //预览合同
			// preview(items){
			// 	//点击预览图片
			// 	this.htImg = true;
			// 	console.log("传来的参数：+",items)
			// },

		//懒加载的事件
		loadMore(code) {
			this.page++;
		 console.log("qqqqqqqqqqqqaaaaa",this.page)
		 console.log("qqqqqqqqqqqqaaaaa2",code)
		 let parmas = {
		 	memberGcode: code,
		 	contractInvstate:2,
		 	rows: 10,
		 	page: this.page,
			// goodsSupplierName:this.info.userPhone
		 };
		 http.get(queryScontractPageNew, parmas)
		 	.then(res => {
		 		console.log("resData....",res)	
		 		
		 	res.rows.forEach(element => {	
				element.date1 = this.format(element.contractEffectivedate)
				element.date2 = this.format(element.contractDepositdate)
		 			this.contractData.push(element)
		 		// this.contractData = res.rows;
		 	});
		 		
		 	});
		},
	
			//根据合同类型查询合同数据
			parts(data,index){
			
					console.log('传来的---0',data,'====',index)
					this.current = index;
					this.$qj.state.set('orderTabIndex', index);
					
				console.log(data,'data')
				if(index=='0'){
					console.log('全部')
				
					
					this.page=1; //第一次展示的十条数据
					//合同查询接口  web/sp/scontract/queryScontractPageNew.json? memberGcode=2-1,2-2&contractInvstate=0
					let parmas = {
						contractInvstate:2,
						rows: 10,
						page: 1,
						contractTypepro:$storage.get('loginInfor').userPhone
						// goodsSupplierName:this.info.userPhone
					}
					this.getData(parmas);
				}
				if(index=='1'){
					console.log('待接洽')
					
					this.page=1; //第一次展示的十条数据
					//合同查询接口  web/sp/scontract/queryScontractPageNew.json? memberGcode=2-1,2-2&contractInvstate=0
					let parmas = {
						contractInvstate:2,
						rows: 10,
						page: 1,
						dataState:0,
						contractTypepro:$storage.get('loginInfor').userPhone
						// goodsSupplierName:this.info.userPhone
					}
					this.getData(parmas);
					
				}
				if(index=='2'){
					console.log('接洽中')
					
					let parmas = {
						contractInvstate:2,
						rows: 10,
						page: 1,
						dataState:1,
						contractTypepro:$storage.get('loginInfor').userPhone
						// goodsSupplierName:this.info.userPhone
					}
					this.getData(parmas);
					
				}
				
				if(index=='3'){
					console.log('已接洽')
				
					let parmas = {
						contractInvstate:2,
						rows: 10,
						page: 1,
						dataState:2,
						contractTypepro:$storage.get('loginInfor').userPhone
						// goodsSupplierName:this.info.userPhone
					}
					this.getData(parmas);
					
				}
				
			},
			getData(data){
				// 查询当前买家合同
				http.get(queryScontractPageNew, data)
					.then(res => {
						console.log("resData....",res)				
					 if(res.total>0){
						 res.rows.forEach(element => {
						 	element.date1 = this.format(element.contractEffectivedate)
						 	element.date2 = this.format(element.contractDepositdate)
						 		if (element.memo == this.userinfoType) {
						 		 console.log(",,,",element.scontractFileUrl)
						 			}
						 	this.contractData = res.rows;
						 });
					 }else{
						 this.contractData = [];
					 }
					
						
					});
			},
			format(shijianchuo){
			//shijianchuo是整数，否则要parseInt转换
			var time = new Date(shijianchuo);
			var y = time.getFullYear();
			var m = time.getMonth()+1;
			var d = time.getDate();
			// var h = time.getHours();
			// var mm = time.getMinutes();
			// var s = time.getSeconds();
			return y+'-'+this.add0(m)+'-'+this.add0(d);
			},
			add0(m){return m<10?'0'+m:m },
			search(){
				uni.navigateTo({
					url:'../../../search_modules/index/main'
				})
			},
			Minemsg(){
				this.$qj.router.push("user_modules/user/user-ui/webMail")
				
			},
		}
	}
</script>

<style lang="less" scoped>
	@import '@/node_modules/qj-mini-pages/libs/css/common.less';
	.popup {
	  position: fixed;
	  left: 0;
	  right: 0;
	  top: 0;
	  height: 100vh;
	  background-color: rgba(0, 0, 0, 0.6);
	  z-index: 9998;
	 }

	 .popup-title {
	  font-size: 14px;
	  font-weight: 700;

	 }

	 .popup-log {
	  font-size: 15px;
	  font-weight: 500;
	  color: #666666;
	  margin: 24rpx;

	 }

	 .popup-btn {
	  display: flex;
	  border-top: 1rpx solid #e6e5e5;
	  margin-top: 100rpx;
	 }

	 .popup-btn .btn {
	  width: 50%;
	  padding: 10px;
	 }
	 button {
	   font-size: 30rpx;
	   width: 90%;
	   margin: 10rpx;
	   background: #fff;

	   &::after {
	    border: none;
	   }
	  }

	  .popup-info {
	   position: fixed;
	   width: 550upx;
	   top: 50%;
	   left: 50%;
	   transform: translate(-50%, -50%);
	   font-size: 30upx;
	   padding: 40upx 0 10rpx 0;
	   border-radius: 20upx;
	   background-color: #fff;
	   z-index: 9999;
	   text-align: center;
	  }

		.htImg{

			margin: 0 auto;
		}

		.htImage{
			text-align: center;
			width: 88%;
			height: 520px;
			margin: 0 auto;
			border:1px solid #fff;
			position: absolute;
			top:60px;
			left:22px;
			z-index: 20000;

		}
	.lessMoney{
		    width: 20%;
		    height: 20px;
		    line-height: 20px;		 
		    font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		    font-weight: 400;
		    font-style: normal;
		    font-size: 12px;
		    color: #02A7F0;
	}
	.chekboxType{
		width: 45%;
		height: 39.5rem;
		box-shadow: 0px 0px 10px gray;
		background-color: #ffffff;
		position: absolute;
		top:93px;
		right: 0;
	}
	
	.checkDiv{
		margin-top: 10px;
		margin-left: 10px;
		font-size: 13px;
	}
	
	.cancelBtn,.sureBtn{
		
		display: inline-block;
		width: 55px;
		height: 30px;
		font-size: 12px;
		
	}
	
	.cancelBtn{
		position: absolute;
		left: 15px;
		bottom: 5px;
	}
	.sureBtn{
		position: absolute;
		right: 20px;
		bottom: 5px;
	}
	
	.cancelBtn:hover,.sureBtn:hover{
		color: white;
		background-color: skyblue;
	}
	.lookconstr{
		    font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		    font-weight: 400;
		    font-style: normal;
		    font-size: 10px;
			color: #169BD5;
	}
	.miaoshu{
		    font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		    font-weight: 400;
		    font-style: normal;
		    font-size: 10px;
		    color: #7F7F7F;
	}
	.money{
		    font-size: 11px;
		    color: rgba(153, 153, 153, 0.619607843137255);
	}
	.buttonClass{
			width: 50%;
		    height: 30rpx;
		    line-height: 30rpx;
		    color: #fff;
		    background-color: #004178;
			font-size: 12px;
	}
	.buttonClass1{
			width: 50%;
			margin-left: 50%;
		    height: 30rpx;
		    line-height: 30rpx;
		    color: #fff;
		    background-color: #004178;
			font-size: 12px;
	}
	.entryName{
		width: 30%;
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
		margin-top: 10rpx;
	}
	.effctivTime{
		width: 30%;
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 10px;
		color: #AAAAAA;
		text-align: left;
		line-height: 60rpx;
	}
	.contractType{
		width: 40%;
		font-family: 'PingFangSC-Regular', 'PingFang SC', sans-serif;
		font-weight: 400;
		font-style: normal;
		font-size: 12px;
		text-align: right;
	}
	.constractName0 {
		width: 34%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-family: 'PingFangSC-Medium', 'PingFang SC Medium', 'PingFang SC', sans-serif;
		font-weight: 500;
		font-style: normal;
		font-size: 13px;
		// color: #004178;
	
	}
	.constractName1 {
		width: 33%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-family: 'PingFangSC-Medium', 'PingFang SC Medium', 'PingFang SC', sans-serif;
		font-weight: 500;
		font-style: normal;
		font-size: 13px;
	
	}
	.constractName2 {
		width: 33%;
		height: 80rpx;
		text-align: center;
		line-height: 80rpx;
		font-family: 'PingFangSC-Medium', 'PingFang SC Medium', 'PingFang SC', sans-serif;
		font-weight: 500;
		font-style: normal;
		font-size: 13px;
	   
	}
	.constractName3 {
		width: 8%;
		height: 80rpx;
		text-align: left;
		line-height: 80rpx;
	}
	
		.search-box {
			background-color: #ffffff;
			z-index: 1000;
			height: 100rpx;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #F4F4F5;
		
			.box-left {
				height: 80rpx;
				width: 80rpx;
				padding: 10rpx;
				line-height: 80rpx;
				margin-left: 20rpx;
		
				image {
					width: 100%;
					height: 100%;
				}
			}
		
			.box-center {
				width: 500rpx;
				height: 100%;
				line-height: 100rpx;
			}
		
			.box-right {
				height: 80rpx;
				width: 80rpx;
				padding: 10rpx;
				margin-left: 10rpx;
				line-height: 80rpx;
				text-align: center;
		
				span {
					height: 100%;
					width: 100%;
					font-size: 38rpx;
		
				}
			}
		}
		
	.orderList {
		width: 100%;
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
		&-tit {
			width: 100%;
			position: fixed;
			// top: 90rpx;
			left: 0;
			z-index: 999;
			background: @white-color;
			padding-top: 10rpx;
			ul {
				display: flex;
				justify-content: space-between;
				padding: @padding-30;
				height: 90rpx;
				li {
					height: 90rpx;
					div {
						width: 100%;
						height: 100%;
						line-height: 90rpx;
						display: inline-block;
						position: relative;
						font-size: 28rpx;
						color: @color-333;
					}
					.active {
						span {
							position: absolute;
							height: 3rpx;
							width: 100%;
							bottom: 0;
							left: 0;
						}
					}
				}
			}
		}
		&-info {
			margin-top: 100rpx;
			ol {
				li {
					border-bottom: 20rpx solid #fafafa;
					padding: @padding-30;
					background: @white-color;
					&:first-child {
						border-top: 20rpx solid #fafafa;
					}
					&:last-child {
						border-bottom: 0;
					}
					.order-item {
						.order-status {
							height: 79rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							border-bottom: 1rpx solid #f6f6f8;
							> div {
								font-size: @big-title;
							}
							.order-info {
								display: flex;
								align-items: center;
								.order-tag {
									font-size: 20rpx;
									border-radius: 18rpx;
									border-width: 1rpx;
									border-style: solid;
									width: 105rpx;
									height: 34rpx;
									line-height: 34rpx;
									text-align: center;
									margin-right: 14rpx;
								}
							}
						}
						.order-msg {
							padding: 15rpx 0 48rpx 0;
							border-bottom: 1rpx solid #f6f6f8;
							display: flex;
							justify-content: space-between;
							img {
								width: 130rpx;
								height: 130rpx;
								margin-right: @margin-right;
							}
							> div {
								display: flex;
								justify-content: space-between;
								p {
									font-size: @big-title;
									color: @color-333;
									margin: 12rpx 0 25rpx 0;
								}
								.currentP {
									width: 380rpx;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								}
								h6 {
									font-size: 24rpx;
									color: @color-999;
								}
							}
						}
						.order-btn {
							height: 88rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							.left {
								display: flex;
								align-items: center;
								i {
									margin-left: 10rpx;
								}
							}
							.right {
								display: flex;
								align-items: center;
								.btn {
									display: inline-block;
									border: 1rpx solid #d4d4d4;
									line-height: 46rpx;
									border-radius: 26rpx;
									padding: 0 20rpx;
									font-size: 22rpx;
									color: @color-666;
									margin-right: @margin-right;
									&:last-child {
										margin-right: 0;
									}
								}
							}
						}
					}
				}
			}
		}
		&-nulls {
			height: calc(100% - 202rpx);
			text-align: center;
			img {
				width: 424rpx;
				height: 311rpx;
				margin: 380rpx auto 0;
			}
		}
	}
</style>
