<template>
 <rich-text :nodes="strings"></rich-text>
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
			strings:''
		};
	},
	onLoad() {	
		this.queryProappConfigPageForPlat()
		this.baseColor = `#${$storage.get('baseColor')}`;
		wx.setNavigationBarTitle({
			title: "隐私政策"
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: this.baseColor
		});
	},

	// onShow() {
	// 	console.log('个人中心onShow',$storage.get('userId'));
	// 	if ($storage.get('userInfo')) this.message = $storage.get('userInfo');
	// 	if ($storage.get('miniUserName') && $storage.get('userId')) {
	// 		http.get(getPersonal, {
	// 			userId: $storage.get('userId')
	// 		}).then(res => {
	// 			this.userLevel = res.userinfoLevel;
	// 		});
	// 	}
	// },
	created() {
	},
	mounted() {
		
	},
	methods: {
		queryProappConfigPageForPlat(){
			let that = this
			http.get(queryProappConfigPageForPlat, {
				proappCode: "001",
				tenantCode: "2020063000000001"
			}).then(res => {
				console.log("用户协议",res)
				res.rows.forEach(element => {
					if (element.proappConfigName == '隐私') {
						// console.log('proappConfigText2---',element.proappConfigText2)
					that.strings= element.proappConfigText2;
						
				}
			});
				// this.userLevel = res.userinfoLevel;
				
			});
			}

		
	}
};
</script>
<style lang="less">
// @import '@/components/gaoyia-parse/parse.css';
</style>
