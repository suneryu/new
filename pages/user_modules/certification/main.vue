<template>
	<div class="certification">
	    <div class="certification-item">
			<div class="left">状态</div>
			<div class="right">{{dataState}}</div>
		</div>
		<div class="certification-item">
			<div class="left">类型</div>
			<div class="right">{{userinfoType}}</div>
		</div>
		<div class="certification-item" v-if="userinfoType=='公司用户'">
			<div class="left">公司名称</div>
			<div class="right">{{companyName}}</div>
		</div>
		<div class="certification-item" v-if="userinfoType=='个人用户'">
			<div class="left">真实姓名</div>
			<div class="right">{{personName}}</div>
		</div>
		<div class="certification-item">
			<div class="left">所在地区</div>
			<div class="right">
				<picker @change="changeRegin" mode="region" :value="region" :disabled="invoiceDone">
				  <view class="tui-picker-detail">{{region[0]}} - {{region[1]}} - {{region[2]}}</view>
				</picker>
			</div>
		</div>
		<div class="certification-item">
			<div class="left">详细地址</div>
			<div class="right">
				<input :disabled="invoiceDone" type="text" v-model="address">
			</div>
		</div>
		<div class="certification-item" v-if="userinfoType=='公司用户'">
			<div class="left">法人姓名</div>
			<div class="right">
				<input :disabled="invoiceDone" type="text" v-model="userinfoCorp">
			</div>
		</div>
		<div class="certification-item">
			<div class="left">身份证号</div>
			<div class="right">
				<input :disabled="invoiceDone" type="idcard" v-model="idcard">
			</div>
		</div>
		<div class="certification-item" v-if="userinfoType=='公司用户'" style="border: 0rpx;">
			<div class="left">营业执照</div>
			<div class="idCard">
				<div class="up" @click="chooseImg('companyImg')">
					<div class="noImg" v-if="companyImg==''">
						<i class="iconfont icon-shangchuan"></i>(上传)
					</div>
					<img v-else :src="companyImg" alt="">
				</div>
			</div>
		</div>
		<div class="certification-item" v-if="userinfoType=='个人用户'">
			<div class="left">身份证照片</div>
			<div class="idCard">
				<div class="up" @click="chooseImg('upImg')">
					<div class="noImg" v-if="upImg==''">
						<i class="iconfont icon-shangchuan"></i>(正面)
					</div>
					<img v-else :src="upImg" alt="">
				</div>
				<div class="down" @click="chooseImg('downImg')">
					<div class="noImg" v-if="downImg==''">
						<i class="iconfont icon-shangchuan"></i>(反面)
					</div>
					<img v-else :src="downImg" alt="">
				</div>
			</div>
		</div>
		<div class="submit" @click="onSubmit" v-if="!invoiceDone">提交</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { getUserinfoDearler,uploadGoodsFile,updateStateToReApprove } from '@/api/interface.js';
export default {
	data(){
		return {
			userinfoCode: "",
			tenantCode: "",
			userinfoType:"",     //类型
			upImg:'',			//身份证正面
			downImg:'',			//身份证反面
			companyImg:'',     //营业执照
			dataState:'',   //认证状态 4待认证 0生效
			region: ['北京市', '北京市', '东城区'],	//所在地
			personName:'',//真实姓名
			idcard:'',    //身份证号码  
			address:""   ,//详细地址
			userinfoCorp:''   ,//法人姓名
			companyName:'',  //公司名字
			invoiceDone:false
		}
	},
	mounted() {
		http.post(getUserinfoDearler).then((res)=>{
			this.companyName=res.userinfoCompname
			this.userinfoCode=res.userinfoCode
			this.tenantCode=res.tenantCode
			this.userinfoType=res.userinfoType==2?"公司用户":"个人用户"
			this.personName=res.userinfoCompname
			if(res.dataState==4){
				this.dataState="待认证"
			}else if(res.dataState==0){
				this.dataState="生效"
				this.invoiceDone=true
				this.region=[res.provinceName,res.cityName,res.areaName]
				this.address=res.companyAddress
				this.idcard=res.userinfoCoid
				this.upImg=this.$imgDomain+res.userinfoCert1Url
				this.downImg=this.$imgDomain+res.userinfoCert2Url
				this.companyImg=this.$imgDomain+res.userinfoCertUrl
				for(let i=0;i<res.umUserinfoapplyQuaList.length;i++){
					if(res.umUserinfoapplyQuaList[i].userinfoapplyQuaKey=="userinfo_userinfoCorp"){
						this.userinfoCorp=res.umUserinfoapplyQuaList[i].userinfoapplyQuaVaule
						break
					}
				}
			}else if(res.dataState==-1){
				this.dataState="作废"
			}
		})
	},
	methods:{
		chooseImg(imgType){
			if(invoiceDone){
				return
			}
			let i = 0;					// 多图上传时使用到的index
			let that = this;
			let max = 1;		//最大选择数
			let upLength;						//图片数组长度
			let imgFilePaths;				//图片的本地临时文件路径列表
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
				that.upLoad(imgFilePaths,i,upLength,imgType);			//上传操作
				}
			})
		},
		upLoad(imgPath,i,upLength,imgType){
		  console.log(imgPath[i])
		  let that = this;
		  //上传文件
		  wx.uploadFile({
		    url: this.$domain + uploadGoodsFile,
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
		      console.log(JSON.parse(res.data).fileUrl,'fileUrl')
			  if(imgType=='upImg'){
				  that.upImg=that.$imgDomain+JSON.parse(res.data).fileUrl
			  }else if(imgType=='downImg'){
				  that.downImg=that.$imgDomain+JSON.parse(res.data).fileUrl
			  }else if(imgType=='companyImg'){
				  that.companyImg=that.$imgDomain+JSON.parse(res.data).fileUrl
			  }
		      wx.hideLoading();
		    },
		    fail: function (res) {
		      wx.hideLoading();
		      wx.showModal({
		        //title: '提示',
		        content: '上传图片失败',
		        showCancel: false,
		        success: function (res) { }
		      })
		    }
		  });
		},
		changeRegin(e) {
		 console.log('picker发送选择改变，携带值为', e.mp.detail)
		  this.region = e.mp.detail.value;
		},
		onSubmit(){
			if(this.userinfoType=="个人用户"){
				if(this.idcard==''){
					wx.showToast({
						icon:"none",
						title:"请填写身份证号码"
					})
					return
				}
				if(this.upImg==''){
					wx.showToast({
						icon:"none",
						title:"请上传身份证正面"
					})
					return
				}
				if(this.downImg==''){
					wx.showToast({
						icon:"none",
						title:"请上传身份证反面"
					})
					return
				}
				if(this.address==''){
					wx.showToast({
						icon:"none",
						title:"请填写详细地址"
					})
					return
				}
				http.post(updateStateToReApprove,{
					userinfoCoid:this.idcard,
					userinfoCert1Url:this.upImg.split(this.$imgDomain)[1],
					userinfoCert2Url:this.downImg.split(this.$imgDomain)[1],
					companyAddress: this.address,
					userinfoCode: this.userinfoCode,
					tenantCode: this.tenantCode,
					userinfoType: 1,
					cityCode: "",
					areaCode: "",
					provinceName: this.region[0],
					cityName: this.region[1],
					areaName: this.region[2]
				}).then((res)=>{
					if(res.success==true){
						wx.showToast({
							icon:"none",
							title:"提交成功"
						})
					}
				})
			}else if(this.userinfoType=="公司用户"){
				if(this.idcard==''){
					wx.showToast({
						icon:"none",
						title:"请填写身份证号码"
					})
					return
				}
				if(this.companyImg==''){
					wx.showToast({
						icon:"none",
						title:"请上传营业执照"
					})
					return
				}
				if(this.address==''){
					wx.showToast({
						icon:"none",
						title:"请填写详细地址"
					})
					return
				}
				if(this.userinfoCorp==''){
					wx.showToast({
						icon:"none",
						title:"请填写法人姓名"
					})
					return
				}
				http.post(updateStateToReApprove,{
					userinfoCorp:this.userinfoCorp,
					userinfoCoid:this.idcard,
					userinfoCertUrl:this.companyImg.split(this.$imgDomain)[1],
					companyAddress: this.address,
					userinfoCode: this.userinfoCode,
					tenantCode: this.tenantCode,
					userinfoType: 2,
					cityCode: "",
					areaCode: "",
					provinceName: this.region[0],
					cityName: this.region[1],
					areaName: this.region[2]
				}).then((res)=>{
					if(res.success==true){
						wx.showToast({
							icon:"none",
							title:"提交成功"
						})
					}
				})
			}
		}
	}
}
</script>

<style lang="less" scoped>
.certification{
	padding: 0 30rpx;
	&-item{
		position: relative;
		width: 100%;
		height: 90rpx;
		border-bottom: #eee 2rpx solid;
		.left{
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
		}
		.right{
			position: absolute;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
			input{
				text-align: right;
			}
		}
		.idCard{
			position: relative;
			top: 90rpx;
			width: 690rpx;
			height: 200rpx;
			.up{
				position: relative;
				float: left;
				width: 335rpx;
				height: 200rpx;
				border: #ccc 1rpx solid;
			}
			.down{
				position: relative;
				float: right;
				width: 335rpx;
				height: 200rpx;
				border: #ccc 1rpx solid;
			}
			.noImg{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				text-align: center;
			}
			img{
				width: 335rpx;
				height: 200rpx;
			}
		}
	}
	&-item:first-child{
		.right{
			color: #374e80;
		}
	}
	&-item:last-child{
		border-bottom:0rpx
	}
	.submit{
		position: fixed;
		bottom: 25rpx;
		left: 50%;
		transform: translateX(-50%);
		color: #fff;
		background-color: #374e80;
		width: 700rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
	}
}
</style>
