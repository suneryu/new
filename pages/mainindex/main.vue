<template>
  <div></div>
</template>
<script>
import http from "@/api/http.js";
import {
  getTopPerMenuListFPc,
  getProappinfo,
  loginMiniProgram
} from "@/api/interface.js";
export default {
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    // 产品基本信息 登陆颜色 商城名字信息
    getBaseInfo() {
      return http.get(getProappinfo);
    },
    // 路由菜单配置信息
    getRouterMenuInfo() {
      return http.get(getTopPerMenuListFPc);
    },

    setStaticPages(element) {
      // 三个静态页首页 分类页 普通商品详情页
      if (element.menuCode == "00000042") {
        this.$state.set("homeUrl", element.menuAction);
        this.setStaticPagesChildren(element.children);
      }
      if (element.menuCode == "00000043") {
        this.$state.set("classifyUrl", element.menuAction);
      }
    },

    //设置静态页下的子级页面
    setStaticPagesChildren(children) {
      if(children == null){
		  return
	  }
      if (children.length > 0) {
        for (let index = 0; index < children.length; index++) {
          const element = children[index];
          if (element.menuCode == "P0000111") {
            this.$storage.set(
              "hrefs",
              element.menuAction.split("${htmldataFilename}")[0]
            );
          }
        }
      }
    },
	
	setOrderMenu(menuList){
		if(menuList == null){
			return 
		}
		menuList.map((val, index) => {
			if (val.menuDefaultClass == 'columnList' || val.menuName == '应用') {
				// 还需要优化
				this.$state.set('application', val.children.filter(v => v.menuShow === 0));
				this.$state.set('columnList', val.children.filter(v => v.menuShow === 1));
			}
			if (val.menuDefaultClass == 'rowListNav' || val.menuName == '我的订单') {
				// 待付款，待发货，待收货，待评价，售后
				let myOrder = val.children.filter(v => v.menuShow === 0).filter(vt => vt.menuAction != 'order');
				// 全部订单
				let orderIndex = val.children.filter(v => v.menuShow === 0).filter(vt => vt.menuAction == 'order');
				this.$state.set('orderIndex', orderIndex);
				this.$state.set('myOrder', myOrder);
				this.$state.set('orderMenu', val.children.filter(v => v.menuShow === 1));
				// 订单搜索和订单搜索结果页
				orderIndex[0].routechildren.map(vc => {
					if (vc.menuAction == 'orderSearch') {
						this.$state.set('orderSearch', vc.menuJspath);
					}
					if (vc.menuAction == 'orderSearchResult') {
						this.$state.set('orderSearchResult', vc.menuJspath);
					}
				});
			}
			if (val.menuName == '导航') {
				this.$state.set('nav', val.children);
			}
		});
		let moreToolsList = [];
		this.$state.nav.map(val => {
			if (val.menuAction === 'collectionGoods' || val.menuAction === 'history') moreToolsList.push(val);
		});
		this.$state.set('moreToolList', moreToolsList);
	},


    async setBaseInfo() {
      let baseInfo = await this.getBaseInfo();
      let baseColor = baseInfo.proappEnvTheme;
      this.$storage.set("proappEnvName", baseInfo.proappEnvName);
      this.$storage.set("baseColor", baseColor);
      this.$storage.set("unitPrice", JSON.parse(baseInfo.proappEnvOpenconf));
      this.$state.set("baseColor", baseColor);
      this.$state.set("unitPrice", JSON.parse(baseInfo.proappEnvOpenconf));
      wx.setNavigationBarColor({
        frontColor: "#ffffff", // 必写项
        backgroundColor: baseColor // 必写项
      });
      let menuInfo = await this.getRouterMenuInfo();
      if (!menuInfo.menuList) return;
      let menuList = menuInfo.menuList;
      this.$storage.set("getTopPerMenuList", menuList);
      this.$storage.set("footerMenu", menuList.filter(v => v.menuShow === 0));
	  
	  let footerMenu = this.$storage.get('footerMenu');
	  
	  footerMenu.forEach(element => {
	  	if (element.menuAction == 'user') {
			this.setOrderMenu(element.children);
	  	}
	  });

      for (let i = 0; i < menuList.length; i++) {
        const element = menuList[i];
        this.setStaticPages(element);
      }
      this.$router.replace("web", {
        defaultUrl: this.$businessDomain + "/paas/shop/" + this.$state.homeUrl
      });
    }
  },
  mounted() {
    this.setBaseInfo();
  }
};
</script>