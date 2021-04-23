<template>
	<!-- 用户协议的詳情頁 -->
	 <rich-text :nodes="detail"></rich-text>
</template>
<script>
import getUserInfo from '@/components/communal/getUserInfo';
import { $storage, $router } from '@/utils/prototype/vue.js';
import http from '@/api/http.js';
import { queryProappConfigPageForPlat,getUserservice,loginOut, getProappinfo, loginIn, getTopPerMenuList, getTopPerMenuListFPc, thirdLogin, loginMicroMessenger, loginMiniProgram, getPersonal } from '@/api/interfaceHDB.js';
import { clearTimeout, setTimeout } from 'timers';
export default {
	data() {
		return {
			detail: '',  //用户协议
		};
	},
	onLoad() {
		this.baseColor = `#${$storage.get('baseColor')}`;
		wx.setNavigationBarTitle({
			title: "用户协议"
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.baseColor
		});
	},

	onShow() {
		console.log('个人中心onShow',$storage.get('userId'));
		if ($storage.get('userInfo')) this.message = $storage.get('userInfo');
		if ($storage.get('miniUserName') && $storage.get('userId')) {
			http.get(getPersonal, {
				userId: $storage.get('userId')
			}).then(res => {
				this.userLevel = res.userinfoLevel;
			});
		}
	},
	created() {
		// console.log('这里是个人中心')
		// this.aaa();
		this.queryProappConfigPageForPlat();
	},
	mounted() {
		
	},
	methods: {
		queryProappConfigPageForPlat(){
			http.get(queryProappConfigPageForPlat, {
				proappCode: "001",
				tenantCode: "2020063000000001"
			}).then(res => {
				console.log("用户协议",res)
				res.rows.forEach(element => {
					if (element.proappConfigName == '协议') {
						// console.log('yyyyyyy',element.proappConfigText2)
					this.detail = element.proappConfigText2;
				}
			});
				// this.userLevel = res.userinfoLevel;
				
			});
			}

		
	}
};
</script>
<style lang="less">


</style>
