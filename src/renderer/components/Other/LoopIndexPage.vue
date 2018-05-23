<template lang="html">
  <div class="content-page">
      <div class="content-nav">
          <el-breadcrumb class="breadcrumb" separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
              <el-breadcrumb-item>首页轮播图管理</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- <div class="operation-nav">
              <router-link to="/dashboard/order/add">
                  <el-button type="primary" icon="plus">添加订单</el-button>
              </router-link>
          </div> -->
      </div>
      <div class="content-page">
        <!-- <el-row :gutter="20"> -->
          <!-- <el-col :span="1"> </el-col> -->
          <!-- <el-col :span="22"> -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <!-- <span>轮播图1</span> -->
                <el-row >
                  <el-col :span="12" style="line-height:38px;color:#48576a;">首页轮播图</el-col>
                  <el-col :span="12" style="text-align:right;" >  <el-button @click="clear" type="danger">清除所有</el-button></el-col>
                </el-row>

                <!-- <el-button style="text-align:right;"  type="text">清除所有</el-button> -->
              </div>
              <div class="image_all_area">
                <el-upload
                  action="http://upload.qiniup.com"
                  list-type="picture-card"
                  :data="uploadToken"
                  :on-preview="handlePictureCardPreview1"
                  :on-remove="handleRemove"
                  :on-success="handlesuccess"
                  :file-list="LoopList"
                  >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>

            </div>
              <el-row>
                <!-- <el-col :span="20">轮播图1</el-col> -->
                <el-col :span="24" style="text-align:right;" >  <el-button @click="upload" type="primary">确定上传</el-button></el-col>
              </el-row>
            </el-card>
          <!-- </el-col> -->
          <!-- <el-col :span="1"><div class="grid-content bg-purple">123</div></el-col> -->
        <!-- </el-row> -->

      </div>


    </div>
</template>

<script>
export default {
  name:"LoopIndexPage",
  data() {
     return {
       uploadToken:{
         token: "",
       },
       dialogImageUrl: '',
       LoopList: [],
       LoopListRes: [],
       dialogVisible: false,
       uploaderHeader: {
         'X-Nideshop-Token': localStorage.getItem('token') || '',
         // 'Access-Control-Allow-Origin:*',
       },
     };
   },
   mounted(){
     this.getLoop()
   },
   methods: {
     getLoop(){
       this.axios.post('index/findindexloop').then((res) => {
         console.log(res.data.data);
         this.LoopList = []
         var loop = res.data.data
         for (var i = 0; i < loop.length; i++) {
           // array[i]
           // console.log(loop);
           let obj = {}
           obj.url = loop[i].image_url
           this.LoopList.push(obj)
         }
         if (loop.length > 0) {
           for (var i = 0; i < loop.length; i++) {
             // array[i]
             let obj = {}
             obj.fileUrl = loop[i].image_url
             obj.linkurl = loop[i].link
             this.LoopListRes.push(obj)
           }
         }
         console.log(this.LoopListRes);
         // this.uploadimgchange(this.LoopList)
         this.gettoken()
       })
     },
     gettoken(){
       // console.log("12163546498764131");
       this.axios.post('upload/token').then((res) => {
         console.log(res);
         this.uploadToken.token = res.data.data.uploadToken
       })
     },
     handlesuccess(res,file){
       console.log(res);
       let linkurl = {}

       this.$prompt('请输入跳转页面(没有请填 / )', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then((resss) => {
          this.$message({
            type: 'success',
            message: '添加成功！'
          });
          console.log(resss);
          linkurl = resss.value
          var imageUrl ='http://resource.bbgshop.com/'+ res.key
          let fileUrl = {}
          let list = {}
          list.fileUrl = imageUrl
          list.linkurl = linkurl
          this.LoopListRes.push(list)
          console.log(this.LoopListRes);
        }).catch(() => {
          this.getLoop()
          // this.LoopListRes = []
          // this.LoopList = []
          this.$message({
            type: 'info',
            message: '取消输入！'
          });
          // this.getLoop()
        });



       // console.log(imageUrl);
     },

     clear(){
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
           confirmButtonText: '确定',
           cancelButtonText: '取消',
           type: 'warning'
         }).then(() => {
           this.axios.post('index/delloop').then((res) => {
             console.log(res);
               this.$message({
                 message: '主页循环图已删除！',
                 type: 'success'
               });
               this.LoopList = []
               this.axios.post('index/findindexloop').then((res) => {
                 console.log(res);
                 var loop = res.data.data
                 for (var i = 0; i < loop.length; i++) {
                   // array[i]
                   // console.log(loop);
                   let obj = {}
                   obj.url = loop[i].image_url
                   this.LoopList.push(obj)
                 }
                 this.uploadimgchange(this.LoopList)
               })
           })
         }).catch(() => {
           this.$message({
             type: 'info',
             message: '已取消删除'
           });
         });

     },
     upload(){
       this.$confirm('请确认是否上传主页循环图 ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('index/setloop',{
            LoopListRes:this.LoopListRes
          }).then((res) => {
            this.LoopList = []
            this.axios.post('index/findindexloop').then((res) => {
              console.log(res);
              var loop = res.data.data
              for (var i = 0; i < loop.length; i++) {
                // array[i]
                // console.log(loop);
                let obj = {}
                obj.url = loop[i].image_url
                this.LoopList.push(obj)
              }
            })
            console.log(res);
              this.$message({
                message: '上传成功！',
                type: 'success'
              });
              // this.LoopList = []
              // this.getLoop()
          })
          console.log(this.LoopListRes);
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消上传！'
          });
        });
      // }

     },
     handleRemove(file, fileList) {
       console.log(fileList);
       console.log(this.LoopListRes);
       let list = []

       for (var i = 0; i < fileList.length; i++) {
         for (var j = 0; j < this.LoopListRes.length; j++) {
           let obj = {}
           if (fileList[i].url == this.LoopListRes[j].fileUrl) {
             // console.log("123465789");
             // console.log(this.LoopListRes[j].fileUrl);
             obj.url = this.LoopListRes[j].fileUrl
             obj.linkurl = this.LoopListRes[j].linkurl
             console.log(obj);
             list.push(obj)
           }
         }
       //
       }
       console.log(list);
       console.log(list.slice(0,fileList.length));
       this.LoopList = list.slice(0,fileList.length)
       // console.log(this.LoopList);
       let listt = []
       for (var k = 0; k < this.LoopList.length; k++) {
         let objj = {}
         objj.fileUrl = this.LoopList[k].url
         objj.linkurl = this.LoopList[k].linkurl
         listt.push(objj)
       }
       this.LoopListRes = listt
       console.log(this.LoopListRes);
       // this.LoopListRes = []
       // for (var i = 0; i < fileList.length; i++) {
       //   // array[i]
       //   let list = {}
       //   let fileUrl = {}
       //   list.fileUrl = fileList[i].url
       //   list.link = fileList[i].url
       //   // console.log(fileList[0].response);
       //   this.LoopListRes.push(list)
       //
       // }
     },
     handlePictureCardPreview1(file) {
       this.dialogImageUrl = file.url;
       this.dialogVisible = true;
     },
     // handleExceed1(files, fileList) {
     //   this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
     // },
   }
}
</script>

<style lang="css" scoped >
/* .image_all_area {
  border: 1px solid black;
} */
/* .el-upload-list--picture-card .el-upload-list__item {
  width: 100% !important;
  height: 100% !important;
} */
</style>
