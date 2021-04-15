<template>
    <div class="afterApply">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="newstyle-mt afterApply-con">
        <div>请选择反馈类型
          <p>
            <picker @change="bindPickerChange" :value="index" :range="array" mode="selector">
              <view class="picker">
                {{pickerValue}}
              </view>
            </picker>
            <i class="iconfont">&#xe61d;</i>
          </p>
        </div>
      </div>
      <div class="afterApply-textarea">
        <p>填写手机号</p>
        <textarea placeholder="请填写手机号码，方便我们与您联系" v-model="phoneNum"></textarea>
      </div>
      <div class="afterApply-textarea">
        <p>详细描述：</p>
        <textarea placeholder="对我们网站、商品、服务、您还有什么建议吗？您还希望在买到什么？请您告诉我们？" v-model="refundMeo"></textarea>
      </div>
      <div class="afterApply-img">
        <h4>上传照片</h4>
        <div class="apply-img-box">
            <dl class="show-apply-img">
              <dd v-for="(item,index) in upImg" :key="index">
                <div class="dd-img">
                  <i class="iconfont" @click="delImg(index)">&#xe600;</i>
                  <img :src="item">
                </div>
              </dd>
              <dd  v-show="upImgLength">
                <form action class="apply-up-img">
                  <div class="weui-uploader__input-box">
                    <div class="weui-uploader__input" @click="chooseImage">
                      <i class="iconfont">&#xe620;</i>
                        <p>上传凭证</p>
                    </div>
                  </div>
                </form>
              </dd>
            </dl>
          </div>
      </div>
      <div class="afterApply-btn" @click="submitBtn" :style="{background:baseColor}">提交</div>
      
 
    </div>
    
</template>

<script>
import http from '@/api/http.js'
import {$storage,$router,$message} from '@/utils/prototype/vue.js'
import {refund} from '@/api/interface.js'
import commonHeader from '@/components/communal/commonHeader';
// import picker from '@/components/communal/picker';
export default {
  data() {
    return {
      title:"意见反馈",
      leftIcon:true,
      rightIcon:false,
      items:{},
      newPrice:0,
      array: [],
      pickerValue:'请选择',
      phoneNum:'', //手机号
      refundMeo:'',//描述
      baseColor:'',
      upImg:[],
      files:[],
      upImgLength:true,
      afterPickerValue:'请选择',
      // userImgurl: require("../../../../../static/img/mine/default_header.png"), 
      menuJspath:''//退货详情列表

    }
  },
  components:{
    commonHeader,
    // picker
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: $storage.get('proappEnvName')
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#'+this.$state.baseColor
    })
    Object.assign(this, this.$options.data());
  },
  computed: {
    unitPrice() {
      // mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
      return this.$state.unitPrice || $storage.get("unitPrice");
    }
  },
  mounted() {
    this.baseColor='#'+this.$state.baseColor
    this.$state.orderMenu.map(v=>{
      if(v.menuAction=='refundInfor'){
        this.menuJspath = v.menuJspath
      }
    })
    this.array=[]
    this.items = this.$root.$mp.query
    http.get(refund.queryRefCause).then(res=>{
      res.map(val=>{
        this.array.push(val.flagSettingInfo)
      })
    })

  },
  methods: {
    bindPickerChange(e){
      this.pickerValue = this.array[Number(e.target.value)]

    },
    chooseImage(e) {
      let i = 0;					// 多图上传时使用到的index
      let that = this;
      let max = 1;		//最大选择数
      let upLength;						//图片数组长度
      let imgFilePaths;				//图片的本地临时文件路径列表
      if(that.upImg.length===2){
        this.upImgLength = false
      }
      wx.chooseImage({
        count: max,           //一次最多可以选择的图片张数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          imgFilePaths = res.tempFilePaths;
          upLength = imgFilePaths.length;
          /**
           * 上传完成后把文件上传到服务器
           */
          wx.showLoading({
            title: '上传中...',
          })
          console.log(imgFilePaths,'imgFilePaths');
          that.upLoad(imgFilePaths,i,upLength);			//上传操作
        },
        fail: function () {
          console.log('fail');
        },
        complete: function () {
          console.log('commplete');
        }
      })
      
    },
    upLoad(imgPath,i,upLength){
      let that = this;
      //上传文件
      wx.uploadFile({
        url: this.$domain + refund.uploadRefFile,
        filePath: imgPath[i],
        name: 'file',
        formData: { 
          'imgIndex': i 
        }, 
        header: {
          "Content-Type": "multipart/form-data",
          "cookie" : wx.getStorageSync('miniToken')+'=' + wx.getStorageSync('sessionid'),
          "saas-Agent":"qj-wemini"
        },
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          that.upImg.push(that.$domain+JSON.parse(res.data).fileUrl);
        },
        fail: function (res) {
          console.log(res);
          wx.hideLoading();
          wx.showModal({
            //title: '提示',
            content: '上传图片失败',
            showCancel: false,
            success: function (res) { }
          })
        },
        complete: function(){
          i++;
          if(i == upLength){
            wx.hideLoading();    //上传结束，隐藏loading
          }else{
            that.upLoad(imgPath,i,upLength);
          }
        }
      });
    },
    delImg(index) {
      this.upImg.splice(index, 1);
      this.upImgLength = true
    },
    submitBtn(){
      let domainList = []
      this.upImg.map(val=>{
        domainList.push({refundFileUrl:val})
      })
      let fund =  {
        phoneNum:this.phoneNum,
        refundMeo:this.refundMeo,
        ocRefundFileDomainList:domainList,  //图片
        }
        if (!this.pickerValue){
           $message.alert('请选择反馈类型！')
        }else if(!this.refundMeo){
          $message.alert('请填写手机号码！')
        }
        http.post(refund.saveRefund,{params:JSON.stringify(fund)}).then(res=>{
          if(res.success){
            $router.push(this.menuJspath,{refundCode:res.dataObj})
          }
        })  
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../../../common/css/common.less';
.afterApply{
  width: 100%;
  height: 100%;
  background: @white-color;
  .newstyle-mt {
    margin-top: 120rpx;
    border-bottom: 20rpx solid #fafafa;
  }
  &-box{
    margin-top: 90rpx;
    border-bottom: 20rpx solid #fafafa;
    ul{
      li{
        padding:20rpx 30rpx;
        .tit{
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 83rpx;
          i{
            margin-right: 15rpx;
          }
          span{
            color: @color-666;
            font-size: @big-title;
          }
        }
        a{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .list-img{
            width: 112rpx;
            height: 112rpx;
            margin-right:20rpx;
            img{
              width: 100%;
              height: 100%;
            }
           
          }
          .list-r{
            flex: 1;
            .list-con{
              display: flex;
              align-items: center;
              justify-content: space-between;
              p{
                width: 380rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: @middle-title;
              }
            }
            
            h3{
              font-size: 20rpx;
              color: @color-999;
              margin: 5rpx 0 0 0;
            }
            .list-add{
              display: flex;
              align-items: center;
              justify-content: flex-end;
              input{
                width: 50rpx;
                text-align: center;
                font-size: 22rpx;
              }
              div:last-child{
                i{
                  font-size:42rpx;
                }
              }
            }
            
          }
        }
      }
    }
  }
  &-con{
    padding: @padding-30;
    div{
      display: flex;
      align-items: center;
      justify-content:space-between;
      font-size: 28rpx;
      height: 107rpx;
      border-bottom: 1rpx solid #f6f6f8;
      p{
        display: flex;
        align-items: center;
        span{
          color: @color-999;
          margin-right: 10rpx;
        }
        input{
          text-align: right;
        }
      }
    }
  }
  &-textarea{
    height: 168rpx;
    padding: @padding-30;
    border-bottom: 1rpx solid #f6f6f8;
    p{
      margin:30rpx 0;
      font-size: 28rpx;
    }
    textarea{
      font-size: @big-title;
      height: 80rpx;
      width: 100%;
    }
  }
  &-img{
    h4{
      margin:30rpx 0;
      font-size: 28rpx;
      padding-left: 30rpx;
    }
    .apply-img-box{
      .show-apply-img{
        dd{
          position: relative;
          width: 154rpx;
          height: 154rpx;
          border: 1rpx solid #f5f5f5;
          float: left;
          margin: 0 20rpx 30rpx;
          background: #f5f5f5;
          .dd-img{
            width: 150rpx;
            height: 150rpx;
            overflow: hidden;
            .icon-delete {
              position: absolute;
              right:-15rpx;
              top:-15rpx;
              z-index:2;
            }
            img{
              width: 150rpx;
              height: 150rpx;
            }
          }
        }
        form{
          width:150rpx;
          height:150rpx;
          background: #fff;
          border: 1px dashed #666;
          display:flex;
          justify-content:center;
          align-items:center;
          text-align: center;
          i{
            font-size: 57rpx;
          }
          p{
            color: @color-999;
            font-size: 20rpx;
          }
          input[type=file] {
            width: 150rpx;
            height: 150rpx;
            position: absolute;
            opacity: 0;
            top: 0;
            left: 0;
            z-index: 2;
          }
        }
      }
    }
  }
  &-btn{
    height: 98rpx;
    line-height: 98rpx;
    width: 100%;
    text-align: center;
    background: #bfa676;
    font-size: 32rpx;
    color: @white-color;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
  }
}
</style>




