<template>
    <div class="Notice">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="Notice-list">
      <div class="Notice-item" v-for="(item,index) in NoticeList" :key="index">
        <div class="timeTitle">{{item.gmtCreate}}</div>
        <div class="itemCenter" v-if="index==0">
          <div class="title">购物车降价通知</div>
          <div class="detailCenter">
            <img src="/static/img/mine/news/temp1.png" alt="" style="width:140rpx;height:140rpx;margin-left:10rpx;margin-top:10rpx">
            <div class="subDetail">
              <div class="subTitle">您的购物车中的[新西兰金奇异果300g]降价10.0元,手慢无哦!</div>
            </div>
          </div>
        </div>
        <div class="itemCenter1" v-else>
          <div class="title">{{item.pushmsgExp.paramMap.title}}</div>
          <div class="subTitle">{{item.pushmsgExp.paramMap.content}}</div>
        </div>
      </div>
    </div>
      <lastPageLine :lastPageLine="lastPageLine"/>
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router,$message} from '@/utils/prototype/vue.js'
import {getImsgPushmsg} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
import {formatDate} from '@/utils/prototype/date.js'
import lastPageLine from '@/components/communal/last-page-line';

export default {
  data() {
    return {
      title:'系统通知',
      leftIcon:true,
      rightIcon:true,
      defaultIcon:false,
      baseColor:'',
      NoticeList:[],
      page: 1,
      rows: 10,
      total: 0,
      lastPageLine:false
    }
  },
  components:{
    commonHeader,lastPageLine
  },
  onLoad(options) {
    Object.assign(this.$data,this.$options.data())//初始化数据
    let pages = getCurrentPages();
    let prevpage = pages[0];
    $storage.set('prevpage',prevpage.route)
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#'+this.$state.baseColor
    })
    if(options&&options.json){
      $storage.set('webmail',options.json)
      //$router.replace('web',{defaultUrl:this.$domain+'/paas/shop/00000001/wemini/index/index/index.html'})
    }
    
  },
  mounted() {
    this.baseColor='#'+this.$state.baseColor
    this.getList();
  },
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    this.loadMore();
  },
  methods: {
    getList(){
      http.post(getImsgPushmsg,{page:this.page,rows:this.rows}).then(res=>{
        this.NoticeList = res.rows
        this.NoticeList.forEach((v,i) =>{
          v.pushmsgExp = JSON.parse(v.pushmsgExp)
          v.pushmsgExp.paramMap = JSON.parse(v.pushmsgExp.paramMap)
          v.gmtCreate = formatDate(v.gmtCreate)
        })
        this.total = res.total;
      })
    },
    loadMore(){
      let num = Math.ceil(this.total/10);
      this.page++;
      if(this.page<= num){
        http.post(getImsgPushmsg,{page:this.page,rows:this.rows}).then(res=>{
          let list = res.rows
          list.forEach((v,i) =>{
            v.pushmsgExp = JSON.parse(v.pushmsgExp)
            v.pushmsgExp.paramMap = JSON.parse(v.pushmsgExp.paramMap)
            v.gmtCreate = formatDate(v.gmtCreate)
          })
          
          this.NoticeList = [...this.NoticeList,...list]
        })
      }else{
        this.lastPageLine = true;
      }
    }
  },
}
</script>

<style  lang="less" scoped>
@import '../../../../../../common/css/common.less';
 .Notice{
    position: relative;
    padding-top: 90rpx;
    height: 100%;
    background-color: rgb(237, 238, 239);
    &-item{
      .timeTitle{
        text-align: center;
        color: rgb(174, 174, 174);
        font-size: 24rpx;
        margin-top: 30rpx;
      }
      .itemCenter{
        background-color: white;
        margin-left: 20rpx;
        margin-top: 30rpx;
        width: 710rpx;
        height: 260rpx;
        border-radius: 20rpx;
        display: flex;
        flex-direction: column;
      }
      .itemCenter1{
        background-color: white;
        margin-left: 20rpx;
        margin-top: 30rpx;
        width: 710rpx;
        height: 220rpx;
        border-radius: 20rpx;
        display: flex;
        flex-direction: column;
      }
      .detailCenter{
        display: flex;
        flex-direction: row;
      }
      .title{
          margin-top: 30rpx;
          margin-left: 30rpx;
          font-size: 36rpx;
        }
        .subTitle{
          margin-left: 30rpx;
          margin-right: 30rpx;
          margin-top: 20rpx;
          font-size: 32rpx;
          color: rgb(161, 161, 161);
        }
    }
  }
</style>>

