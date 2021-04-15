<template>
	<div class="userMan" :style="{ background: baseColor }">
		<headerCenter :baseColor="baseColor" :message="message" :isShow="isShow" :nav="nav" :webmail="webmail"
			:userLevel="userLevel" />
		<div class='userMan-account'>
			<span style='color: #fff;font-size: 15px;'>可添加账号</span>
			<div class='userMan-add'>
				<div class='userMan-add-list' v-if='tableList.length>0'>
					<ul>
						<li v-for='(item,index) in tableList' :key="index" >
							<div class="memberTit" @click.stop="listCheckBox(index)" >
								<!-- 点击全选按钮-->
								<i class="iconfont" v-if="item.titChecked == 0"
									:style="{ color: baseColor }">&#xe671;</i>
								<i class="iconfont" v-else :style="{ color: '#ededed' }">&#xe671;</i>
								{{item.userinfoCorp}} {{item.userinfoPhone}}
							</div>
						</li>
					</ul>
				</div>
				<div v-else class='userMan-add-list' style='padding: 30rpx;box-sizing: border-box;'>
					暂无可添加子账号
				</div>
				<div
					style='height: 60rpx;display: flex;justify-content: space-between;padding: 10rpx 20rpx 10rpx 20rpx;'>
					<div class="memberTit" style='width: 100rpx;' @click.stop="listCheckBoxAll">
						<i class="iconfont" :style="{ color: baseColor }" v-if="countChecked">&#xe671;</i>
						<i class="iconfont" :style="{ color: '#ededed' }" v-else>&#xe671;</i>
						全选
					</div>
					<button class="buttonClass" @click.stop="addSubaccount">确定</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import headerCenter from '../subaccount';
	import {
		$storage,
		$router
	} from '@/utils/prototype/vue.js';
	import http from '@/api/http.js';
	import {
		getPersonal,
		queryUserinfoservicePageByJFTZ,
		addSubAccount
	} from '@/api/interfaceHDB.js';
	import {
		clearTimeout,
		setTimeout
	} from 'timers';
	export default {
		data() {
			return {
				show: false,
				selectNavIndex: 3,
				appid: '',
				secret: '',
				state: 'wx',
				grant_type: '',
				domains: this.$domain,
				fapiap1: '', //发票
				yhxy1: "", // 用户协议
				qyinfo1: "", //企业信息
				jfsc1: "", //积分商城
				hyscCar1: "", //合约商城购物车
				baseColor: '',
				message: '',
				isShow: false,
				application: {}, //应用
				myOrder: [],
				userImgurl: require('../../../../../static/img/mine/default_header.png'), //头像
				webmail: '',
				nav: [],
				// 多样式展示应用列表idnex 对应路由接口中的proappMenuOrder
				columnApplicationIndex: [],
				// 用户等级
				userLevel: '',
				userinfoType: "", //用户类型
				tableList: [],
				countChecked: false, //全选
				userinfoCompname: ''
			};
		},
		onLoad() {
			this.baseColor = `#${$storage.get('baseColor')}`;
			wx.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.baseColor
			});
		},

		onShow() {
			this.userinfoType = $storage.get('loginInfor').userinfoType;
			if ($storage.get('userInfo')) this.message = $storage.get('userInfo');
			if ($storage.get('miniUserName') && $storage.get('userId')) {
				http.get(getPersonal, {
					userId: $storage.get('userId')
				}).then(res => {
					this.userLevel = res.userinfoLevel;
					this.userinfoCompname = res.userinfoCompname
					this.getSubAccount(res.userinfoCompname)
				});
			}

		},
		created() {
			this.yhxy1 = this.$domain + '/paas/shop/2020063000000001/2021-03-23/5f8e628099264f9b838b8588c6d15c87.png';
			this.jfsc1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/728f2dd8ba6c4d6e8a9df37ca7a51de0.png';
			this.fapiap1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/27251fe8602b4926b15f39e52f91f11a.png';
			this.hyscCar1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/277c0621c99a4e5a8fb96bbf360a5f01.png';
			this.qyinfo1 = this.$domain + '/paas/shop/2020063000000001/2021-03-25/b430fdd00a2947ed8ea99e4f11b9c9d1.png';
		},
		mounted() {},
		components: {
			headerCenter
		},
		methods: {
			//单选
			listCheckBox(index) {
				if (this.tableList[index].titChecked == 0) {
					this.tableList[index].titChecked = 1
				} else {
					this.tableList[index].titChecked = 0
				}
				let isCheckAll = this.tableList.find(item=>item.titChecked==1)
				if(isCheckAll != undefined){
					this.countChecked = false
				}else{
					this.countChecked = true
				}

			},
			//获取可添加子账号
			getSubAccount(option) { 
				this.$qj.message.loading(); 
				http.get(queryUserinfoservicePageByJFTZ, {
					userinfoQuality: 'dealer',
					userinfoDischannelcode: '1',
					userinfoType: 1,
					userinfoCompname:option
				}).then(res => {
					if(res.list != null){
						res.list.forEach(item => {
							item.titChecked = 1
						})
					}else{
						this.countChecked = false
						res.list = []
					}
					this.tableList = res.list
				})
			},
			//多选
			listCheckBoxAll() {
				this.countChecked = !this.countChecked
				if (this.countChecked) {
					this.tableList.forEach(item => {
						item.titChecked = 0
					})
				} else {
					this.tableList.forEach(item => {
						item.titChecked = 1
					})
				}
			},
			//确认添加子账号
			addSubaccount() {
				let checkList = this.tableList.filter(item => item.titChecked == 0)
				if (checkList.length > 0) {
					let userinfojson =[]
					checkList.forEach(item=>{
						let params = {
							userinfoOpcode2: $storage.get('loginInfor').userInfoCode,
							userinfoId: item.userinfoId,
							userId: item.umUserDomainBean.userId,
							userinfoCode: item.userinfoCode,
							userPcode: $storage.get('loginInfor').userInfoCode,
							userinfoType:1,
							userCode:item.umUserDomainBean.userCode
						}
						userinfojson.push(params)
					})
					let that = this
					http.get(addSubAccount, {
						userinfojson:JSON.stringify(userinfojson)
					}).then(res => {
						if (res.success) {
							uni.showModal({
								title: '提示',
								content: '添加子账号成功！',
								confirmColor: '#' + $storage.get('baseColor'),
								showCancel: false,
								success(res) {
									that.getSubAccount(that.userinfoCompname)
								}
							})
						} else {
							uni.showModal({
								title: '提示',
								content: '添加子账号失败！',
								confirmColor: '#' + $storage.get('baseColor'),
								showCancel: false,
								success(res) {

								}
							})
						}
					});
				}else{
					this.$qj.message.alert('你还未选择要添加的子账号');
				}

			}
		}

	}
</script>
<style lang="less">
	@import '../../../../../common/css/common.less';

	.userMan {
		height: 100%;

		.buttonClass {
			height: 55rpx;
			width: 130rpx;
			line-height: 55rpx;
			background-color: #02437b;
			font-size: 12px;
			font-weight: 500;
			border: 1px solid #555555;
			color: #fff;
			margin-top: 18rpx;
		}

		.memberTit {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			height: 68rpx;
			font-size: 28rpx;
			// font-weight: bold;
			color: @color-333;

			i {
				padding-right: 15rpx;
			}
		}

		&-account {
			padding: 40rpx 50rpx 50rpx 50rpx;
			display: flex;
			justify-content: flex-start;
		}

		&-add {
			background: #fff;
			height: 500rpx;
			width: 450rpx;
			margin-left: 20rpx;
			border-radius: 5px;

			&-list {
				height: 400rpx;
				overflow-y: auto;

			}
		}

		ul {

			// margin-bottom: 256rpx;
			// marg		        in-bottom: 256rpx;
			li {
				margin: 10rpx 0rpx 10rpx 30rpx;
				// background: @white-color;
				// border-radius: 6rpx;

			}
		}
	}
</style>
