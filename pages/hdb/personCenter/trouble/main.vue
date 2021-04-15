<template>
	<!-- 常见问题详情页 -->
	<div v-html="detail"></div>
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
			detail: '',  //隱私政策
		};
	},
	onLoad() {
		this.baseColor = `#${$storage.get('baseColor')}`;
		wx.setNavigationBarTitle({
			title: "常见问题"
		});
		wx.setNavigationBarColor({
		  frontColor: "#ffffff", // 必写项
		  backgroundColor: "#" + this.$state.baseColor,
		  backgroundColor: "#374e80"
		});
		
	},

	onShow() {
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
		// this.aaa();
	},
	mounted() {
		this.queryProappConfigPageForPlat()
	},
	methods: {
		navigateTo(options) {
			this.$qj.router.push(options.url, options.query ? options.query : '');
		},
		queryProappConfigPageForPlat(){
			http.get(queryProappConfigPageForPlat, {
				proappCode: "001",
				tenantCode: "2020063000000001"
			}).then(res => {
				let that = this
				console.log("用户协议",res)
				res.rows.forEach(element => {
					if (element.proappConfigName == '问题') {
						if (element.proappConfigText1.trim() != '') {
							// let att = this.$qj.businessDomain + '/paas/shop/' + this.$qj.storage.get('hrefs') + skuCode + '.html';
							let options = {
								url: 'web',
								query: {
									defaultUrl: element.proappConfigText1
								}
							};
							this.navigateTo(options);

						} else {
							that.detail =
								element.proappConfigText2 &&
								element.proappConfigText2.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
									return '<img style="width:100%"  src="' + (that.$imgDomain + capture) + '"/>';
								});
							// this.detail = element.proappConfigText2;
						}
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
